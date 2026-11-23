import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useRoomStore } from '../store/roomStore';
import { PlayerAvatar } from '../components/PlayerAvatar';
import confetti from 'canvas-confetti';
import { Trophy, Crown, Sparkles, Home, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import audioService from '../services/audioService';

export const ResultsPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { gameOverResult, resetGame } = useGameStore();
  const { resetRoom, isHost } = useRoomStore();

  useEffect(() => {
    audioService.playWinFanfare();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.4 },
    });
  }, []);

  const handleBackHome = () => {
    audioService.playButtonClick();
    resetGame();
    resetRoom();
    navigate('/home');
  };

  const leaderboard = gameOverResult?.leaderboard || [];
  const winner = gameOverResult?.winner || leaderboard[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl"
      >
        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
          GAME OVER &bull; 11 ROUNDS COMPLETE
        </span>

        {/* Winner Highlight */}
        {winner && (
          <div className="my-6">
            <div className="relative inline-block mb-3">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 animate-bounce">
                <Crown className="w-10 h-10 fill-current" />
              </div>
              <div className="p-1 rounded-3xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-orange-500 shadow-neon-orange">
                <PlayerAvatar avatarId={winner.avatar} size="lg" />
              </div>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              {winner.username}
            </h2>
            <p className="text-sm font-black text-amber-400 uppercase tracking-wider mt-0.5">
              🏆 GUESS THE ELEVEN CHAMPION!
            </p>
            <div className="mt-2 inline-block px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 font-mono font-black text-lg">
              {winner.score} TOTAL POINTS
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="text-left my-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Final Standings</span>
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {leaderboard.map((player) => (
              <div
                key={player.userId}
                className={`flex items-center justify-between p-3 rounded-2xl border ${
                  player.rank === 1
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                    : player.rank === 2
                    ? 'bg-slate-300/15 border-slate-400/40 text-slate-100'
                    : player.rank === 3
                    ? 'bg-amber-800/20 border-amber-700/40 text-amber-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-black text-sm w-6 text-center">
                    {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                  </span>
                  <PlayerAvatar avatarId={player.avatar} size="xs" />
                  <span className="font-bold text-sm">{player.username}</span>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-slate-800/90 font-mono font-black text-purple-300 text-xs">
                  {player.score} PTS
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 justify-center">
          <button
            type="button"
            onClick={handleBackHome}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 font-black text-base shadow-neon-orange flex items-center justify-center gap-2 transform active:scale-95 transition-all"
          >
            <Home className="w-5 h-5" />
            BACK TO HOME
          </button>
        </div>
      </motion.div>
    </div>
  );
};
