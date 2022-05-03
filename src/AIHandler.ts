import { Side, PieceName, Winner, MoveType } from "./utils/constants";
import { TCell, TMove, TPiece } from "./utils/types";
import { getCellByPos, getPieceById, gameOverByReachingCheck, drawCheck, generateMoves, deleteMoves, moveExecute, moveUndo } from "./utils/GameUtils";

class AIHandler {
  // algorithm needed info
  nodeTraversed: number = 0; // only needed for debugging
  maxDepth: number;
  bestMove: TMove;
  bestMoveScore: number = -10000000;

  // current game state
  allCells: TCell[];
  allPieces: TPiece[];
  aiSide: Side;
  playerSide: Side;
  moveHistory: TMove[];

  // deep clone to store game state objects, declare bestMove object
  constructor(maxDepth: number, allCells: TCell[], allPieces: TPiece[], aiSide: Side, moveHistory: TMove[]) {
    this.maxDepth = maxDepth;

    // deep clone allCells state
    let newCopyAllCells: TCell[] = [];
    allCells.forEach((cell) => {
      let newCopyCell = {
        ...cell,
      };
      newCopyAllCells.push(newCopyCell);
    });
    this.allCells = newCopyAllCells;

    // deep clone current allPieces state
    let newCopyAllPieces: TPiece[] = [];
    allPieces.forEach((piece) => {
      let newCopyPiece = {
        ...piece,
      };
      newCopyAllPieces.push(newCopyPiece);
    });
    this.allPieces = newCopyAllPieces;

    // get different side
    this.aiSide = aiSide;
    if (aiSide === Side.white) {
      this.playerSide = Side.black;
    } else {
      this.playerSide = Side.white;
    }

    // deep clone movehistory
    let newCopyMoveHistory: TMove[] = [];
    moveHistory.forEach((move) => {
      let newCopyMove = {
        ...move,
      };
      newCopyMoveHistory.push(newCopyMove);
    });
    this.moveHistory = newCopyMoveHistory;

    // declare a bestMove object
    this.bestMove = {
      type: null,
      movePiece: this.allPieces[0],
      killedPiece: null,
      fromCell: null,
      toCell: this.allCells[0],
      promote: false,
      demote: false,
    };
  }

  getBestMove() {
    this.minimax(this.maxDepth, -1000000000, 1000000000, true);
    console.log("number of searched node: " + this.nodeTraversed);
    console.log("best score for side " + this.aiSide + ": " + this.bestMoveScore);
    return this.bestMove;
  }

  minimax(depth: number, alpha: number, beta: number, maximize: boolean) {
    this.nodeTraversed = this.nodeTraversed + 1;

    // check for terminal positions
    if (depth === 0 || this.gameOver() !== null) {
      return this.evalutate(this.gameOver(), depth);
    }

    if (maximize) {
      let maxEval = -1000000000;
      let allMoves: TMove[] = this.getAllSideMoves(this.aiSide);
      allMoves.every((move) => {
        this.moveHistory.push(move);
        moveExecute(move);
        let currentEval = this.minimax(depth - 1, alpha, beta, false);
        moveUndo(move);
        this.moveHistory.pop();
        maxEval = Math.max(maxEval, currentEval);
        if (depth === this.maxDepth) {
          if (currentEval > this.bestMoveScore) {
            this.bestMoveScore = currentEval;
            this.bestMove = move;
          }
        }
        alpha = Math.max(alpha, currentEval);
        if (beta <= alpha) {
          return false;
        }
        return true;
      });
      return maxEval;
    } else {
      let minEval = 1000000000;
      let allMoves: TMove[] = this.getAllSideMoves(this.playerSide);
      allMoves.every((move) => {
        this.moveHistory.push(move);
        moveExecute(move);
        let currentEval = this.minimax(depth - 1, alpha, beta, true);
        moveUndo(move);
        this.moveHistory.pop();
        minEval = Math.min(minEval, currentEval);
        beta = Math.min(beta, currentEval);
        if (beta <= alpha) {
          return false;
        }
        return true;
      });
      return minEval;
    }
  }

  getAllSideMoves(side: Side) {
    let allMoves: TMove[] = [];

    this.allPieces
      .filter((piece) => piece.side === side)
      .forEach((piece) => {
        generateMoves(piece, this.allCells, this.allPieces);
        piece.allMoves.forEach((toCell) => {
          let fromCell: TCell | null = null;
          if (piece.currentCell) {
            fromCell = getCellByPos(piece.currentCell.x, piece.currentCell.y, this.allCells);
          }
          let killedPiece: TPiece | null;
          if (toCell.currentPieceId === null) {
            killedPiece = null;
          } else {
            killedPiece = getPieceById(toCell.currentPieceId, this.allPieces);
          }
          let newMove: TMove = {
            type: toCell.moveType,
            fromCell: fromCell,
            toCell: toCell,
            movePiece: piece,
            killedPiece: killedPiece,
            promote: false,
            demote: false,
          };
          allMoves.push(newMove);
        });
        deleteMoves(piece, this.allCells);
      });

    allMoves.sort((a, b) => {
      if (a.type === MoveType.move && b.type === MoveType.atk) {
        return 1;
      } else if (a.type === MoveType.atk && b.type === MoveType.move) {
        return -1;
      } else if (a.type === MoveType.move && b.type === MoveType.rev) {
        return 1;
      } else if (a.type === MoveType.rev && b.type === MoveType.move) {
        return -1;
      } else if (a.type === MoveType.atk && b.type === MoveType.rev) {
        return -1;
      } else if (a.type === MoveType.rev && b.type === MoveType.atk) {
        return 1;
      } else {
        return 0;
      }
    });

    return allMoves;
  }

  gameOver() {
    const lastMove = this.moveHistory[this.moveHistory.length - 1];

    // draw check
    if (drawCheck(this.moveHistory)) {
      return Winner.draw;
    }

    if (lastMove !== undefined) {
      // check if lastMove was a killedLion move
      if (lastMove.type === MoveType.atk && lastMove.killedPiece !== null) {
        if (lastMove.killedPiece.name === PieceName.lion) {
          if (lastMove.movePiece.side === Side.white) {
            return Winner.white;
          } else {
            return Winner.black;
          }
        }
      }

      // check if lastMove was a winning move by reaching territory
      if (gameOverByReachingCheck(lastMove, this.allCells, this.allPieces) === true) {
        if (lastMove.movePiece.side === Side.white) {
          return Winner.white;
        } else {
          return Winner.black;
        }
      }
    }

    return null;
  }

  evalutate(winner: Winner | null, depth: number) {
    let aiScore = 0;
    let playerScore = 0;

    if (winner !== null) {
      if (winner === Winner.white) {
        if (this.aiSide === Side.white) {
          aiScore += 10000 + depth;
        } else {
          playerScore += 10000 + depth;
        }
      } else if (winner === Winner.black) {
        if (this.aiSide === Side.black) {
          aiScore += 10000 + depth;
        } else {
          playerScore += 10000 + depth;
        }
      }
    } else {
      this.allPieces.forEach((piece) => {
        if (piece.currentCell === null) {
          // dead pieces
          if (piece.side === this.aiSide) {
            if (piece.name === PieceName.chick) {
              aiScore = aiScore + 1;
            } else if (piece.name === PieceName.giraffe || piece.name === PieceName.elephant) {
              aiScore = aiScore + 3;
            } else {
              throw new Error("No way king/queen is dead in this condition!");
            }
          } else {
            if (piece.name === PieceName.chick) {
              playerScore = playerScore + 1;
            } else if (piece.name === PieceName.giraffe || piece.name === PieceName.elephant) {
              playerScore = playerScore + 3;
            } else {
              throw new Error("No way king/queen is dead in this condition!");
            }
          }
        } else {
          if (piece.side === this.aiSide) {
            if (piece.name === PieceName.chick) {
              aiScore = aiScore + 2;
            } else if (piece.name === PieceName.giraffe || piece.name === PieceName.elephant) {
              aiScore = aiScore + 6;
            } else if (piece.name === PieceName.hen) {
              aiScore = aiScore + 12;
            } else {
              aiScore = aiScore + 10000;
            }
          } else {
            if (piece.name === PieceName.chick) {
              playerScore = playerScore + 2;
            } else if (piece.name === PieceName.giraffe || piece.name === PieceName.elephant) {
              playerScore = playerScore + 6;
            } else if (piece.name === PieceName.hen) {
              playerScore = playerScore + 12;
            } else {
              playerScore = playerScore + 10000;
            }
          }
        }
      });
    }
    return aiScore - playerScore;
  }
}

export default AIHandler;
