import { Server } from 'socket.io';
import { socketAuthMiddleware, AuthenticatedSocket } from './authSocket.js';
import { registerRoomHandlers } from './roomHandlers.js';
import { registerGameHandlers } from './gameHandlers.js';
import { registerDrawingHandlers } from './drawingHandlers.js';

export function initializeSockets(io: Server): void {
  // Socket Authentication Middleware
  io.use(socketAuthMiddleware as any);

  io.on('connection', (rawSocket) => {
    const socket = rawSocket as AuthenticatedSocket;
    const user = socket.data.user;

    console.log(`🔌 Player connected: ${user?.username} (${user?.userId}) [Socket: ${socket.id}]`);

    // Register event handlers
    registerRoomHandlers(io, socket);
    registerGameHandlers(io, socket);
    registerDrawingHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`❌ Player disconnected: ${user?.username} [Socket: ${socket.id}] Reason: ${reason}`);
    });
  });
}
