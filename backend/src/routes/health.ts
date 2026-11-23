import { Router } from 'express';
import os from 'os';
import { ObjectService } from '../services/objectService.js';
import { ENV } from '../config/env.js';

const router = Router();

export function getLocalIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    game: 'GUESS THE ELEVEN',
    tagline: 'DRAW IT. GUESS IT. SCORE 11.',
    objectsLoaded: ObjectService.getAllObjects().length,
  });
});

router.get('/network', (req, res) => {
  const localIp = getLocalIp();
  res.status(200).json({
    localIp,
    clientPort: 5173,
    serverPort: ENV.PORT,
    lanUrl: `http://${localIp}:5173`,
  });
});

export default router;
