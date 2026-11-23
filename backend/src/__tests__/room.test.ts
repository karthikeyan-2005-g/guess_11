import { describe, it, expect } from 'vitest';
import { RoomService } from '../services/roomService.js';

describe('Room Management & 11-Player Capacity', () => {
  const host = {
    id: 'host-1',
    userId: 'superhost',
    username: 'Super Host',
    avatar: 'avatar-1',
  };

  it('creates a room with unique code and default 11 max players', async () => {
    const room = await RoomService.createRoom(host);
    expect(room.code).toMatch(/^GTE-[A-Z0-9]{4}$/);
    expect(room.hostId).toBe(host.userId);
    expect(room.settings.maxPlayers).toBe(11);
    expect(room.settings.totalRounds).toBe(11);
    expect(Object.keys(room.players).length).toBe(1);
  });

  it('allows players to join until room reaches maximum capacity of 11', async () => {
    const room = await RoomService.createRoom({
      id: 'host-cap',
      userId: 'host_cap',
      username: 'Host Cap',
      avatar: 'avatar-1',
    });

    // Add 10 more players to hit 11
    for (let i = 1; i <= 10; i++) {
      const joinResult = RoomService.joinRoom(
        room.code,
        {
          id: `player-${i}`,
          userId: `player_${i}`,
          username: `Player ${i}`,
          avatar: `avatar-${i}`,
        },
        `socket-${i}`
      );
      expect(joinResult.player.userId).toBe(`player_${i}`);
    }

    expect(Object.keys(room.players).length).toBe(11);

    // 12th player MUST be rejected
    expect(() => {
      RoomService.joinRoom(
        room.code,
        {
          id: 'player-12',
          userId: 'player_12',
          username: 'Player 12',
          avatar: 'avatar-1',
        },
        'socket-12'
      );
    }).toThrow(/Room is already full/);
  });

  it('reassigns host cleanly when existing host leaves', async () => {
    const room = await RoomService.createRoom({
      id: 'h1',
      userId: 'h1_user',
      username: 'H1',
      avatar: 'avatar-1',
    });

    RoomService.joinRoom(
      room.code,
      {
        id: 'h2',
        userId: 'h2_user',
        username: 'H2',
        avatar: 'avatar-2',
      },
      'socket-h2'
    );

    const leaveResult = RoomService.leaveRoom(room.code, 'h1_user');
    expect(leaveResult.hostChanged).toBe(true);
    expect(leaveResult.room?.hostId).toBe('h2_user');
  });

  it('allows starting the game with minimum 2 players up to 11 players', async () => {
    const room = await RoomService.createRoom({
      id: 'h3',
      userId: 'h3_user',
      username: 'H3',
      avatar: 'avatar-1',
    });

    expect(Object.keys(room.players).length).toBe(1);

    // Join second player
    RoomService.joinRoom(
      room.code,
      {
        id: 'p2',
        userId: 'p2_user',
        username: 'P2',
        avatar: 'avatar-2',
      },
      'socket-p2'
    );

    expect(Object.keys(room.players).length).toBe(2);
    expect(room.settings.maxPlayers).toBe(11);
  });
});
