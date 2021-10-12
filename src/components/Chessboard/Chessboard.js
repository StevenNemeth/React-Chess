import './Chessboard.css'
import Tile from '../Tile/Tile'
import Referee from '../../referee/Referee'
import React from 'react'
import { useState, useRef, useEffect } from 'react'

const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const initialBoardState = []

for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: 'assets/images/pawn_b.png', x: i, y: 6, type: `pawn-black-${i}` })
}
for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: 'assets/images/pawn_w.png', x: i, y: 1, type: `pawn-white-${i}` })
}
//black pieces starting positions
initialBoardState.push({ image: 'assets/images/rook_b.png', x: 7, y: 7, type: 'rook-black-1' })
initialBoardState.push({ image: 'assets/images/rook_b.png', x: 0, y: 7, type: 'rook-black-2' })
initialBoardState.push({ image: 'assets/images/knight_b.png', x: 6, y: 7, type: 'knight-black-1' })
initialBoardState.push({ image: 'assets/images/knight_b.png', x: 1, y: 7, type: 'knight-black-2' })
initialBoardState.push({ image: 'assets/images/bishop_b.png', x: 5, y: 7, type: 'bishop-black-1' })
initialBoardState.push({ image: 'assets/images/bishop_b.png', x: 2, y: 7, type: 'bishop-black-2' })
initialBoardState.push({ image: 'assets/images/queen_b.png', x: 3, y: 7, type: 'queen-black' })
initialBoardState.push({ image: 'assets/images/king_b.png', x: 4, y: 7, type: 'king-black' })
//white pieces starting positions
initialBoardState.push({ image: 'assets/images/rook_w.png', x: 7, y: 0, type: 'rook-white-1' })
initialBoardState.push({ image: 'assets/images/rook_w.png', x: 0, y: 0, type: 'rook-white-2' })
initialBoardState.push({ image: 'assets/images/knight_w.png', x: 6, y: 0, type: 'knight-white-1' })
initialBoardState.push({ image: 'assets/images/knight_w.png', x: 1, y: 0, type: 'knight-white-2' })
initialBoardState.push({ image: 'assets/images/bishop_w.png', x: 5, y: 0, type: 'bishop-white-1' })
initialBoardState.push({ image: 'assets/images/bishop_w.png', x: 2, y: 0, type: 'bishop-white-2' })
initialBoardState.push({ image: 'assets/images/queen_w.png', x: 3, y: 0, type: 'queen-white' })
initialBoardState.push({ image: 'assets/images/king_w.png', x: 4, y: 0, type: 'king-white' })
const Chessboard = () => {
  const chessboardRef = useRef(null)
  const [activePiece, setActivePiece] = useState(null)
  const [lastMovePiece, setLastMovePiece] = useState(null)
  const [lastMove, setLastMove] = useState(null)
  const [piece, setPiece] = useState(initialBoardState)
  const [myTeam, setMyTeam] = useState('white')
  const [gridX, setGridX] = useState(0)
  const [gridY, setGridY] = useState(0)



  const grabPiece = (e) => {
    const element = e.target
    const chessboard = chessboardRef.current
    if (e.target.className === 'chess-piece' && chessboard) {
      const gridX = Math.floor((e.clientX - chessboard.offsetLeft) / 100)
      const gridY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))
      setGridX(gridX)
      setGridY(gridY)
      element.style.position = 'absolute'
      const x = e.clientX - 50
      const y = e.clientY - 50
      element.style.left = `${x}px`
      element.style.top = `${y}px`
      setActivePiece(element)
    }
  }
  const movePiece = (e) => {
    const chessboard = chessboardRef.current
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25
      const minY = chessboard.offsetTop - 25
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75
      const x = e.clientX - 50
      const y = e.clientY - 50
      activePiece.style.position = 'absolute'
      // activePiece.style.left = `${x}px`
      // activePiece.style.top = `${y}px`

      if (x < minX) {
        activePiece.style.left = `${minX}px`
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`
      } else {
        activePiece.style.left = `${x}px`
      }
      if (y < minY) {
        activePiece.style.top = `${minY}px`
      } else if (y > maxX) {
        activePiece.style.top = `${maxY}px`
      } else {
        activePiece.style.top = `${y}px`
      }


      // activePiece.style.left = x < minX ?  `${minX}px` : `${x}px`
      // activePiece.style.top = y < minY ? `${minY}px` :  `${y}px`
    }
  }
  const dropPiece = (e, lastMove, lastMovePiece, piece) => {
    const chessboard = chessboardRef.current
    if (activePiece && chessboard) {
      //calculates tiles X and Y values
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100)
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))

      const currentPiece = piece.find((p) => p.x === gridX && p.y === gridY)
      const attackedPiece = piece.find((p) => p.x === x && p.y === y)

      if (currentPiece) {
        console.log('current piece')
        const validMove = Referee.isValidMove(gridX, gridY, x, y, activePiece.id, piece, attackedPiece, currentPiece, lastMovePiece, lastMove)
        // const isEnPassantMove = Referee.isEnPassantMove(gridX, gridY, x, y, activePiece.id, piece, attackedPiece, currentPiece)
        // if(isEnPassantMove){
        //   // for (let i = 0; i < piece.length; i++) {
        //     //loop through pieces array and find the index of the unit killed
        //     //remove unit from array and move the attacking unit
        //     const piece2 = piece.find(
        //       (p) => p.x === x && p.y === y - 1
        //     )
        //       console.log(piece2, 'enpessant')
        //       currentPiece.x = x
        //       currentPiece.y = y
        //       // piece.splice(i, 1)           

        //   // }
        // }

        setLastMovePiece(activePiece.id)        
        setLastMove({startX: gridX, startY: gridY, endX: x, endY: y })
       

        if (validMove && attackedPiece) {
          

          //if move is valid, and is an attacking move

          for (let i = 0; i < piece.length; i++) {
            //loop through pieces array and find the index of the unit killed
            //remove unit from array and move the attacking unit
            if (piece[i].type === attackedPiece.type) {
              // console.log(piece, 'enpessant')
              piece.splice(i, 1)
              currentPiece.x = x
              currentPiece.y = y
            }
          } 
          if(currentPiece.type.includes('pawn') && currentPiece.type.includes('white') && y === 7) {
            console.log(currentPiece.type, currentPiece.type.slice(-1), 'p type')
            currentPiece.type = `queen-white-${currentPiece.type.slice(-1)}`
            currentPiece.image = 'assets/images/queen_w.png'                
          }
          if(currentPiece.type.includes('pawn') && currentPiece.type.includes('black') && y === 0) {
            console.log(currentPiece.type, currentPiece.type.slice(-1), 'p type')
            currentPiece.type = `queen-black-${currentPiece.type.slice(-1)}`
            currentPiece.image = 'assets/images/queen_b.png'                
          }       

        } else {
          //INVALID MOVE
          activePiece.style.position = 'relative'
          activePiece.style.removeProperty('top')
          activePiece.style.removeProperty('left')
        }
        const pieces = piece.map((p) => {
          if (p.x === gridX & p.y === gridY) {           
            if (validMove) {
              if(p.type.includes('pawn') && p.type.includes('white') && y === 7) {
                console.log(p.type, p.type.slice(-1), 'p type')
                p.type = `queen-white-${p.type.slice(-1)}`
                p.image = 'assets/images/queen_w.png'                
              }
              if(p.type.includes('pawn') && p.type.includes('black') && y === 0) {
                console.log(p.type, p.type.slice(-1), 'p type')
                p.type = `queen-black-${p.type.slice(-1)}`
                p.image = 'assets/images/queen_b.png'                
              }
              setLastMovePiece(activePiece.id)
              setLastMove({startX: gridX, startY: gridY, endX: x, endY: y })
              p.x = x
              p.y = y
            } else {
              //INVALID MOVE
              activePiece.style.position = 'relative'
              activePiece.style.removeProperty('top')
              activePiece.style.removeProperty('left')
            }

          }
          return p
        })
        setPiece(pieces)
        Referee.isInCheck(piece, activePiece.id, lastMove)
      }

      // update piece location
      // setPiece((value) => {
      //   console.log('setPiece call')
      //   const attackedPiece = piece.find((p) => p.x === x && p.y === y)
      //   const pieces = value.map((p) => {
      //     if (p.x === gridX & p.y === gridY) {
      //       console.log('set piece')
      //       const validMove = Referee.isValidMove(gridX, gridY, x, y, activePiece.id, piece, attackedPiece, currentPiece, lastMovePiece, lastMove, piece)
      //       if (validMove) {
      //         setLastMovePiece(activePiece.id)
      //         setLastMove({startX: gridX, startY: gridY, endX: x, endY: y })
      //         p.x = x
      //         p.y = y
      //       } else {
      //         //INVALID MOVE
      //         activePiece.style.position = 'relative'
      //         activePiece.style.removeProperty('top')
      //         activePiece.style.removeProperty('left')
      //       }

      //     }
      //     return p
      //   })
      //   return pieces
      // })
      
      setActivePiece(null)
    }
  }


  let board = []
  //board is an array of the tiles/pieces that will be rendered
  // double for loop to create x and y grid tiles
  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i
      let image = undefined
      let id

      piece.forEach((p) => {
        if (p.x === i && p.y === j) {
          image = p.image
          id = p.type
        }
      })

      board.push(<Tile key={`${j}, ${i}`} number={number} image={image} id={id} />)

    }
  }
  return (
    <div
      onMouseDown={e => grabPiece(e)}
      onMouseMove={e => movePiece(e)}
      onMouseUp={e => dropPiece(e, lastMove, lastMovePiece, piece)}
      ref={chessboardRef}
      id='chessboard'
    >{board}</div>
  )
}

export default Chessboard