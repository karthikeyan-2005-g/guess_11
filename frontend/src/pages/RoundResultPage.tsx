import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { Sparkles, Trophy, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const RoundResultPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const roomCode = code?.toUpperCase() || '';

  const { status, roundEndResult } = useGameStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (status === 'DRAWING') {
      navigate(`/game/${roomCode}`);
    } else if (status === 'GAME_OVER') {
      navigate(`/results/${roomCode}`);
    }
  }, [status, roomCode, navigate]);

  if (!roundEndResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading round results...</p>
      </div>
    );
  }

  const myResult = roundEndResult.leaderboard.find((p) => p.userId === user?.userId);
  const isDrawer = user?.userId === roundEndResult.drawerUserId;
  const isWinner = myResult?.hasGuessed || (isDrawer && roundEndResult.drawerPoints > 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl"
      >
        {/* Round Badge */}
        <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-widest">
          ROUND {roundEndResult.roundNumber} OF {roundEndResult.totalRounds} ENDED
        </span>

        {/* Revealed Secret Word */}
        <div className="mt-4 mb-4">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            THE SECRET OBJECT WAS:
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400 uppercase tracking-tight mt-1 drop-shadow-md">
            {roundEndResult.secretWord}
          </h2>
        </div>

        {/* Funny Reaction Message */}
        <div
          className={`p-3.5 rounded-2xl mb-6 text-sm sm:text-base font-black flex items-center justify-center gap-2 ${
            isWinner
              ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 shadow-md'
              : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
          }`}
        >
          {isWinner ? (
            <>
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{roundEndResult.winMessage}</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>{roundEndResult.loseMessage}</span>
            </>
          )}
        </div>

        {/* Drawer Stats */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6 flex items-center justify-between text-left">
          <div>
            <span className="text-[11px] text-slate-400 font-bold">DRAWER SCORE:</span>
            <p className="text-xs text-slate-200 mt-0.5">
              {roundEndResult.correctGuessesCount} players correctly guessed the object
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-black text-sm border border-cyan-500/40">
            +{roundEndResult.drawerPoints} PTS {roundEndResult.drawerBonus && '(BONUS!)'}
          </span>
        </div>

        {/* Round Leaderboard */}
        <div className="text-left mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Scores After Round {roundEndResult.roundNumber}</span>
          </h4>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {roundEndResult.leaderboard.map((player, idx) => (
              <div
                key={player.userId}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 w-4">#{idx + 1}</span>
                  <PlayerAvatar avatarId={player.avatar} size="xs" />
                  <span className="font-bold text-slate-100">{player.username}</span>
                  {player.isDrawer && (
                    <span className="text-[10px] text-cyan-400 font-semibold">(Drawer)</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {player.roundScore > 0 && (
                    <span className="text-emerald-400 font-bold">+{player.roundScore}</span>
                  )}
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-black text-purple-300">
                    {player.score} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown to Next Round indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-cyan-400 animate-pulse">
          <Clock className="w-4 h-4" />
          <span>Next round will start automatically in a few seconds...</span>
        </div>
      </motion.div>
    </div>
  );
};
