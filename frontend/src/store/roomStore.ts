import { create } from 'zustand';
import { Player } from '../types/player';
import { RoomDetails, RoomSettings } from '../types/room';

interface RoomStore {
  room: RoomDetails | null;
  players: Record<string, Player>;
  isHost: boolean;
  isInLobby: boolean;
  roomFullCelebrated: boolean;
  setRoom: (room: RoomDetails | null) => void;
  updatePlayers: (players: Record<string, Player>) => void;
  setRoomFullCelebrated: (val: boolean) => void;
  resetRoom: () => void;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  room: null,
  players: {},
  isHost: false,
  isInLobby: false,
  roomFullCelebrated: false,

  setRoom: (room) => {
    if (!room) {
      set({ room: null, players: {}, isHost: false, isInLobby: false });
      return;
    }

    let playersDict: Record<string, Player> = {};
    if (Array.isArray(room.players)) {
      room.players.forEach((p: any) => {
        if (p?.userId) playersDict[p.userId] = p;
      });
    } else if (room.players && typeof room.players === 'object') {
      playersDict = room.players;
    }

    const currentUser = (() => {
      try {
        const u = localStorage.getItem('gte_user');
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    })();

    const isHost = !!(
      currentUser && (
        (room.hostId && (room.hostId === currentUser.userId || room.hostId === currentUser.id)) ||
        (playersDict[currentUser.userId]?.isHost === true) ||
        (currentUser.id && playersDict[currentUser.id]?.isHost === true)
      )
    );

    set({
      room: { ...room, players: playersDict },
      players: playersDict,
      isHost,
      isInLobby: room.status === 'LOBBY',
    });
  },

  updatePlayers: (playersInput) => {
    let playersDict: Record<string, Player> = {};
    if (Array.isArray(playersInput)) {
      playersInput.forEach((p: any) => {
        if (p?.userId) playersDict[p.userId] = p;
      });
    } else if (playersInput && typeof playersInput === 'object') {
      playersDict = playersInput;
    }

    const currentUser = (() => {
      try {
        const u = localStorage.getItem('gte_user');
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    })();

    const room = get().room;
    const isHost = !!(
      currentUser && (
        (room?.hostId && (room.hostId === currentUser.userId || room.hostId === currentUser.id)) ||
        (playersDict[currentUser.userId]?.isHost === true) ||
        (currentUser.id && playersDict[currentUser.id]?.isHost === true)
      )
    );

    if (room) {
      set({
        players: playersDict,
        room: { ...room, players: playersDict },
        isHost,
      });
    } else {
      set({ players: playersDict, isHost });
    }
  },

  setRoomFullCelebrated: (val) => set({ roomFullCelebrated: val }),

  resetRoom: () =>
    set({
      room: null,
      players: {},
      isHost: false,
      isInLobby: false,
      roomFullCelebrated: false,
    }),
}));
