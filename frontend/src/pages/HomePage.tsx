import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { Play, PlusCircle, Users, BookOpen, Trophy, Sparkles, User, Settings as SettingsIcon, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import audioService from '../services/audioService';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallModal } from '../components/InstallModal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = React.useState(false);
  const [localIp, setLocalIp] = React.useState<string>('');

  React.useEffect(() => {
    fetch('/api/health/network')
      .then((res) => res.json())
      .then((data) => {
        if (data.localIp && data.localIp !== 'localhost') {
          setLocalIp(data.localIp);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      {/* Floating 3D/Neon particles */}
      <div className="relative mb-6 text-center">
        <div className="inline-block">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-600 p-0.5 shadow-md mb-3 mx-auto">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center font-display font-black text-4xl sm:text-5xl text-white">
              11
            </div>
          </div>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight mb-1">
          GUESS THE ELEVEN
        </h1>

        <p className="text-xs sm:text-sm font-bold text-slate-400 tracking-widest uppercase">
          DRAW IT. GUESS IT. SCORE 11.
        </p>
      </div>

      {/* User greeting card */}
      {user && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel rounded-3xl p-4 sm:p-5 mb-8 flex items-center justify-between gap-4 border border-slate-700/80 w-full max-w-md shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <PlayerAvatar avatarId={user.avatar} size="md" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Ready to play,</p>
              <h3 className="font-display font-black text-lg text-white truncate max-w-[150px]">
                {user.username}
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">@{user.userId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                audioService.playButtonClick();
                navigate('/profile');
              }}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                audioService.playButtonClick();
                navigate('/settings');
              }}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Mobile Link Info Pill for Local Network Play */}
      {localIp && (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) && (
        <div className="mb-6 px-4 py-2 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-2 max-w-md w-full justify-center">
          <span className="font-bold">📱 Friends on Mobile:</span>
          <span className="font-mono font-bold text-white select-all">http://{localIp}:5173</span>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="w-full max-w-md space-y-3.5">
        {/* Play with Friends / Create Room */}
        <button
          type="button"
          onClick={() => {
            audioService.playButtonClick();
            navigate('/create-room');
          }}
          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-sm flex items-center justify-between transform active:scale-98 transition-all group"
        >
          <div className="flex items-center gap-3">
            <PlusCircle className="w-6 h-6 text-white" />
            <div className="text-left">
              <div className="leading-tight">CREATE ROOM</div>
              <div className="text-xs text-indigo-200">Host an 11-player party room</div>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
        </button>

        {/* Join Room */}
        <button
          type="button"
          onClick={() => {
            audioService.playButtonClick();
            navigate('/join-room');
          }}
          className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg border border-slate-700 flex items-center justify-between transform active:scale-98 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-cyan-400" />
            <div className="text-left">
              <div className="leading-tight">JOIN ROOM</div>
              <div className="text-xs text-slate-400">Enter Room Code or Invite Link</div>
            </div>
          </div>
          <Play className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* How to Play */}
        <button
          type="button"
          onClick={() => {
            audioService.playButtonClick();
            navigate('/how-to-play');
          }}
          className="w-full py-3.5 px-6 rounded-2xl glass-card hover:bg-slate-800/50 text-slate-300 hover:text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-800 transition-all"
        >
          <BookOpen className="w-4 h-4 text-purple-400" />
          HOW TO PLAY & GAME RULES
        </button>

        {/* Click to Install App Banner (Windows, Android, iOS) */}
        {!isInstalled && (
          <button
            type="button"
            onClick={async () => {
              audioService.playButtonClick();
              if (isInstallable) {
                const outcome = await installApp();
                if (outcome === 'accepted') return;
              }
              setShowInstallModal(true);
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-emerald-500/40 shadow-lg transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>INSTALL APP ON THIS DEVICE (WINDOWS / ANDROID / IOS)</span>
          </button>
        )}
      </div>

      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstall={async () => {
          if (isInstallable) {
            await installApp();
          }
        }}
        isInstallable={isInstallable}
        isIOS={isIOS}
      />
    </div>
  );
};
