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
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-orange-500 via-purple-600 to-cyan-400 p-1 shadow-neon-orange mb-4 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-display font-black text-5xl sm:text-6xl text-white">
              11
            </div>
          </div>
        </motion.div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-purple-300 to-cyan-400 tracking-tight mb-2">
          GUESS THE ELEVEN
        </h1>

        <p className="text-sm sm:text-base font-black text-cyan-400 tracking-widest uppercase">
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
      <div className="w-full max-w-md space-y-4">
        {/* Play with Friends / Create Room */}
        <button
          type="button"
          onClick={() => {
            audioService.playButtonClick();
            navigate('/create-room');
          }}
          className="w-full py-4 sm:py-5 px-6 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-slate-950 font-black text-xl shadow-neon-orange flex items-center justify-between transform active:scale-98 transition-all group"
        >
          <div className="flex items-center gap-3">
            <PlusCircle className="w-7 h-7" />
            <div className="text-left">
              <div className="leading-tight">CREATE ROOM</div>
              <div className="text-xs font-bold text-slate-900/80">Become Host &bull; 11 Player Room</div>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-slate-950 group-hover:rotate-12 transition-transform" />
        </button>

        {/* Join Room */}
        <button
          type="button"
          onClick={() => {
            audioService.playButtonClick();
            navigate('/join-room');
          }}
          className="w-full py-4 sm:py-5 px-6 rounded-3xl glass-panel-elevated hover:bg-slate-800/80 text-white font-black text-xl border border-slate-700/80 flex items-center justify-between transform active:scale-98 transition-all shadow-xl group"
        >
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-cyan-400" />
            <div className="text-left">
              <div className="leading-tight">JOIN ROOM</div>
              <div className="text-xs font-semibold text-slate-400">Enter Room Code or Invite Link</div>
            </div>
          </div>
          <Play className="w-6 h-6 text-cyan-400 group-hover:translate-x-1 transition-transform" />
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
