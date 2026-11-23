import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { initializeSockets } from './sockets/index.js';
import { getLocalIp } from './routes/health.js';

const app = createApp();
const server = http.createServer(app);

// Initialize Socket.IO with dynamic CORS for cross-device & mobile play
export const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 30000,
  pingInterval: 10000,
});

initializeSockets(io);

const PORT = ENV.PORT;
const localIp = getLocalIp();

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 GUESS THE ELEVEN - Multi-device Multiplayer Server`);
    console.log(`🎯 Tagline: DRAW IT. GUESS IT. SCORE 11.`);
    console.log(`💻 Local Machine:       http://localhost:${PORT}`);
    console.log(`📱 Friends on Mobile:   http://${localIp}:5173`);
    console.log(`🔌 WebSocket Server:    ws://${localIp}:${PORT}`);
    console.log(`=======================================================`);
  });
}

export { server, app };
