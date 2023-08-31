import express from 'express'
import morgan from 'morgan';
import {Server as SocketServer} from 'socket.io';
import http from 'http';
import cors from 'cors';
import {PORT} from './config.js'

const app = express();
const server =  http.createServer(app);
const io = new SocketServer(server, {
    cors:{
      origin: "http://localhost:5173"
    }
});

app.use(cors());
app.use(morgan('dev'));

//almacenar rooms
const rooms = {};

app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express!');
});




io.on('connection', (socket) => {
  
  console.log('Un usuario se ha conectado', socket.id);
  
  socket.on('joinWaitingRoom', () => {
    const playerId = socket.id;
    let roomToJoin = null;

    // Buscar una sala existente en espera
    for (const roomName in rooms) {
      if (rooms[roomName].length === 1) {
        roomToJoin = roomName;
        break;
      }
    }

    if (roomToJoin) {
      // Unirse a una sala existente
      rooms[roomToJoin].push(playerId);
    } else {
      // Crear una nueva sala
      const newRoomName = `room_${Date.now()}`;
      rooms[newRoomName] = [playerId];
      roomToJoin = newRoomName;
    }

    // Unir al jugador a la sala
    socket.join(roomToJoin);
    io.to(roomToJoin).emit('gameStart');
  });


  socket.on('mensaje', (data)=>{
    socket.broadcast.emit('mensaje', data)
  });

});

server.listen(PORT);
console.log("levantando server", PORT);