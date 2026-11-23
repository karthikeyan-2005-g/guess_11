import { Server } from 'socket.io';
import { AuthenticatedSocket } from './authSocket.js';
import { RoomService } from '../services/roomService.js';
import { GameService } from '../services/gameService.js';

export function registerGameHandlers(io: Server, socket: AuthenticatedSocket): void {
  // Host starts the game
  socket.on('GAME_START', () => {
    const user = socket.data.user;
    const roomCode = socket.data.currentRoomCode;
    if (!user || !roomCode) return;

    const room = RoomService.getRoom(roomCode);
    if (!room) return;

    try {
      GameService.startGame(io, room, user.userId);
    } catch (err: any) {
      socket.emit('GAME_ERROR', { message: err.message });
    }
  });

  // Guess submission
  socket.on('GUESS_SUBMIT', (data: { guess: string }) => {
    const user = socket.data.user;
    const roomCode = socket.data.currentRoomCode;
    if (!user || !roomCode || !data.guess) return;

    const room = RoomService.getRoom(roomCode);
    if (!room) return;

    GameService.handleGuess(io, room, user.userId, data.guess);
  });

  // Chat message
  socket.on('CHAT_SEND', (data: { text: string }) => {
    const user = socket.data.user;
    const roomCode = socket.data.currentRoomCode;
    if (!user || !roomCode || !data.text) return;

    const room = RoomService.getRoom(roomCode);
    if (!room) return;

    const player = room.players[user.userId];
    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      senderId: user.userId,
      senderName: player?.username || user.username,
      text: data.text.trim().substring(0, 100),
      type: 'chat' as const,
      timestamp: Date.now(),
    };

    io.to(roomCode).emit('CHAT_MESSAGE', message);
  });
}
