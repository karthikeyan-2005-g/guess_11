import { GAME_OBJECTS, GameObject } from '../data/objects.js';

export class ObjectService {
  private static objects: GameObject[] = [...GAME_OBJECTS];

  static getAllObjects(): GameObject[] {
    return this.objects.filter((o) => o.enabled);
  }

  static getObjectById(id: string): GameObject | undefined {
    return this.objects.find((o) => o.id === id);
  }

  static getRandomObject(excludeIds: string[] = [], category?: string, difficulty?: string): GameObject {
    let pool = this.objects.filter((o) => o.enabled && !excludeIds.includes(o.id));

    if (category && category !== 'All') {
      const catPool = pool.filter((o) => o.category.toLowerCase() === category.toLowerCase());
      if (catPool.length > 0) pool = catPool;
    }

    if (difficulty) {
      const diffPool = pool.filter((o) => o.difficulty === difficulty);
      if (diffPool.length > 0) pool = diffPool;
    }

    if (pool.length === 0) {
      pool = this.objects.filter((o) => o.enabled);
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  static normalizeGuess(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '');
  }

  static isCorrectGuess(guess: string, targetName: string, synonyms: string[] = []): boolean {
    const normGuess = this.normalizeGuess(guess);
    const normTarget = this.normalizeGuess(targetName);

    if (normGuess === normTarget) return true;

    for (const syn of synonyms) {
      if (normGuess === this.normalizeGuess(syn)) {
        return true;
      }
    }

    return false;
  }

  static isCloseGuess(guess: string, targetName: string): boolean {
    const normGuess = this.normalizeGuess(guess);
    const normTarget = this.normalizeGuess(targetName);

    if (normGuess.length < 3) return false;

    const dist = this.levenshtein(normGuess, normTarget);
    return dist === 1 || (normTarget.length >= 6 && dist === 2);
  }

  public static levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}
