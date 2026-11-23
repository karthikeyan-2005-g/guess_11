import { Player } from './player.js';

export type GameStateStatus = 'LOBBY' | 'STARTING' | 'DRAWING' | 'ROUND_END' | 'GAME_OVER';

export interface DrawPoint {
  x: number;
  y: number;
}

export interface DrawStroke {
  points: DrawPoint[];
  color: string;
  size: number;
  tool: 'pencil' | 'brush' | 'eraser';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  type: 'chat' | 'system' | 'guess' | 'correct' | 'close' | 'join' | 'leave';
  timestamp: number;
  pointsEarned?: number;
}

export interface GameScoreEntry {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  roundScore: number;
  rank: number;
  isDrawer: boolean;
}

export interface CurrentRoundInfo {
  roundNumber: number;
  totalRounds: number;
  drawerId: string;
  drawerName: string;
  drawerAvatar: string;
  wordLength: number;
  category: string;
  difficulty: string;
  revealedLetters: Record<number, string>;
  timeRemaining: number;
  secretWord?: string; // Only sent to drawer!
}
