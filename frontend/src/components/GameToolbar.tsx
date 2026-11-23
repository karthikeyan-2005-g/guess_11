import React from 'react';
import { Pencil, Paintbrush, Eraser, Undo2, Trash2 } from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import socketService from '../services/socketService';
import audioService from '../services/audioService';

interface GameToolbarProps {
  roomCode: string;
  activeTool: 'pencil' | 'brush' | 'eraser';
  activeColor: string;
  brushSize: number;
  onToolChange: (tool: 'pencil' | 'brush' | 'eraser') => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onUndo: () => void;
  onClear: () => void;
}

export const GameToolbar: React.FC<GameToolbarProps> = ({
  roomCode,
  activeTool,
  activeColor,
  brushSize,
  onToolChange,
  onColorChange,
  onSizeChange,
  onUndo,
  onClear,
}) => {
  const handleUndo = () => {
    audioService.playButtonClick();
    socketService.emit('DRAW_UNDO', { roomCode });
    onUndo();
  };

  const handleClear = () => {
    audioService.playButtonClick();
    socketService.emit('DRAW_CLEAR', { roomCode });
    onClear();
  };

  return (
    <div className="glass-panel rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
      {/* Tool Selector */}
      <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => {
            audioService.playButtonClick();
            onToolChange('pencil');
            onSizeChange(3);
          }}
          className={`p-2 rounded-lg transition-all ${
            activeTool === 'pencil'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-neon-cyan'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Pencil"
        >
          <Pencil className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => {
            audioService.playButtonClick();
            onToolChange('brush');
            onSizeChange(8);
          }}
          className={`p-2 rounded-lg transition-all ${
            activeTool === 'brush'
              ? 'bg-purple-500 text-white font-bold shadow-neon-purple'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Brush"
        >
          <Paintbrush className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => {
            audioService.playButtonClick();
            onToolChange('eraser');
          }}
          className={`p-2 rounded-lg transition-all ${
            activeTool === 'eraser'
              ? 'bg-rose-500 text-white font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Eraser"
        >
          <Eraser className="w-5 h-5" />
        </button>
      </div>

      {/* Brush Size Selector */}
      <div className="flex items-center gap-2 px-2 bg-slate-900/60 py-1.5 rounded-xl border border-slate-800">
        <span className="text-xs text-slate-400 font-medium">Size:</span>
        {[3, 6, 12, 20].map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => {
              audioService.playButtonClick();
              onSizeChange(size);
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              brushSize === size
                ? 'bg-slate-700 text-cyan-400 border border-cyan-400/50'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div
              className="rounded-full bg-current"
              style={{ width: Math.max(3, size / 1.5), height: Math.max(3, size / 1.5) }}
            />
          </button>
        ))}
      </div>

      {/* Color Palette */}
      <ColorPicker activeColor={activeColor} onSelectColor={onColorChange} />

      {/* Actions: Undo & Clear */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleUndo}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
          title="Undo last stroke"
        >
          <Undo2 className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="p-2 rounded-xl bg-rose-950/60 text-rose-300 hover:bg-rose-900/80 transition-all border border-rose-800/40"
          title="Clear canvas"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
