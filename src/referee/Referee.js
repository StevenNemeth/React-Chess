import Piece from '../components/Chessboard/Chessboard'
import { merge } from 'lodash'

//Things to add
//Check if square is attacked DONE
//Prevent king from moving into check DONE
//Check DONE
//Checkmate - loop through all the pieces, if no valid moves then that color loses / checkmate DONE
//Castling - DONE
//Stalemate - loop through all the pieces, if no valid moves AND not in check tie / stalemate - DONE
//add timer - DONE

//add sockets for multiplayer
// replace alert box


const tileIsOccupied = (x, y, boardState) => {
  const movedPiece = boardState.find((p) => p.x === x && p.y === y)
  if (movedPiece) {
    return true
  } else {
    return false
  }
}

export const getAdjacentPieceLeft = (x, y, boardState) => {
  return boardState.find((p) => p.x === x - 1 && p.y === y)
}
export const getAdjacentPieceRight = (x, y, boardState) => {
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

const Referee = {
  isInCheck: (boardState, lastMovePiece, lastMove, teamColor) => {
    let attackedKingColor, attackingColor
    if (!teamColor) {
      attackingColor = lastMovePiece.includes('white') ? 'white' : 'black'
      //check lastMovePiece color
      attackedKingColor = !lastMovePiece.includes('white') ? 'white' : 'black'
      //get the king's color
    } else {
      attackedKingColor = teamColor
      attackingColor = teamColor === 'black' ? 'white' : 'black'

    }
    const attackedKingLocation = boardState.filter((element) => {

      if (element.type === `king-${attackedKingColor}`) {
        return true
      }

    })[0]

    //get the king's location
    const isInCheck = boardState.some((element) => {
      if (element.type.includes(attackingColor) && attackedKingLocation) {
        return Referee.isValidMove(element.x, element.y, attackedKingLocation.x, attackedKingLocation.y, element.type, boardState, null, null, lastMovePiece, lastMove)
      }
      return false
    })
    //loop through lastMovePiece pieces
    //check if lastMovePiece pieces are attacking king

    return isInCheck
  },

  isPinned: (boardState, currentPiece, newX, newY) => {
    if (!currentPiece) return false
    const tempBoardState = merge([], boardState)
    const currentPieceColor = currentPiece.type.includes('white') ? 'white' : 'black'
    const findAttackPiece = tempBoardState.findIndex((element) => {
      return !element.type.includes(currentPieceColor) && element.x === newX && element.y === newY
    })
    if (findAttackPiece !== -1) tempBoardState.splice(findAttackPiece, 1)

    // console.log(JSON.stringify(tempBoardState))
    const findPiece = tempBoardState.findIndex((element) => {
      return element.type === currentPiece.type
    })
    tempBoardState[findPiece].x = newX
    tempBoardState[findPiece].y = newY
    return Referee.isInCheck(tempBoardState, null, null, currentPieceColor)
  },
  isValidMove: (px, py, x, y, type, boardState, attackedPiece, currentPiece, lastMovePiece, lastMove) => {
    // px and py are previous x and previous y
    // x and y are current x and y when dropped/moved
    // type is type of chess piece
    // boardState is an array of objects of board tiles including pieces position

    if (Referee.isPinned(boardState, currentPiece, x, y)) return false
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
          //En passant left
          const adjacentLeftPiece = getAdjacentPieceLeft(px, py, boardState)
          if (adjacentLeftPiece && adjacentLeftPiece.type === lastMovePiece && lastMovePiece.includes('pawn') && !lastMovePiece.includes(team)) {

            // for (let i = 0; i < boardState.length; i++) {
            //   if (boardState[i].type === adjacentLeftPiece.type) {
            //     boardState.splice(i, 1)
            //   }
            // }
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
          //En passant right
          const adjacentRightPiece = getAdjacentPieceRight(px, py, boardState)
          if (adjacentRightPiece && adjacentRightPiece.type === lastMovePiece && lastMovePiece.includes('pawn') && !lastMovePiece.includes(team)) {

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

      const findInd = boardState.findIndex((element) => {
        if (currentPiece) {
          return element.type === currentPiece.type
        }
      })
      const team = type.includes('white') ? 'white' : 'black'
      const rook1 = boardState.findIndex((elem) => {
        return elem.type === `rook-${team}-1`
      })
      const rook2 = boardState.findIndex((elem) => {
        return elem.type === `rook-${team}-2`
      })
      if (!tileIsOccupied(x, y, boardState)) {
        if (Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
          if (findInd !== -1 && boardState[findInd].canCastle) {
            boardState[findInd].canCastle = false
          }
          return true
        }
      } else if (tileIsOccupiedByOpponent(x, y, boardState, team) && Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
        return true
      }
      if (findInd !== -1 && boardState[findInd].canCastle) {

        //castling left
        if (!boardState[rook1]?.hasMoved && !Referee.isInCheck(boardState, null, null, team) && !Referee.isPinned(boardState, currentPiece, 3, currentPiece.y) && !tileIsOccupied(1, y, boardState) && !tileIsOccupied(2, y, boardState) && !tileIsOccupied(3, y, boardState)) {
          if (Math.abs(px - x) <= 2 && Math.abs(py - y) <= 0) {
            if (x === 2) {
              boardState[rook1].x = 3
              boardState[findInd].canCastle = false
              return true
            }
          }
        }
        //castling right
        if (!boardState[rook2]?.hasMoved && !Referee.isInCheck(boardState, null, null, team)&& !Referee.isPinned(boardState, currentPiece, 5, currentPiece.y) && !tileIsOccupied(5, y, boardState) && !tileIsOccupied(6, y, boardState)) {
          if (Math.abs(px - x) <= 2 && Math.abs(py - y) <= 0) {
            if (x === 6) {
              boardState[rook2].x = 5
              boardState[findInd].canCastle = false
              return true
            }
          }
        }
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