import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { UserService } from '../services/userService.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/auth/register
router.post('/register', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'ACCOUNT CREATED SUCCESSFULLY! Welcome to GUESS THE ELEVEN.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'WELCOME BACK!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token is required.' });
      return;
    }
    const result = await AuthService.refreshToken(refreshToken);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.requestPasswordReset(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await UserService.getProfile(req.user!.id);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

export default router;
