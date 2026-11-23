import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { generateTokens, verifyRefreshToken } from '../utils/token.js';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { SanitizedUser } from '../types/auth.js';

export class AuthService {
  static sanitizeUser(user: any): SanitizedUser {
    return {
      id: user.id,
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.profile?.avatar || 'avatar-1',
      fullName: user.profile?.fullName,
      bio: user.profile?.bio,
      favoriteCategory: user.profile?.favoriteCategory || 'General',
      createdAt: user.createdAt,
    };
  }

  static async register(data: unknown) {
    const validated = registerSchema.parse(data);

    // Check unique userId
    const existingUserId = await prisma.user.findFirst({
      where: { userId: { equals: validated.userId } },
    });
    if (existingUserId) {
      throw { statusCode: 409, message: 'User ID is already taken. Please choose another.' };
    }

    // Check unique email
    const existingEmail = await prisma.user.findFirst({
      where: { email: { equals: validated.email.toLowerCase() } },
    });
    if (existingEmail) {
      throw { statusCode: 409, message: 'An account with this email address already exists.' };
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    // Create user with transaction
    const newUser = await prisma.user.create({
      data: {
        userId: validated.userId,
        username: validated.username,
        email: validated.email.toLowerCase(),
        passwordHash,
        profile: {
          create: {
            avatar: validated.avatar || 'avatar-1',
            fullName: validated.fullName || null,
            favoriteCategory: 'General',
          },
        },
        statistics: {
          create: {
            gamesPlayed: 0,
            gamesWon: 0,
            totalScore: 0,
            bestScore: 0,
            correctGuesses: 0,
            drawingRounds: 0,
            winPercentage: 0.0,
          },
        },
      },
      include: {
        profile: true,
        statistics: true,
      },
    });

    const tokens = generateTokens({
      id: newUser.id,
      userId: newUser.userId,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        userId: newUser.id,
        token: tokens.refreshToken,
        expiresAt,
      },
    });

    return {
      user: this.sanitizeUser(newUser),
      tokens,
    };
  }

  static async login(data: unknown) {
    const validated = loginSchema.parse(data);

    // Find by userId or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { userId: { equals: validated.userId } },
          { email: { equals: validated.userId.toLowerCase() } },
        ],
      },
      include: {
        profile: true,
        statistics: true,
      },
    });

    if (!user) {
      throw { statusCode: 401, message: 'INVALID USER ID OR PASSWORD.' };
    }

    if (user.isBanned) {
      throw { statusCode: 403, message: 'This account has been suspended. Please contact support.' };
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      throw { statusCode: 401, message: 'INVALID USER ID OR PASSWORD.' };
    }

    const tokens = generateTokens({
      id: user.id,
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt,
      },
    });

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  static async refreshToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw { statusCode: 401, message: 'Invalid or expired refresh token.' };
    }

    const savedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (!savedToken || savedToken.isRevoked || savedToken.expiresAt < new Date()) {
      throw { statusCode: 401, message: 'Refresh token has expired or been revoked.' };
    }

    // Revoke old token and generate new ones (token rotation)
    await prisma.refreshToken.update({
      where: { id: savedToken.id },
      data: { isRevoked: true },
    });

    const user = savedToken.user;
    const tokens = generateTokens({
      id: user.id,
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: newExpiresAt,
      },
    });

    return {
      tokens,
      user: this.sanitizeUser(user),
    };
  }

  static async logout(refreshToken?: string) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { isRevoked: true },
      });
    }
    return { success: true };
  }
}
