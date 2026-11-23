import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { updateProfileSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validation.js';
import { AuthService } from './authService.js';
import crypto from 'crypto';

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        statistics: true,
      },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found.' };
    }

    return {
      user: AuthService.sanitizeUser(user),
      statistics: user.statistics || {
        gamesPlayed: 0,
        gamesWon: 0,
        totalScore: 0,
        bestScore: 0,
        correctGuesses: 0,
        drawingRounds: 0,
        winPercentage: 0,
      },
    };
  }

  static async updateProfile(userId: string, data: unknown) {
    const validated = updateProfileSchema.parse(data);

    if (validated.username) {
      await prisma.user.update({
        where: { id: userId },
        data: { username: validated.username },
      });
    }

    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...(validated.avatar ? { avatar: validated.avatar } : {}),
        ...(validated.fullName !== undefined ? { fullName: validated.fullName } : {}),
        ...(validated.bio !== undefined ? { bio: validated.bio } : {}),
        ...(validated.favoriteCategory ? { favoriteCategory: validated.favoriteCategory } : {}),
      },
      create: {
        userId,
        avatar: validated.avatar || 'avatar-1',
        fullName: validated.fullName || null,
        bio: validated.bio || null,
        favoriteCategory: validated.favoriteCategory || 'General',
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, statistics: true },
    });

    return AuthService.sanitizeUser(user);
  }

  static async changePassword(userId: string, data: unknown) {
    const validated = changePasswordSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found.' };
    }

    const isMatch = await bcrypt.compare(validated.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw { statusCode: 400, message: 'Current password is incorrect.' };
    }

    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(validated.newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { success: true, message: 'Password updated successfully.' };
  }

  static async requestPasswordReset(data: unknown) {
    const validated = forgotPasswordSchema.parse(data);

    const user = await prisma.user.findFirst({
      where: { email: validated.email.toLowerCase() },
    });

    // Security best practice: don't reveal if email doesn't exist
    if (!user) {
      return {
        success: true,
        message: 'If an account with that email exists, reset instructions have been generated.',
      };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    return {
      success: true,
      message: 'If an account with that email exists, reset instructions have been generated.',
      // Reset token returned for development environment testing convenience
      ...(process.env.NODE_ENV === 'development' ? { devResetToken: token } : {}),
    };
  }

  static async resetPassword(data: unknown) {
    const validated = resetPasswordSchema.parse(data);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: validated.token },
      include: { user: true },
    });

    if (!resetToken || resetToken.isUsed || resetToken.expiresAt < new Date()) {
      throw { statusCode: 400, message: 'Invalid or expired password reset token.' };
    }

    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(validated.newPassword, salt);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash: newHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { isUsed: true },
      }),
    ]);

    return { success: true, message: 'Password has been reset successfully. You can now log in.' };
  }

  static async updateGameStatistics(
    userId: string,
    stats: {
      points: number;
      won: boolean;
      correctGuesses: number;
      drewRound: boolean;
    }
  ) {
    const current = await prisma.gameStatistics.findUnique({
      where: { userId },
    });

    const gamesPlayed = (current?.gamesPlayed || 0) + 1;
    const gamesWon = (current?.gamesWon || 0) + (stats.won ? 1 : 0);
    const totalScore = (current?.totalScore || 0) + stats.points;
    const bestScore = Math.max(current?.bestScore || 0, stats.points);
    const correctGuesses = (current?.correctGuesses || 0) + stats.correctGuesses;
    const drawingRounds = (current?.drawingRounds || 0) + (stats.drewRound ? 1 : 0);
    const winPercentage = Number(((gamesWon / gamesPlayed) * 100).toFixed(1));

    return prisma.gameStatistics.upsert({
      where: { userId },
      update: {
        gamesPlayed,
        gamesWon,
        totalScore,
        bestScore,
        correctGuesses,
        drawingRounds,
        winPercentage,
      },
      create: {
        userId,
        gamesPlayed,
        gamesWon,
        totalScore,
        bestScore,
        correctGuesses,
        drawingRounds,
        winPercentage,
      },
    });
  }
}
