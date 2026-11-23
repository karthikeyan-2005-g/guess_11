import { Router, Response, NextFunction } from 'express';
import { UserService } from '../services/userService.js';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/profile
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await UserService.getProfile(req.user!.id);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

// PUT /api/profile
router.put('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await UserService.updateProfile(req.user!.id, req.body);
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
});

// POST /api/profile/change-password
router.post('/change-password', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.changePassword(req.user!.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
