import { useSelector, useDispatch } from 'react-redux';
import { GoPrimitiveDot } from 'react-icons/go';

import { RootState } from '../../store';
import { gameActions } from '../../store/game';
import { Side, PieceName } from '../../utils/constants';
import { TPiece } from '../../utils/types';
import './Piece.scss';

type PieceProps = {
  piece: TPiece;
};

const Piece = ({ piece }: PieceProps) => {
  const dispatch = useDispatch();

  const gameModeIdex = useSelector((state: RootState) => state.setting.gameModeIndex);
  const activePieceId = useSelector((state: RootState) => state.game.activePieceId);
  const currentSide = useSelector((state: RootState) => state.game.currentSide);
  const winner = useSelector((state: RootState) => state.game.winningSide);
  const reversed = useSelector((state: RootState) => state.setting.reversed);

  const selecting: boolean = piece.id === activePieceId;
  const onBoard: boolean = piece.currentCell !== null;
  const side: Side = piece.side;

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
        dispatch(gameActions.pieceOnClick(piece));
      }
    }
  };

  let pieceContent;
  const pieceName = piece.name.charAt(0).toUpperCase() + piece.name.slice(1);
  if (piece.name === PieceName.chick) {
    if (reversed) {
      if (piece.side === Side.white) {
        pieceContent = (
          <div className='piece__content'>
            <div className='piece__name'>{pieceName}</div>
            <GoPrimitiveDot className='piece__direction-down' />
          </div>
        );
      } else {
        pieceContent = (
          <div className='piece__content'>
            <div className='piece__name'>{pieceName}</div>
            <GoPrimitiveDot className='piece__direction-up' />
          </div>
        );
      }
    } else {
      if (piece.side === Side.white) {
        pieceContent = (
          <div className='piece__content'>
            <div className='piece__name'>{pieceName}</div>
            <GoPrimitiveDot className='piece__direction-up' />
          </div>
        );
      } else {
        pieceContent = (
          <div className='piece__content'>
            <div className='piece__name'>{pieceName}</div>
            <GoPrimitiveDot className='piece__direction-down' />
          </div>
        );
      }
    }
  } else if (piece.name === PieceName.elephant) {
    pieceContent = (
      <div className='piece__content'>
        <div className='piece__name'>{pieceName}</div>
        <GoPrimitiveDot className='piece__direction-upleft' />
        <GoPrimitiveDot className='piece__direction-upright' />
        <GoPrimitiveDot className='piece__direction-downleft' />
        <GoPrimitiveDot className='piece__direction-downright' />
      </div>
    );
  } else if (piece.name === PieceName.giraffe) {
    pieceContent = (
      <div className='piece__content'>
        <div className='piece__name'>{pieceName}</div>
        <GoPrimitiveDot className='piece__direction-up' />
        <GoPrimitiveDot className='piece__direction-left' />
        <GoPrimitiveDot className='piece__direction-right' />
        <GoPrimitiveDot className='piece__direction-down' />
      </div>
    );
  } else if (piece.name === PieceName.hen) {
    if (reversed) {
      if (piece.side === Side.white) {
        pieceContent = (
          <div className='piece__content'>
            <div className='piece__name'>{pieceName}</div>
            <GoPrimitiveDot className='piece__direction-up' />
            <GoPrimitiveDot className='piece__direction-left' />
            <GoPrimitiveDot className='piece__direction-right' />
            <GoPrimitiveDot className='piece__direction-down' />
            <GoPrimitiveDot className='piece__direction-downleft' />
            <GoPrimitiveDot className='piece__direction-downright' />
          </div>
        );
      } else {
        pieceContent = (
          <div className='piece__content'>
            <div className='piece__name'>{pieceName}</div>
            <GoPrimitiveDot className='piece__direction-up' />
            <GoPrimitiveDot className='piece__direction-left' />
            <GoPrimitiveDot className='piece__direction-right' />
            <GoPrimitiveDot className='piece__direction-down' />
            <GoPrimitiveDot className='piece__direction-upleft' />
            <GoPrimitiveDot className='piece__direction-upright' />
          </div>
        );
      }
    } else {
      if (piece.side === Side.white) {
        pieceContent = (
          <div className='piece__content'>
            <div className='piece__name'>{pieceName}</div>
            <GoPrimitiveDot className='piece__direction-up' />
            <GoPrimitiveDot className='piece__direction-left' />
            <GoPrimitiveDot className='piece__direction-right' />
            <GoPrimitiveDot className='piece__direction-down' />
            <GoPrimitiveDot className='piece__direction-upleft' />
            <GoPrimitiveDot className='piece__direction-upright' />
          </div>
        );
      } else {
        pieceContent = (
          <div className='piece__content'>
            <div className='piece__name'>{pieceName}</div>
            <GoPrimitiveDot className='piece__direction-up' />
            <GoPrimitiveDot className='piece__direction-left' />
            <GoPrimitiveDot className='piece__direction-right' />
            <GoPrimitiveDot className='piece__direction-down' />
            <GoPrimitiveDot className='piece__direction-downleft' />
            <GoPrimitiveDot className='piece__direction-downright' />
          </div>
        );
      }
    }
  } else {
    pieceContent = (
      <div className='piece__content'>
        <div className='piece__name'>{pieceName}</div>
        <GoPrimitiveDot className='piece__direction-up' />
        <GoPrimitiveDot className='piece__direction-left' />
        <GoPrimitiveDot className='piece__direction-right' />
        <GoPrimitiveDot className='piece__direction-down' />
        <GoPrimitiveDot className='piece__direction-upleft' />
        <GoPrimitiveDot className='piece__direction-upright' />
        <GoPrimitiveDot className='piece__direction-downleft' />
        <GoPrimitiveDot className='piece__direction-downright' />
      </div>
    );
  }

  return (
    <div
      className={`piece piece-${side === Side.white ? 'white' : 'black'} ${clickable ? 'piece-turn' : ''} ${onBoard ? 'piece-on-board' : ''} ${
        selecting ? 'piece-selecting' : ''
      }`}
      onClick={onClickHandler}
    >
      {pieceContent}
    </div>
  );
};

export default Piece;
