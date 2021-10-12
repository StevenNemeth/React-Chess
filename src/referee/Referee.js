import Piece from '../components/Chessboard/Chessboard'

//Things to add
//Check if square is attacked
//Prevent king from moving into check
//Castling
//Checkmate
//Stalemate
//Check

// step for writing is in check
// get the color of last moved piece
// get opposite color's king
// get opposite color's king location
// loop through boardState
// check if the boardState of lastmovePiece are attacking opposite king's location using isValidMove

const tileIsOccupied = (x, y, boardState) => {
  const movedPiece = boardState.find((p) => p.x === x && p.y === y)
  if (movedPiece) {
    return true
  } else {
    return false
  }
}

const getAdjacentPieceLeft = (x, y, boardState) => {
  return boardState.find((p) => p.x === x - 1 && p.y === y)
}
const getAdjacentPieceRight = (x, y, boardState) => {
  return boardState.find((p) => p.x === x + 1 && p.y === y)
}

const tileIsEmptyOrOccupiedByOpponent = (x, y, boardState, team) => {
  return (
    !tileIsOccupied(x, y, boardState) || tileIsOccupiedByOpponent(x, y, boardState, team)
  )
}
const samePosition = (p1, p2) => {
  return p1.x === p2.x && p1.y === p2.y;
}

const tileIsOccupiedByOpponent = (x, y, boardState, team) => {
  const piece = boardState.find((p) => p.x === x && p.y === y && !p.type.includes(team))

  if (piece) {
    return true
  } else {
    return false
  }
}

const rowOrColumnIsOccupied = (boardState, x, y, px, py) => {
  // loop through from x to px
  // check to see if each tile is occupied



  for (let i = px + 1; i < x; i++) {
    if (tileIsOccupied(i, y, boardState)) {
      return false
    }
  }
  return true
}


// const attackingOpposingColor = (currentPiece, attackedPiece) => {
//   let curr = ''
//   if (currentPiece.type.includes('white')) {
//     curr = 'white'
//   }
//   if (currentPiece.type.includes('black')) {
//     curr = 'black'
//   }
//   if (attackedPiece) {
//     if (attackedPiece.type.includes('white') && curr === 'black') {
//       return true
//     } else if (attackedPiece.type.includes('black') && curr === 'white') {
//       return true
//     }
//   }
// }
//check my unit is on 4th

const isEnPassantMove = (px, py, x, y, type, boardState, currentPiece, attackedPiece) => {
  const pawnDirection = (type.includes('white')) ? 1 : -1

  if (type.includes('pawn')) {
    if (x - px === -1 || x - px === 1 && y - py === pawnDirection) {
      const piece = boardState.find(
        (p) => p.x === x && p.y === y + pawnDirection
      )
    }
  }
  return false
}

const Referee = {
  // isEnPassantMove: (px, py, x, y, type, boardState, currentPiece, attackedPiece) => {
  //   const pawnDirection = (type.includes('white')) ? 1 : -1
  //   // if pawn
  //   if (type.includes('pawn')) {
  //     // if the tile we are moving to is 1 left or 1 right and 1 above or below being respective to our team color
  //     if (x - px === -1 || x - px === 1 && y - py === pawnDirection) {
  //       const piece = boardState.find(
  //         (p) => p.x === x && p.y === y - pawnDirection
  //       )
  //       if(piece !== undefined){
  //         console.log(piece, 'enPassant')
  //         return true
  //       }
  //     }
  //   }
  //   return false
  // },
  isInCheck: (boardState, lastMovePiece, lastMove) => {

    const attackingColor = lastMovePiece.includes('white') ? 'white' : 'black'
    //check lastMovePiece color
    const attackedKingColor = !lastMovePiece.includes('white') ? 'white' : 'black'
    //get the king's color
    const attackedKingLocation = boardState.filter((element) => {

      if (element.type === `king-${attackedKingColor}`) {
        return true
      }

    })[0]

    //get the king's location
    const isInCheck = boardState.some((element) => {
      if (element.type.includes(attackingColor)) {
        return Referee.isValidMove(element.x, element.y, attackedKingLocation.x, attackedKingLocation.y, element.type, boardState, null, null, lastMovePiece, lastMove)
      }
      return false
    })
    //loop through lastMovePiece pieces
    //check if lastMovePiece pieces are attacking king
    console.log(isInCheck, 'isIncheck')
    return isInCheck
  },
  isValidMove: (px, py, x, y, type, boardState, currentPiece, attackedPiece, lastMovePiece, lastMove) => {
    // px and py are previous x and previous y
    // x and y are current x and y when dropped/moved
    // type is type of chess piece
    // boardState is an array of objects of board tiles including pieces position



    if (type.includes('pawn')) {
      const team = type.includes('white') ? 'white' : 'black'
      const specialRow = (type.includes('white')) ? 1 : 6
      const pawnDirection = (type.includes('white')) ? 1 : -1


      if (px === x && py === specialRow && y - py === 2 * pawnDirection) {
        if (!tileIsOccupied(x, y, boardState) && !tileIsOccupied(x, y - pawnDirection, boardState)) {
          return true
        }
      } else if (px === x && y - py === pawnDirection) {
        if (!tileIsOccupied(x, y, boardState)) {
          return true
        }
      }
      //ATTACK LOGIC
      else if (x - px === -1 && y - py === pawnDirection) {

        //attack upper or lower left corner
        if (tileIsOccupiedByOpponent(x, y, boardState, team) && tileIsOccupied(x, y, boardState)) {
          return true
        }
        else if (lastMove && Math.abs(lastMove.startY - lastMove.endY) === 2) {
          //En passant
          const adjacentLeftPiece = getAdjacentPieceLeft(px, py, boardState)
          if (adjacentLeftPiece && adjacentLeftPiece.type === lastMovePiece && lastMovePiece.includes('pawn')) {

            for (let i = 0; i < boardState.length; i++) {
              if (boardState[i].type === adjacentLeftPiece.type) {
                boardState.splice(i, 1)
              }
            }
            return true
          }

          //check if the last move is a pawn adjacent to current pawn


        }

      } else if (x - px === 1 && y - py === pawnDirection) {
        //attack upper or lower right corner
        if (tileIsOccupiedByOpponent(x, y, boardState, team) && tileIsOccupied(x, y, boardState)) {
          return true
        }
        else if (lastMove && Math.abs(lastMove.startY - lastMove.endY) === 2) {
          //En passant
          const adjacentRightPiece = getAdjacentPieceRight(px, py, boardState)
          if (adjacentRightPiece && adjacentRightPiece.type === lastMovePiece && lastMovePiece.includes('pawn')) {

            for (let i = 0; i < boardState.length; i++) {
              if (boardState[i].type === adjacentRightPiece.type) {
                boardState.splice(i, 1)
              }
            }
            return true
          }
          //check if the last move is a pawn adjacent to current pawn  
        }
      }
    }

    if (type.includes('rook')) {
      const team = type.includes('white') ? 'white' : 'black'
      for (let i = 1; i < 8; i++) {
        //right movement
        if (x > px && y === py) {
          //Check if the tile is the destination tile
          if (x === px + i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px + i, py, boardState, team)) {
              return true;
            }
          } else {
            //Dealing with passing tile
            if (tileIsOccupied(px + i, py, boardState)) {
              break;
            }
          }
        }
        //down movement
        if (x === px && y < py) {
          //Check if the tile is the destination tile
          if (y === py - i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px, py - i, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px, py - i, boardState)) {
              break;
            }
          }
        }
        //left movement
        if (x < px && y === py) {
          //Check if the tile is the destination tile
          if (x === px - i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px - i, py, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px - i, py, boardState)) {
              break;
            }
          }
        }
        //up movement
        if (x === px && y > py) {
          //Check if the tile is the destination tile
          if (y === py + i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px, py + i, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px, py + i, boardState)) {
              break;
            }
          }
        }
      }
      return false;
    }


    //KING
    if (type.includes('king')) {
      const team = type.includes('white') ? 'white' : 'black'
      if (!tileIsOccupied(x, y, boardState)) {
        if (Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1)
          return true
      } else if (tileIsOccupiedByOpponent(x, y, boardState, team) && Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
        return true
      }
      return false;
    }


    //QUEEN
    if (type.includes('queen')) {
      const team = type.includes('white') ? 'white' : 'black'
      for (let i = 1; i < 8; i++) {
        //right movement
        if (x > px && y === py) {
          //Check if the tile is the destination tile
          if (x === px + i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px + i, py, boardState, team)) {
              return true;
            }
          } else {
            //Dealing with passing tile
            if (tileIsOccupied(px + i, py, boardState)) {
              break;
            }
          }
        }
        //down movement
        if (x === px && y < py) {
          //Check if the tile is the destination tile
          if (y === py - i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px, py - i, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px, py - i, boardState)) {
              break;
            }
          }
        }
        //left movement
        if (x < px && y === py) {
          //Check if the tile is the destination tile
          if (x === px - i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px - i, py, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px - i, py, boardState)) {
              break;
            }
          }
        }
        //up movement
        if (x === px && y > py) {
          //Check if the tile is the destination tile
          if (y === py + i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px, py + i, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px, py + i, boardState)) {
              break;
            }
          }
        }
        //Up right movement
        if (x > px && y > py) {
          //Check if the tile is the destination tile
          if (x === px + i && y === py + i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px + i, py + i, boardState, team)) {
              return true;
            }
          } else {
            //Dealing with passing tile
            if (tileIsOccupied(px + i, py + i, boardState)) {
              break;
            }
          }
        }
        //Bottom right movement
        if (x > px && y < py) {
          //Check if the tile is the destination tile
          if (x === px + i && y === py - i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px + i, py - i, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px + i, py - i, boardState)) {
              break;
            }
          }
        }
        //Bottom left movement
        if (x < px && y < py) {
          //Check if the tile is the destination tile
          if (x === px - i && y === py - i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px - i, py - i, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px - i, py - i, boardState)) {
              break;
            }
          }
        }
        //Top left movement
        if (x < px && y > py) {
          //Check if the tile is the destination tile
          if (x === px - i && y === py + i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px - i, py + i, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px - i, py + i, boardState)) {
              break;
            }
          }
        }
      }
      return false;
    }


    //BISHOP
    if (type.includes('bishop')) {
      const team = type.includes('white') ? 'white' : 'black'
      for (let i = 1; i < 8; i++) {
        //Up right movement
        if (x > px && y > py) {
          //Check if the tile is the destination tile
          if (x === px + i && y === py + i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px + i, py + i, boardState, team)) {
              return true;
            }
          } else {
            //Dealing with passing tile
            if (tileIsOccupied(px + i, py + i, boardState)) {
              break;
            }
          }
        }
        //Bottom right movement
        if (x > px && y < py) {
          //Check if the tile is the destination tile
          if (x === px + i && y === py - i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px + i, py - i, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px + i, py - i, boardState)) {
              break;
            }
          }
        }
        //Bottom left movement
        if (x < px && y < py) {
          //Check if the tile is the destination tile
          if (x === px - i && y === py - i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px - i, py - i, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px - i, py - i, boardState)) {
              break;
            }
          }
        }
        //Top left movement
        if (x < px && y > py) {
          //Check if the tile is the destination tile
          if (x === px - i && y === py + i) {
            //Dealing with destination tile
            if (tileIsEmptyOrOccupiedByOpponent(px - i, py + i, boardState, team)) {
              return true;
            }
          } else {
            if (tileIsOccupied(px - i, py + i, boardState)) {
              break;
            }
          }
        }
      }
      return false;
    }


    //KNIGHT
    if (type.includes('knight')) {
      const team = type.includes('white') ? 'white' : 'black'
      for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
          if (y - py === 2 * i) {
            if (x - px === j) {
              if (tileIsEmptyOrOccupiedByOpponent(x, y, boardState, team)) {
                return true

              }
              return false
            }
          }
          if (x - px === 2 * i) {
            if (y - py === j) {
              if (tileIsEmptyOrOccupiedByOpponent(x, y, boardState, team)) {
                return true
              }
              return false

            }
          }
        }
      }
    }
    return false
  }
}

export default Referee