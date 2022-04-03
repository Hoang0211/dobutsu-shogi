import { createSlice } from "@reduxjs/toolkit";

import AIHandler from "../AIHandler";

import { MoveType, PieceName, Side, Winner } from "../utils/constants";
import { TCell, TGrave, TPiece, TMove } from "../utils/types";

import {
  getCellByPos,
  getPieceById,
  reorderPieceInGraves,
  changeSide,
  gameOverByReachingCheck,
  drawCheck,
  initCells,
  initGraves,
  initPieces,
  generateMoves,
  deleteMoves,
  moveExecute,
  moveUndo,
} from "../utils/GameUtils";

const initialGameState: {
  allCells: TCell[];
  allGraves: TGrave[];
  allPieces: TPiece[];
  currentSide: Side;
  winningSide: Winner | null;
  activePieceId: number | null;
  moveHistory: TMove[];
} = {
  allCells: [],
  allGraves: [],
  allPieces: [],
  currentSide: Side.white,
  winningSide: null,
  activePieceId: null,
  moveHistory: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    initGame(state) {
      initCells(state.allCells);
      initGraves(state.allGraves);
      initPieces(state.allPieces, state.allCells);
      state.currentSide = Side.white;
      state.winningSide = null;
      state.activePieceId = null;
      state.moveHistory = [];
    },
    pieceOnClick(state, actions) {
      let piece = getPieceById(actions.payload.id, state.allPieces);
      // if current activePiece is this piece
      if (state.activePieceId !== null && state.activePieceId === piece.id) {
        deleteMoves(piece, state.allCells);
        state.activePieceId = null;
      } else {
        // if current activePiece is another piece
        if (state.activePieceId !== null) {
          const currentActivePiece = getPieceById(state.activePieceId, state.allPieces);
          deleteMoves(currentActivePiece, state.allCells);
        }
        generateMoves(piece, state.allCells, state.allPieces);
        state.activePieceId = piece.id;
      }
    },
    cellOnClick(state, actions) {
      if (state.activePieceId !== null) {
        // get all move info
        const moveType: MoveType = actions.payload.moveType;
        const movePiece = getPieceById(state.activePieceId, state.allPieces);
        let killedPiece: TPiece | null = null;
        if (actions.payload.currentPieceId !== null) {
          killedPiece = getPieceById(actions.payload.currentPieceId, state.allPieces);
        }
        let fromCell: TCell | null = null;
        if (movePiece.currentCell !== null) {
          fromCell = getCellByPos(movePiece.currentCell.x, movePiece.currentCell.y, state.allCells);
        }
        const toCell = getCellByPos(actions.payload.x, actions.payload.y, state.allCells);

        // define move (promote and demote is not set yet)
        let newMove: TMove = {
          type: moveType,
          movePiece: movePiece,
          killedPiece: killedPiece,
          fromCell: fromCell,
          toCell: toCell,
          promote: false,
          demote: false,
        };

        // move execute
        moveExecute(newMove);

        // push to moveHistory
        state.moveHistory.push(newMove);

        if (moveType === MoveType.rev) {
          reorderPieceInGraves(movePiece.side, state.allGraves, state.allPieces);
        } else {
          if (drawCheck(state.moveHistory) === true) {
            state.winningSide = Winner.draw;
          } else {
            if (gameOverByReachingCheck(newMove, state.allCells, state.allPieces) === true) {
              if (movePiece.side === Side.white) {
                state.winningSide = Winner.white;
              } else {
                state.winningSide = Winner.black;
              }
            }
            if (moveType === MoveType.atk && killedPiece !== null) {
              if (killedPiece.name !== PieceName.lion) {
                reorderPieceInGraves(movePiece.side, state.allGraves, state.allPieces);
              } else {
                if (movePiece.side === Side.white) {
                  state.winningSide = Winner.white;
                } else {
                  state.winningSide = Winner.black;
                }
              }
            }
          }
        }

        // clean up
        deleteMoves(movePiece, state.allCells);
        state.activePieceId = null;
        state.currentSide = changeSide(state.currentSide);
      }
    },
    undoHandler(state, actions) {
      for (let i = 0; i < actions.payload; i++) {
        const lastMove = state.moveHistory.pop();

        if (lastMove !== undefined) {
          // get all move info
          const movePiece = getPieceById(lastMove.movePiece.id, state.allPieces);
          let killedPiece: TPiece | null = null;
          if (lastMove.killedPiece !== null) {
            killedPiece = getPieceById(lastMove.killedPiece.id, state.allPieces);
          }
          let fromCell: TCell | null = null;
          if (lastMove.fromCell !== null) {
            fromCell = getCellByPos(lastMove.fromCell.x, lastMove.fromCell.y, state.allCells);
          }
          const toCell = getCellByPos(lastMove.toCell.x, lastMove.toCell.y, state.allCells);

          const lastMoveCopy: TMove = {
            type: lastMove.type,
            movePiece: movePiece,
            killedPiece: killedPiece,
            fromCell: fromCell,
            toCell: toCell,
            promote: lastMove.promote,
            demote: lastMove.demote,
          };
          moveUndo(lastMoveCopy);

          // update grave info if this is atk or rev move
          if (lastMove.type === MoveType.atk || lastMove.type === MoveType.rev) {
            reorderPieceInGraves(movePiece.side, state.allGraves, state.allPieces);
          }

          // clean up
          deleteMoves(movePiece, state.allCells);
          state.activePieceId = null;
          state.currentSide = changeSide(state.currentSide);
        }
      }
    },
    aiHandler(state, actions) {
      let ai: AIHandler;
      ai = new AIHandler(7, state.allCells, state.allPieces, actions.payload, state.moveHistory);

      let aiMove = ai.getBestMove();
      console.log("best score for side " + ai.aiSide + ": " + ai.bestMoveScore);

      // get all move info
      const moveType: MoveType | null = aiMove.type;
      const movePiece = getPieceById(aiMove.movePiece.id, state.allPieces);
      let killedPiece: TPiece | null = null;
      if (aiMove.killedPiece !== null) {
        killedPiece = getPieceById(aiMove.killedPiece.id, state.allPieces);
      }
      let fromCell: TCell | null = null;
      if (aiMove.fromCell !== null) {
        fromCell = getCellByPos(aiMove.fromCell.x, aiMove.fromCell.y, state.allCells);
      }
      const toCell = getCellByPos(aiMove.toCell.x, aiMove.toCell.y, state.allCells);

      // define move
      let newMove: TMove = {
        type: moveType,
        movePiece: movePiece,
        killedPiece: killedPiece,
        fromCell: fromCell,
        toCell: toCell,
        promote: aiMove.promote,
        demote: aiMove.demote,
      };

      // move execute
      moveExecute(newMove);

      // update grave info if this is atk or rev move
      if (moveType === MoveType.atk && killedPiece !== null) {
        // check winning by capturing enemy lion
        if (killedPiece.name !== PieceName.lion) {
          reorderPieceInGraves(movePiece.side, state.allGraves, state.allPieces);
        } else {
          if (movePiece.side === Side.white) {
            state.winningSide = Winner.white;
          } else {
            state.winningSide = Winner.black;
          }
        }
      } else if (moveType === MoveType.rev) {
        reorderPieceInGraves(movePiece.side, state.allGraves, state.allPieces);
      }

      // push to moveHistory
      state.moveHistory.push(newMove);

      // check draw
      if (drawCheck(state.moveHistory) === true) {
        state.winningSide = Winner.draw;
      }

      // check for winning by reaching enemy territory
      if (gameOverByReachingCheck(newMove, state.allCells, state.allPieces) === true) {
        if (movePiece.side === Side.white) {
          state.winningSide = Winner.white;
        } else {
          state.winningSide = Winner.black;
        }
      }

      // clean up
      deleteMoves(movePiece, state.allCells);
      state.activePieceId = null;
      state.currentSide = changeSide(state.currentSide);
    },
  },
});

export const gameActions = gameSlice.actions;
export default gameSlice.reducer;
