import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useRoomStore } from '../store/roomStore';
import { Sparkles, Users, Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import audioService from '../services/audioService';

const GAME_MODES = [
  { id: 'NORMAL', name: 'Normal Mode', desc: 'Standard 11-point scoring party mode' },
  { id: 'DOUBLE11', name: 'Double 11 Mode', desc: 'All points doubled! High stakes!' },
  { id: 'SPEED', name: 'Speed Mode', desc: '60 seconds per round for frantic action' },
  { id: 'HARD', name: 'Hard Object Mode', desc: 'Complex objects and challenging words' },
  { id: 'MYSTERY', name: 'Mystery Mode', desc: 'Secret twists and fewer revealed hints' },
];

export const CreateRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRoom } = useRoomStore();

  const [roomName, setRoomName] = useState('Party Room 11');
  const [gameMode, setGameMode] = useState('NORMAL');
  const [roundDuration, setRoundDuration] = useState(90);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    audioService.playButtonClick();

    try {
      const res = await apiRequest('/rooms', {
        method: 'POST',
        body: JSON.stringify({
          name: roomName.trim(),
          gameMode,
          roundDuration,
        }),
      });

      audioService.playGameStart();
      const code = res.data.room.code;
      navigate(`/lobby/${code}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create room.');
    } finally {
      setIsCreating(false);
    }
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

      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl text-white">CREATE GAME ROOM</h2>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              Host an 11-player party room
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-5">
          {/* Room Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Room Title</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Master Minds 11"
              maxLength={30}
              required
              className="w-full bg-slate-900/90 text-white placeholder-slate-500 px-4 py-3 rounded-2xl border border-slate-700 focus:border-emerald-400 focus:outline-none text-sm font-medium"
            />
          </div>

          {/* Max Players (2 to 11) */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Room Capacity</h4>
                <p className="text-xs text-slate-400">Min 2 players to start &bull; Max 11 players</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs sm:text-sm border border-emerald-500/40 font-mono">
              2 – 11 PLAYERS
            </span>
          </div>

          {/* Round Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Round Duration</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[60, 90, 120].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => {
                    audioService.playButtonClick();
                    setRoundDuration(dur);
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    roundDuration === dur
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {dur} SECONDS {dur === 90 && '(DEFAULT)'}
                </button>
              ))}
            </div>
          </div>

          {/* Game Modes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Select Game Mode</label>
            <div className="space-y-2">
              {GAME_MODES.map((mode) => (
                <div
                  key={mode.id}
                  onClick={() => {
                    audioService.playButtonClick();
                    setGameMode(mode.id);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    gameMode === mode.id
                      ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{mode.name}</h4>
                    <p className="text-xs text-slate-400">{mode.desc}</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      gameMode === mode.id ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600'
                    }`}
                  >
                    {gameMode === mode.id && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 transform active:scale-95 transition-all mt-6"
          >
            {isCreating ? 'CREATING LOBBY...' : 'START ROOM LOBBY'}
          </button>
        </form>
      </div>
    </div>
  );
};
