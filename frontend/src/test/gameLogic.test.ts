import { describe, it, expect } from 'vitest';
import { normalizeGuess } from '../utils/normalizeGuess';
import { getPointsForOrder } from '../utils/scoring';
import { validateUserId, validatePassword } from '../utils/validation';

describe('Frontend Game Logic & Validation', () => {
  it('correctly calculates points by guess order', () => {
    expect(getPointsForOrder(1)).toBe(11);
    expect(getPointsForOrder(2)).toBe(7);
    expect(getPointsForOrder(3)).toBe(5);
    expect(getPointsForOrder(4)).toBe(3);
    expect(getPointsForOrder(5)).toBe(1);
    expect(getPointsForOrder(11)).toBe(1);
  });

  it('normalizes guesses cleanly', () => {
    expect(normalizeGuess('  Smart Phone! ')).toBe('smartphone');
    expect(normalizeGuess('Frying-Pan')).toBe('fryingpan');
  });

  it('validates User ID according to requirements', () => {
    expect(validateUserId('player11')).toBeNull();
    expect(validateUserId('p')).toBe('User ID must be at least 3 characters');
    expect(validateUserId('bad user!')).toBe('User ID can only contain letters, numbers, and underscores');
  });

  it('validates password length and strength', () => {
    expect(validatePassword('short').isValid).toBe(false);
    expect(validatePassword('Password123').isValid).toBe(true);
    expect(validatePassword('Password123!').strength).toBe('strong');
  });
});
