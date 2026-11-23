import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DrawStroke, DrawPoint } from '../types/game';
import { renderStroke, getCanvasCoordinates } from '../utils/drawing';
import socketService from '../services/socketService';

interface DrawingCanvasProps {
  isDrawer: boolean;
  strokes: DrawStroke[];
  activeTool: 'pencil' | 'brush' | 'eraser';
  activeColor: string;
  brushSize: number;
  roomCode: string;
  onStrokeComplete?: (stroke: DrawStroke) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  isDrawer,
  strokes,
  activeTool,
  activeColor,
  brushSize,
  roomCode,
  onStrokeComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const currentPointsRef = useRef<DrawPoint[]>([]);

  // Repaint all strokes whenever strokes array updates
  const redrawAllStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach((stroke) => renderStroke(ctx, stroke));
  }, [strokes]);

  useEffect(() => {
    redrawAllStrokes();
  }, [redrawAllStrokes]);

  // Pointer event handlers (Works for both touch and mouse)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const point = getCanvasCoordinates(canvas, e.clientX, e.clientY);
    currentPointsRef.current = [point];

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const liveStroke: DrawStroke = {
        points: [point],
        color: activeColor,
        size: brushSize,
        tool: activeTool,
      };
      renderStroke(ctx, liveStroke);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawer || !isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getCanvasCoordinates(canvas, e.clientX, e.clientY);
    currentPointsRef.current.push(point);

    const ctx = canvas.getContext('2d');
    if (ctx && currentPointsRef.current.length >= 2) {
      const len = currentPointsRef.current.length;
      const subStroke: DrawStroke = {
        points: [currentPointsRef.current[len - 2], currentPointsRef.current[len - 1]],
        color: activeColor,
        size: brushSize,
        tool: activeTool,
      };
      renderStroke(ctx, subStroke);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawer || !isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {}

    isDrawingRef.current = false;

    if (currentPointsRef.current.length > 0) {
      const completedStroke: DrawStroke = {
        points: [...currentPointsRef.current],
        color: activeColor,
        size: brushSize,
        tool: activeTool,
      };

      currentPointsRef.current = [];

      // Emit stroke through Socket.IO
      socketService.emit('DRAW_STROKE', {
        roomCode,
        stroke: completedStroke,
      });

      if (onStrokeComplete) {
        onStrokeComplete(completedStroke);
      }
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] max-h-[520px] bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 touch-none">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className={`w-full h-full block ${isDrawer ? 'cursor-crosshair' : 'cursor-default'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {!isDrawer && (
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-cyan-300 border border-cyan-500/30">
          👀 Spectating Drawer
        </div>
      )}
    </div>
  );
};
