import { Player } from './player';
import { GameStatus, DrawStroke, CurrentRoundInfo } from './game';

export interface RoomSettings {
  maxPlayers: number;
  roundDuration: number;
  totalRounds: number;
  gameMode: 'NORMAL' | 'DOUBLE11' | 'SPEED' | 'HARD' | 'MYSTERY';
}

export interface RoomDetails {
  code: string;
  name: string;
  hostId: string;
  status: GameStatus;
  settings: RoomSettings;
  players: Record<string, Player>;
  currentRound: number;
  currentRoundInfo: CurrentRoundInfo | null;
  canvasStrokes: DrawStroke[];
}
