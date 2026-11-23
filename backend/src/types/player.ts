export interface Player {
  socketId: string;
  userId: string; // User handle
  userDbId: string; // Database ID
  username: string;
  avatar: string;
  score: number;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  hasDrawnThisGame: boolean;
  hasGuessedThisRound: boolean;
  guessOrder?: number; // 1st, 2nd, 3rd, etc.
}
