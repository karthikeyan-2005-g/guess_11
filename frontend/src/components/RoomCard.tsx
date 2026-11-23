import React from 'react';
import { Users, Play, ShieldAlert } from 'lucide-react';

interface RoomCardProps {
  room: {
    code: string;
    name: string;
    hostId: string;
    status: string;
    playerCount: number;
    maxPlayers: number;
  };
  onJoin: (code: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin }) => {
  const isFull = room.playerCount >= room.maxPlayers;
  const isPlaying = room.status !== 'WAITING' && room.status !== 'LOBBY';

  return (
    <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-slate-800 hover:border-cyan-500/40 transition-all">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-cyan-400 text-sm">{room.code}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isPlaying
                ? 'bg-purple-950/80 text-purple-300 border border-purple-700/50'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
            }`}
          >
            {isPlaying ? 'IN GAME' : 'WAITING'}
          </span>
        </div>
        <h4 className="text-sm font-bold text-white mt-1">{room.name}</h4>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
          <Users className="w-3.5 h-3.5" />
          <span>
            {room.playerCount}/{room.maxPlayers} Players
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={isFull || isPlaying}
        onClick={() => onJoin(room.code)}
        className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed shadow-neon-cyan transition-all"
      >
        {isFull ? 'FULL' : isPlaying ? 'PLAYING' : 'JOIN'}
      </button>
    </div>
  );
};
