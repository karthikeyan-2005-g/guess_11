import { RoomState, RoomSettings } from '../types/room.js';
import { Player } from '../types/player.js';
import { generateRoomCode } from '../utils/roomCode.js';
import prisma from '../config/db.js';

export class RoomService {
  // In-memory active game rooms for ultra-fast real-time socket events
  private static rooms: Map<string, RoomState> = new Map();

  static getRoom(code: string): RoomState | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  static getAllRooms(): RoomState[] {
    return Array.from(this.rooms.values());
  }

  static async createRoom(
    hostUser: { id: string; userId: string; username: string; avatar: string },
    options: Partial<RoomSettings> = {}
  ): Promise<RoomState> {
    let code = generateRoomCode();
    while (this.rooms.has(code)) {
      code = generateRoomCode();
    }

    const settings: RoomSettings = {
      maxPlayers: options.maxPlayers || 11,
      roundDuration: options.roundDuration || 90,
      totalRounds: options.totalRounds || 11,
      gameMode: options.gameMode || 'NORMAL',
    };

    const hostPlayer: Player = {
      socketId: '',
      userId: hostUser.userId,
      userDbId: hostUser.id,
      username: hostUser.username,
      avatar: hostUser.avatar,
      score: 0,
      isHost: true,
      isReady: true,
      isConnected: false,
      hasDrawnThisGame: false,
      hasGuessedThisRound: false,
    };

    const roomState: RoomState = {
      code,
      name: `${hostUser.username}'s Room`,
      hostId: hostUser.userId,
      status: 'LOBBY',
      settings,
      players: {
        [hostUser.userId]: hostPlayer,
      },
      playerOrder: [hostUser.userId],
      currentRound: 0,
      currentRoundInfo: null,
      currentDrawerUserId: null,
      currentWord: null,
      currentWordSynonyms: [],
      canvasStrokes: [],
      messages: [],
      roundStartTime: null,
      correctGuessesCount: 0,
      roundScores: {},
      totalScores: {
        [hostUser.userId]: 0,
      },
    };

    this.rooms.set(code, roomState);

    // Persist to database if db is available and host user exists in db
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: hostUser.id } });
      if (dbUser) {
        await prisma.gameRoom.create({
          data: {
            code,
            name: roomState.name,
            hostId: hostUser.id,
            status: 'WAITING',
            gameMode: settings.gameMode,
            maxPlayers: settings.maxPlayers,
            roundDuration: settings.roundDuration,
            totalRounds: settings.totalRounds,
          },
        });
      }
    } catch (err) {
      console.warn('Database room persist notice:', err);
    }

    return roomState;
  }

  static joinRoom(
    code: string,
    user: { id: string; userId: string; username: string; avatar: string },
    socketId: string
  ): { room: RoomState; player: Player; isReconnect: boolean } {
    const room = this.getRoom(code);
    if (!room) {
      throw { statusCode: 404, message: 'Game room not found.' };
    }

    const existingPlayer = room.players[user.userId];
    if (existingPlayer) {
      // Reconnection
      existingPlayer.socketId = socketId;
      existingPlayer.isConnected = true;
      existingPlayer.avatar = user.avatar;
      existingPlayer.username = user.username;
      return { room, player: existingPlayer, isReconnect: true };
    }

    // New join validations
    const playerCount = Object.keys(room.players).length;
    if (playerCount >= room.settings.maxPlayers) {
      throw { statusCode: 400, message: 'Room is already full! Maximum 11 players.' };
    }

    if (room.status !== 'LOBBY') {
      throw { statusCode: 400, message: 'Game is already in progress. Cannot join now.' };
    }

    const newPlayer: Player = {
      socketId,
      userId: user.userId,
      userDbId: user.id,
      username: user.username,
      avatar: user.avatar,
      score: 0,
      isHost: false,
      isReady: true,
      isConnected: true,
      hasDrawnThisGame: false,
      hasGuessedThisRound: false,
    };

    room.players[user.userId] = newPlayer;
    if (!room.playerOrder.includes(user.userId)) {
      room.playerOrder.push(user.userId);
    }
    room.totalScores[user.userId] = 0;

    return { room, player: newPlayer, isReconnect: false };
  }

  static leaveRoom(code: string, userId: string): { room?: RoomState; hostChanged: boolean; deleted: boolean } {
    const room = this.getRoom(code);
    if (!room || !room.players[userId]) {
      return { hostChanged: false, deleted: false };
    }

    delete room.players[userId];
    room.playerOrder = room.playerOrder.filter((id) => id !== userId);

    const remainingPlayerIds = Object.keys(room.players);

    if (remainingPlayerIds.length === 0) {
      if (room.timerInterval) {
        clearInterval(room.timerInterval);
      }
      this.rooms.delete(code);
      return { deleted: true, hostChanged: false };
    }

    let hostChanged = false;
    if (room.hostId === userId) {
      // Assign host to next player
      room.hostId = remainingPlayerIds[0];
      room.players[room.hostId].isHost = true;
      hostChanged = true;
    }

    return { room, hostChanged, deleted: false };
  }

  static deleteRoom(code: string): void {
    const room = this.getRoom(code);
    if (room?.timerInterval) {
      clearInterval(room.timerInterval);
    }
    this.rooms.delete(code);
  }
}
