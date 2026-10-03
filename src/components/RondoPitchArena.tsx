import React from 'react';
import { Bot, User, Flame } from 'lucide-react';
import { RondoPhase } from '../types/rondo';

interface RondoPitchArenaProps {
  turnOwner: 'P1' | 'P2' | 'AI';
  phase: RondoPhase;
  remainingSeconds: number;
  totalTurnSeconds: number;
  p1Name: string;
  p1Score: number;
  p1Streak: number;
  p2Name: string;
  p2Score: number;
  p2Streak: number;
  isP2AI: boolean;
  lastPassedPlayerName?: string;
}

export const RondoPitchArena: React.FC<RondoPitchArenaProps> = ({
  turnOwner,
  phase,
  remainingSeconds,
  totalTurnSeconds,
  p1Name,
  p1Score,
  p1Streak,
  p2Name,
  p2Score,
  p2Streak,
  isP2AI,
  lastPassedPlayerName,
}) => {
  const fraction = Math.max(0, Math.min(1, remainingSeconds / totalTurnSeconds));
  const isCritical = remainingSeconds <= 1.8 && phase === 'PLAYING';

  // Ball position: 15% on left (P1), 85% on right (P2/AI)
  const isBallAtP1 = turnOwner === 'P1';
  const ballLeftPercentage = isBallAtP1 ? '16%' : '84%';

  // Timer color
  let timerRingColor = '#22C55E'; // green
  if (remainingSeconds <= 2.2) {
    timerRingColor = '#EF4444'; // red
  } else if (remainingSeconds <= totalTurnSeconds * 0.5) {
    timerRingColor = '#EAB308'; // yellow/gold
  }

  const strokeDashoffset = 220 * (1 - fraction);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-2 border-rondo-gold/40 shadow-pitch-card bg-pitch-dark p-3 sm:p-4">
      {/* Stadium Pitch Canvas */}
      <div className="relative h-48 sm:h-56 w-full rounded-xl bg-football-pitch border border-white/20 overflow-hidden shadow-inner flex flex-col justify-between p-3 select-none">
        {/* Pitch Field Lines & Center Circle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Halfway line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/25 -translate-x-1/2" />
          {/* Center Circle */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-white/25 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Players Nodes & Center Countdown */}
        <div className="relative z-10 flex items-center justify-between h-full px-2 sm:px-6">
          {/* Player 1 Node (You) */}
          <div
            className={`flex flex-col items-center transition-all duration-300 p-2 rounded-xl backdrop-blur-sm ${
              turnOwner === 'P1' && phase === 'PLAYING'
                ? 'bg-emerald-950/80 ring-2 ring-rondo-gold scale-105 shadow-glow-gold'
                : 'bg-black/40 border border-white/10 opacity-85'
            }`}
          >
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 flex items-center justify-center shadow-lg">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-rondo-gold">
                  <User className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </div>
              {p1Streak >= 2 && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black font-black text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                  <Flame className="w-3 h-3 fill-orange-600 text-orange-600" />
                  x{p1Streak}
                </div>
              )}
            </div>
            <span className="mt-1 font-bold text-xs sm:text-sm text-white drop-shadow truncate max-w-[90px] text-center">
              {p1Name}
            </span>
            <span className="text-[11px] font-extrabold text-rondo-gold">
              {p1Score} نقطة
            </span>
          </div>

          {/* Center Live Circular Timer */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`relative flex items-center justify-center transition-transform ${
                isCritical ? 'scale-110 animate-pulse-fast' : 'scale-100'
              }`}
            >
              <svg className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="35"
                  className="stroke-black/50"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="35"
                  stroke={timerRingColor}
                  strokeWidth="7"
                  strokeDasharray="220"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-100"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span
                  className="text-lg sm:text-2xl font-black transition-colors"
                  style={{ color: timerRingColor }}
                >
                  {remainingSeconds.toFixed(1)}
                </span>
                <span className="text-[9px] font-bold text-white/70 -mt-1">
                  ثانية
                </span>
              </div>
            </div>

            {/* Turn status indicator */}
            <div className="mt-1 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 text-[10px] font-bold text-white">
              {phase === 'COUNTDOWN' && 'استعد للانطلاق! ⏳'}
              {phase === 'PLAYING' &&
                (turnOwner === 'P1' ? 'دورك للتمرير! ⚽' : `دور ${p2Name}...`)}
              {phase === 'PASS_SUCCESS' && 'تمريرة متقنة! 🎯'}
              {phase === 'TIMEOUT_FOUL' && 'انقطع الاستحواذ! ❌'}
              {phase === 'MATCH_OVER' && 'نهاية الروندو 🏁'}
            </div>
          </div>

          {/* Player 2 / AI Node */}
          <div
            className={`flex flex-col items-center transition-all duration-300 p-2 rounded-xl backdrop-blur-sm ${
              turnOwner !== 'P1' && phase === 'PLAYING'
                ? 'bg-cyan-950/80 ring-2 ring-rondo-cyan scale-105 shadow-glow-cyan'
                : 'bg-black/40 border border-white/10 opacity-85'
            }`}
          >
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-cyan-400">
                  {isP2AI ? (
                    <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
                  ) : (
                    <User className="w-6 h-6 sm:w-7 sm:h-7" />
                  )}
                </div>
              </div>
              {p2Streak >= 2 && (
                <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-black font-black text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                  <Flame className="w-3 h-3 fill-cyan-700 text-cyan-700" />
                  x{p2Streak}
                </div>
              )}
            </div>
            <span className="mt-1 font-bold text-xs sm:text-sm text-white drop-shadow truncate max-w-[90px] text-center">
              {p2Name}
            </span>
            <span className="text-[11px] font-extrabold text-cyan-400">
              {p2Score} نقطة
            </span>
          </div>
        </div>

        {/* Dynamic Animated Traveling Football */}
        <div className="relative w-full h-6 flex items-center">
          <div
            className="absolute transition-all duration-300 ease-out transform -translate-x-1/2 flex items-center justify-center"
            style={{ left: ballLeftPercentage }}
          >
            <div className="text-2xl animate-ball-pulse drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              ⚽
            </div>
          </div>
        </div>
      </div>

      {/* Last Passed Notification strip */}
      {lastPassedPlayerName && (
        <div className="mt-2 text-center text-xs font-semibold text-rondo-goldLight bg-white/5 py-1 px-3 rounded-lg border border-rondo-gold/20 flex items-center justify-center gap-1.5">
          <span>آخر تمريرة:</span>
          <span className="font-extrabold text-white underline underline-offset-2">
            {lastPassedPlayerName}
          </span>
          <span>⚽</span>
        </div>
      )}
    </div>
  );
};
