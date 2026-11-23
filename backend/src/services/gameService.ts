import { Server } from 'socket.io';
import { RoomState } from '../types/room.js';
import { ObjectService } from './objectService.js';
import { ScoringService } from './scoringService.js';
import { UserService } from './userService.js';
import prisma from '../config/db.js';

export const WIN_MESSAGES = [
  'BIG BRAIN ACTIVATED!',
  'YOU ARE THE LEGEND!',
  '11/11 MASTER!',
  'YOU DESTROYED THE GUESSING GAME!',
  'YOUR BRAIN IS RUNNING AT 1000 FPS!',
  'THE DRAWING WAS UGLY, BUT YOU GOT IT!',
];

export const LOSE_MESSAGES = [
  'YOUR BRAIN WENT AFK!',
  'THE OBJECT WAS RIGHT THERE!',
  'EVEN THE DRAWER GAVE UP!',
  'BETTER LUCK NEXT ROUND!',
  'THE PENCIL WAS STRONGER THAN YOU!',
  'YOU NEED A REBOOT!',
  'MISSION FAILED SUCCESSFULLY!',
  'YOUR GUESSING SKILLS NEED AN UPDATE!',
];

export class GameService {
  private static usedObjectsByRoom: Map<string, string[]> = new Map();

  static startGame(io: Server, room: RoomState, hostUserId: string): void {
    if (room.hostId !== hostUserId) {
      throw new Error('Only the room host can start the game.');
    }

    const playerCount = Object.keys(room.players).length;
    if (playerCount < 2) {
      throw new Error('At least 2 players are needed to start the game (maximum 11 players).');
    }
    if (playerCount > room.settings.maxPlayers) {
      throw new Error(`Maximum ${room.settings.maxPlayers} players allowed.`);
    }

    room.status = 'STARTING';

    // Shuffle drawing order
    const playerIds = Object.keys(room.players);
    room.playerOrder = playerIds.sort(() => Math.random() - 0.5);
    room.currentRound = 0;
    this.usedObjectsByRoom.set(room.code, []);

    // Broadcast 3-2-1 countdown
    io.to(room.code).emit('GAME_COUNTDOWN', { count: 3 });
    setTimeout(() => io.to(room.code).emit('GAME_COUNTDOWN', { count: 2 }), 1000);
    setTimeout(() => io.to(room.code).emit('GAME_COUNTDOWN', { count: 1 }), 2000);
    setTimeout(() => {
      this.startNextRound(io, room);
    }, 3000);
  }

  static startNextRound(io: Server, room: RoomState): void {
    if (room.timerInterval) {
      clearInterval(room.timerInterval);
      room.timerInterval = null;
    }

    // Check if total 11 rounds reached (cycles through players fairly for 2-11 players)
    const maxRounds = room.settings.totalRounds || 11;
    if (room.currentRound >= maxRounds) {
      this.endGame(io, room);
      return;
    }

    room.currentRound += 1;
    room.status = 'DRAWING';
    room.canvasStrokes = [];
    room.correctGuessesCount = 0;
    room.roundScores = {};

    // Select drawer based on drawing order
    const drawerUserId = room.playerOrder[(room.currentRound - 1) % room.playerOrder.length];
    room.currentDrawerUserId = drawerUserId;

    // Reset player round flags
    Object.values(room.players).forEach((p) => {
      p.hasGuessedThisRound = false;
      delete p.guessOrder;
    });

    // Select random object
    const usedObjects = this.usedObjectsByRoom.get(room.code) || [];
    const chosenObject = ObjectService.getRandomObject(
      usedObjects,
      room.settings.customWordCategories?.[0],
      room.settings.gameMode === 'HARD' ? 'HARD' : undefined
    );

    usedObjects.push(chosenObject.id);
    this.usedObjectsByRoom.set(room.code, usedObjects);

    room.currentWord = chosenObject.name;
    room.currentWordSynonyms = chosenObject.synonyms;

    const drawer = room.players[drawerUserId];
    const duration = room.settings.roundDuration;
    let timeRemaining = duration;

    // Build masked word representation
    const wordLength = chosenObject.name.replace(/\s+/g, '').length;
    const revealedLetters: Record<number, string> = {};

    room.currentRoundInfo = {
      roundNumber: room.currentRound,
      totalRounds: maxRounds,
      drawerId: drawerUserId,
      drawerName: drawer?.username || 'Drawer',
      drawerAvatar: drawer?.avatar || 'avatar-1',
      wordLength,
      category: chosenObject.category,
      difficulty: chosenObject.difficulty,
      revealedLetters,
      timeRemaining,
    };

    // Send round start to all players
    // Drawer receives secret word
    const drawerSocket = drawer?.socketId;
    if (drawerSocket) {
      io.to(drawerSocket).emit('ROUND_START', {
        ...room.currentRoundInfo,
        secretWord: chosenObject.name,
        isDrawer: true,
      });
    }

    // Other players receive masked word info
    Object.values(room.players).forEach((p) => {
      if (p.userId !== drawerUserId && p.socketId) {
        io.to(p.socketId).emit('ROUND_START', {
          ...room.currentRoundInfo,
          secretWord: undefined,
          isDrawer: false,
        });
      }
    });

    // Server 90-second synchronized timer
    room.roundStartTime = Date.now();
    room.timerInterval = setInterval(() => {
      timeRemaining -= 1;
      if (room.currentRoundInfo) {
        room.currentRoundInfo.timeRemaining = timeRemaining;
      }

      // Hint reveal at 60s and 30s
      if (timeRemaining === 60 || timeRemaining === 30) {
        const letters = chosenObject.name.split('');
        const unrevealedIndices = letters
          .map((char, idx) => (char !== ' ' && !revealedLetters[idx] ? idx : -1))
          .filter((idx) => idx !== -1);

        if (unrevealedIndices.length > 0) {
          const randIdx = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
          revealedLetters[randIdx] = letters[randIdx];
        }
      }

      // Sync timer tick to all players
      io.to(room.code).emit('TIMER_TICK', {
        timeRemaining,
        revealedLetters,
      });

      if (timeRemaining <= 0) {
        if (room.timerInterval) {
          clearInterval(room.timerInterval);
          room.timerInterval = null;
        }
        this.endRound(io, room, 'TIME_UP');
      }
    }, 1000);
  }

  static handleGuess(io: Server, room: RoomState, userId: string, text: string): void {
    if (room.status !== 'DRAWING' || !room.currentWord) return;

    const player = room.players[userId];
    if (!player) return;

    // Drawer cannot guess
    if (room.currentDrawerUserId === userId) return;

    // Already guessed correctly this round
    if (player.hasGuessedThisRound) return;

    const isCorrect = ObjectService.isCorrectGuess(text, room.currentWord, room.currentWordSynonyms);

    if (isCorrect) {
      room.correctGuessesCount += 1;
      player.hasGuessedThisRound = true;
      player.guessOrder = room.correctGuessesCount;

      const points = ScoringService.getGuesserPoints(player.guessOrder, room.settings.gameMode);
      player.score += points;
      room.roundScores[userId] = points;
      room.totalScores[userId] = player.score;

      // Broadcast correct guess event
      io.to(room.code).emit('GUESS_CORRECT', {
        userId,
        username: player.username,
        avatar: player.avatar,
        pointsEarned: points,
        guessOrder: player.guessOrder,
        isFirst: player.guessOrder === 1,
      });

      // Check if all non-drawers have guessed
      const guesserCount = Object.keys(room.players).length - 1;
      if (room.correctGuessesCount >= guesserCount) {
        if (room.timerInterval) {
          clearInterval(room.timerInterval);
          room.timerInterval = null;
        }
        setTimeout(() => {
          this.endRound(io, room, 'ALL_GUESSED');
        }, 1200);
      }
    } else {
      const isClose = ObjectService.isCloseGuess(text, room.currentWord);

      if (isClose && player.socketId) {
        io.to(player.socketId).emit('GUESS_CLOSE', {
          text,
          message: 'You are so close!',
        });
      }

      // Normal chat broadcast
      io.to(room.code).emit('CHAT_MESSAGE', {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        senderId: userId,
        senderName: player.username,
        text,
        type: 'guess',
        timestamp: Date.now(),
      });
    }
  }

  static endRound(io: Server, room: RoomState, reason: 'TIME_UP' | 'ALL_GUESSED'): void {
    if (room.timerInterval) {
      clearInterval(room.timerInterval);
      room.timerInterval = null;
    }

    room.status = 'ROUND_END';

    // Calculate drawer points
    let drawerPoints = 0;
    let drawerBonus = false;
    if (room.currentDrawerUserId && room.players[room.currentDrawerUserId]) {
      const drawer = room.players[room.currentDrawerUserId];
      const result = ScoringService.getDrawerPoints(room.correctGuessesCount, room.settings.gameMode);
      drawerPoints = result.points;
      drawerBonus = result.bonus;
      drawer.score += drawerPoints;
      room.roundScores[drawer.userId] = drawerPoints;
      room.totalScores[drawer.userId] = drawer.score;
    }

    // Pick funny win / lose message
    const winMsg = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
    const loseMsg = LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)];

    // Build round leaderboard
    const leaderboard = Object.values(room.players)
      .map((p) => ({
        userId: p.userId,
        username: p.username,
        avatar: p.avatar,
        score: p.score,
        roundScore: room.roundScores[p.userId] || 0,
        hasGuessed: p.hasGuessedThisRound,
        isDrawer: p.userId === room.currentDrawerUserId,
      }))
      .sort((a, b) => b.score - a.score);

    io.to(room.code).emit('ROUND_END', {
      roundNumber: room.currentRound,
      totalRounds: room.settings.totalRounds || 11,
      secretWord: room.currentWord,
      reason,
      correctGuessesCount: room.correctGuessesCount,
      drawerUserId: room.currentDrawerUserId,
      drawerPoints,
      drawerBonus,
      winMessage: winMsg,
      loseMessage: loseMsg,
      leaderboard,
    });

    // Wait 7 seconds on Round Result Screen, then go to next round
    setTimeout(() => {
      this.startNextRound(io, room);
    }, 7000);
  }

  static async endGame(io: Server, room: RoomState): Promise<void> {
    room.status = 'GAME_OVER';

    const rankedPlayers = Object.values(room.players).sort((a, b) => b.score - a.score);
    const winner = rankedPlayers[0];

    io.to(room.code).emit('GAME_OVER', {
      winner: winner
        ? {
            userId: winner.userId,
            username: winner.username,
            avatar: winner.avatar,
            score: winner.score,
          }
        : null,
      leaderboard: rankedPlayers.map((p, idx) => ({
        rank: idx + 1,
        userId: p.userId,
        username: p.username,
        avatar: p.avatar,
        score: p.score,
      })),
    });

    // Asynchronously persist game statistics to database
    try {
      for (const p of rankedPlayers) {
        if (p.userDbId) {
          await UserService.updateGameStatistics(p.userDbId, {
            points: p.score,
            won: winner?.userId === p.userId,
            correctGuesses: p.score > 0 ? Math.floor(p.score / 5) : 0,
            drewRound: true,
          });
        }
      }
    } catch (err) {
      console.warn('Game statistics persistence note:', err);
    }
  }
}
