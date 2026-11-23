import { create } from 'zustand';
import { GameStatus, DrawStroke, ChatMessage, CurrentRoundInfo, RoundEndResult, GameOverResult } from '../types/game';

interface GameStore {
  status: GameStatus;
  countdown: number | null;
  currentRoundInfo: CurrentRoundInfo | null;
  strokes: DrawStroke[];
  activeTool: 'pencil' | 'brush' | 'eraser';
  activeColor: string;
  brushSize: number;
  messages: ChatMessage[];
  roundEndResult: RoundEndResult | null;
  gameOverResult: GameOverResult | null;
  lastPointsEarned: { points: number; userId: string } | null;

  setStatus: (status: GameStatus) => void;
  setCountdown: (count: number | null) => void;
  setCurrentRoundInfo: (info: CurrentRoundInfo | null) => void;
  updateTimer: (timeRemaining: number, revealedLetters?: Record<number, string>) => void;
  addStroke: (stroke: DrawStroke) => void;
  setStrokes: (strokes: DrawStroke[]) => void;
  clearStrokes: () => void;
  setActiveTool: (tool: 'pencil' | 'brush' | 'eraser') => void;
  setActiveColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  addMessage: (msg: ChatMessage) => void;
  setRoundEndResult: (res: RoundEndResult | null) => void;
  setGameOverResult: (res: GameOverResult | null) => void;
  setLastPointsEarned: (pts: { points: number; userId: string } | null) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  status: 'LOBBY',
  countdown: null,
  currentRoundInfo: null,
  strokes: [],
  activeTool: 'brush',
  activeColor: '#ffffff',
  brushSize: 6,
  messages: [],
  roundEndResult: null,
  gameOverResult: null,
  lastPointsEarned: null,

  setStatus: (status) => set({ status }),
  setCountdown: (countdown) => set({ countdown }),
  setCurrentRoundInfo: (currentRoundInfo) => set({ currentRoundInfo }),

  updateTimer: (timeRemaining, revealedLetters) => {
    const cur = get().currentRoundInfo;
    if (cur) {
      set({
        currentRoundInfo: {
          ...cur,
          timeRemaining,
          revealedLetters: revealedLetters || cur.revealedLetters,
        },
      });
    }
  },

  addStroke: (stroke) => set((state) => ({ strokes: [...state.strokes, stroke] })),
  setStrokes: (strokes) => set({ strokes }),
  clearStrokes: () => set({ strokes: [] }),

  setActiveTool: (activeTool) => set({ activeTool }),
  setActiveColor: (activeColor) => set({ activeColor }),
  setBrushSize: (brushSize) => set({ brushSize }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages.slice(-50), msg], // keep last 50
    })),

  setRoundEndResult: (roundEndResult) => set({ roundEndResult }),
  setGameOverResult: (gameOverResult) => set({ gameOverResult }),
  setLastPointsEarned: (lastPointsEarned) => set({ lastPointsEarned }),

  resetGame: () =>
    set({
      status: 'LOBBY',
      countdown: null,
      currentRoundInfo: null,
      strokes: [],
      messages: [],
      roundEndResult: null,
      gameOverResult: null,
      lastPointsEarned: null,
    }),
}));
