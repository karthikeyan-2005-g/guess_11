import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Clock, Paintbrush, Users, Sparkles, Target, Zap } from 'lucide-react';
import audioService from '../services/audioService';

export const HowToPlayPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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

      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-8">
        {/* Title */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500 via-purple-600 to-cyan-400 p-0.5 shadow-neon-orange mb-3 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-display font-black text-3xl text-white">
              11
            </div>
          </div>
          <h2 className="font-display font-black text-3xl text-white">HOW TO PLAY</h2>
          <p className="text-xs text-cyan-400 font-black uppercase tracking-widest mt-1">
            DRAW IT. GUESS IT. SCORE 11.
          </p>
        </div>

        {/* Core Rules Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">2 to 11 Players</h4>
            <p className="text-xs text-slate-400">
              Minimum 2 players can play, and rooms hold up to 11 players for full party fun!
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2">
              <Paintbrush className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">11 Rounds</h4>
            <p className="text-xs text-slate-400">
              Every player gets exactly 1 turn to draw the secret object.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">90s Timer</h4>
            <p className="text-xs text-slate-400">
              The server synchronizes a 90-second countdown with hints revealed at 60s and 30s.
            </p>
          </div>
        </div>

        {/* Scoring Breakdown Table */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <h3 className="font-display font-black text-lg text-white mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>The 11-Point Scoring System</span>
          </h3>

          <div className="space-y-2 text-xs font-semibold">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200">
              <span>🥇 1st Correct Guess</span>
              <span className="font-mono font-black text-sm text-amber-400">+11 POINTS</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-400/15 border border-slate-400/30 text-slate-200">
              <span>🥈 2nd Correct Guess</span>
              <span className="font-mono font-black text-sm text-slate-300">+7 POINTS</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-700/15 border border-amber-700/30 text-amber-300">
              <span>🥉 3rd Correct Guess</span>
              <span className="font-mono font-black text-sm text-amber-500">+5 POINTS</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
              <span>4th Correct Guess</span>
              <span className="font-mono font-black text-sm text-purple-300">+3 POINTS</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
              <span>Remaining Correct Guessers</span>
              <span className="font-mono font-black text-sm text-slate-300">+1 POINT</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300">
              <span>🎨 Drawer (if anyone guesses)</span>
              <span className="font-mono font-black text-sm text-cyan-400">+11 POINTS</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-950/40 border border-orange-500/40 text-orange-300">
              <span>⭐ Drawer Bonus (if 8+ players guess)</span>
              <span className="font-mono font-black text-sm text-orange-400">+5 BONUS PTS</span>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
          <h4 className="font-bold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Pro Tips:</span>
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>You can type synonyms! For example, "car" and "automobile" both count.</li>
            <li>Letters, numbers, and capitalization do not matter—guessing is normalized.</li>
            <li>If your guess is only off by 1 letter, you will get a "So Close!" alert!</li>
            <li>Double 11 Mode doubles all points for ultra-competitive party gameplay!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
