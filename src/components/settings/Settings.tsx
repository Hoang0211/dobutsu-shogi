import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { gameActions } from "../../store/game";
import { RiComputerLine, RiUser3Line } from "react-icons/ri";

import styles from "./Settings.module.scss";

const Settings = () => {
  console.log("Render Settings");

  const dispatch = useDispatch();
  const [currentModeIndex, setCurrentModeIndex] = useState(0);

  const changeGameModeHandler = (newModeIndex: number) => {
    if (newModeIndex !== currentModeIndex) {
      setCurrentModeIndex(newModeIndex);
      dispatch(gameActions.changeGameMode(newModeIndex));
      dispatch(gameActions.initGame());
    }
  };

  const undoHandler = () => {
    dispatch(gameActions.undoHandler());
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
          <div className={styles.btn}>Undo</div>
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
