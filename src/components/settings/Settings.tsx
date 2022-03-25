import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { gameActions } from "../../store/game";
import { RiComputerLine, RiUser3Line } from "react-icons/ri";

import { Side } from "../../constants";

import styles from "./Settings.module.scss";

const Settings = () => {
  const [currentModeIndex, setCurrentModeIndex] = useState(0);

  const dispatch = useDispatch();

  const currentSide = useSelector((state: RootState) => state.game.currentSide);
  const moveHistory = useSelector((state: RootState) => state.game.moveHistory);

  let undoable: boolean = false;
  if (currentModeIndex === 0 && moveHistory.length > 0) {
    undoable = true;
  } else if (currentModeIndex === 1 && moveHistory.length > 1) {
    undoable = true;
  } else if (currentModeIndex === 2 && moveHistory.length > 0) {
    undoable = true;
  }

  const changeGameModeHandler = (newModeIndex: number) => {
    if (newModeIndex !== currentModeIndex) {
      setCurrentModeIndex(newModeIndex);
      dispatch(gameActions.changeGameMode(newModeIndex));
      dispatch(gameActions.initGame());
    }
  };

  const undoHandler = () => {
    if (undoable) {
      // the payload in action here represents number of moves that need to be undo
      if (currentModeIndex === 0) {
        dispatch(gameActions.undoHandler(1));
      } else if (currentModeIndex === 1) {
        if (currentSide === Side.white) {
          dispatch(gameActions.undoHandler(1));
        } else {
          dispatch(gameActions.undoHandler(2));
        }
      } else {
        if (currentSide === Side.white) {
          dispatch(gameActions.undoHandler(2));
        } else {
          dispatch(gameActions.undoHandler(1));
        }
      }
    }
  };

  const newGameHandler = () => {
    dispatch(gameActions.initGame());
  };

  const reverseBoardHandler = () => {};

  return (
    <div className={styles.settings}>
      <div className={styles.title}>Dobutsu Shogi</div>
      <div className={styles.about}>About</div>
      <div className={styles.modes}>
        <p className={styles.subtitle}>Game mode</p>
        <div className={`${styles.mode} ${currentModeIndex === 0 && styles.current}`} onClick={() => changeGameModeHandler(0)}>
          <RiUser3Line />
          <span>vs</span>
          <RiUser3Line />
        </div>

        <div className={`${styles.mode} ${currentModeIndex === 1 && styles.current}`} onClick={() => changeGameModeHandler(1)}>
          <RiComputerLine />
          <span>vs</span>
          <RiUser3Line />
        </div>

        <div className={`${styles.mode} ${currentModeIndex === 2 && styles.current}`} onClick={() => changeGameModeHandler(2)}>
          <RiUser3Line />
          <span>vs</span>
          <RiComputerLine />
        </div>
      </div>
      <div className={styles.options}>
        <p className={styles.subtitle}>Game options</p>
        <div className={styles.btns}>
          <div className={`${styles.btn} ${!undoable && styles.unclickable}`} onClick={undoHandler}>
            Undo
          </div>
          <div className={styles.btn} onClick={newGameHandler}>
            New Game
          </div>
          <div className={styles.btn}>Reverse Board</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
