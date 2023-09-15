import express from 'express'
import morgan from 'morgan';
import {Server as SocketServer} from 'socket.io';
import http from 'http';
import cors from 'cors';
import {PORT} from './config.js'

import { getRandomRoom } from './utils/roomRandom.js';


const app = express();
const server =  http.createServer(app);
const io = new SocketServer(server, {
    cors:{
      origin: "http://localhost:5173"
    }
});

app.use(cors());
app.use(morgan('dev'));



const rooms = []
const waintingPlayers = []

app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express!');
});



io.on('connection', (socket) => {
  
  console.log('Un usuario se ha conectado', socket.id);
  
  socket.on('searchForMatch', (nickname) => {
    

      waintingPlayers.push({socket,nickname});

    if (waintingPlayers.length == 2) {
       const room = {
        nameRoom: getRandomRoom(8),
        player1: waintingPlayers.shift(),
        player2: waintingPlayers.shift()
      }
        room.player1.socket.join(room.nameRoom);
        room.player2.socket.join(room.nameRoom);

        io.to(room.nameRoom).emit("redirectToMach");
        rooms.push(room);
        console.log('Sala creada:', room.nameRoom);
      } else {
        console.log('Esperando a más jugadores...');
      } 
  });



  
  socket.on('event', (data) => {
 

    const playerRoom = rooms.find(room => room.player1.socket === socket || room.player2.socket === socket);
    console.log("Quien envio el cliente es ",  socket.id)
    if (playerRoom) {
      if(socket.id === playerRoom.player1.socket.id){
        io.to(playerRoom.player2.socket.id).emit('event', data);
      }else{
        io.to(playerRoom.player1.socket.id).emit('event', data);
      }
      // const roomName = playerRoom.nameRoom;
      // io.to(roomName).emit('event', data);
      console.log(`Evento enviado a la sala ${playerRoom.roomName}`);
    } else {
      console.log("El socket no está en una sala.");
    }
  });

});

server.listen(PORT);
console.log("levantando server", PORT);