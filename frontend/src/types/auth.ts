export interface User {
  id: string;
  userId: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  fullName?: string | null;
  bio?: string | null;
  favoriteCategory: string;
  createdAt: string;
}

export interface UserStatistics {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestScore: number;
  correctGuesses: number;
  drawingRounds: number;
  winPercentage: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
