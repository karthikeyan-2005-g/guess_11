import React from 'react';
import { Player } from '../types/player';
import { PlayerCard } from './PlayerCard';

interface PlayerGridProps {
  players: Record<string, Player>;
  maxPlayers?: number;
  currentDrawerId?: string | null;
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({
  players,
  maxPlayers = 11,
  currentDrawerId,
}) => {
  const playerList = Object.values(players);
  const slots = Array.from({ length: maxPlayers }, (_, i) => playerList[i]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-3 w-full">
      {slots.map((player, index) => (
        <PlayerCard
          key={player ? player.userId : `slot-${index}`}
          player={player}
          slotNumber={index + 1}
          isHost={player?.isHost}
          isCurrentDrawer={player && player.userId === currentDrawerId}
        />
      ))}
    </div>
  );
};
