import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, intendedRedirectUrl } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (intendedRedirectUrl && isAuthenticated) {
        navigate(intendedRedirectUrl);
      } else if (isAuthenticated) {
        navigate('/home');
      } else {
        navigate('/welcome');
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [isAuthenticated, intendedRedirectUrl, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-radial-gradient relative overflow-hidden">
      {/* Floating neon ambient orbs */}
      <div className="absolute w-72 h-72 rounded-full bg-purple-600/20 blur-3xl -top-10 -left-10 animate-float" />
      <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl -bottom-10 -right-10 animate-float delay-1000" />
      <div className="absolute w-60 h-60 rounded-full bg-orange-500/20 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="flex flex-col items-center text-center z-10"
      >
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-orange-500 via-purple-600 to-cyan-400 p-1 shadow-neon-orange mb-6 animate-pulse-fast overflow-hidden">
          <img src="/images/logo.png" alt="Guess The Eleven" className="w-full h-full object-cover rounded-[22px]" />
        </div>

        <h1 className="font-display font-black text-5xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400 tracking-wider mb-2">
          GUESS
        </h1>

        <p className="text-sm sm:text-base font-extrabold text-cyan-300 tracking-widest uppercase">
          THE ELEVEN • SCORE 11
        </p>

        <div className="mt-8 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-semibold text-slate-400 tracking-wider">
            PREPARING GAME ENGINE...
          </span>
        </div>
      </motion.div>
    </div>
  );
};
