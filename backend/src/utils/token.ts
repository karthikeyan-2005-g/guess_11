import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ENV } from '../config/env.js';
import { TokenPayload, AuthTokens } from '../types/auth.js';

export function generateTokens(payload: TokenPayload): AuthTokens {
  const accessToken = jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(
    { id: payload.id, userId: payload.userId, jti: uuidv4() },
    ENV.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60, // 15 minutes in seconds
  };
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function verifyRefreshToken(token: string): { id: string; userId: string } | null {
  try {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as { id: string; userId: string };
  } catch (err) {
    return null;
  }
}
