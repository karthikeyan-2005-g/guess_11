import React from 'react';
import { useTimer } from '../hooks/useTimer';
import { Clock } from 'lucide-react';

export const Timer: React.FC = () => {
  const { timeRemaining, formattedTime, isWarning, isUrgent, isTimeUp } = useTimer();

  const percentage = (timeRemaining / 90) * 100;

  let colorClasses = 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30';
  let barColor = 'bg-cyan-400';

  if (isUrgent) {
    colorClasses = 'text-rose-400 border-rose-500 bg-rose-950/50 animate-pulse-fast';
    barColor = 'bg-rose-500';
  } else if (isWarning) {
    colorClasses = 'text-orange-400 border-orange-500/60 bg-orange-950/40';
    barColor = 'bg-orange-400';
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border-2 font-mono font-black text-lg sm:text-xl shadow-lg transition-colors duration-300 ${colorClasses}`}
      >
        <Clock className="w-5 h-5 animate-spin-slow" />
        <span>{isTimeUp ? "TIME'S UP!" : formattedTime}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${barColor}`}
          style={{ width: `${Math.max(0, percentage)}%` }}
        />
      </div>
    </div>
  );
};
