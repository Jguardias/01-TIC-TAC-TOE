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
const waitingPlayers = []
const resetWaitigPlayer = []

app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express!');
});



io.on('connection', (socket) => {
  
  console.log('Un usuario se ha conectado', socket.id);
  
  socket.on('searchForMatch', (nickname) => {
    
      waitingPlayers.push({socket,nickname});

    if (waitingPlayers.length == 2) {
       const room = {
        nameRoom: getRandomRoom(8),
        player1: waitingPlayers.shift(),
        player2: waitingPlayers.shift()
      }
        room.player1.socket.join(room.nameRoom);
        room.player2.socket.join(room.nameRoom);
        io.to(room.nameRoom).emit("matchFound");
        rooms.push(room);
        setTimeout(() => {
          io.to(room.nameRoom).emit("sendInfoRoom",{room: room.nameRoom, player1: room.player1.nickname, player2: room.player2.nickname});
          io.to(room.nameRoom).emit("sendPlayerIDs",{idPlayer1: room.player1.socket.id, idPlayer2: room.player2.socket.id});
        }, 300);
        console.log('Sala creada:', room.nameRoom);
      } else {
        console.log('Esperando a más jugadores...');
      } 
  });
  socket.on('gameMove', (data) => {
    const playerRoom = rooms.find(room => room.player1.socket === socket || room.player2.socket === socket);
    console.log("Quien envio el cliente es ",  socket.id)
    if (playerRoom) {
      if(socket.id === playerRoom.player1.socket.id){
        io.to(playerRoom.player2.socket.id).emit('gameMove', data);
      }else{
        io.to(playerRoom.player1.socket.id).emit('gameMove', data);
      }
      console.log(`Evento enviado a la sala ${playerRoom.nameRoom}`);
    } else {
      console.log("El socket no está en una sala.");
    }
  });

  socket.on('playerWin', ( turn ) => {
    const playerRoom = rooms.find(room => room.player1.socket === socket || room.player2.socket === socket);
    if (playerRoom) {
      if(turn){
        io.to(playerRoom.player2.socket.id).emit('gameResult', "Winner");
        io.to(playerRoom.player1.socket.id).emit('gameResult', "Losser");
      }else{
        io.to(playerRoom.player2.socket.id).emit('gameResult', "Losser");
        io.to(playerRoom.player1.socket.id).emit('gameResult', "Winner");
      }
      console.log(`Enviando ganador a la sala ${playerRoom.nameRoom}`)
    } else {
      console.log("El socket no está en una sala.");
    }
  });
  socket.on("resetGame",()=>{
      resetWaitigPlayer.push(socket);
      const playerRoom = rooms.find(room => room.player1.socket === socket || room.player2.socket === socket);
      if(resetWaitigPlayer.length === 2){
        resetWaitigPlayer.splice(0, resetWaitigPlayer.length);
        io.to(playerRoom.nameRoom).emit('resetGame');
      }else{
        console.log("Esperando oponente")
      }
  } );




});

server.listen(PORT);
console.log("levantando server", PORT);