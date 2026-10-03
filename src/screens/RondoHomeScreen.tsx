import React from 'react';
import { Play, Users, Trophy, Calendar, Sparkles, HelpCircle } from 'lucide-react';
import { GameMode, AIDifficulty } from '../types/rondo';
import { ALL_PLAYERS } from '../data/footballCatalog';

interface RondoHomeScreenProps {
  onStartGame: (mode: GameMode, levelNumber?: number) => void;
  onOpenLevels: () => void;
  aiDifficulty: AIDifficulty;
  setAIDifficulty: (diff: AIDifficulty) => void;
  unlockedLevel: number;
}

export const RondoHomeScreen: React.FC<RondoHomeScreenProps> = ({
  onStartGame,
  onOpenLevels,
  aiDifficulty,
  setAIDifficulty,
  unlockedLevel,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 flex flex-col items-center animate-fade-in">
      {/* Stadium Hero Logo & Title */}
      <div className="text-center my-4 sm:my-6 relative">
        <div className="relative inline-block mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-pitch-mid via-pitch-vibrant to-rondo-gold p-1 shadow-glow-gold flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-4xl sm:text-5xl animate-bounce-subtle">
              ⚽
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-rondo-gold text-black font-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
            الكلاسيكية
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
          روندو <span className="gold-text-gradient">الكلاسيكية</span>
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-md mx-auto font-medium">
          تحدي سرعة البديهة الكروية في دائرة التمرير السريعة. اذكر اسم لاعب يحقق الشروط قبل نفاد الوقت ولا تكرر!
        </p>
      </div>

      {/* Main Action Modes Cards */}
      <div className="w-full space-y-3 sm:space-y-3.5">
        {/* 1. Quick Play vs AI */}
        <button
          onClick={() => onStartGame('QUICK')}
          className="w-full text-right p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-pitch-mid to-emerald-900 border-2 border-rondo-gold/70 hover:border-rondo-gold shadow-pitch-card hover:shadow-glow-gold transition-all active:scale-[0.99] group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rondo-gold text-black flex items-center justify-center font-black text-2xl group-hover:scale-110 transition shadow-md">
              <Play className="w-6 h-6 fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-rondo-gold transition">
                  مباراة سريعة ضد الذكاء الاصطناعي
                </h3>
                <span className="text-[10px] font-extrabold bg-rondo-gold text-black px-1.5 py-0.5 rounded-md">
                  الأشهر ⚡
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                فئة عشوائية وتحدي فوري لاختبار سرعة بديهتك الكروية!
              </p>
            </div>
          </div>
        </button>

        {/* AI Difficulty Selector pill */}
        <div className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2 flex items-center justify-between">
          <span className="text-xs font-bold text-white/70 px-2">
            مستوى المنافس الآلي:
          </span>
          <div className="flex items-center gap-1">
            {(
              [
                { id: 'EASY', label: 'سهل' },
                { id: 'NORMAL', label: 'عادي' },
                { id: 'HARD', label: 'صعب' },
                { id: 'LEGEND', label: 'أسطوري' },
              ] as const
            ).map((d) => (
              <button
                key={d.id}
                onClick={() => setAIDifficulty(d.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                  aiDifficulty === d.id
                    ? 'bg-rondo-gold text-black shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Levels Campaign */}
        <button
          onClick={onOpenLevels}
          className="w-full text-right p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/15 hover:border-rondo-gold/60 transition-all active:scale-[0.99] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xl">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">رحلة المستويات (1-10)</h3>
                <span className="text-[10px] font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/30">
                  المستوى {unlockedLevel}
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                تدرج من فئات المبتدئين حتى معركة الزعيم الكبرى
              </p>
            </div>
          </div>
        </button>

        {/* 3. Local 2-Player Pass-and-Play */}
        <button
          onClick={() => onStartGame('LOCAL_2P')}
          className="w-full text-right p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/15 hover:border-rondo-cyan/60 transition-all active:scale-[0.99] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">لاعب ضد لاعب (محلي)</h3>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  مع صديق 👥
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                تنافس مع صديقك وجهاً لوجه على نفس الشاشة بالتناوب
              </p>
            </div>
          </div>
        </button>

        {/* 4. Daily Challenge */}
        <button
          onClick={() => onStartGame('DAILY')}
          className="w-full text-right p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/15 hover:border-amber-400/60 transition-all active:scale-[0.99] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">تحدي روندو اليومي</h3>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
                  مكافأة 🌟
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                فئة خاصة تتجدد يومياً لجميع اللاعبين
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Rules & Info Accordion / Box */}
      <div className="w-full mt-6 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white/70 space-y-1.5">
        <div className="flex items-center gap-1.5 text-rondo-gold font-bold text-sm mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>كيف تلعب روندو الكلاسيكية؟</span>
        </div>
        <p>1. يحدد النظام فئة كروية محددة (مثل: لاعبون فازوا بالكرة الذهبية أو مثلوا برشلونة ومدريد).</p>
        <p>2. لديك عداد ثوانٍ محدود للتمرير، اكتب اسم أي لاعب يستوفي الشروط.</p>
        <p>3. ممنوع تكرار اسم لاعب تم ذكره سابقاً في نفس الجولة.</p>
        <p>4. كل تمريرة صحيحة تنقل الكرة للطرف الآخر، والذي ينفد وقته يخسر نقطة الجولة!</p>
        <div className="pt-2 text-center text-[11px] text-rondo-gold font-bold">
          ⚽ قاعدة بيانات ضخمة تضم أكثر من {ALL_PLAYERS.length} نجم وأسطورة عالمية!
        </div>
      </div>
    </div>
  );
};
