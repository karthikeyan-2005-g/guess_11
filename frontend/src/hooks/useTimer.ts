import { useGameStore } from '../store/gameStore';

export function useTimer() {
  const currentRoundInfo = useGameStore((s) => s.currentRoundInfo);
  const timeRemaining = currentRoundInfo?.timeRemaining ?? 90;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWarning = timeRemaining <= 30 && timeRemaining > 10;
  const isUrgent = timeRemaining <= 10 && timeRemaining > 0;
  const isTimeUp = timeRemaining === 0;

  return {
    timeRemaining,
    formattedTime,
    isWarning,
    isUrgent,
    isTimeUp,
  };
}
