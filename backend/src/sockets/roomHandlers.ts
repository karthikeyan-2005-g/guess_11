import { Server } from 'socket.io';
import { AuthenticatedSocket } from './authSocket.js';
import { RoomService } from '../services/roomService.js';
import prisma from '../config/db.js';

export function registerRoomHandlers(io: Server, socket: AuthenticatedSocket): void {
  // Join Room
  socket.on('ROOM_JOIN', async (data: { roomCode: string }) => {
    try {
      const user = socket.data.user;
      if (!user) {
        socket.emit('ERROR', { message: 'Authentication required to join room.' });
        return;
      }

      // Fetch latest profile avatar
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId: user.id },
      });

      const { room, player, isReconnect } = RoomService.joinRoom(
        data.roomCode,
        {
          id: user.id,
          userId: user.userId,
          username: user.username,
          avatar: userProfile?.avatar || 'avatar-1',
        },
        socket.id
      );

      socket.data.currentRoomCode = room.code;
      socket.join(room.code);

      // Send room state to the newly connected player
      socket.emit('ROOM_JOINED', {
        room: {
          code: room.code,
          name: room.name,
          hostId: room.hostId,
          status: room.status,
          settings: room.settings,
          players: room.players,
          currentRound: room.currentRound,
          currentRoundInfo: room.currentRoundInfo,
          canvasStrokes: room.canvasStrokes,
        },
        player,
      });

      // Broadcast updated player list to room
      const playerCount = Object.keys(room.players).length;
      io.to(room.code).emit('ROOM_UPDATE', {
        players: room.players,
        playerCount,
        maxPlayers: room.settings.maxPlayers,
        hostId: room.hostId,
        isFull: playerCount >= room.settings.maxPlayers,
      });

      // Emit PLAYER_JOIN notification
      socket.to(room.code).emit('PLAYER_JOINED', {
        player,
        playerCount,
        message: `${player.username} joined the room!`,
      });

      // If room just hit 11 players, trigger ROOM_FULL celebration event
      if (playerCount === room.settings.maxPlayers) {
        io.to(room.code).emit('ROOM_FULL', {
          message: 'ROOM FULL! All 11 players are connected! Host can start the game!',
        });
      }
    } catch (err: any) {
      socket.emit('ROOM_ERROR', {
        message: err.message || 'Failed to join room.',
      });
    }
  });

  // Leave Room
  socket.on('ROOM_LEAVE', () => {
    handlePlayerLeave(io, socket);
  });

  // Toggle ready status
  socket.on('PLAYER_READY_TOGGLE', () => {
    const user = socket.data.user;
    const roomCode = socket.data.currentRoomCode;
    if (!user || !roomCode) return;

    const room = RoomService.getRoom(roomCode);
    if (!room || !room.players[user.userId]) return;

    const player = room.players[user.userId];
    player.isReady = !player.isReady;

    io.to(room.code).emit('ROOM_UPDATE', {
      players: room.players,
      playerCount: Object.keys(room.players).length,
      maxPlayers: room.settings.maxPlayers,
      hostId: room.hostId,
    });
  });

  // Handle Socket Disconnect
  socket.on('disconnect', () => {
    handlePlayerLeave(io, socket);
  });
}

function handlePlayerLeave(io: Server, socket: AuthenticatedSocket): void {
  const user = socket.data.user;
  const roomCode = socket.data.currentRoomCode;
  if (!user || !roomCode) return;

  const result = RoomService.leaveRoom(roomCode, user.userId);
  socket.leave(roomCode);
  delete socket.data.currentRoomCode;

  if (result.room) {
    io.to(roomCode).emit('PLAYER_LEFT', {
      userId: user.userId,
      username: user.username,
      hostChanged: result.hostChanged,
      newHostId: result.room.hostId,
      players: result.room.players,
      playerCount: Object.keys(result.room.players).length,
    });
  }
}
