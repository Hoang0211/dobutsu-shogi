import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Cell from './Cell';
import Grave from './Grave';
import { RootState } from '../../store';
import { gameActions } from '../../store/game';
import { Side, Winner } from '../../utils/constants';
import { TGrave, TCell } from '../../utils/types';
import './Game.scss';

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

  const newGameHandler = useCallback(() => {
    dispatch(gameActions.initGame());
  }, [dispatch]);

  useEffect(() => {
    newGameHandler();
  }, [newGameHandler]);

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
  }, [currentSide, winner, gameModeIndex, dispatch]);

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
      currentTurnLoading = 'up';
    } else {
      currentTurnLoading = 'down';
    }
  } else {
    if (currentSide === Side.white) {
      currentTurnLoading = 'down';
    } else {
      currentTurnLoading = 'up';
    }
  }

  return (
    <div className='game'>
      <div className='game__board'>
        <div className='game__graves'>
          {reversed
            ? whiteGraves.map((grave) => {
                return <Grave key={grave.id} grave={grave} />;
              })
            : blackGraves.map((grave) => {
                return <Grave key={grave.id} grave={grave} />;
              })}
        </div>
        <div className='game__cells'>
          {reversed
            ? allCellsClone.reverse().map((cell) => {
                return <Cell key={cell.x.toString() + cell.y.toString()} cell={cell} />;
              })
            : allCellsClone.map((cell) => {
                return <Cell key={cell.x.toString() + cell.y.toString()} cell={cell} />;
              })}
        </div>
        <div className='game__graves'>
          {reversed
            ? blackGraves.map((grave) => {
                return <Grave key={grave.id} grave={grave} />;
              })
            : whiteGraves.map((grave) => {
                return <Grave key={grave.id} grave={grave} />;
              })}
        </div>
      </div>
      <div className={`game__turn game__turn-${currentTurnLoading}`}>
        <div className='game__turn-loader'>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
      {winner && (
        <div className='game__gameover'>
          <div className='game__gameover-text'>{winningContent}</div>
          <button className='btn game__gameover-btn' onClick={newGameHandler}>
            New Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
