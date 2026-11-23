import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { SoundSettings } from '../components/SoundSettings';
import { Settings as SettingsIcon, LogOut, ArrowLeft, Shield } from 'lucide-react';
import audioService from '../services/audioService';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    audioService.playButtonClick();
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => {
          audioService.playButtonClick();
          navigate(-1);
        }}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        BACK
      </button>

      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl text-white">SETTINGS</h2>
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
              Audio, Preferences & Account
            </p>
          </div>
        </div>

        {/* Audio & Haptic Controls */}
        <SoundSettings />
      </div>

      {/* Account Settings */}
      {user && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-700 shadow-xl flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Signed In As</h4>
            <p className="text-xs text-cyan-400 font-mono font-bold mt-0.5">@{user.userId}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-2xl bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/40 text-xs font-black flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>LOG OUT</span>
          </button>
        </div>
      )}
    </div>
  );
};
