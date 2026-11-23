export interface Player {
  socketId: string;
  userId: string;
  userDbId: string;
  username: string;
  avatar: string;
  score: number;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  hasDrawnThisGame: boolean;
  hasGuessedThisRound: boolean;
  guessOrder?: number;
}
