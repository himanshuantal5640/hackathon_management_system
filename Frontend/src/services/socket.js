import { io } from 'socket.io-client';

export const socket = io({
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});
