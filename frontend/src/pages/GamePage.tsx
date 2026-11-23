import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useRoomStore } from '../store/roomStore';
import { useAuthStore } from '../store/authStore';
import { DrawingCanvas } from '../components/DrawingCanvas';
import { GameToolbar } from '../components/GameToolbar';
import { Timer } from '../components/Timer';
import { GuessInput } from '../components/GuessInput';
import { ChatBox } from '../components/ChatBox';
import { Scoreboard } from '../components/Scoreboard';
import { PlayerAvatar } from '../components/PlayerAvatar';
import socketService from '../services/socketService';
import { motion, AnimatePresence } from 'framer-motion';

export const GamePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const roomCode = code?.toUpperCase() || '';

  const {
    status,
    currentRoundInfo,
    strokes,
    activeTool,
    activeColor,
    brushSize,
    messages,
    lastPointsEarned,
    setActiveTool,
    setActiveColor,
    setBrushSize,
    clearStrokes,
    addStroke,
  } = useGameStore();

  const { players } = useRoomStore();
  const { user } = useAuthStore();

  const isDrawer = currentRoundInfo?.drawerId === user?.userId;
  const myPlayer = user ? players[user.userId] : null;
  const hasGuessed = myPlayer?.hasGuessedThisRound || false;

  useEffect(() => {
    if (status === 'ROUND_END') {
      navigate(`/round-result/${roomCode}`);
    } else if (status === 'GAME_OVER') {
      navigate(`/results/${roomCode}`);
    }
  }, [status, roomCode, navigate]);

  const handleGuessSubmit = (guess: string) => {
    socketService.emit('GUESS_SUBMIT', { guess });
  };

  // Build display word for guessers (revealed hints + underscores)
  const renderWordDisplay = () => {
    if (isDrawer && currentRoundInfo?.secretWord) {
      return (
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
            YOUR SECRET WORD TO DRAW:
          </span>
          <span className="font-display font-black text-2xl sm:text-3xl text-amber-400 tracking-wide uppercase drop-shadow">
            {currentRoundInfo.secretWord}
          </span>
          <span className="text-[10px] text-slate-400">Category: {currentRoundInfo.category}</span>
        </div>
      );
    }

    if (!currentRoundInfo) return null;

    return (
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          GUESS THE OBJECT ({currentRoundInfo.category})
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
          {Array.from({ length: currentRoundInfo.wordLength }).map((_, idx) => {
            const revealedChar = currentRoundInfo.revealedLetters?.[idx];
            return (
              <span
                key={idx}
                className={`w-7 h-9 sm:w-8 sm:h-10 rounded-xl border flex items-center justify-center font-display font-black text-lg sm:text-xl transition-all ${
                  revealedChar
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-neon-cyan'
                    : 'bg-slate-900/60 text-slate-600 border-slate-700/80'
                }`}
              >
                {revealedChar ? revealedChar.toUpperCase() : '_'}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 min-h-[calc(100vh-80px)] flex flex-col justify-between relative">
      {/* Floating points earned notification animation (+11 Points!) */}
      <AnimatePresence>
        {lastPointsEarned && (
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1.2, y: -20, opacity: 1 }}
            exit={{ scale: 1.5, y: -80, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-display font-black text-2xl shadow-neon-orange flex items-center gap-2 pointer-events-none"
          >
            <span>✨</span>
            <span>+{lastPointsEarned.points} POINTS!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Header Bar */}
      <div className="glass-panel rounded-2xl p-3 sm:p-4 mb-3 border border-slate-700/80 shadow-xl flex items-center justify-between gap-4">
        {/* Round number */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-display font-black text-purple-300 text-sm">
            {currentRoundInfo?.roundNumber || 1}/11
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              ROUND {currentRoundInfo?.roundNumber || 1} OF 11
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Drawer:</span>
              <span className="text-xs font-black text-cyan-400">
                {currentRoundInfo?.drawerName}
              </span>
            </div>
          </div>
        </div>

        {/* Word / Category Display in Center */}
        <div className="hidden md:block">{renderWordDisplay()}</div>

        {/* Timer */}
        <Timer />
      </div>

      {/* Mobile Word Display (shown on smaller screens below header) */}
      <div className="block md:hidden glass-panel rounded-2xl p-2.5 mb-3 text-center">
        {renderWordDisplay()}
      </div>

      {/* Main Game Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 flex-1">
        {/* Left Side: Scoreboard */}
        <div className="hidden lg:block lg:col-span-3">
          <Scoreboard players={players} currentDrawerId={currentRoundInfo?.drawerId} />
        </div>

        {/* Center: Canvas and Drawing Controls */}
        <div className="lg:col-span-6 flex flex-col gap-2.5">
          <DrawingCanvas
            isDrawer={isDrawer}
            strokes={strokes}
            activeTool={activeTool}
            activeColor={activeColor}
            brushSize={brushSize}
            roomCode={roomCode}
            onStrokeComplete={(s) => addStroke(s)}
          />

          {isDrawer && (
            <GameToolbar
              roomCode={roomCode}
              activeTool={activeTool}
              activeColor={activeColor}
              brushSize={brushSize}
              onToolChange={setActiveTool}
              onColorChange={setActiveColor}
              onSizeChange={setBrushSize}
              onUndo={() => {}}
              onClear={clearStrokes}
            />
          )}

          {/* Guess Input Bar */}
          <div className="mt-auto pt-1">
            <GuessInput
              isDrawer={isDrawer}
              hasGuessed={hasGuessed}
              onGuess={handleGuessSubmit}
            />
          </div>
        </div>

        {/* Right Side: Chat & Guesses */}
        <div className="lg:col-span-3 h-full">
          <ChatBox messages={messages} currentUserId={user?.userId} />
        </div>
      </div>
    </div>
  );
};
