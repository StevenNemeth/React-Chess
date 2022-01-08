import './App.css';
import Chessboard from './components/Chessboard/Chessboard';
import Timer from './components/Timer/Timer'
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
let socket
socket = io()

const App = () => {
  const [showChessboard, setShowChessBoard] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [userName, setUserName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [team, setTeam] = useState()
  
  useEffect(() => {
    socket.emit('test', 'test') 
    console.log(socket, 'socket')     

  }, [])

  const Login = () => {
   let loginData = [userName, roomName]

    socket.emit('login', loginData, (answer, loginStatus, team) => {
      if(loginStatus){
        setShowChessBoard(true)
        setTeam(team)
        console.log(team, 'team')
      }
      setErrorMessage(answer)
      console.log(answer,'answer')
      
    })

  }

  return (
    <div id='app'>
     {!showChessboard && <div>
       <div id='errorMsg'>
         {errorMessage}
       </div>
      <div id='roomName'>Room Name:
        <input id='roomNameInput' onChange={(e) => { setRoomName(e.target.value)}} value={roomName}></input>
        </div>      
      <div id='userName'>User Name:
        <input id='userNameInput' onChange={(e) => {setUserName(e.target.value)}} value={userName}></input>
        </div>
        <button onClick={Login}>login</button>
        </div>}    
      {showChessboard && <Chessboard userName={userName} roomName={roomName} socket={socket} team={team}/> }
      </div>
  )
}

export default App;
