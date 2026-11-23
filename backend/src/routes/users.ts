import { Router, Response, NextFunction } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import prisma from '../config/db.js';

const router = Router();

// GET /api/users/leaderboard - Global leaderboard
router.get('/leaderboard', async (req, res, next) => {
  try {
    const topStats = await prisma.gameStatistics.findMany({
      take: 20,
      orderBy: { totalScore: 'desc' },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            profile: { select: { avatar: true } },
          },
        },
      },
    });

    const leaderboard = topStats.map((stat, idx) => ({
      rank: idx + 1,
      userId: stat.user.userId,
      username: stat.user.username,
      avatar: stat.user.profile?.avatar || 'avatar-1',
      totalScore: stat.totalScore,
      bestScore: stat.bestScore,
      gamesWon: stat.gamesWon,
      gamesPlayed: stat.gamesPlayed,
      winPercentage: stat.winPercentage,
    }));

    res.json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
});

// Admin routes
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
      return;
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        userId: true,
        username: true,
        email: true,
        role: true,
        isBanned: true,
        createdAt: true,
        profile: true,
        statistics: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

export default router;
