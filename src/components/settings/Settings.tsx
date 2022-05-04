import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { gameActions } from '../../store/game';
import { settingActions } from '../../store/setting';
import { RiComputerLine, RiUser3Line } from 'react-icons/ri';

import { Side } from '../../utils/constants';
import './Settings.scss';

const Settings = () => {
  const dispatch = useDispatch();
  const currentModeIndex = useSelector((state: RootState) => state.setting.gameModeIndex);
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

  const aboutHandler = () => {
    dispatch(settingActions.showAboutHandler());
  };

  const changeGameModeHandler = (newModeIndex: number) => {
    if (newModeIndex !== currentModeIndex) {
      dispatch(settingActions.changeGameMode(newModeIndex));
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

  const reverseBoardHandler = () => {
    dispatch(settingActions.reverseBoard());
  };

  return (
    <div className='settings'>
      <h1 className='settings__title'>Dobutsu Shogi</h1>
      <button className='btn settings__about' onClick={aboutHandler}>
        About
      </button>
      <div className='settings__modes'>
        <h2 className='settings__subtitle'>Game mode</h2>
        <button className={`settings__mode ${currentModeIndex === 0 && 'settings__mode-current'}`} onClick={() => changeGameModeHandler(0)}>
          <RiUser3Line />
          <span>vs</span>
          <RiUser3Line />
        </button>

        <button className={`settings__mode ${currentModeIndex === 1 && 'settings__mode-current'}`} onClick={() => changeGameModeHandler(1)}>
          <RiComputerLine />
          <span>vs</span>
          <RiUser3Line />
        </button>

        <button className={`settings__mode ${currentModeIndex === 2 && 'settings__mode-current'}`} onClick={() => changeGameModeHandler(2)}>
          <RiUser3Line />
          <span>vs</span>
          <RiComputerLine />
        </button>
      </div>
      <div className='settings__options'>
        <h2 className='settings__subtitle'>Game options</h2>
        <div className='options__btns'>
          <button className={`btn options__btn ${!undoable && 'options__btn-unclickable'}`} onClick={undoHandler}>
            Undo
          </button>
          <button className='btn options__btn' onClick={newGameHandler}>
            New Game
          </button>
          <button className='btn options__btn' onClick={reverseBoardHandler}>
            Reverse Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
