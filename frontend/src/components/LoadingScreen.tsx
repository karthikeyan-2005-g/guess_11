import React from 'react';

export const LoadingScreen: React.FC<{ message?: string }> = ({
  message = 'Connecting to GUESS THE ELEVEN...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 p-6">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 via-purple-600 to-cyan-400 p-1 animate-spin-slow shadow-neon-orange">
          <div className="w-full h-full bg-slate-950 rounded-[22px]" />
        </div>
        <span className="absolute font-display font-black text-3xl text-white">11</span>
      </div>
      <h2 className="font-display font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-purple-300 to-cyan-400 mb-2">
        GUESS THE ELEVEN
      </h2>
      <p className="text-sm font-medium text-slate-400 animate-pulse">{message}</p>
    </div>
  );
};
