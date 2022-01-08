const express = require('express')
const path = require('path')
const app = express()
var http = require('http').Server(app);
const users = {}  // userName: {room, socket} // name, room, socket };
const rooms = {}; // roomName {userList}
var io = require('socket.io')(http, {
  // cors: {
  //   origin: ['http://localhost:5000'],
  // },
})
const port = process.env.PORT || 3000

app.use(express.static(path.resolve(__dirname, './../../build')));

app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname, "./../../build/", "index.html"));
});

app.get("/health", (req, res) => {
 res.send('this is alive');
});

http.listen(port, function () {
  io.on("connection", socket => {
    socket.on('test', () => {
      console.log('test')
    })
    socket.on('login', (data, callback) => {
      if (data[0] !== '' && data[1] !== '') {
        if (rooms[data[1]] === undefined) {
          users[data[0]] = { room: data[1], socket }
          socket.join(data[1])
          rooms[data[1]] = [data[0]]
          callback(null, true, 'white')
        }
        else if ((Array.isArray(rooms[data[1]]) && rooms[data[1]].indexOf(data[0]) === -1)) {
          if (rooms[data[1]].length < 2) {
            users[data[0]] = { room: data[1], socket }
            socket.join(data[1])
            rooms[data[1]] = [...rooms[data[1]], data[0]]
            console.log(rooms, 'rooms')
            callback(null, true, 'black')

          }
          else {
            callback('room already has two players')
          }
        }
        else {
          callback('you cannot have the same name as another player in the room')
        }
      }
      console.log(data[0], data[1])

    })
    socket.on('boardState', (data) => {
      io.in(data.roomName).emit('updateBoardState', {
        boardState: data.boardState,
        currentTurn: data.lastMove === 'white' ? 'black' : 'white',
      })
    })
    socket.on('lastMovePiece', (data) => {
      io.in(data.roomName).emit('updateLastMovePiece', {
        lastMovePiece: data.lastMovePiece,
        lastMove: data.lastMove
      })
    })
    socket.on('winLoseTie', (data) => {
      io.in(data.roomName).emit('winLoseTieResult', {
        result: data.result
      })

    })
  })
  console.log('listening on localhost: ' + port);
});
