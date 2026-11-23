import { Server } from 'socket.io';
import { AuthenticatedSocket } from './authSocket.js';
import { RoomService } from '../services/roomService.js';
import { DrawStroke } from '../types/game.js';

export function registerDrawingHandlers(io: Server, socket: AuthenticatedSocket): void {
  // Client drawer starts/adds a stroke
  socket.on('DRAW_STROKE', (data: { roomCode: string; stroke: DrawStroke }) => {
    const user = socket.data.user;
    if (!user) return;

    const room = RoomService.getRoom(data.roomCode);
    if (!room || room.status !== 'DRAWING') return;

    // Verify current drawer
    if (room.currentDrawerUserId !== user.userId) {
      return;
    }

    room.canvasStrokes.push(data.stroke);

    // Broadcast stroke to other players in the room
    socket.to(data.roomCode).emit('DRAW_STROKE', data.stroke);
  });

  // Client drawer clears canvas
  socket.on('DRAW_CLEAR', (data: { roomCode: string }) => {
    const user = socket.data.user;
    if (!user) return;

    const room = RoomService.getRoom(data.roomCode);
    if (!room || room.status !== 'DRAWING') return;

    if (room.currentDrawerUserId !== user.userId) {
      return;
    }

    room.canvasStrokes = [];
    socket.to(data.roomCode).emit('DRAW_CLEAR');
  });

  // Client drawer undoes stroke
  socket.on('DRAW_UNDO', (data: { roomCode: string }) => {
    const user = socket.data.user;
    if (!user) return;

    const room = RoomService.getRoom(data.roomCode);
    if (!room || room.status !== 'DRAWING') return;

    if (room.currentDrawerUserId !== user.userId) {
      return;
    }

    if (room.canvasStrokes.length > 0) {
      room.canvasStrokes.pop();
      io.to(data.roomCode).emit('DRAW_SYNC', { strokes: room.canvasStrokes });
    }
  });
}
