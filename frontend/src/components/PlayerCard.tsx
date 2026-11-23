import React from 'react';
import { Player } from '../types/player';
import { PlayerAvatar } from './PlayerAvatar';
import { motion } from 'framer-motion';

interface PlayerCardProps {
  player?: Player;
  slotNumber: number;
  isHost?: boolean;
  isCurrentDrawer?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  slotNumber,
  isHost,
  isCurrentDrawer,
}) => {
  if (!player) {
    // Empty slot
    return (
      <div className="glass-card rounded-2xl p-3 flex flex-col items-center justify-center border-dashed border-2 border-slate-700/60 h-28 opacity-60">
        <div className="w-10 h-10 rounded-full border border-dashed border-slate-600 flex items-center justify-center text-slate-500 font-bold mb-1">
          {slotNumber}
        </div>
        <span className="text-xs text-slate-500 font-medium tracking-wide">Waiting...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`glass-panel rounded-2xl p-3 flex flex-col items-center justify-between h-28 relative overflow-hidden transition-all duration-300 ${
        isCurrentDrawer
          ? 'border-cyan-400 shadow-neon-cyan ring-2 ring-cyan-400/50'
          : player.hasGuessedThisRound
          ? 'border-emerald-500 ring-2 ring-emerald-500/30'
          : 'border-slate-700/80'
      }`}
    >
      {/* Slot number pill */}
      <span className="absolute top-1.5 left-2 text-[10px] font-bold text-slate-400">
        #{slotNumber}
      </span>

      {/* Ready / Score badge */}
      <span className="absolute top-1.5 right-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-300 border border-purple-500/40">
        {player.score} pts
      </span>

      <div className="mt-1">
        <PlayerAvatar
          avatarId={player.avatar}
          size="sm"
          isHost={isHost || player.isHost}
          isDrawer={isCurrentDrawer}
          hasGuessed={player.hasGuessedThisRound}
        />
      </div>

      <div className="w-full text-center truncate">
        <p className="text-xs font-bold text-slate-100 truncate">{player.username}</p>
        <span
          className={`text-[10px] font-medium ${
            player.isConnected ? 'text-emerald-400' : 'text-slate-500'
          }`}
        >
          {player.isHost ? '👑 Host' : player.isReady ? '✓ Ready' : '• Online'}
        </span>
      </div>
    </motion.div>
  );
};
