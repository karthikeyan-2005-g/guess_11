import { useEffect } from 'react';
import socketService from '../services/socketService';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';
import audioService from '../services/audioService';
import confetti from 'canvas-confetti';

export function useSocket() {
  const { setRoom, updatePlayers, setRoomFullCelebrated, roomFullCelebrated } = useRoomStore();
  const {
    setStatus,
    setCountdown,
    setCurrentRoundInfo,
    updateTimer,
    addStroke,
    setStrokes,
    clearStrokes,
    addMessage,
    setRoundEndResult,
    setGameOverResult,
    setLastPointsEarned,
  } = useGameStore();

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('ROOM_JOINED', (data) => {
      setRoom(data.room);
      if (data.room.canvasStrokes) {
        setStrokes(data.room.canvasStrokes);
      }
      if (data.room.status) {
        setStatus(data.room.status);
      }
      if (data.room.currentRoundInfo) {
        setCurrentRoundInfo(data.room.currentRoundInfo);
      }
    });

    socket.on('ROOM_UPDATE', (data) => {
      updatePlayers(data.players);
    });

    socket.on('PLAYER_JOINED', (data) => {
      audioService.playJoinPop();
      addMessage({
        id: `sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'SYSTEM',
        text: `${data.player.username} joined the party! (${data.playerCount}/11)`,
        type: 'join',
        timestamp: Date.now(),
      });
    });

    socket.on('PLAYER_LEFT', (data) => {
      updatePlayers(data.players);
      addMessage({
        id: `sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'SYSTEM',
        text: `${data.username} left the room.`,
        type: 'leave',
        timestamp: Date.now(),
      });
    });

    socket.on('ROOM_FULL', () => {
      if (!roomFullCelebrated) {
        setRoomFullCelebrated(true);
        audioService.playRoomFull();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    });

    socket.on('GAME_COUNTDOWN', (data) => {
      setCountdown(data.count);
      audioService.playButtonClick();
    });

    socket.on('ROUND_START', (data) => {
      setCountdown(null);
      setStatus('DRAWING');
      clearStrokes();
      setCurrentRoundInfo(data);
      audioService.playGameStart();
      if (data.isDrawer) {
        setTimeout(() => audioService.playDrawingStart(), 500);
      }
    });

    socket.on('TIMER_TICK', (data) => {
      updateTimer(data.timeRemaining, data.revealedLetters);
      if (data.timeRemaining === 30) {
        audioService.playTimerWarning();
      } else if (data.timeRemaining <= 5 && data.timeRemaining > 0) {
        audioService.playFinalCountdown();
      }
    });

    socket.on('DRAW_STROKE', (stroke) => {
      addStroke(stroke);
    });

    socket.on('DRAW_CLEAR', () => {
      clearStrokes();
    });

    socket.on('DRAW_SYNC', (data) => {
      setStrokes(data.strokes);
    });

    socket.on('GUESS_CORRECT', (data) => {
      if (data.isFirst) {
        audioService.playFirstGuess();
        audioService.playScore11();
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 },
        });
      } else {
        audioService.playCorrectGuess();
      }

      setLastPointsEarned({ points: data.pointsEarned, userId: data.userId });
      setTimeout(() => setLastPointsEarned(null), 3000);

      addMessage({
        id: `guess-ok-${Date.now()}`,
        senderId: data.userId,
        senderName: data.username,
        text: `Guessed correctly! (+${data.pointsEarned} pts)`,
        type: 'correct',
        pointsEarned: data.pointsEarned,
        timestamp: Date.now(),
      });
    });

    socket.on('GUESS_CLOSE', (data) => {
      addMessage({
        id: `close-${Date.now()}`,
        senderId: 'system',
        senderName: 'SYSTEM',
        text: `"${data.text}" is SO CLOSE! Keep guessing!`,
        type: 'close',
        timestamp: Date.now(),
      });
    });

    socket.on('CHAT_MESSAGE', (msg) => {
      addMessage(msg);
    });

    socket.on('ROUND_END', (data) => {
      setStatus('ROUND_END');
      setRoundEndResult(data);
      if (data.reason === 'TIME_UP') {
        audioService.playTimeUp();
      } else {
        audioService.playWinFanfare();
      }
    });

    socket.on('GAME_OVER', (data) => {
      setStatus('GAME_OVER');
      setGameOverResult(data);
      audioService.playWinFanfare();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
      });
    });

    return () => {
      socket.off('ROOM_JOINED');
      socket.off('ROOM_UPDATE');
      socket.off('PLAYER_JOINED');
      socket.off('PLAYER_LEFT');
      socket.off('ROOM_FULL');
      socket.off('GAME_COUNTDOWN');
      socket.off('ROUND_START');
      socket.off('TIMER_TICK');
      socket.off('DRAW_STROKE');
      socket.off('DRAW_CLEAR');
      socket.off('DRAW_SYNC');
      socket.off('GUESS_CORRECT');
      socket.off('GUESS_CLOSE');
      socket.off('CHAT_MESSAGE');
      socket.off('ROUND_END');
      socket.off('GAME_OVER');
    };
  }, []);
}
