import { describe, it, expect } from 'vitest';
import { ObjectService } from '../services/objectService.js';
import { GAME_OBJECTS } from '../data/objects.js';

describe('Object Database & Guess Normalization', () => {
  it('contains at least 200 enabled game objects', () => {
    const all = ObjectService.getAllObjects();
    expect(all.length).toBeGreaterThanOrEqual(200);
    expect(GAME_OBJECTS.length).toBeGreaterThanOrEqual(200);
  });

  it('normalizes guesses by lowercasing and stripping punctuation and spaces', () => {
    expect(ObjectService.normalizeGuess('  Ice Cream!  ')).toBe('icecream');
    expect(ObjectService.normalizeGuess('Hot-Air Balloon?')).toBe('hotairballoon');
    expect(ObjectService.normalizeGuess('Washing Machine...')).toBe('washingmachine');
  });

  it('validates exact matches and acceptable synonyms', () => {
    const target = 'Television';
    const synonyms = ['tv', 'telly', 'monitor', 'screen'];

    expect(ObjectService.isCorrectGuess('television', target, synonyms)).toBe(true);
    expect(ObjectService.isCorrectGuess('TV', target, synonyms)).toBe(true);
    expect(ObjectService.isCorrectGuess('telly', target, synonyms)).toBe(true);
    expect(ObjectService.isCorrectGuess('radio', target, synonyms)).toBe(false);
  });

  it('detects close guesses off by 1 character (Levenshtein distance)', () => {
    expect(ObjectService.isCloseGuess('elefant', 'elephant')).toBe(true);
    expect(ObjectService.isCloseGuess('bannana', 'banana')).toBe(true);
    expect(ObjectService.isCloseGuess('cat', 'dog')).toBe(false);
  });
});
