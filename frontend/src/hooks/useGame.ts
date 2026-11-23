import { useGameStore } from '../store/gameStore';
import socketService from '../services/socketService';

export function useGame() {
  const game = useGameStore();

  const submitGuess = (guess: string) => {
    socketService.emit('GUESS_SUBMIT', { guess });
  };

  const sendChatMessage = (text: string) => {
    socketService.emit('CHAT_SEND', { text });
  };

  const startGame = () => {
    socketService.emit('GAME_START');
  };

  return {
    ...game,
    submitGuess,
    sendChatMessage,
    startGame,
  };
}
