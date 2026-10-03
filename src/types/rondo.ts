export type CategoryDifficulty =
  | 'ROOKIE'
  | 'BEGINNER'
  | 'RISING'
  | 'INTERMEDIATE'
  | 'COMPETITOR'
  | 'ADVANCED'
  | 'EXPERT'
  | 'ELITE'
  | 'LEGEND'
  | 'BOSS';

export interface DifficultyConfig {
  titleAr: string;
  titleEn: string;
  defaultTimerSeconds: number;
  scoreMultiplier: number;
  badgeColor: string;
}

export const DIFFICULTY_CONFIG: Record<CategoryDifficulty, DifficultyConfig> = {
  ROOKIE: { titleAr: 'مبتدئ جداً', titleEn: 'Rookie', defaultTimerSeconds: 6, scoreMultiplier: 1.0, badgeColor: 'bg-emerald-600' },
  BEGINNER: { titleAr: 'مبتدئ', titleEn: 'Beginner', defaultTimerSeconds: 6, scoreMultiplier: 1.1, badgeColor: 'bg-green-600' },
  RISING: { titleAr: 'صاعد', titleEn: 'Rising', defaultTimerSeconds: 5, scoreMultiplier: 1.2, badgeColor: 'bg-teal-600' },
  INTERMEDIATE: { titleAr: 'متوسط', titleEn: 'Intermediate', defaultTimerSeconds: 5, scoreMultiplier: 1.4, badgeColor: 'bg-blue-600' },
  COMPETITOR: { titleAr: 'منافس', titleEn: 'Competitor', defaultTimerSeconds: 4, scoreMultiplier: 1.6, badgeColor: 'bg-indigo-600' },
  ADVANCED: { titleAr: 'متقدم', titleEn: 'Advanced', defaultTimerSeconds: 4, scoreMultiplier: 1.8, badgeColor: 'bg-purple-600' },
  EXPERT: { titleAr: 'خبير', titleEn: 'Expert', defaultTimerSeconds: 4, scoreMultiplier: 2.0, badgeColor: 'bg-amber-600' },
  ELITE: { titleAr: 'نخبة', titleEn: 'Elite', defaultTimerSeconds: 3.5, scoreMultiplier: 2.2, badgeColor: 'bg-orange-600' },
  LEGEND: { titleAr: 'أسطوري', titleEn: 'Legend', defaultTimerSeconds: 3, scoreMultiplier: 2.5, badgeColor: 'bg-rose-600' },
  BOSS: { titleAr: 'الزعيم', titleEn: 'Boss', defaultTimerSeconds: 3, scoreMultiplier: 3.0, badgeColor: 'bg-red-600' },
};

export interface FootballPlayer {
  id: string;
  canonicalName: string;
  arabicName: string;
  englishName: string;
  aliases: string[];
  shortNames: string[];
  clubHistory: string[];
  nationalTeams: string[];
  competitions: string[];
  achievements: string[];
  positions: string[];
  isCommon: boolean;
  notableStats: string;
  avatarEmoji?: string;
}

export interface FootballCategory {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  difficulty: CategoryDifficulty;
  timerSeconds: number;
  levelNumber: number;
  iconEmoji: string;
  predicate: (player: FootballPlayer) => boolean;
}

export type RondoPhase =
  | 'READY'
  | 'COUNTDOWN'
  | 'PLAYING'
  | 'PASS_SUCCESS'
  | 'TIMEOUT_FOUL'
  | 'MATCH_OVER';

export type GameMode = 'QUICK' | 'LEVEL' | 'LOCAL_2P' | 'DAILY';
export type AIDifficulty = 'EASY' | 'NORMAL' | 'HARD' | 'LEGEND';

export interface PassRecord {
  player: FootballPlayer;
  passer: 'P1' | 'P2' | 'AI';
  passerName: string;
  timeSpentSeconds: number;
  roundNumber: number;
  timestamp: number;
}

export type ValidationStatus =
  | { type: 'VALID'; player: FootballPlayer }
  | { type: 'ALREADY_USED'; player: FootballPlayer }
  | { type: 'CATEGORY_MISMATCH'; player: FootballPlayer; reasonAr: string }
  | { type: 'NOT_FOUND'; query: string };
