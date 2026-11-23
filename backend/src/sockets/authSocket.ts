import { Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/token.js';
import { TokenPayload } from '../types/auth.js';

export interface AuthenticatedSocket extends Socket {
  data: {
    user?: TokenPayload;
    currentRoomCode?: string;
  };
}

export function socketAuthMiddleware(socket: AuthenticatedSocket, next: (err?: Error) => void): void {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(new Error('AUTH_REQUIRED: Socket connection requires a valid authentication token.'));
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return next(new Error('AUTH_INVALID: Token expired or invalid.'));
  }

  socket.data.user = payload;
  next();
}
