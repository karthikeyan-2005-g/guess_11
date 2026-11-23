import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'guess_the_eleven_jwt_access_secret_super_secure_key_2025',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'guess_the_eleven_jwt_refresh_secret_super_secure_key_2025',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  DEFAULT_ROUND_TIME: parseInt(process.env.DEFAULT_ROUND_TIME || '90', 10),
  MAX_PLAYERS_PER_ROOM: parseInt(process.env.MAX_PLAYERS_PER_ROOM || '11', 10),
  TOTAL_ROUNDS: parseInt(process.env.TOTAL_ROUNDS || '11', 10),
};
