import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import roomRoutes from './routes/rooms.js';
import userRoutes from './routes/users.js';
import healthRoutes from './routes/health.js';

export function createApp(): Express {
  const app = express();

  // Security Middleware
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginOpenerPolicy: { policy: 'unsafe-none' },
    })
  );

  // Allow all network origins (LAN IPs, localhost, mobile Capacitor, tunnels) with credentials
  app.use(
    cors({
      origin: (_origin, callback) => {
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));

  // General Rate Limiter
  app.use('/api', apiLimiter);

  // API Routes
  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/users', userRoutes);

  // Error Handling
  app.use(errorHandler);

  return app;
}
