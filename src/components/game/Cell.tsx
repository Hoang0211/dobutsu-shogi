import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { gameActions } from "../../store/game";

import { TCell, TPiece } from "../../types";

import Piece from "./Piece";

import styles from "./Cell.module.scss";

const Cell: React.FC<{ cell: TCell }> = (props) => {
  const dispatch = useDispatch();
  const allPieces = useSelector((state: RootState) => state.game.allPieces);

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

  return (
    <div
      className={` ${styles.cell} ${props.cell.y === 0 ? styles.white : props.cell.y === 3 && styles.black} ${
        props.cell.moveType !== null && styles[props.cell.moveType]
      }`}
      onClick={onClickHandler}
    >
      {/* <p className={styles.location}>
        {props.cell.x} {props.cell.y}
      </p> */}
      {thisPiece && <Piece piece={thisPiece} />}
    </div>
  );
};

export default Cell;
