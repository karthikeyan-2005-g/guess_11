export interface TokenPayload {
  id: string; // User primary key
  userId: string; // Unique handle
  username: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SanitizedUser {
  id: string;
  userId: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  fullName?: string | null;
  bio?: string | null;
  favoriteCategory: string;
  createdAt: Date;
}
