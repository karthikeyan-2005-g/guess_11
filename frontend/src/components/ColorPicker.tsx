import React from 'react';

const PALETTE = [
  '#000000', // Black
  '#ffffff', // White
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#78350f', // Brown
  '#64748b', // Slate
];

interface ColorPickerProps {
  activeColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ activeColor, onSelectColor }) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap p-1">
      {PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onSelectColor(color)}
          style={{ backgroundColor: color }}
          className={`w-7 h-7 rounded-full border-2 transition-transform duration-150 ${
            activeColor === color
              ? 'scale-125 border-white shadow-md ring-2 ring-cyan-400'
              : 'border-slate-700/80 hover:scale-110'
          }`}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
};
