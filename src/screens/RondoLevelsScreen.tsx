import React from 'react';
import { ALL_CATEGORIES } from '../data/footballCatalog';
import { DIFFICULTY_CONFIG } from '../types/rondo';
import { ArrowLeft, Play, Lock, CheckCircle2 } from 'lucide-react';

interface RondoLevelsScreenProps {
  unlockedLevel: number;
  onSelectLevel: (levelNumber: number) => void;
  onBack: () => void;
}

export const RondoLevelsScreen: React.FC<RondoLevelsScreenProps> = ({
  unlockedLevel,
  onSelectLevel,
  onBack,
}) => {
  // Sort categories by level 1 to 10
  const levels = ALL_CATEGORIES.filter((c) => c.levelNumber <= 10).sort(
    (a, b) => a.levelNumber - b.levelNumber
  );

  return (
    <div className="w-full max-w-xl mx-auto p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold transition"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>رجوع</span>
        </button>

        <h2 className="text-lg font-black text-white">رحلة المستويات (1 - 10)</h2>

        <div className="text-xs font-bold text-rondo-gold bg-rondo-gold/10 px-2.5 py-1 rounded-lg border border-rondo-gold/20">
          مفتوح: {unlockedLevel}/10
        </div>
      </div>

      {/* Levels list */}
      <div className="space-y-3">
        {levels.map((cat) => {
          const isUnlocked = cat.levelNumber <= unlockedLevel;
          const isCurrent = cat.levelNumber === unlockedLevel;
          const isPassed = cat.levelNumber < unlockedLevel;
          const diff = DIFFICULTY_CONFIG[cat.difficulty];

          return (
            <div
              key={cat.id}
              className={`p-4 rounded-2xl border transition-all ${
                isUnlocked
                  ? 'bg-slate-900/90 border-rondo-gold/30 hover:border-rondo-gold shadow-pitch-card'
                  : 'bg-black/40 border-white/5 opacity-55'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl font-black ${
                      isPassed
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : isCurrent
                        ? 'bg-rondo-gold text-black shadow-glow-gold'
                        : 'bg-slate-800 text-white/50'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      cat.levelNumber
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{cat.iconEmoji}</span>
                      <h3 className="font-extrabold text-sm sm:text-base text-white">
                        {cat.titleAr}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[9px] font-extrabold text-white px-2 py-0.5 rounded-full ${diff.badgeColor}`}
                      >
                        {diff.titleAr}
                      </span>
                      <span className="text-xs text-white/50">
                        وقت التمرير: {cat.timerSeconds}ث
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                {isUnlocked ? (
                  <button
                    onClick={() => onSelectLevel(cat.levelNumber)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-rondo-goldDark via-rondo-gold to-rondo-goldLight text-black hover:brightness-110 shadow-md active:scale-95 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>العب</span>
                  </button>
                ) : (
                  <div className="p-2 rounded-xl bg-white/5 text-white/30">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
