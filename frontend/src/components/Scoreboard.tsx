import React from 'react';
import { Player } from '../types/player';
import { PlayerAvatar } from './PlayerAvatar';
import { Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoreboardProps {
  players: Record<string, Player>;
  currentDrawerId?: string | null;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, currentDrawerId }) => {
  const sorted = Object.values(players).sort((a, b) => b.score - a.score);

  return (
    <div className="glass-panel rounded-2xl p-3 border border-slate-800 flex flex-col h-full">
      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800/80 text-xs font-bold text-amber-400 uppercase tracking-wider">
        <Trophy className="w-4 h-4 text-amber-400" />
        <span>Live Leaderboard</span>
      </div>

      <div className="space-y-1.5 overflow-y-auto max-h-[360px] pr-1">
        {sorted.map((player, idx) => {
          const rank = idx + 1;
          const isTop3 = rank <= 3;
          const isDrawer = player.userId === currentDrawerId;

          return (
            <motion.div
              key={player.userId}
              layout
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                rank === 1
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : rank === 2
                  ? 'bg-slate-300/10 border-slate-400/30 text-slate-200'
                  : rank === 3
                  ? 'bg-amber-800/10 border-amber-700/30 text-amber-400'
                  : 'bg-slate-900/30 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-xs w-4 text-center">
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                </span>
                <PlayerAvatar
                  avatarId={player.avatar}
                  size="xs"
                  isDrawer={isDrawer}
                  hasGuessed={player.hasGuessedThisRound}
                />
                <span className="text-xs font-bold truncate max-w-[90px] sm:max-w-[120px]">
                  {player.username}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-800/80 text-purple-300">
                  {player.score}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
