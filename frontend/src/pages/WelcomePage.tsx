import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Sparkles, BookOpen, LogIn, UserPlus, Download } from 'lucide-react';
import audioService from '../services/audioService';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallModal } from '../components/InstallModal';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 max-w-lg mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated Badge Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-6"
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-orange-500 via-purple-600 to-cyan-400 p-1 shadow-neon-orange animate-float overflow-hidden">
            <img src="/images/logo.png" alt="Guess The Eleven" className="w-full h-full object-cover rounded-[22px]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-display font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400 mb-2 tracking-wider"
        >
          GUESS 11
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm font-black text-cyan-400 tracking-widest uppercase mb-6"
        >
          DRAW IT. GUESS IT. SCORE 11.
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-slate-300 max-w-xs mb-8"
        >
          The ultimate 11-player multiplayer party game! 11 rounds of fast drawing, lightning guesses,
          and +11 point glory!
        </motion.p>

        {/* Action Buttons */}
        <div className="w-full space-y-3.5">
          <button
            type="button"
            onClick={() => {
              audioService.playButtonClick();
              navigate('/register');
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 font-black text-lg shadow-neon-orange flex items-center justify-center gap-3 transform active:scale-95 transition-all"
          >
            <UserPlus className="w-6 h-6" />
            CREATE ACCOUNT
          </button>

          <button
            type="button"
            onClick={() => {
              audioService.playButtonClick();
              navigate('/login');
            }}
            className="w-full py-4 rounded-2xl glass-panel-elevated hover:bg-slate-800/80 text-white font-black text-lg border border-slate-700 flex items-center justify-center gap-3 transform active:scale-95 transition-all"
          >
            <LogIn className="w-6 h-6 text-cyan-400" />
            LOGIN TO PLAY
          </button>

          <button
            type="button"
            onClick={() => {
              audioService.playButtonClick();
              navigate('/how-to-play');
            }}
            className="w-full py-3 rounded-2xl text-slate-400 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            HOW TO PLAY
          </button>

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
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-cyan-500/30 transition-all shadow-md"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              INSTALL APP ON THIS DEVICE
            </button>
          )}
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-500">
        11 Players &bull; 11 Rounds &bull; Real-time Drawing &bull; Web, Android & iOS
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
