import { Side, PieceName, MoveType } from "./constants";

export type TCell = {
  x: number;
  y: number;
  currentPieceId: number | null;
  moveType: MoveType | null;
};

export type TGrave = {
  id: number;
  side: Side;
  currentPieceId: number | null;
};

export type TPiece = {
  id: number;
  side: Side;
  name: PieceName;
  currentCell: TCell | null;
  allMoves: TCell[];
};

export type TMove = {
  type: MoveType | null;
  movePiece: TPiece;
  killedPiece: TPiece | null;
  fromCell: TCell | null;
  toCell: TCell;
  promote: boolean;
  demote: boolean;
};
