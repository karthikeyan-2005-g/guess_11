import React from 'react';
import { Link } from 'react-router-dom';
import audioService from '../services/audioService';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/60 py-4 px-4 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-medium">
          GUESS THE ELEVEN &copy; {new Date().getFullYear()} — Draw It. Guess It. Score 11.
        </p>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link
            to="/how-to-play"
            onClick={() => audioService.playButtonClick()}
            className="hover:text-cyan-400 transition-colors"
          >
            How to Play
          </Link>
          <Link
            to="/settings"
            onClick={() => audioService.playButtonClick()}
            className="hover:text-cyan-400 transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>
    </footer>
  );
};
