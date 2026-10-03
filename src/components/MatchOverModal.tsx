import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowRight, Award, Zap, Timer } from 'lucide-react';

interface MatchOverModalProps {
  winner: 'P1' | 'P2' | 'AI' | 'DRAW';
  winnerName: string;
  p1Score: number;
  p2Score: number;
  p1Name: string;
  p2Name: string;
  totalPasses: number;
  bestStreak: number;
  avgResponseSeconds: number;
  onRematch: () => void;
  onNextLevel?: () => void;
  onHome: () => void;
  hasNextLevel?: boolean;
}

export const MatchOverModal: React.FC<MatchOverModalProps> = ({
  winner,
  winnerName,
  p1Score,
  p2Score,
  p1Name,
  p2Name,
  totalPasses,
  bestStreak,
  avgResponseSeconds,
  onRematch,
  onNextLevel,
  onHome,
  hasNextLevel,
}) => {
  const isP1Winner = winner === 'P1';

  useEffect(() => {
    if (isP1Winner) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#22C55E', '#00F0FF', '#FFFFFF'],
        });
      } catch {
        // ignore
      }
    }
  }, [isP1Winner]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-pitch-dark to-slate-950 border-2 border-rondo-gold/60 rounded-3xl p-6 shadow-2xl text-center">
        {/* Header Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-rondo-goldDark via-rondo-gold to-rondo-goldLight p-1 shadow-glow-gold flex items-center justify-center mb-3">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-rondo-gold">
            <Trophy className="w-8 h-8" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white">
          {isP1Winner ? 'مبروك! فزت بالروندو! 🏆' : `الفائز: ${winnerName} ⚽`}
        </h2>
        <p className="text-sm font-semibold text-rondo-gold mt-1">
          {isP1Winner
            ? 'أثبتت سرعة بديهتك ومعرفتك الكروية الفائقة!'
            : 'مباراة حماسية قوية، حظاً أوفر في الجولة القادمة!'}
        </p>

        {/* Score comparison card */}
        <div className="my-5 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-white/70">{p1Name}</span>
            <span className="text-3xl font-black text-emerald-400">{p1Score}</span>
            <span className="text-[10px] text-white/50">نقطة</span>
          </div>
          <div className="text-xl font-black text-white/30">VS</div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-white/70">{p2Name}</span>
            <span className="text-3xl font-black text-cyan-400">{p2Score}</span>
            <span className="text-[10px] text-white/50">نقطة</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-black/40 border border-white/5 p-2 rounded-xl">
            <Award className="w-4 h-4 text-rondo-gold mx-auto mb-1" />
            <div className="text-base font-black text-white">{totalPasses}</div>
            <div className="text-[10px] text-white/60">إجمالي التمريرات</div>
          </div>
          <div className="bg-black/40 border border-white/5 p-2 rounded-xl">
            <Zap className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <div className="text-base font-black text-white">x{bestStreak}</div>
            <div className="text-[10px] text-white/60">أعلى سلسلة</div>
          </div>
          <div className="bg-black/40 border border-white/5 p-2 rounded-xl">
            <Timer className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-base font-black text-white">
              {avgResponseSeconds > 0 ? avgResponseSeconds.toFixed(1) : '2.1'}ث
            </div>
            <div className="text-[10px] text-white/60">متوسط السرعة</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          {hasNextLevel && isP1Winner && onNextLevel && (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 px-4 rounded-xl font-black text-black bg-gradient-to-r from-rondo-goldDark via-rondo-gold to-rondo-goldLight hover:brightness-110 shadow-glow-gold transition flex items-center justify-center gap-2"
            >
              <span>المستوى التالي</span>
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          )}

          <button
            onClick={onRematch}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة التحدي</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-white/80 bg-white/10 hover:bg-white/15 transition text-sm"
          >
            الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};
