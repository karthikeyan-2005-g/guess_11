import { useRoomStore } from '../store/roomStore';
import socketService from '../services/socketService';

export function useRoom() {
  const { room, players, isHost, isInLobby, roomFullCelebrated, resetRoom } = useRoomStore();

  const joinRoom = (roomCode: string) => {
    socketService.emit('ROOM_JOIN', { roomCode });
  };

  const leaveRoom = () => {
    socketService.emit('ROOM_LEAVE');
    resetRoom();
  };

  const toggleReady = () => {
    socketService.emit('PLAYER_READY_TOGGLE');
  };

  return {
    room,
    players,
    isHost,
    isInLobby,
    roomFullCelebrated,
    joinRoom,
    leaveRoom,
    toggleReady,
  };
}
