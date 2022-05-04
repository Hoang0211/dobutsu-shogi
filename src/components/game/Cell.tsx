import { useSelector, useDispatch } from 'react-redux';

import Piece from './Piece';
import { RootState } from '../../store';
import { gameActions } from '../../store/game';
import { TCell, TPiece } from '../../utils/types';
import './Cell.scss';

type CellProps = {
  cell: TCell;
};

const Cell = ({ cell }: CellProps) => {
  const dispatch = useDispatch();
  const allPieces = useSelector((state: RootState) => state.game.allPieces);
  const reversed = useSelector((state: RootState) => state.setting.reversed);

  let thisPiece: TPiece | undefined = undefined;

  if (cell.currentPieceId !== null) {
    thisPiece = allPieces.find((piece) => piece.id === cell.currentPieceId);
  }

  const onClickHandler = () => {
    // only allow cell with moveType to be clicked
    if (cell.moveType !== null) {
      dispatch(gameActions.cellOnClick(cell));
    }
  };

  let homeRowClass = 'neutral';
  if (reversed) {
    if (cell.y === 0) {
      homeRowClass = 'white-reversed';
    } else if (cell.y === 3) {
      homeRowClass = 'black-reversed';
    }
  } else {
    if (cell.y === 0) {
      homeRowClass = 'white';
    } else if (cell.y === 3) {
      homeRowClass = 'black';
    }
  }

  return (
    <div className={`cell cell-${homeRowClass} ${cell.moveType !== null ? `cell-${cell.moveType}` : ''}`} onClick={onClickHandler}>
      {thisPiece && <Piece piece={thisPiece} />}
    </div>
  );
};

export default Cell;
