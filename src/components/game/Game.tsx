import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { gameActions } from "../../store/game";

import { Side, Winner } from "../../constants";
import { TGrave, TCell } from "../../types";

import Cell from "./Cell";
import Grave from "./Grave";

import styles from "./Game.module.scss";

const Game = () => {
  const dispatch = useDispatch();
  const allCells = useSelector((state: RootState) => state.game.allCells);
  const allGraves = useSelector((state: RootState) => state.game.allGraves);
  const currentSide = useSelector((state: RootState) => state.game.currentSide);
  const winner = useSelector((state: RootState) => state.game.winningSide);

  const gameModeIndex = useSelector((state: RootState) => state.setting.gameModeIndex);
  const reversed = useSelector((state: RootState) => state.setting.reversed);

  let whiteGraves: TGrave[] = [];
  let blackGraves: TGrave[] = [];

  allGraves.forEach((grave) => {
    if (grave.side === Side.white) {
      whiteGraves.push(grave);
    } else {
      blackGraves.push(grave);
    }
  });

  useEffect(() => {
    newGameHandler();
  }, []);

  useEffect(() => {
    let timer: any;

    if (winner === null && gameModeIndex !== 0) {
      if (gameModeIndex === 1) {
        if (currentSide === Side.white) {
          timer = setTimeout(() => {
            dispatch(gameActions.aiHandler(Side.white));
          }, 1000);
        }
      } else {
        if (currentSide === Side.black) {
          timer = setTimeout(() => {
            dispatch(gameActions.aiHandler(Side.black));
          }, 1000);
        }
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [currentSide, winner, gameModeIndex]);

  const newGameHandler = () => {
    dispatch(gameActions.initGame());
  };

  let winningContent;
  if (winner !== null) {
    if (winner === Winner.draw) {
      winningContent = <>draw!</>;
    } else {
      winningContent = <>{winner} side win!</>;
    }
  }

  let allCellsClone: TCell[] = [];
  allCells.forEach((cell) => {
    let newCopyCell = {
      ...cell,
    };
    allCellsClone.push(newCopyCell);
  });

  let currentTurnLoading;
  if (reversed) {
    if (currentSide === Side.white) {
      currentTurnLoading = "up";
    } else {
      currentTurnLoading = "down";
    }
  } else {
    if (currentSide === Side.white) {
      currentTurnLoading = "down";
    } else {
      currentTurnLoading = "up";
    }
  }

  return (
    <div className={styles.game}>
      <div className={styles.board}>
        <div className={styles["graves-container"]}>
          {reversed
            ? whiteGraves.map((grave) => {
                return <Grave key={grave.id} grave={grave} />;
              })
            : blackGraves.map((grave) => {
                return <Grave key={grave.id} grave={grave} />;
              })}
        </div>
        <div className={styles["cells-container"]}>
          {reversed
            ? allCellsClone.reverse().map((cell) => {
                return <Cell key={cell.x.toString() + cell.y.toString()} cell={cell} />;
              })
            : allCellsClone.map((cell) => {
                return <Cell key={cell.x.toString() + cell.y.toString()} cell={cell} />;
              })}
        </div>
        <div className={styles["graves-container"]}>
          {reversed
            ? blackGraves.map((grave) => {
                return <Grave key={grave.id} grave={grave} />;
              })
            : whiteGraves.map((grave) => {
                return <Grave key={grave.id} grave={grave} />;
              })}
        </div>
      </div>
      <div className={`${styles["turn-info"]} ${currentTurnLoading ? styles[currentTurnLoading] : ""}`}>
        <div className={styles.loader}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
      {winner && (
        <div className={styles["gameover-panel"]}>
          <div className={styles.result}>{winningContent}</div>
          <div className={styles["new-game"]} onClick={newGameHandler}>
            New Game
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
