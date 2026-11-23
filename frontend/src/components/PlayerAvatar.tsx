import React from 'react';
import { getAvatarById } from '../data/avatars';
import { Crown, Pencil, Check } from 'lucide-react';

interface PlayerAvatarProps {
  avatarId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isHost?: boolean;
  isDrawer?: boolean;
  hasGuessed?: boolean;
  className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  avatarId,
  size = 'md',
  isHost,
  isDrawer,
  hasGuessed,
  className = '',
}) => {
  const avatar = getAvatarById(avatarId);

  const sizeClasses = {
    xs: 'w-7 h-7 text-sm',
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-3xl',
    lg: 'w-20 h-20 text-4xl',
    xl: 'w-28 h-28 text-6xl',
  };

  const badgeSize = {
    xs: 'w-3 h-3 p-0.5',
    sm: 'w-4 h-4 p-0.5',
    md: 'w-5 h-5 p-1',
    lg: 'w-6 h-6 p-1',
    xl: 'w-8 h-8 p-1.5',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div
        className={`rounded-2xl flex items-center justify-center bg-gradient-to-br ${avatar.bgGradient} border-2 ${avatar.borderColor} shadow-lg transition-transform duration-200 hover:scale-105 ${sizeClasses[size]}`}
      >
        <span>{avatar.emoji}</span>
      </div>

      {/* Host Crown Badge */}
      {isHost && (
        <div
          title="Host"
          className={`absolute -top-2 -right-2 rounded-full bg-amber-400 text-slate-900 shadow-md ${badgeSize[size]}`}
        >
          <Crown className="w-full h-full fill-current" />
        </div>
      )}

      {/* Drawer Pencil Badge */}
      {isDrawer && (
        <div
          title="Drawing Now"
          className={`absolute -bottom-1 -right-1 rounded-full bg-cyan-400 text-slate-900 shadow-md ${badgeSize[size]}`}
        >
          <Pencil className="w-full h-full fill-current" />
        </div>
      )}

      {/* Guessed Checkmark Badge */}
      {hasGuessed && !isDrawer && (
        <div
          title="Correct Guess!"
          className={`absolute -bottom-1 -right-1 rounded-full bg-emerald-500 text-white shadow-md animate-bounce-short ${badgeSize[size]}`}
        >
          <Check className="w-full h-full stroke-[3]" />
        </div>
      )}
    </div>
  );
};
