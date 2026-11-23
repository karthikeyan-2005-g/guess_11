import { Router, Response, NextFunction } from 'express';
import { RoomService } from '../services/roomService.js';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { getRoomInvitationUrl, formatInvitationMessage } from '../utils/roomCode.js';

const router = Router();

// POST /api/rooms - Create Room (Protected)
router.post('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { name, gameMode, roundDuration } = req.body;

    const room = await RoomService.createRoom(
      {
        id: user.id,
        userId: user.userId,
        username: user.username,
        avatar: 'avatar-1',
      },
      {
        gameMode,
        roundDuration: roundDuration ? parseInt(roundDuration, 10) : 90,
      }
    );

    const inviteUrl = getRoomInvitationUrl(room.code, req.headers.origin as string);
    const inviteMessage = formatInvitationMessage(room.code, req.headers.origin as string);

    res.status(201).json({
      success: true,
      data: {
        room: {
          code: room.code,
          name: room.name,
          hostId: room.hostId,
          status: room.status,
          settings: room.settings,
          playerCount: Object.keys(room.players).length,
          maxPlayers: room.settings.maxPlayers,
        },
        inviteUrl,
        inviteMessage,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/rooms/:code - Validate and get room preview
router.get('/:code', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const code = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
    const room = RoomService.getRoom(code);

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Game room not found. It may have expired or ended.',
      });
      return;
    }

    const playerCount = Object.keys(room.players).length;

    res.status(200).json({
      success: true,
      data: {
        code: room.code,
        name: room.name,
        hostId: room.hostId,
        status: room.status,
        playerCount,
        maxPlayers: room.settings.maxPlayers,
        isFull: playerCount >= room.settings.maxPlayers,
        canJoin: room.status === 'LOBBY' && playerCount < room.settings.maxPlayers,
        players: Object.values(room.players).map((p) => ({
          userId: p.userId,
          username: p.username,
          avatar: p.avatar,
          isHost: p.isHost,
          isReady: p.isReady,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/rooms - List active rooms
router.get('/', (req, res) => {
  const rooms = RoomService.getAllRooms().map((r) => ({
    code: r.code,
    name: r.name,
    hostId: r.hostId,
    status: r.status,
    playerCount: Object.keys(r.players).length,
    maxPlayers: r.settings.maxPlayers,
  }));
  res.json({ success: true, data: rooms });
});

export default router;
