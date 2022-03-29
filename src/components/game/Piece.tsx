import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { gameActions } from "../../store/game";
import { GoPrimitiveDot } from "react-icons/go";

import { Side, PieceName } from "../../utils/constants";
import { TPiece } from "../../utils/types";

import styles from "./Piece.module.scss";

const Piece: React.FC<{ piece: TPiece }> = (props) => {
  const dispatch = useDispatch();

  const gameModeIdex = useSelector((state: RootState) => state.setting.gameModeIndex);
  const activePieceId = useSelector((state: RootState) => state.game.activePieceId);
  const currentSide = useSelector((state: RootState) => state.game.currentSide);
  const winner = useSelector((state: RootState) => state.game.winningSide);
  const reversed = useSelector((state: RootState) => state.setting.reversed);

  const selecting: boolean = props.piece.id === activePieceId;
  const onBoard: boolean = props.piece.currentCell !== null;
  const side: Side = props.piece.side;

  let clickable: boolean = false;
  if (gameModeIdex === 0) {
    if (side === currentSide) {
      clickable = true;
    }
  } else if (gameModeIdex === 1) {
    if (side === currentSide && currentSide === Side.black) {
      clickable = true;
    }
  } else {
    if (side === currentSide && currentSide === Side.white) {
      clickable = true;
    }
  }

  const onClickHandler = () => {
    if (winner === null) {
      if (clickable) {
        dispatch(gameActions.pieceOnClick(props.piece));
      }
    }
  };

  let pieceContent;
  const pieceName = props.piece.name.charAt(0).toUpperCase() + props.piece.name.slice(1);
  if (props.piece.name === PieceName.chick) {
    if (reversed) {
      if (props.piece.side === Side.white) {
        pieceContent = (
          <div className={styles.content}>
            <div className={styles.name}>{pieceName}</div>
            <GoPrimitiveDot className={styles.down} />
          </div>
        );
      } else {
        pieceContent = (
          <div className={styles.content}>
            <GoPrimitiveDot className={styles.up} />
            <div className={styles.name}>{pieceName}</div>
          </div>
        );
      }
    } else {
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
            <div className={styles.name}>{pieceName}</div>
            <GoPrimitiveDot className={styles.down} />
          </div>
        );
      }
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
    if (reversed) {
      if (props.piece.side === Side.white) {
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
      } else {
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
      }
    } else {
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
      className={`${styles.piece} 
      ${side === Side.white ? styles.white : styles.black} 
      ${clickable && styles.turn} 
      ${onBoard && styles["on-board"]} 
      ${selecting && styles.selecting}`}
      onClick={onClickHandler}
    >
      {pieceContent}
    </div>
  );
};

export default Piece;
