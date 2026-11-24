import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { RoomCard } from '../components/RoomCard';
import { ArrowLeft, Search, Users, AlertCircle, RefreshCw } from 'lucide-react';
import audioService from '../services/audioService';

export const JoinRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [roomInput, setRoomInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [activeRooms, setActiveRooms] = useState<any[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  const fetchRooms = async () => {
    setIsLoadingRooms(true);
    try {
      const res = await apiRequest('/rooms');
      setActiveRooms(res.data || []);
    } catch {
      // ignore
    } finally {
      setIsLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleJoin = (code: string) => {
    let cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError('Please enter a room code or link');
      return;
    }

    // Extract code if user pasted a URL
    if (cleanCode.includes('/ROOM/')) {
      const parts = cleanCode.split('/ROOM/');
      cleanCode = parts[parts.length - 1];
    }

    if (!cleanCode.startsWith('GTE-') && cleanCode.length === 4) {
      cleanCode = `GTE-${cleanCode}`;
    }

    audioService.playButtonClick();
    navigate(`/room/${cleanCode}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => {
          audioService.playButtonClick();
          navigate('/home');
        }}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        BACK TO HOME
      </button>

      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl text-white">JOIN GAME ROOM</h2>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              Enter Room Code or Invitation Link
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleJoin(roomInput);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Room Code or Invitation URL
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="e.g. GTE-A829 or paste full URL"
                required
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-4 py-3.5 rounded-2xl border border-slate-700 focus:border-emerald-400 focus:outline-none text-base font-mono font-bold tracking-wider"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg shadow-sm transform active:scale-95 transition-all"
          >
            ENTER ROOM
          </button>
        </form>
      </div>

      {/* Active rooms list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Active Rooms</h3>
          <button
            type="button"
            onClick={fetchRooms}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh active rooms"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingRooms ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {activeRooms.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-center text-slate-500 text-xs italic">
            No active open rooms right now. Create your own and invite friends!
          </div>
        ) : (
          <div className="space-y-3">
            {activeRooms.map((room) => (
              <RoomCard key={room.code} room={room} onJoin={handleJoin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
