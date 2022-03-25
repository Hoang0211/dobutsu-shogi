import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import { TGrave, TPiece } from "../../types";

import Piece from "./Piece";

import styles from "./Grave.module.scss";

const Grave: React.FC<{ grave: TGrave }> = (props) => {
  const allPieces = useSelector((state: RootState) => state.game.allPieces);
  let thisPiece: TPiece | undefined = undefined;

  if (props.grave.currentPieceId !== null) {
    thisPiece = allPieces.find((piece) => piece.id === props.grave.currentPieceId);
  }

  return (
    <div className={styles.grave}>
      {/* <p className={styles.location}>
        {props.grave.id} {props.grave.side}
      </p> */}
      {thisPiece && <Piece piece={thisPiece} />}
    </div>
  );
};

export default Grave;
