import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallModal } from './InstallModal';
import { PlayerAvatar } from './PlayerAvatar';
import { Volume2, VolumeX, Settings, LogOut, Download } from 'lucide-react';
import audioService from '../services/audioService';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { soundEnabled, toggleSound } = useSettingsStore();
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    audioService.playButtonClick();
    await logout();
    navigate('/login');
  };

  const handleInstallClick = async () => {
    audioService.playButtonClick();
    if (isInstallable) {
      const outcome = await installApp();
      if (outcome === 'accepted') return;
    }
    setShowInstallModal(true);
  };

  return (
    <>
      <header className="glass-panel sticky top-0 z-40 px-4 py-2.5 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => audioService.playButtonClick()}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 p-0.5 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/images/logo.png" alt="Guess The Eleven" className="w-full h-full object-cover rounded-[14px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-wider text-white group-hover:text-emerald-400 transition-colors leading-none">
                GUESS 11
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5">
                SCORE 11 PARTY
              </span>
            </div>
          </Link>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Click to Install App Button (Android, Windows, iOS, Mac) */}
            {!isInstalled && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-sm transition-all"
                title="Install app on this device"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">INSTALL APP</span>
                <span className="sm:hidden">INSTALL</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-slate-800/80 text-emerald-400 border-emerald-500/30 hover:bg-slate-700'
                  : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  onClick={() => audioService.playButtonClick()}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all group"
                >
                  <PlayerAvatar avatarId={user.avatar} size="xs" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 max-w-[90px] truncate">
                    {user.username}
                  </span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => audioService.playButtonClick()}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/30 transition-all"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={() => audioService.playButtonClick()}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  LOG IN
                </Link>
                <Link
                  to="/register"
                  onClick={() => audioService.playButtonClick()}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 shadow-neon-orange transition-all"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Install App Modal */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstall={handleInstallClick}
        isInstallable={isInstallable}
        isIOS={isIOS}
      />
    </>
  );
};
