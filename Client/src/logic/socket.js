import { io } from 'socket.io-client';

const socket = io('https://rendersocketserver.onrender.com');

export default socket;