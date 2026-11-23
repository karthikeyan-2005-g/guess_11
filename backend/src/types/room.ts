import { Player } from './player.js';
import { GameStateStatus, DrawStroke, ChatMessage, CurrentRoundInfo } from './game.js';

export interface RoomSettings {
  maxPlayers: number;
  roundDuration: number;
  totalRounds: number;
  gameMode: 'NORMAL' | 'DOUBLE11' | 'SPEED' | 'HARD' | 'MYSTERY';
  customWordCategories?: string[];
}

export interface RoomState {
  code: string;
  name: string;
  hostId: string;
  status: GameStateStatus;
  settings: RoomSettings;
  players: Record<string, Player>; // keyed by userId
  playerOrder: string[]; // drawing order for the 11 rounds
  currentRound: number;
  currentRoundInfo: CurrentRoundInfo | null;
  currentDrawerUserId: string | null;
  currentWord: string | null;
  currentWordSynonyms: string[];
  canvasStrokes: DrawStroke[];
  messages: ChatMessage[];
  roundStartTime: number | null;
  timerInterval?: NodeJS.Timeout | null;
  correctGuessesCount: number;
  roundScores: Record<string, number>; // Points won in current round
  totalScores: Record<string, number>; // Total game scores
  gameDbId?: string;
}
