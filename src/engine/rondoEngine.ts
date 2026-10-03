import { ArabicNormalizer } from './arabicNormalizer';
import { ALL_PLAYERS } from '../data/footballCatalog';
import { FootballCategory, FootballPlayer, ValidationStatus, AIDifficulty } from '../types/rondo';

export class RondoEngine {
  /**
   * Finds matching players from text query using normalized matching
   */
  public static resolvePlayers(query: string, limit = 5): FootballPlayer[] {
    const raw = query.trim();
    if (!raw) return [];

    const norm = ArabicNormalizer.normalize(raw);
    const stripped = ArabicNormalizer.stripAl(raw);

    const scored: { player: FootballPlayer; score: number }[] = [];

    for (const player of ALL_PLAYERS) {
      const names = [
        player.canonicalName,
        player.arabicName,
        player.englishName,
        ...player.aliases,
        ...player.shortNames,
      ];

      let bestScore = 0;

      for (const name of names) {
        const normName = ArabicNormalizer.normalize(name);
        const strippedName = ArabicNormalizer.stripAl(name);

        if (normName === norm || strippedName === stripped) {
          bestScore = Math.max(bestScore, 100);
          break;
        }

        if (normName.startsWith(norm) || strippedName.startsWith(stripped)) {
          bestScore = Math.max(bestScore, 85);
        } else if (normName.includes(norm) || strippedName.includes(stripped)) {
          bestScore = Math.max(bestScore, 70);
        } else if (norm.length >= 3) {
          const sim = ArabicNormalizer.similarity(normName, norm);
          if (sim >= 0.8) {
            bestScore = Math.max(bestScore, Math.round(sim * 60));
          }
        }
      }

      if (bestScore > 0) {
        scored.push({ player, score: bestScore });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.player);
  }

  /**
   * Validates a player input against current category and used players
   */
  public static validateAnswer(
    query: string,
    category: FootballCategory,
    usedPlayerIds: Set<string>
  ): ValidationStatus {
    const matches = this.resolvePlayers(query, 1);

    if (matches.length === 0) {
      return { type: 'NOT_FOUND', query };
    }

    const player = matches[0];

    if (usedPlayerIds.has(player.id)) {
      return { type: 'ALREADY_USED', player };
    }

    const satisfies = category.predicate(player);
    if (!satisfies) {
      return {
        type: 'CATEGORY_MISMATCH',
        player,
        reasonAr: `اللاعب (${player.arabicName}) لا يستوفي شروط الفئة الحالية!`,
      };
    }

    return { type: 'VALID', player };
  }

  /**
   * Picks a response for the AI opponent
   */
  public static pickAIPlayer(
    category: FootballCategory,
    usedPlayerIds: Set<string>,
    difficulty: AIDifficulty = 'NORMAL'
  ): { player: FootballPlayer; thinkingSeconds: number } | null {
    const candidates = ALL_PLAYERS.filter(
      (p) => category.predicate(p) && !usedPlayerIds.has(p.id)
    );

    if (candidates.length === 0) {
      return null;
    }

    // AI thinking delay based on difficulty
    let thinkingSeconds = 2.2;
    let pool = candidates;

    if (difficulty === 'EASY') {
      thinkingSeconds = Math.max(2.5, category.timerSeconds * 0.65);
      pool = candidates.filter((c) => c.isCommon);
    } else if (difficulty === 'NORMAL') {
      thinkingSeconds = Math.max(1.8, category.timerSeconds * 0.5);
    } else if (difficulty === 'HARD') {
      thinkingSeconds = Math.max(1.2, category.timerSeconds * 0.35);
    } else {
      // LEGEND
      thinkingSeconds = Math.max(0.8, category.timerSeconds * 0.25);
    }

    if (pool.length === 0) pool = candidates;

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    return { player: chosen, thinkingSeconds };
  }
}
