import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import audioService from '../services/audioService';

interface GuessInputProps {
  isDrawer: boolean;
  hasGuessed: boolean;
  onGuess: (guess: string) => void;
  disabled?: boolean;
}

export const GuessInput: React.FC<GuessInputProps> = ({
  isDrawer,
  hasGuessed,
  onGuess,
  disabled = false,
}) => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = guess.trim();
    if (!trimmed || isDrawer || hasGuessed || disabled) return;

    audioService.playButtonClick();
    onGuess(trimmed);
    setGuess('');
  };

  if (isDrawer) {
    return (
      <div className="glass-panel rounded-2xl p-3 text-center border-cyan-500/30 text-cyan-300 font-semibold text-sm">
        🎨 You are the Drawer! Draw the secret object clearly!
      </div>
    );
  }

  if (hasGuessed) {
    return (
      <div className="glass-panel rounded-2xl p-3 text-center border-emerald-500/40 bg-emerald-950/20 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        Awesome! You already guessed the object correctly!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        disabled={disabled}
        placeholder="Type your guess here..."
        maxLength={40}
        className="flex-1 bg-slate-900/90 text-white placeholder-slate-500 px-4 py-3 rounded-2xl border-2 border-slate-700/80 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-base font-medium transition-all"
      />
      <button
        type="submit"
        disabled={disabled || !guess.trim()}
        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black flex items-center justify-center gap-2 shadow-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
      >
        <Send className="w-5 h-5" />
        <span className="hidden sm:inline">GUESS</span>
      </button>
    </form>
  );
};
