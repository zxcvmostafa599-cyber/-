import React from 'react';
import { PassRecord } from '../types/rondo';
import { History } from 'lucide-react';

interface PassHistoryStripProps {
  passes: PassRecord[];
}

export const PassHistoryStrip: React.FC<PassHistoryStripProps> = ({ passes }) => {
  if (passes.length === 0) return null;

  return (
    <div className="w-full bg-slate-950/70 border border-white/10 rounded-xl p-2.5 sm:p-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-rondo-gold mb-2">
        <History className="w-3.5 h-3.5" />
        <span>تمريرات الجولة ({passes.length})</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
        {passes.map((pass, index) => {
          const isP1 = pass.passer === 'P1';
          return (
            <div
              key={`${pass.player.id}-${index}`}
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold backdrop-blur-sm shadow-sm ${
                isP1
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
                  : 'bg-cyan-950/70 border-cyan-500/40 text-cyan-200'
              }`}
            >
              <span className="text-sm">{pass.player.avatarEmoji || '⚽'}</span>
              <div className="flex flex-col">
                <span className="leading-tight">{pass.player.arabicName}</span>
                <span className="text-[9px] opacity-70">
                  بواسطة: {pass.passerName} ({pass.timeSpentSeconds.toFixed(1)}ث)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
