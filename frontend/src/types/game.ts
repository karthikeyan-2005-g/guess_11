export type GameStatus = 'LOBBY' | 'STARTING' | 'DRAWING' | 'ROUND_END' | 'GAME_OVER';

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
  secretWord?: string;
  isDrawer?: boolean;
}

export interface RoundEndResult {
  roundNumber: number;
  totalRounds: number;
  secretWord: string;
  reason: 'TIME_UP' | 'ALL_GUESSED';
  correctGuessesCount: number;
  drawerUserId: string;
  drawerPoints: number;
  drawerBonus: boolean;
  winMessage: string;
  loseMessage: string;
  leaderboard: Array<{
    userId: string;
    username: string;
    avatar: string;
    score: number;
    roundScore: number;
    hasGuessed: boolean;
    isDrawer: boolean;
  }>;
}

export interface GameOverResult {
  winner: {
    userId: string;
    username: string;
    avatar: string;
    score: number;
  } | null;
  leaderboard: Array<{
    rank: number;
    userId: string;
    username: string;
    avatar: string;
    score: number;
  }>;
}
