import { describe, it, expect } from 'vitest';
import { ScoringService } from '../services/scoringService.js';

describe('11-Point Scoring Service Rules', () => {
  it('awards exactly 11 points for the 1st correct guess', () => {
    const points = ScoringService.getGuesserPoints(1, 'NORMAL');
    expect(points).toBe(11);
  });

  it('awards 7 points for the 2nd correct guess', () => {
    const points = ScoringService.getGuesserPoints(2, 'NORMAL');
    expect(points).toBe(7);
  });

  it('awards 5 points for the 3rd correct guess', () => {
    const points = ScoringService.getGuesserPoints(3, 'NORMAL');
    expect(points).toBe(5);
  });

  it('awards 3 points for the 4th correct guess', () => {
    const points = ScoringService.getGuesserPoints(4, 'NORMAL');
    expect(points).toBe(3);
  });

  it('awards 1 point for 5th through 11th correct guesses', () => {
    for (let order = 5; order <= 11; order++) {
      expect(ScoringService.getGuesserPoints(order, 'NORMAL')).toBe(1);
    }
  });

  it('awards drawer 11 points if at least 1 player guessed correctly', () => {
    const result = ScoringService.getDrawerPoints(1, 'NORMAL');
    expect(result.points).toBe(11);
    expect(result.bonus).toBe(false);
  });

  it('awards drawer 0 points if nobody guessed correctly', () => {
    const result = ScoringService.getDrawerPoints(0, 'NORMAL');
    expect(result.points).toBe(0);
    expect(result.bonus).toBe(false);
  });

  it('awards drawer +5 bonus points (total 16) if 8 or more players guess correctly', () => {
    const result8 = ScoringService.getDrawerPoints(8, 'NORMAL');
    expect(result8.points).toBe(16);
    expect(result8.bonus).toBe(true);

    const result10 = ScoringService.getDrawerPoints(10, 'NORMAL');
    expect(result10.points).toBe(16);
    expect(result10.bonus).toBe(true);
  });

  it('doubles all points in DOUBLE11 mode', () => {
    expect(ScoringService.getGuesserPoints(1, 'DOUBLE11')).toBe(22);
    expect(ScoringService.getGuesserPoints(2, 'DOUBLE11')).toBe(14);
    expect(ScoringService.getGuesserPoints(3, 'DOUBLE11')).toBe(10);
    expect(ScoringService.getDrawerPoints(1, 'DOUBLE11').points).toBe(22);
    expect(ScoringService.getDrawerPoints(8, 'DOUBLE11').points).toBe(32);
  });
});
