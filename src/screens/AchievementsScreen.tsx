import React from 'react';
import { ArrowLeft, Trophy, Check, Lock, Coins, Sparkles } from 'lucide-react';

interface AchievementItem {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  rewardCoins: number;
  rewardXp: number;
  icon: string;
}

const DEFAULT_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first_win',
    title: 'ضربة البداية ⚽',
    description: 'حقق أول انتصار لك في مواجهة روندو ضد الذكاء الاصطناعي',
    unlocked: true,
    rewardCoins: 50,
    rewardXp: 100,
    icon: '⚽',
  },
  {
    id: 'streak_5',
    title: 'شعلة الروندو 🔥',
    description: 'حقق سلسلة من 5 تمريرات متتالية ناجحة بدون خطأ',
    unlocked: false,
    rewardCoins: 100,
    rewardXp: 200,
    icon: '🔥',
  },
  {
    id: 'streak_10',
    title: 'تيكي تاكا أسطورية 🪄',
    description: 'حقق سلسلة خارقة من 10 تمريرات ناجحة في جولة واحدة',
    unlocked: false,
    rewardCoins: 250,
    rewardXp: 500,
    icon: '🪄',
  },
  {
    id: 'level_5',
    title: 'بطل الكلاسيكو 👑',
    description: 'تخطَّ المستوى الخامس وتحدي نجوم برشلونة وريال مدريد',
    unlocked: false,
    rewardCoins: 200,
    rewardXp: 400,
    icon: '👑',
  },
  {
    id: 'level_10',
    title: 'قاهر الزعيم 🏆',
    description: 'أكمل جميع المستويات العشرة واهزم تحدي الزعيم الأسطوري',
    unlocked: false,
    rewardCoins: 500,
    rewardXp: 1000,
    icon: '🏆',
  },
  {
    id: 'speed_demon',
    title: 'برق الملاعب ⚡',
    description: 'نفذ تمريرة صحيحة في أقل من ثانية ونصف',
    unlocked: false,
    rewardCoins: 150,
    rewardXp: 300,
    icon: '⚡',
  },
];

interface AchievementsScreenProps {
  onBack: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ onBack }) => {
  const unlockedCount = DEFAULT_ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-5 space-y-4 animate-fade-in text-white" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>رجوع</span>
        </button>

        <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-rondo-gold" />
          <span>أوسمة وإنجازات الروندو</span>
        </h2>

        <div className="text-xs font-bold text-rondo-gold bg-rondo-gold/10 px-2.5 py-1 rounded-lg border border-rondo-gold/20">
          {unlockedCount} / {DEFAULT_ACHIEVEMENTS.length}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {DEFAULT_ACHIEVEMENTS.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all ${
              item.unlocked
                ? 'bg-slate-900/90 border-rondo-gold/40 shadow-pitch-card'
                : 'bg-[#1E293B]/40 border-white/5 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    item.unlocked
                      ? 'bg-gradient-to-tr from-rondo-goldDark via-rondo-gold to-rondo-goldLight text-black shadow-glow-gold'
                      : 'bg-slate-800 text-white/30 border border-white/10'
                  }`}
                >
                  {item.unlocked ? item.icon : <Lock className="w-5 h-5" />}
                </div>

                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5 max-w-xs">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] font-bold">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      +{item.rewardCoins} عملة
                    </span>
                    <span className="text-rondo-gold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      +{item.rewardXp} XP
                    </span>
                  </div>
                </div>
              </div>

              {item.unlocked && (
                <div className="p-1.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
