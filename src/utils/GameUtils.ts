import { Side, PieceName, Direction, MoveType } from "./constants";
import { TCell, TGrave, TMove, TPiece } from "./types";

// helper functions
export const getCellByPos = (x: number, y: number, allCells: TCell[]) => {
  let cell: TCell | undefined;

  cell = allCells.find((cell) => cell.x === x && cell.y === y);

  if (cell !== undefined) {
    return cell;
  } else {
    throw new Error("Cannot find cell with this pos!");
  }
};
export const getPieceById = (pieceId: number, allPieces: TPiece[]) => {
  let piece: TPiece | undefined;

  piece = allPieces.find((piece) => piece.id === pieceId);

  if (piece !== undefined) {
    return piece;
  } else {
    throw new Error("Cannot find piece with this id!");
  }
};
export const getEmptyGrave = (side: Side, allGraves: TGrave[]) => {
  // classify graves
  let whiteGraves: TGrave[] = [];
  let blackGraves: TGrave[] = [];
  allGraves.forEach((grave) => {
    if (grave.side === Side.white) {
      whiteGraves.push(grave);
    } else {
      blackGraves.push(grave);
    }
  });

  // find empty grave for this side
  if (side === Side.white) {
    for (let i = 0; i < 6; i++) {
      if (whiteGraves[i].currentPieceId === null) {
        return whiteGraves[i];
      }
    }
  } else {
    for (let i = 0; i < 6; i++) {
      if (blackGraves[i].currentPieceId === null) {
        return blackGraves[i];
      }
    }
  }
  throw new Error("No empty grave left???");
};
export const reorderPieceInGraves = (side: Side, allGraves: TGrave[], allPieces: TPiece[]) => {
  let chickPieces: TPiece[] = [];
  let elephantPieces: TPiece[] = [];
  let giraffePieces: TPiece[] = [];
  let gravesArray = allGraves.filter((grave) => grave.side === side);

  allPieces
    .filter((piece) => piece.side === side)
    .forEach((piece) => {
      if (piece.currentCell === null) {
        if (piece.name === PieceName.chick) {
          chickPieces.push(piece);
        } else if (piece.name === PieceName.elephant) {
          elephantPieces.push(piece);
        } else if (piece.name === PieceName.giraffe) {
          giraffePieces.push(piece);
        } else {
          throw new Error("Another pice type than chick, elephant, giraffe in grave!");
        }
      }
    });

  gravesArray.forEach((grave) => {
    grave.currentPieceId = null;
  });

  let orderedPiecesArr: TPiece[] = chickPieces.concat(elephantPieces).concat(giraffePieces);

  orderedPiecesArr.forEach((piece) => {
    let emptyGrave = getEmptyGrave(side, allGraves);
    emptyGrave.currentPieceId = piece.id;
  });
};
export const updateKilledPiece = (move: TMove) => {
  if (move.killedPiece !== null) {
    if (move.killedPiece.side === Side.white) {
      move.killedPiece.side = Side.black;
    } else {
      move.killedPiece.side = Side.white;
    }

    if (move.killedPiece.name === PieceName.hen) {
      move.killedPiece.name = PieceName.chick;
      move.demote = true;
    }
  } else {
    throw new Error("updateKilledPiece method is called from somewhere move killedPiece is null!");
  }
};
export const promotionCheck = (move: TMove) => {
  if (move.movePiece.name === PieceName.chick) {
    if ((move.movePiece.side === Side.white && move.toCell.y === 3) || (move.movePiece.side === Side.black && move.toCell.y === 0)) {
      move.movePiece.name = PieceName.hen;
      move.promote = true;
    }
  }
};
export const changeSide = (currentSide: Side) => {
  if (currentSide === Side.white) {
    currentSide = Side.black;
  } else {
    currentSide = Side.white;
  }
  return currentSide;
};

// gameover check
export const gameOverByReachingCheck = (move: TMove, allCells: TCell[], allPieces: TPiece[]) => {
  if (move.movePiece.name === PieceName.lion) {
    let checkSide: Side = Side.white; // default is white, if movePiece is white, then switch to black
    let gameOver: boolean = true;

    if (move.movePiece.side === Side.white && move.toCell.y === 3) {
      checkSide = Side.black;
    } else if (move.movePiece.side === Side.black && move.toCell.y === 0) {
      checkSide = Side.white;
    } else {
      return false;
    }

    allPieces
      .filter((piece) => piece.side === checkSide)
      .forEach((piece) => {
        generateMoves(piece, allCells, allPieces);
        piece.allMoves.forEach((toCell) => {
          if (toCell.moveType === MoveType.atk && toCell.currentPieceId !== null) {
            let killedPiece = getPieceById(toCell.currentPieceId, allPieces);
            if (killedPiece.name === PieceName.lion && killedPiece.side !== checkSide) {
              gameOver = false;
            }
          }
          toCell.moveType = null;
        });
      });

    return gameOver;
  }
};
export const drawCheck = (moveHistory: TMove[]) => {
  // secondNearestMove, fourthNearestMove, sixthNearestMove, and eighthNearestMove between two same positions with the same movePiece
  // nearestMove, thirdNearestMove, fifthNearestMove, seventhNearestMove, and ninthNearestMove between two same positions with the same movePiece, then draw!
  // example:
  // ninthNearestMove       (arr[length - 9]):   whiteLion fromCell 01 toCell 11
  // eighthNearestMove      (arr[length - 8]):   blackGiraffe fromcell 23 toCell 13
  // seventhNearestMove     (arr[length - 7]):   whiteLion fromCell 11 toCell 01
  // sixthNearestMove       (arr[length - 6]):   blackGiraffe fromcell 13 toCell 23
  // fifthNearestMove       (arr[length - 5]):   whiteLion fromCell 01 toCell 11
  // fourthNearestMove      (arr[length - 4]):   blackGiraffe fromcell 23 toCell 13
  // thirdNearestMove       (arr[length - 3]):   whiteLion fromCell 11 toCell 01
  // secondNearestMove      (arr[length - 2]):   blackGiraffe fromcell 13 toCell 23
  // nearestMove            (arr[length - 1]):   whiteLion fromCell 01 toCell 11      ====> draw

  let moveHistoryLength = moveHistory.length;
  if (moveHistoryLength >= 9) {
    let fromCell1 = moveHistory[moveHistoryLength - 1].fromCell;
    let fromCell2 = moveHistory[moveHistoryLength - 2].fromCell;
    let fromCell3 = moveHistory[moveHistoryLength - 3].fromCell;
    let fromCell4 = moveHistory[moveHistoryLength - 4].fromCell;
    let fromCell5 = moveHistory[moveHistoryLength - 5].fromCell;
    let fromCell6 = moveHistory[moveHistoryLength - 6].fromCell;
    let fromCell7 = moveHistory[moveHistoryLength - 7].fromCell;
    let fromCell8 = moveHistory[moveHistoryLength - 8].fromCell;
    let fromCell9 = moveHistory[moveHistoryLength - 9].fromCell;

    let toCell1 = moveHistory[moveHistoryLength - 1].toCell;
    let toCell2 = moveHistory[moveHistoryLength - 2].toCell;
    let toCell3 = moveHistory[moveHistoryLength - 3].toCell;
    let toCell4 = moveHistory[moveHistoryLength - 4].toCell;
    let toCell5 = moveHistory[moveHistoryLength - 5].toCell;
    let toCell6 = moveHistory[moveHistoryLength - 6].toCell;
    let toCell7 = moveHistory[moveHistoryLength - 7].toCell;
    let toCell8 = moveHistory[moveHistoryLength - 8].toCell;
    let toCell9 = moveHistory[moveHistoryLength - 9].toCell;

    let movePieceId1 = moveHistory[moveHistoryLength - 1].movePiece.id;
    let movePieceId2 = moveHistory[moveHistoryLength - 2].movePiece.id;
    let movePieceId3 = moveHistory[moveHistoryLength - 3].movePiece.id;
    let movePieceId4 = moveHistory[moveHistoryLength - 4].movePiece.id;
    let movePieceId5 = moveHistory[moveHistoryLength - 5].movePiece.id;
    let movePieceId6 = moveHistory[moveHistoryLength - 6].movePiece.id;
    let movePieceId7 = moveHistory[moveHistoryLength - 7].movePiece.id;
    let movePieceId8 = moveHistory[moveHistoryLength - 8].movePiece.id;
    let movePieceId9 = moveHistory[moveHistoryLength - 9].movePiece.id;

    // if any move is revMove ==> return false
    if (
      fromCell1 === null ||
      fromCell2 === null ||
      fromCell3 === null ||
      fromCell4 === null ||
      fromCell5 === null ||
      fromCell6 === null ||
      fromCell7 === null ||
      fromCell8 === null ||
      fromCell9 === null
    ) {
      return false;
    }

    // first check fromCell and toCell of evenMoves, then oddMoves, then pieceId
    if (
      fromCell2.x === toCell4.x &&
      fromCell2.y === toCell4.y &&
      toCell2.x === fromCell4.x &&
      toCell2.y === fromCell4.y &&
      fromCell4.x === toCell6.x &&
      fromCell4.y === toCell6.y &&
      toCell4.x === fromCell6.x &&
      toCell4.y === fromCell6.y &&
      fromCell6.x === toCell8.x &&
      fromCell6.y === toCell8.y &&
      toCell6.x === fromCell8.x &&
      toCell6.y === fromCell8.y
    ) {
      if (
        fromCell1.x === toCell3.x &&
        fromCell1.y === toCell3.y &&
        toCell1.x === fromCell3.x &&
        toCell1.y === fromCell3.y &&
        fromCell3.x === toCell5.x &&
        fromCell3.y === toCell5.y &&
        toCell3.x === fromCell5.x &&
        toCell3.y === fromCell5.y &&
        fromCell5.x === toCell7.x &&
        fromCell5.y === toCell7.y &&
        toCell5.x === fromCell7.x &&
        toCell5.y === fromCell7.y &&
        fromCell7.x === toCell9.x &&
        fromCell7.y === toCell9.y &&
        toCell7.x === fromCell9.x &&
        toCell7.y === fromCell9.y
      ) {
        if (
          movePieceId1 === movePieceId3 &&
          movePieceId3 === movePieceId5 &&
          movePieceId5 === movePieceId7 &&
          movePieceId7 === movePieceId9 &&
          movePieceId2 === movePieceId4 &&
          movePieceId4 === movePieceId6 &&
          movePieceId6 === movePieceId8
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

// game initialize
export const initCells = (allCells: TCell[]) => {
  allCells.length = 0;
  for (let y = 3; y > -1; y--) {
    for (let x = 0; x < 3; x++) {
      let newCell: TCell = {
        x: x,
        y: y,
        currentPieceId: null,
        moveType: null,
      };
      allCells.push(newCell);
    }
  }
};
export const initGraves = (allGraves: TGrave[]) => {
  allGraves.length = 0;
  for (let i = 0; i < 12; i++) {
    let graveSide: Side;
    if (i < 6) {
      graveSide = Side.white;
    } else {
      graveSide = Side.black;
    }
    let newGrave: TGrave = {
      id: i,
      side: graveSide,
      currentPieceId: null,
    };
    allGraves.push(newGrave);
  }
};
export const initPieces = (allPieces: TPiece[], allCells: TCell[]) => {
  allPieces.length = 0;

  allCells.forEach((cell) => {
    let newPiece: TPiece | null = null;
    if (cell.x === 1 && cell.y === 1) {
      newPiece = {
        id: 0,
        side: Side.white,
        name: PieceName.chick,
        currentCell: cell,
        allMoves: [],
      };
    } else if (cell.x === 0 && cell.y === 0) {
      newPiece = {
        id: 1,
        side: Side.white,
        name: PieceName.elephant,
        currentCell: cell,
        allMoves: [],
      };
    } else if (cell.x === 2 && cell.y === 0) {
      newPiece = {
        id: 2,
        side: Side.white,
        name: PieceName.giraffe,
        currentCell: cell,
        allMoves: [],
      };
    } else if (cell.x === 1 && cell.y === 0) {
      newPiece = {
        id: 3,
        side: Side.white,
        name: PieceName.lion,
        currentCell: cell,
        allMoves: [],
      };
    } else if (cell.x === 1 && cell.y === 2) {
      newPiece = {
        id: 4,
        side: Side.black,
        name: PieceName.chick,
        currentCell: cell,
        allMoves: [],
      };
    } else if (cell.x === 2 && cell.y === 3) {
      newPiece = {
        id: 5,
        side: Side.black,
        name: PieceName.elephant,
        currentCell: cell,
        allMoves: [],
      };
    } else if (cell.x === 0 && cell.y === 3) {
      newPiece = {
        id: 6,
        side: Side.black,
        name: PieceName.giraffe,
        currentCell: cell,
        allMoves: [],
      };
    } else if (cell.x === 1 && cell.y === 3) {
      newPiece = {
        id: 7,
        side: Side.black,
        name: PieceName.lion,
        currentCell: cell,
        allMoves: [],
      };
    }

    if (newPiece !== null) {
      cell.currentPieceId = newPiece.id;
      allPieces.push(newPiece);
    }
  });
};

// piece onClick handler
export const generateMoves = (piece: TPiece, allCells: TCell[], allPieces: TPiece[]) => {
  piece.allMoves = [];

  // this piece currently on board
  if (piece.currentCell !== null) {
    let directionArr: Direction[] = [];

    // get piece directions
    switch (piece.name) {
      case PieceName.chick:
        if (piece.side === Side.white) {
          directionArr = [Direction.up];
        } else {
          directionArr = [Direction.down];
        }
        break;
      case PieceName.hen:
        if (piece.side === Side.white) {
          directionArr = [Direction.up, Direction.down, Direction.right, Direction.left, Direction.upright, Direction.upleft];
        } else {
          directionArr = [Direction.up, Direction.down, Direction.right, Direction.left, Direction.downright, Direction.downleft];
        }
        break;
      case PieceName.elephant:
        directionArr = [Direction.upright, Direction.upleft, Direction.downright, Direction.downleft];
        break;
      case PieceName.giraffe:
        directionArr = [Direction.up, Direction.down, Direction.right, Direction.left];
        break;
      case PieceName.lion:
        directionArr = [
          Direction.up,
          Direction.down,
          Direction.right,
          Direction.left,
          Direction.upright,
          Direction.upleft,
          Direction.downright,
          Direction.downleft,
        ];
        break;
      default:
        return;
    }

    // determine toCells
    let fromCell = piece.currentCell;
    let toCells: TCell[] = [];
    directionArr.forEach((direction) => {
      let toCell: TCell | undefined = undefined;
      switch (direction) {
        case Direction.up:
          toCell = allCells.find((cell) => cell.x === fromCell.x && cell.y === fromCell.y + 1);
          break;
        case Direction.down:
          toCell = allCells.find((cell) => cell.x === fromCell.x && cell.y === fromCell.y - 1);
          break;
        case Direction.right:
          toCell = allCells.find((cell) => cell.x + 1 === fromCell.x && cell.y === fromCell.y);
          break;
        case Direction.left:
          toCell = allCells.find((cell) => cell.x - 1 === fromCell.x && cell.y === fromCell.y);
          break;
        case Direction.upright:
          toCell = allCells.find((cell) => cell.x + 1 === fromCell.x && cell.y === fromCell.y + 1);
          break;
        case Direction.upleft:
          toCell = allCells.find((cell) => cell.x - 1 === fromCell.x && cell.y === fromCell.y + 1);
          break;
        case Direction.downright:
          toCell = allCells.find((cell) => cell.x + 1 === fromCell.x && cell.y === fromCell.y - 1);
          break;
        case Direction.downleft:
          toCell = allCells.find((cell) => cell.x - 1 === fromCell.x && cell.y === fromCell.y - 1);
          break;
        default:
          throw new Error("Unable to determine direction!");
      }

      if (toCell !== undefined) {
        toCells.push(toCell);
      }
    });

    // change toCells moveType
    toCells.forEach((toCell) => {
      if (toCell.currentPieceId === null) {
        toCell.moveType = MoveType.move;
        piece.allMoves.push(toCell);
      } else {
        let toCellCurrentPiece = getPieceById(toCell.currentPieceId, allPieces);
        if (toCellCurrentPiece.side !== piece.side) {
          toCell.moveType = MoveType.atk;
          piece.allMoves.push(toCell);
        }
      }
    });
  }
  // this piece currently in hand
  else {
    // determine toCells and change their moveType
    allCells
      .filter((cell) => cell.currentPieceId === null)
      .forEach((cell) => {
        cell.moveType = MoveType.rev;
        piece.allMoves.push(cell);
      });
  }
};
export const deleteMoves = (piece: TPiece, allCells: TCell[]) => {
  piece.allMoves = [];
  allCells.forEach((cell) => (cell.moveType = null));
};

// cell onClick handler
export const moveExecute = (move: TMove) => {
  if (move.type === MoveType.move && move.fromCell !== null) {
    // check for chick promotion
    promotionCheck(move);

    // update fromCell currentPieceId
    move.fromCell.currentPieceId = null;

    // update toCell currentPieceId
    move.toCell.currentPieceId = move.movePiece.id;

    //update movePiece currentCell
    move.movePiece.currentCell = move.toCell;
  } else if (move.type === MoveType.atk && move.fromCell !== null && move.killedPiece !== null) {
    // check for chick promotion
    promotionCheck(move);

    // update fromCell currentPieceId
    move.fromCell.currentPieceId = null;

    // update toCell currentPieceId
    move.toCell.currentPieceId = move.movePiece.id;

    // update movePiece currentCell
    move.movePiece.currentCell = move.toCell;

    // update killedPiece info
    updateKilledPiece(move);

    // update currentCell
    move.killedPiece.currentCell = null;
  } else {
    // update toCell currentPieceId
    move.toCell.currentPieceId = move.movePiece.id;

    // update movePiece currentCell
    move.movePiece.currentCell = move.toCell;
  }
};
export const moveUndo = (move: TMove) => {
  if (move.type === MoveType.move && move.fromCell !== null) {
    // if this is a promotion move, demote it
    if (move.promote === true) {
      move.movePiece.name = PieceName.chick;
    }

    // update fromCell currentPieceId
    move.fromCell.currentPieceId = move.movePiece.id;

    // update toCell currentPieceId
    move.toCell.currentPieceId = null;

    // update movePiece currentCell
    move.movePiece.currentCell = move.fromCell;
  } else if (move.type === MoveType.atk && move.killedPiece !== null && move.fromCell !== null) {
    // if this is a promotion move, demote it
    if (move.promote === true) {
      move.movePiece.name = PieceName.chick;
    }

    // update fromCell currentPieceId
    move.fromCell.currentPieceId = move.movePiece.id;

    // update toCell currentPieceId
    move.toCell.currentPieceId = move.killedPiece.id;

    // update movePiece currentCell
    move.movePiece.currentCell = move.fromCell;

    // update killedPiece info
    updateKilledPiece(move);
    if (move.demote === true) {
      move.killedPiece.name = PieceName.hen;
    }

    // update killedPiece currentCell
    move.killedPiece.currentCell = move.toCell;
  } else if (move.type === MoveType.rev) {
    // update toCell currentPieceId
    move.toCell.currentPieceId = null;

    // update movePiece currentCell
    move.movePiece.currentCell = null;
  }
};
