import React from 'react';
import { FootballCategory, DIFFICULTY_CONFIG } from '../types/rondo';
import { ShieldAlert, Award } from 'lucide-react';

interface FootballCategoryBannerProps {
  category: FootballCategory;
  levelNumber?: number;
}

export const FootballCategoryBanner: React.FC<FootballCategoryBannerProps> = ({
  category,
  levelNumber,
}) => {
  const diff = DIFFICULTY_CONFIG[category.difficulty];

  return (
    <div className="w-full bg-gradient-to-r from-pitch-mid via-pitch-dark to-pitch-mid border border-rondo-gold/40 rounded-2xl p-3.5 sm:p-4 shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">{category.iconEmoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-rondo-gold uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                {levelNumber ? `المستوى ${levelNumber}` : 'تحدي الروندو'}
              </span>
              <span
                className={`text-[10px] font-extrabold text-white px-2 py-0.5 rounded-full ${diff.badgeColor} shadow`}
              >
                {diff.titleAr} ({category.timerSeconds}ث)
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white leading-tight">
              {category.titleAr}
            </h2>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-white/70 bg-black/30 px-2.5 py-1 rounded-lg border border-white/10">
          <ShieldAlert className="w-3.5 h-3.5 text-rondo-gold" />
          <span>ممنوع تكرار الأسماء</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium bg-black/25 p-2 rounded-xl border border-white/5">
        {category.descriptionAr}
      </p>
    </div>
  );
};
