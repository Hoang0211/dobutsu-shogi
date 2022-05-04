import { useSelector } from 'react-redux';

import Piece from './Piece';
import { RootState } from '../../store';
import { TGrave, TPiece } from '../../utils/types';
import './Grave.scss';

type GraveProps = {
  grave: TGrave;
};

const Grave = ({ grave }: GraveProps) => {
  const allPieces = useSelector((state: RootState) => state.game.allPieces);
  let thisPiece: TPiece | undefined = undefined;

  if (grave.currentPieceId !== null) {
    thisPiece = allPieces.find((piece) => piece.id === grave.currentPieceId);
  }

  return <div className='grave'>{thisPiece && <Piece piece={thisPiece} />}</div>;
};

export default Grave;
