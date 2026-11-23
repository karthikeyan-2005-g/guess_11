import { ENV } from '../config/env.js';

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GTE-${randomPart}`;
}

export function getRoomInvitationUrl(code: string, origin?: string): string {
  const base = origin || ENV.CLIENT_URL;
  return `${base}/room/${code}`;
}

export function formatInvitationMessage(code: string, origin?: string): string {
  const link = getRoomInvitationUrl(code, origin);
  return `JOIN MY GUESS THE ELEVEN GAME!\n\nRoom Code: ${code}\n\nJoin here:\n${link}\n\nLet's play and see who gets 11 points!`;
}
