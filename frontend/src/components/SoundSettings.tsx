import React from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { Volume2, VolumeX, Music, Smartphone } from 'lucide-react';

export const SoundSettings: React.FC = () => {
  const {
    soundEnabled,
    musicEnabled,
    volume,
    vibrationEnabled,
    toggleSound,
    toggleMusic,
    setVolume,
    toggleVibration,
  } = useSettingsStore();

  return (
    <div className="space-y-4">
      {/* Sound Effects */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Sound Effects</h4>
            <p className="text-xs text-slate-400">Funny chimes, timer beeps, scoring rewards</p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleSound}
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
            soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              soundEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Background Music */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Lobby & Party Music</h4>
            <p className="text-xs text-slate-400">Playful rhythmic party background music</p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleMusic}
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
            musicEnabled ? 'bg-cyan-500' : 'bg-slate-700'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              musicEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Volume Slider */}
      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-white">Master Volume</span>
          <span className="text-xs font-mono text-cyan-400 font-bold">{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer"
        />
      </div>

      {/* Mobile Vibration / Haptics */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/20 text-orange-300">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Haptic Vibration</h4>
            <p className="text-xs text-slate-400">Tactile buzz on correct guesses & timer alarms</p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleVibration}
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
            vibrationEnabled ? 'bg-cyan-500' : 'bg-slate-700'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              vibrationEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
