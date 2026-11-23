import { describe, it, expect, afterAll } from 'vitest';
import { AuthService } from '../services/authService.js';
import { verifyAccessToken } from '../utils/token.js';
import prisma from '../config/db.js';

describe('Authentication & Security Service', () => {
  const testUserId = `test_${Date.now()}`;
  const testEmail = `${testUserId}@example.com`;

  afterAll(async () => {
    try {
      await prisma.user.deleteMany({
        where: {
          OR: [{ userId: testUserId }, { email: testEmail }],
        },
      });
      await prisma.$disconnect();
    } catch {}
  });

  it('successfully registers a new user with secure password hash and tokens', async () => {
    const result = await AuthService.register({
      userId: testUserId,
      username: 'Test Master',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
      avatar: 'avatar-1',
    });

    expect(result.user.userId).toBe(testUserId);
    expect(result.user.username).toBe('Test Master');
    expect(result.tokens.accessToken).toBeDefined();
    expect(result.tokens.refreshToken).toBeDefined();

    // Verify password hash is never exposed to sanitized output
    expect((result.user as any).passwordHash).toBeUndefined();

    // Verify token can be verified
    const payload = verifyAccessToken(result.tokens.accessToken);
    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe(testUserId);
  });

  it('rejects registration with duplicate User ID', async () => {
    await expect(
      AuthService.register({
        userId: testUserId,
        username: 'Duplicate Player',
        email: `another_${Date.now()}@example.com`,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        avatar: 'avatar-2',
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      message: expect.stringContaining('User ID is already taken'),
    });
  });

  it('rejects registration with duplicate email', async () => {
    await expect(
      AuthService.register({
        userId: `new_${Date.now()}`,
        username: 'New Player',
        email: testEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        avatar: 'avatar-3',
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      message: expect.stringContaining('email address already exists'),
    });
  });

  it('successfully logs in with valid User ID and password', async () => {
    const result = await AuthService.login({
      userId: testUserId,
      password: 'Password123!',
    });

    expect(result.user.userId).toBe(testUserId);
    expect(result.tokens.accessToken).toBeDefined();
  });

  it('rejects login with invalid password using generic message', async () => {
    await expect(
      AuthService.login({
        userId: testUserId,
        password: 'WrongPassword999!',
      })
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'INVALID USER ID OR PASSWORD.',
    });
  });

  it('rejects login with non-existent User ID using generic message', async () => {
    await expect(
      AuthService.login({
        userId: 'non_existent_player_xyz',
        password: 'Password123!',
      })
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'INVALID USER ID OR PASSWORD.',
    });
  });

  it('rotates refresh tokens when refreshing access token', async () => {
    const loginRes = await AuthService.login({
      userId: testUserId,
      password: 'Password123!',
    });

    const refreshed = await AuthService.refreshToken(loginRes.tokens.refreshToken);
    expect(refreshed.tokens.accessToken).toBeDefined();
    expect(refreshed.tokens.refreshToken).toBeDefined();
    expect(refreshed.tokens.refreshToken).not.toBe(loginRes.tokens.refreshToken);
  });
});
