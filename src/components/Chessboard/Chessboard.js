import './Chessboard.css'
import Tile from '../Tile/Tile'
import Timer from '../Timer/Timer'
import Referee from '../../referee/Referee'
import React from 'react'
import { merge } from 'lodash'
import { useState, useRef, useEffect } from 'react'
import { getAdjacentPieceRight, getAdjacentPieceLeft } from '../../referee/Referee'

const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const initialBoardState = []

for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: 'assets/images/pawn_b.png', x: i, y: 6, type: `pawn-black-${i}`, legalMove: [{ x: i, y: 5 }, { x: i, y: 4 }] })
}
for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: 'assets/images/pawn_w.png', x: i, y: 1, type: `pawn-white-${i}`, legalMove: [{ x: i, y: 2 }, { x: i, y: 3 }] })
}
//black pieces starting positions
initialBoardState.push({ image: 'assets/images/rook_b.png', x: 0, y: 7, type: 'rook-black-1', legalMove: [] })
initialBoardState.push({ image: 'assets/images/rook_b.png', x: 7, y: 7, type: 'rook-black-2', legalMove: [] })
initialBoardState.push({ image: 'assets/images/knight_b.png', x: 6, y: 7, type: 'knight-black-1', legalMove: [{ x: 5, y: 5 }, { x: 7, y: 5 }] })
initialBoardState.push({ image: 'assets/images/knight_b.png', x: 1, y: 7, type: 'knight-black-2', legalMove: [{ x: 0, y: 5 }, { x: 2, y: 5 }] })
initialBoardState.push({ image: 'assets/images/bishop_b.png', x: 5, y: 7, type: 'bishop-black-1', legalMove: [] })
initialBoardState.push({ image: 'assets/images/bishop_b.png', x: 2, y: 7, type: 'bishop-black-2', legalMove: [] })
initialBoardState.push({ image: 'assets/images/queen_b.png', x: 3, y: 7, type: 'queen-black', legalMove: [] })
initialBoardState.push({ image: 'assets/images/king_b.png', x: 4, y: 7, type: 'king-black', legalMove: [], canCastle: true })
//white pieces starting positions
initialBoardState.push({ image: 'assets/images/rook_w.png', x: 0, y: 0, type: 'rook-white-1', legalMove: [] })
initialBoardState.push({ image: 'assets/images/rook_w.png', x: 7, y: 0, type: 'rook-white-2', legalMove: [] })
initialBoardState.push({ image: 'assets/images/knight_w.png', x: 6, y: 0, type: 'knight-white-1', legalMove: [{ x: 5, y: 2 }, { x: 7, y: 2 }] })
initialBoardState.push({ image: 'assets/images/knight_w.png', x: 1, y: 0, type: 'knight-white-2', legalMove: [{ x: 0, y: 2 }, { x: 2, y: 2 }] })
initialBoardState.push({ image: 'assets/images/bishop_w.png', x: 5, y: 0, type: 'bishop-white-1', legalMove: [] })
initialBoardState.push({ image: 'assets/images/bishop_w.png', x: 2, y: 0, type: 'bishop-white-2', legalMove: [] })
initialBoardState.push({ image: 'assets/images/queen_w.png', x: 3, y: 0, type: 'queen-white', legalMove: [] })
initialBoardState.push({ image: 'assets/images/king_w.png', x: 4, y: 0, type: 'king-white', legalMove: [], canCastle: true })
const Chessboard = ({ team, socket, userName, roomName }) => {
  const chessboardRef = useRef(null)
  const [activePiece, setActivePiece] = useState(null)
  const [lastMovePiece, setLastMovePiece] = useState(null)
  const [lastMove, setLastMove] = useState(null)
  const [piece, setPiece] = useState(initialBoardState)
  const [turn, setTurn] = useState('white')
  const [gridX, setGridX] = useState(0)
  const [gridY, setGridY] = useState(0)
  const [legalMoves, setLegalMoves] = useState([])
  const [totalLegalTeamMoves, setTotalLegalTeamMoves] = useState(20)

  // useEffect(() => {
  //   setTurn(turn === 'white' ? 'black' : 'white')

  // }, [lastMovePiece])


  useEffect(() => {
    socket.on('updateBoardState', (data) => {
      setPiece(data.boardState)
      setTurn(data.currentTurn)
      console.log(socket, userName, roomName)
      // console.log(data.lastMovePiece, 'updatebaordstate data')
    })
    socket.on('updateLastMovePiece', (data) => {
      setLastMovePiece(data.lastMovePiece)
      setLastMove(data.lastMove)
    })
    socket.on('winLoseTieResult', (data) => {
      window.alert(data.result)
    })
  }, [])

  useEffect(() => {
    let opposingTeamColor = turn === 'white' ? 'black' : 'white'
    if (totalLegalTeamMoves === 0 && Referee.isInCheck(piece, null, null, opposingTeamColor)) {
      socket.emit('winLoseTie', {                 
        result: `CheckMate!! ${turn} Wins!!`,        
        roomName: roomName
      })
      // window.alert(`CheckMate!! ${turn} Wins!!`)
    }
    if (totalLegalTeamMoves === 0 && !Referee.isInCheck(piece, null, null, opposingTeamColor)) {
      socket.emit('winLoseTie', {                 
        result: 'Stalemate!! its a Draw!',        
        roomName: roomName
      })

      // window.alert('Stalemate!! its a Draw!')
    }


  }, [totalLegalTeamMoves])

  const checkMate = () => {
    let legalMoveCount = 0
    const tempBoardState = merge([], piece)
    let opposingTeamColor = turn === 'white' ? 'black' : 'white'
    // console.log(opposingTeamColor, turn)
    tempBoardState.forEach((element) => {
      if (element.type.includes(opposingTeamColor)) {
        if (element.legalMove) {
          legalMoveCount += element.legalMove.length
        }

      }
    })
  }

  const findRook1 = piece.findIndex((element) => {
    return element.type === `rook-${turn}-1`
  })
  const findRook2 = piece.findIndex((element) => {
    return element.type === `rook-${turn}-2`
  })

  const updateLegalMoves = (newLastMove) => {
    const tempPiece = merge([], piece)
    let legalMoveCount = 0
    let opposingTeamColor = turn === 'white' ? 'black' : 'white'
    tempPiece.forEach((elem) => {
      elem.legalMove = []
      if (elem.type.includes('bishop') || elem.type.includes('queen')) {
        for (let i = 1; !(elem.x + i > 7 || elem.y + i > 7); i++) {
          if (Referee.isValidMove(elem.x, elem.y, elem.x + i, elem.y + i, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, elem.x + i, elem.y + i) && elem.x + i < 8 && elem.y + i < 8 && elem.x + i > -1 && elem.y + i > -1) {
            elem.legalMove.push({ x: elem.x + i, y: elem.y + i })
          }
        }
        for (let i = 1; !(elem.x + i > 7 || elem.y - i < 0); i++) {
          if (Referee.isValidMove(elem.x, elem.y, elem.x + i, elem.y - i, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, elem.x + i, elem.y - i) && elem.x + i < 8 && elem.y - i < 8 && elem.x + i > -1 && elem.y - i > -1) {
            elem.legalMove.push({ x: elem.x + i, y: elem.y - i })
          }
        }
        for (let i = 1; !(elem.x - i < 0 || elem.y - i < 0); i++) {
          if (Referee.isValidMove(elem.x, elem.y, elem.x - i, elem.y - i, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, elem.x - i, elem.y - i) && elem.x - i < 8 && elem.y - i < 8 && elem.x - i > -1 && elem.y - i > -1) {
            elem.legalMove.push({ x: elem.x - i, y: elem.y - i })
          }
        }
        for (let i = 1; !(elem.x - i < 0 || elem.y + i > 7); i++) {
          if (Referee.isValidMove(elem.x, elem.y, elem.x - i, elem.y + i, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, elem.x - i, elem.y + i) && elem.x - i < 8 && elem.y + i < 8 && elem.x - i > -1 && elem.y + i > -1) {
            elem.legalMove.push({ x: elem.x - i, y: elem.y + i })
          }
        }
      }
      if (elem.type.includes('knight')) {
        let toX = elem.x - 1
        let toY = elem.y + 2
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x + 1
        toY = elem.y + 2
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x - 1
        toY = elem.y - 2
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x + 1
        toY = elem.y - 2
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x - 2
        toY = elem.y + 1
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x + 2
        toY = elem.y + 1
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x + 2
        toY = elem.y - 1
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x - 2
        toY = elem.y - 1
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
      }
      if (elem.type.includes('rook') || elem.type.includes('queen')) {
        for (let i = 1; !(elem.y + i > 7); i++) {
          if (Referee.isValidMove(elem.x, elem.y, elem.x, elem.y + i, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, elem.x, elem.y + i) && elem.x < 8 && elem.y + i < 8 && elem.x > -1 && elem.y + i > -1) {
            elem.legalMove.push({ x: elem.x, y: elem.y + i })
          }
        }
        for (let i = 1; !(elem.y - i < 0); i++) {
          if (Referee.isValidMove(elem.x, elem.y, elem.x, elem.y - i, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, elem.x, elem.y - i) && elem.x < 8 && elem.y - i < 8 && elem.x > -1 && elem.y - i > -1) {
            elem.legalMove.push({ x: elem.x, y: elem.y - i })
          }
        }
        for (let i = 1; !(elem.x + i > 7); i++) {
          if (Referee.isValidMove(elem.x, elem.y, elem.x + i, elem.y, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, elem.x + i, elem.y) && elem.x + i < 8 && elem.y < 8 && elem.x + i > -1 && elem.y > -1) {
            elem.legalMove.push({ x: elem.x + i, y: elem.y })
          }
        }
        for (let i = 1; !(elem.x - i < 0); i++) {
          if (Referee.isValidMove(elem.x, elem.y, elem.x - i, elem.y, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isPinned(tempPiece, elem, elem.x - i, elem.y) && elem.x - i < 8 && elem.y < 8 && elem.x - i > -1 && elem.y > -1) {
            elem.legalMove.push({ x: elem.x - i, y: elem.y })
          }
        }
      }
      if (elem.type.includes('pawn')) {
        let toX = elem.x
        let toY = elem.y + 1
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, activePiece.id, newLastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toY = elem.y - 1
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, activePiece.id, newLastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toY = elem.y - 2
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, activePiece.id, newLastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toY = elem.y + 2
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, activePiece.id, newLastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x - 1
        toY = elem.y + 1
        // isValidMove: (px, py, x, y, type, boardState, attackedPiece, currentPiece, activePiece.id, newLastMove)
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, activePiece.id, newLastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x + 1
        toY = elem.y + 1
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, activePiece.id, newLastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x - 1
        toY = elem.y - 1
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, activePiece.id, newLastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x + 1
        toY = elem.y - 1
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, activePiece.id, newLastMove) && !Referee.isPinned(tempPiece, elem, toX, toY) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
      }
      if (elem.type.includes('king')) {
        const tempBoardState = merge([], piece)
        let toX = elem.x - 1
        let toY = elem.y - 1
        const kingIndex = tempBoardState.findIndex((element) => {
          return element.type === elem.type
        })
        tempBoardState[kingIndex].x = toX
        tempBoardState[kingIndex].y = toY
        let kingColor = elem.type.includes('white') ? 'white' : 'black'
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isInCheck(tempBoardState, null, null, kingColor) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x - 1
        toY = elem.y
        tempBoardState[kingIndex].x = toX
        tempBoardState[kingIndex].y = toY
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isInCheck(tempBoardState, null, null, kingColor) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
          toX = elem.x - 2
          toY = elem.y
          tempBoardState[kingIndex].x = toX
          tempBoardState[kingIndex].y = toY
          if (Referee.isValidMove(elem.x - 1, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isInCheck(piece, null, null, kingColor) && !piece[findRook1]?.hasMoved && document.getElementById(`3, ${elem.y}`).childNodes.length === 0 && document.getElementById(`2, ${elem.y}`).childNodes.length === 0 && document.getElementById(`1, ${elem.y}`).childNodes.length === 0 && elem.canCastle && !Referee.isInCheck(tempBoardState, null, null, kingColor) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
            elem.legalMove.push({ x: toX, y: toY })
          }
        }
        toX = elem.x - 1
        toY = elem.y + 1
        tempBoardState[kingIndex].x = toX
        tempBoardState[kingIndex].y = toY
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isInCheck(tempBoardState, null, null, kingColor) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x
        toY = elem.y + 1
        tempBoardState[kingIndex].x = toX
        tempBoardState[kingIndex].y = toY
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isInCheck(tempBoardState, null, null, kingColor) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x + 1
        toY = elem.y + 1
        tempBoardState[kingIndex].x = toX
        tempBoardState[kingIndex].y = toY
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isInCheck(tempBoardState, null, null, kingColor) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x + 1
        toY = elem.y
        tempBoardState[kingIndex].x = toX
        tempBoardState[kingIndex].y = toY
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isInCheck(tempBoardState, null, null, kingColor) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
          toX = elem.x + 2
          toY = elem.y
          tempBoardState[kingIndex].x = toX
          tempBoardState[kingIndex].y = toY
          if (Referee.isValidMove(elem.x + 1, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isInCheck(tempBoardState, null, null, kingColor) && !Referee.isInCheck(piece, null, null, kingColor) && !piece[findRook2]?.hasMoved && document.getElementById(`5, ${elem.y}`).childNodes.length === 0 && document.getElementById(`6, ${elem.y}`).childNodes.length === 0 && elem.canCastle && !Referee.isInCheck(tempBoardState, null, null, kingColor) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
            elem.legalMove.push({ x: toX, y: toY })
          }
        }
        toX = elem.x + 1
        toY = elem.y - 1
        tempBoardState[kingIndex].x = toX
        tempBoardState[kingIndex].y = toY
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isInCheck(tempBoardState, null, null, kingColor) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }
        toX = elem.x
        toY = elem.y - 1
        tempBoardState[kingIndex].x = toX
        tempBoardState[kingIndex].y = toY
        if (Referee.isValidMove(elem.x, elem.y, toX, toY, elem.type, tempPiece, null, null, lastMovePiece, lastMove) && !Referee.isInCheck(tempBoardState, null, null, kingColor) && toX < 8 && toY < 8 && toX > -1 && toY > -1) {
          elem.legalMove.push({ x: toX, y: toY })
        }

      }
      if (elem.type.includes(opposingTeamColor)) {
        legalMoveCount += elem.legalMove.length
      }
    })
    setTotalLegalTeamMoves(legalMoveCount)
    setPiece(tempPiece)
    socket.emit('boardState', {
      boardState: tempPiece,
      lastMove: team,      
      roomName: roomName
    })
  }

  const grabPiece = (e) => {
    const element = e.target
    const chessboard = chessboardRef.current
    if (e.target.className === 'chess-piece' && e.target.id.includes(team) && e.target.id.includes(turn) && chessboard) {
      const currentPiece = piece.find((elem) => {
        return elem.type === element.id

      })
      //highlight valid move tiles   
      setLegalMoves(currentPiece.legalMove)
      currentPiece.legalMove.forEach((tile) => {
        const legalMoveTile = document.getElementById(`${tile.x}, ${tile.y}`)
        legalMoveTile.style.backgroundColor = 'cyan'
        legalMoveTile.style.boxShadow = 'inset 0 0 50px #000'
      })

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

      const validMove = Referee.isValidMove(gridX, gridY, x, y, activePiece.id, piece, attackedPiece, currentPiece, lastMovePiece, lastMove)
      console.log(Referee.isValidMove(gridX, gridY, x, y, activePiece.id, piece, attackedPiece, currentPiece, lastMovePiece, lastMove))
      if (currentPiece) {

        if (validMove) {
          setLastMovePiece(activePiece.id)
          setLastMove({ startX: gridX, startY: gridY, endX: x, endY: y })
          socket.emit('lastMovePiece', {                 
            lastMovePiece: activePiece.id,
            lastMove: { startX: gridX, startY: gridY, endX: x, endY: y },
            roomName: roomName
          })

          currentPiece.hasMoved = true
        }
        if (validMove && attackedPiece) {
          currentPiece.hasMoved = true

          //if move is valid, and is an attacking move

          for (let i = 0; i < piece.length; i++) {
            //loop through pieces array and find the index of the unit killed
            //remove unit from array and move the attacking unit
            if (piece[i].type === attackedPiece.type) {
              piece.splice(i, 1)
              currentPiece.x = x
              currentPiece.y = y
            }
          }
          if (currentPiece.type.includes('pawn') && currentPiece.type.includes('white') && y === 7) {
            currentPiece.type = `queen-white-${currentPiece.type.slice(-1)}`
            currentPiece.image = 'assets/images/queen_w.png'
          }
          if (currentPiece.type.includes('pawn') && currentPiece.type.includes('black') && y === 0) {
            currentPiece.type = `queen-black-${currentPiece.type.slice(-1)}`
            currentPiece.image = 'assets/images/queen_b.png'
          }

        }


        //en pessant
        else if (validMove && currentPiece.type.includes('pawn') && gridX - x === 1 && getAdjacentPieceLeft(gridX, gridY, piece).type === lastMovePiece && lastMovePiece.includes('pawn')) {
          console.log(lastMovePiece, 'lastmfsefse')
          for (let i = 0; i < piece.length; i++) {
            if (piece[i].type === lastMovePiece) {
              piece.splice(i, 1)
            }
          }

        }
        else if (validMove && currentPiece.type.includes('pawn') && gridX - x === -1 && getAdjacentPieceRight(gridX, gridY, piece).type === lastMovePiece && lastMovePiece.includes('pawn')) {
          for (let i = 0; i < piece.length; i++) {
            if (piece[i].type === lastMovePiece) {
              piece.splice(i, 1)
            }
          }
        }
    
        else {
          //INVALID MOVE
          activePiece.style.position = 'relative'
          activePiece.style.removeProperty('top')
          activePiece.style.removeProperty('left')
        }
        const pieces = piece.map((p) => {
          if (p.x === gridX & p.y === gridY) {
            if (validMove) {
              if (p.type.includes('pawn') && p.type.includes('white') && y === 7) {
                p.type = `queen-white-${p.type.slice(-1)}`
                p.image = 'assets/images/queen_w.png'
              }
              if (p.type.includes('pawn') && p.type.includes('black') && y === 0) {
                p.type = `queen-black-${p.type.slice(-1)}`
                p.image = 'assets/images/queen_b.png'
              }
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
      //
      legalMoves.forEach((tile) => {
        const legalMoveTile = document.getElementById(`${tile.x}, ${tile.y}`)
        if (legalMoveTile.className === 'tile white-tile') {
          legalMoveTile.style.backgroundColor = '#ebecd0'
          legalMoveTile.style.border = '0px'
          legalMoveTile.style.removeProperty('box-shadow')

        } else if (legalMoveTile.className === 'tile black-tile') {
          legalMoveTile.style.backgroundColor = '#779556'
          legalMoveTile.style.removeProperty('box-shadow')
        }

      })
      setLegalMoves([])
      if(validMove){
        updateLegalMoves({ startX: gridX, startY: gridY, endX: x, endY: y })

      }
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

      board.push(<Tile key={`${j}, ${i}`} number={number} image={image} id={id} tileId={`${i}, ${j}`} />)

    }
  }
  return (
    <>
      <Timer lastMove={lastMove} turn={turn} />
      <div
        onMouseDown={e => grabPiece(e)}
        onMouseMove={e => movePiece(e)}
        onMouseUp={e => dropPiece(e, lastMove, lastMovePiece, piece)}
        ref={chessboardRef}
        id='chessboard'
      >{board}</div>
    </>
  )
}

export default Chessboard