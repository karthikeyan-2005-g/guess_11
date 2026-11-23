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
    const currentUser = (() => {
      try {
        const u = localStorage.getItem('gte_user');
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    })();

    const isHost = !!(
      room?.hostId &&
      currentUser &&
      (room.hostId === currentUser.userId || room.hostId === currentUser.id)
    );
    set({
      room,
      players: room?.players || {},
      isHost,
      isInLobby: room?.status === 'LOBBY',
    });
  },

  updatePlayers: (players) => {
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
      room?.hostId &&
      currentUser &&
      (room.hostId === currentUser.userId || room.hostId === currentUser.id)
    );
    if (room) {
      set({
        players,
        room: { ...room, players },
        isHost,
      });
    } else {
      set({ players });
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
