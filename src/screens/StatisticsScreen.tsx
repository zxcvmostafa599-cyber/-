import React from 'react';
import { ArrowLeft, BarChart2, Timer, Flame, Trophy, CheckCircle2 } from 'lucide-react';
import { Player } from '../types/player';

interface StatisticsScreenProps {
  player: Player;
  onBack: () => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ player, onBack }) => {
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
          <BarChart2 className="w-5 h-5 text-indigo-400" />
          <span>سجل المواجهات والتحليلات</span>
        </h2>

        <div className="w-8" />
      </div>

      {/* Summary card */}
      <div className="w-full bg-slate-900/90 border border-white/10 rounded-2xl p-4 shadow-pitch-card">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-black/30 p-3 rounded-xl border border-white/5">
            <span className="text-xs text-white/60 block">إجمالي المباريات</span>
            <span className="text-2xl font-black text-white">{player.totalMatches}</span>
          </div>
          <div className="bg-black/30 p-3 rounded-xl border border-white/5">
            <span className="text-xs text-white/60 block">المباريات الفائزة</span>
            <span className="text-2xl font-black text-emerald-400">{player.wins}</span>
          </div>
        </div>
      </div>

      {/* Detailed metrics grid */}
      <div className="space-y-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-rondo-gold" />
            <div>
              <div className="text-sm font-bold text-white">أسرع زمن استجابة</div>
              <div className="text-[11px] text-white/50">أسرع تمريرة مسجلة في الروندو</div>
            </div>
          </div>
          <span className="text-lg font-black text-rondo-gold">
            {player.fastestAnswerSec > 0 ? player.fastestAnswerSec.toFixed(1) : '-'} ثانية
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-sm font-bold text-white">أعلى سلسلة متتالية (Combo)</div>
              <div className="text-[11px] text-white/50">تمريرات ناجحة متصلة بدون خطأ</div>
            </div>
          </div>
          <span className="text-lg font-black text-orange-400">
            x{player.longestStreak}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-sm font-bold text-white">نسبة الفوز الإجمالية</div>
              <div className="text-[11px] text-white/50">معدل الفوز ضد المنافسين</div>
            </div>
          </div>
          <span className="text-lg font-black text-emerald-400">
            {player.winRate.toFixed(1)}%
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-sky-400" />
            <div>
              <div className="text-sm font-bold text-white">إجمالي التمريرات الناجحة</div>
              <div className="text-[11px] text-white/50">عدد اللاعبين الصحيحين الذين تم ذكرهم</div>
            </div>
          </div>
          <span className="text-lg font-black text-sky-400">
            {player.correctAnswers} لاعب
          </span>
        </div>
      </div>
    </div>
  );
};
