import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { initializeSockets } from './sockets/index.js';
import { getLocalIp } from './routes/health.js';
import { prisma } from './config/db.js';
import { GAME_OBJECTS } from './data/objects.js';

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

async function ensureDatabaseInitialized() {
  try {
    const count = await prisma.drawingObject.count().catch(() => 0);
    if (count === 0) {
      console.log('📦 Auto-seeding initial game objects...');
      for (const obj of GAME_OBJECTS) {
        await prisma.drawingObject.upsert({
          where: { name: obj.name },
          update: {},
          create: {
            id: obj.id,
            name: obj.name,
            category: obj.category,
            difficulty: obj.difficulty,
            synonyms: obj.synonyms.join(','),
            enabled: obj.enabled,
          },
        });
      }
      console.log(`✅ Loaded ${GAME_OBJECTS.length} drawing objects.`);
    }
  } catch (err: any) {
    console.warn('Database auto-seed notice:', err.message);
  }
}

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, '0.0.0.0', async () => {
    await ensureDatabaseInitialized();
    console.log(`=======================================================`);
    console.log(`🚀 GUESS THE ELEVEN - Multi-device Multiplayer Server`);
    console.log(`🎯 Tagline: DRAW IT. GUESS IT. SCORE 11.`);
    console.log(`💻 Local Machine:       http://localhost:${PORT}`);
    console.log(`📱 Friends on Mobile:   http://${localIp}:5173`);
    console.log(`🔌 WebSocket Server:    ws://${localIp}:${PORT}`);
    console.log(`☁️  Cloud / 24/7 Mode:   Port ${PORT} Ready`);
    console.log(`=======================================================`);
  });
}

export { server, app };
