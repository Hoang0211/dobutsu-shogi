import { Side, PieceName, Winner } from "./constants";
import { TCell, TMove, TPiece } from "./types";
import { getCellByPos, getPieceById, drawCheck, generateMoves, deleteMoves, moveExecute, moveUndo } from "./utils/GameUtils";

class AIHandler {
  nodeTraversed: number = 0;
  maxDepth: number;
  bestMove: TMove;
  bestMoveScore: number = -10000000;
  fakeMoveHistory: TMove[] = [];

  // current game state
  allCells: TCell[];
  allPieces: TPiece[];
  aiSide: Side;
  playerSide: Side;

  // constructor for deep clone all game state
  constructor(maxDepth: number, allCells: TCell[], allPieces: TPiece[], aiSide: Side, moveHistory: TMove[]) {
    this.maxDepth = maxDepth;

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

    this.aiSide = aiSide;
    if (aiSide === Side.white) {
      this.playerSide = Side.black;
    } else {
      this.playerSide = Side.white;
    }

    let newCopyMoveHistory: TMove[] = [];
    moveHistory.forEach((move) => {
      let newCopyMove = {
        ...move,
      };
      newCopyMoveHistory.push(newCopyMove);
    });
    this.fakeMoveHistory = newCopyMoveHistory;

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

  getBestMove = () => {
    this.Minimax(this.maxDepth, -1000000000, 1000000000, true);
    // console.log(this.bestMove);
    // console.log(this.nodeTraversed);
    return this.bestMove;
  };

  Minimax(depth: number, alpha: number, beta: number, maximize: boolean) {
    this.nodeTraversed = this.nodeTraversed + 1;
    if (depth === 0 || this.gameOver() !== null) {
      return this.evalutate(this.gameOver());
    }

    if (maximize) {
      let maxEval = -1000000000;
      let allMoves: TMove[] = this.getAllSideMoves(this.aiSide);
      allMoves.every((move) => {
        this.fakeMoveHistory.push(move);
        moveExecute(move);
        let currentEval = this.Minimax(depth - 1, alpha, beta, false);
        moveUndo(move);
        this.fakeMoveHistory.pop();
        maxEval = Math.max(maxEval, currentEval);
        if (depth === this.maxDepth) {
          if (currentEval > this.bestMoveScore) {
            this.bestMoveScore = currentEval;
            this.bestMove = move;
            // console.log("bestMoveScore for " + this.aiSide + ": " + this.bestMoveScore);
          }
        }
        alpha = Math.max(alpha, currentEval);
        if (beta <= alpha) {
          // console.log("Prune");
          return false;
        }
        return true;
      });
      return maxEval;
    } else {
      let minEval = 1000000000;
      let allMoves: TMove[] = this.getAllSideMoves(this.playerSide);
      allMoves.every((move) => {
        this.fakeMoveHistory.push(move);
        moveExecute(move);
        let currentEval = this.Minimax(depth - 1, alpha, beta, true);
        moveUndo(move);
        this.fakeMoveHistory.pop();
        minEval = Math.min(minEval, currentEval);
        beta = Math.min(beta, currentEval);
        if (beta <= alpha) {
          // console.log("Prune");
          return false;
        }
        return true;
      });
      return minEval;
    }
  }

  getAllSideMoves = (side: Side) => {
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

    return allMoves;
  };

  // return null or winning side
  gameOver = () => {
    // check if two kings still alive
    let whiteKing: TPiece | null = null;
    let blackKing: TPiece | null = null;

    this.allPieces.forEach((piece) => {
      if (piece.name === PieceName.lion) {
        if (piece.side === Side.white) {
          whiteKing = piece;
          // if whiteKing is alive, check its position to see if it is a reaching victory
          if (whiteKing.currentCell && whiteKing.currentCell.y === 3) {
            let killedKingMove = this.getAllSideMoves(Side.black).find((move) => (move.killedPiece = whiteKing));
            if (killedKingMove === undefined) {
              return Winner.white;
            }
          }
        } else {
          blackKing = piece;
          if (blackKing.currentCell && blackKing.currentCell.y === 0) {
            let killedKingMove = this.getAllSideMoves(Side.white).find((move) => (move.killedPiece = blackKing));
            if (killedKingMove === undefined) {
              return Winner.black;
            }
          }
        }
      }
    });

    if (whiteKing === null) {
      return Winner.black;
    }

    if (blackKing === null) {
      return Winner.white;
    }

    if (drawCheck(this.fakeMoveHistory)) {
      return Winner.draw;
    }

    return null;
  };

  evalutate = (winner: Winner | null) => {
    let aiScore = 0;
    let playerScore = 0;

    if (winner !== null) {
      if (winner === Winner.white) {
        if (this.aiSide === Side.white) {
          aiScore += 10000;
        } else {
          playerScore += 10000;
        }
      } else if (winner === Winner.black) {
        if (this.aiSide === Side.black) {
          aiScore += 10000;
        } else {
          playerScore += 10000;
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
  };
}

export default AIHandler;
