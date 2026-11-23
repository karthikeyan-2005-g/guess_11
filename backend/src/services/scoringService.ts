export class ScoringService {
  /**
   * Calculates points for a guesser based on order of correct guess
   * 1st = 11, 2nd = 7, 3rd = 5, 4th = 3, remaining = 1
   */
  static getGuesserPoints(guessOrder: number, gameMode: string = 'NORMAL'): number {
    let base = 1;
    if (guessOrder === 1) {
      base = 11;
    } else if (guessOrder === 2) {
      base = 7;
    } else if (guessOrder === 3) {
      base = 5;
    } else if (guessOrder === 4) {
      base = 3;
    } else {
      base = 1;
    }

    if (gameMode === 'DOUBLE11') {
      return base * 2;
    }

    return base;
  }

  /**
   * Calculates points for the drawer at the end of the round
   * +11 points if at least 1 player guessed correctly
   * +5 bonus points if 8 or more players correctly guessed
   */
  static getDrawerPoints(totalCorrectGuessers: number, gameMode: string = 'NORMAL'): { points: number; bonus: boolean } {
    if (totalCorrectGuessers === 0) {
      return { points: 0, bonus: false };
    }

    let base = 11;
    const hasBonus = totalCorrectGuessers >= 8;
    if (hasBonus) {
      base += 5;
    }

    if (gameMode === 'DOUBLE11') {
      base *= 2;
    }

    return { points: base, bonus: hasBonus };
  }
}
