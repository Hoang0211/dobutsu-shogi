import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { gameActions } from "../../store/game";
import { GoPrimitiveDot } from "react-icons/go";

import { Side, PieceName } from "../../constants";
import { TPiece } from "../../types";

import styles from "./Piece.module.scss";

const Piece: React.FC<{ piece: TPiece }> = (props) => {
  const dispatch = useDispatch();

  const activePieceId = useSelector((state: RootState) => state.game.activePieceId);
  const currentSide = useSelector((state: RootState) => state.game.currentSide);
  const winner = useSelector((state: RootState) => state.game.winningSide);

  const onClickHandler = () => {
    if (winner === null) {
      // only allow piece with currentSide be clicked
      if (props.piece.side === currentSide) {
        dispatch(gameActions.pieceOnClick(props.piece));
      }
    }
  };

  let pieceContent;
  const pieceName = props.piece.name.charAt(0).toUpperCase() + props.piece.name.slice(1);
  if (props.piece.name === PieceName.chick) {
    if (props.piece.side === Side.white) {
      pieceContent = (
        <div className={styles.content}>
          <GoPrimitiveDot className={styles.up} />
          <div className={styles.name}>{pieceName}</div>
        </div>
      );
    } else {
      pieceContent = (
        <div className={styles.content}>
          <GoPrimitiveDot className={styles.down} />
          <div className={styles.name}>{pieceName}</div>
        </div>
      );
    }
  } else if (props.piece.name === PieceName.elephant) {
    pieceContent = (
      <div className={styles.content}>
        <GoPrimitiveDot className={styles.upleft} />
        <GoPrimitiveDot className={styles.upright} />
        <div className={styles.name}>{pieceName}</div>
        <GoPrimitiveDot className={styles.downleft} />
        <GoPrimitiveDot className={styles.downright} />
        <GoPrimitiveDot className={styles.upleft} />
      </div>
    );
  } else if (props.piece.name === PieceName.giraffe) {
    pieceContent = (
      <div className={styles.content}>
        <GoPrimitiveDot className={styles.up} />
        <GoPrimitiveDot className={styles.right} />
        <div className={styles.name}>{pieceName}</div>
        <GoPrimitiveDot className={styles.left} />
        <GoPrimitiveDot className={styles.down} />
      </div>
    );
  } else if (props.piece.name === PieceName.hen) {
    if (props.piece.side === Side.white) {
      pieceContent = (
        <div className={styles.content}>
          <GoPrimitiveDot className={styles.upleft} />
          <GoPrimitiveDot className={styles.up} />
          <GoPrimitiveDot className={styles.upright} />
          <GoPrimitiveDot className={styles.left} />
          <div className={styles.name}>{pieceName}</div>
          <GoPrimitiveDot className={styles.right} />
          <GoPrimitiveDot className={styles.down} />
          <GoPrimitiveDot className={styles.upleft} />
        </div>
      );
    } else {
      pieceContent = (
        <div className={styles.content}>
          <GoPrimitiveDot className={styles.up} />
          <GoPrimitiveDot className={styles.left} />
          <div className={styles.name}>{pieceName}</div>
          <GoPrimitiveDot className={styles.right} />
          <GoPrimitiveDot className={styles.downleft} />
          <GoPrimitiveDot className={styles.down} />
          <GoPrimitiveDot className={styles.downright} />
        </div>
      );
    }
  } else {
    pieceContent = (
      <div className={styles.content}>
        <GoPrimitiveDot className={styles.upleft} />
        <GoPrimitiveDot className={styles.up} />
        <GoPrimitiveDot className={styles.upright} />
        <GoPrimitiveDot className={styles.left} />
        <div className={styles.name}>{pieceName}</div>
        <GoPrimitiveDot className={styles.right} />
        <GoPrimitiveDot className={styles.downleft} />
        <GoPrimitiveDot className={styles.down} />
        <GoPrimitiveDot className={styles.downright} />
        <GoPrimitiveDot className={styles.upleft} />
      </div>
    );
  }

  return (
    <div
      className={`${styles.piece} ${props.piece.side === Side.white ? styles.white : styles.black} ${
        currentSide === props.piece.side && styles.turn
      } ${props.piece.currentCell && styles["on-board"]} ${props.piece.id === activePieceId && styles.selecting}`}
      onClick={onClickHandler}
    >
      {pieceContent}
    </div>
  );
};

export default Piece;
