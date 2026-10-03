export interface Player {
  id: number;
  name: string;
  xp: number;
  coins: number;
  currentLevel: number;
  totalMatches: number;
  wins: number;
  losses: number;
  currentStreak: number;
  longestStreak: number;
  totalAnswers: number;
  correctAnswers: number;
  fastestAnswerSec: number;
  lastMatchTimestamp: number;
  winRate: number;
  accuracy: number;
  playerRankTitle: string;
  xpForNextRank: number;
}

export function createInitialPlayer(savedName = 'لاعب روندو'): Player {
  const xp = 0;
  return {
    id: 1,
    name: savedName,
    xp,
    coins: 100,
    currentLevel: 1,
    totalMatches: 0,
    wins: 0,
    losses: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalAnswers: 0,
    correctAnswers: 0,
    fastestAnswerSec: 0,
    lastMatchTimestamp: 0,
    winRate: 0,
    accuracy: 100,
    playerRankTitle: getPlayerRank(xp),
    xpForNextRank: getXpForNextRank(xp),
  };
}

export function getPlayerRank(xp: number): string {
  if (xp >= 5000) return 'أسطورة الروندو 👑 (Legend)';
  if (xp >= 3000) return 'موسوعة كروية 🧠 (Master)';
  if (xp >= 1500) return 'لاعب نخبة ⚡ (Elite)';
  if (xp >= 500) return 'منافس محترف ⚽ (Pro)';
  return 'مبتدئ كرة قدم 👟 (Rookie)';
}

export function getXpForNextRank(xp: number): number {
  if (xp < 500) return 500;
  if (xp < 1500) return 1500;
  if (xp < 3000) return 3000;
  if (xp < 5000) return 5000;
  return 10000;
}
