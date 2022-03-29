import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { gameActions } from "../../store/game";

import { TCell, TPiece } from "../../utils/types";

import Piece from "./Piece";

import styles from "./Cell.module.scss";

const Cell: React.FC<{ cell: TCell }> = (props) => {
  const dispatch = useDispatch();
  const allPieces = useSelector((state: RootState) => state.game.allPieces);
  const reversed = useSelector((state: RootState) => state.setting.reversed);

  let thisPiece: TPiece | undefined = undefined;

  if (props.cell.currentPieceId !== null) {
    thisPiece = allPieces.find((piece) => piece.id === props.cell.currentPieceId);
  }

  const onClickHandler = () => {
    // only allow cell with moveType to be clicked
    if (props.cell.moveType !== null) {
      dispatch(gameActions.cellOnClick(props.cell));
    }
  };

  let homeRowClass;
  if (reversed) {
    if (props.cell.y === 0) {
      homeRowClass = "white-reversed";
    } else if (props.cell.y === 3) {
      homeRowClass = "black-reversed";
    }
  } else {
    if (props.cell.y === 0) {
      homeRowClass = "white";
    } else if (props.cell.y === 3) {
      homeRowClass = "black";
    }
  }

  return (
    <div
      className={` ${styles.cell} ${homeRowClass ? styles[homeRowClass] : ""} ${props.cell.moveType !== null ? styles[props.cell.moveType] : ""}`}
      onClick={onClickHandler}
    >
      {thisPiece && <Piece piece={thisPiece} />}
    </div>
  );
};

export default Cell;
