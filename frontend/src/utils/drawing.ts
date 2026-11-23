import { DrawPoint, DrawStroke } from '../types/game';

export function renderStroke(ctx: CanvasRenderingContext2D, stroke: DrawStroke) {
  if (stroke.points.length === 0) return;

  ctx.save();
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (stroke.tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = stroke.size * 2;
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
  }

  const p0 = stroke.points[0];
  ctx.moveTo(p0.x, p0.y);

  if (stroke.points.length === 1) {
    ctx.arc(p0.x, p0.y, stroke.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = stroke.tool === 'eraser' ? 'rgba(0,0,0,1)' : stroke.color;
    ctx.fill();
    ctx.restore();
    return;
  }

  // Smooth quadratic curves
  for (let i = 1; i < stroke.points.length - 1; i++) {
    const xc = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
    const yc = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
    ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
  }

  const last = stroke.points[stroke.points.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
  ctx.restore();
}

export function getCanvasCoordinates(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): DrawPoint {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}
