import React, { useState } from 'react';
import { Volume2, VolumeX, Home, BookOpen, X, Trophy } from 'lucide-react';
import { soundManager } from '../engine/soundManager';
import { ALL_PLAYERS } from '../data/footballCatalog';

interface RondoNavbarProps {
  onHomeClick?: () => void;
  title?: string;
}

export const RondoNavbar: React.FC<RondoNavbarProps> = ({
  onHomeClick,
  title = 'روندو الكلاسيكية',
}) => {
  const [soundOn, setSoundOn] = useState(soundManager.enabled);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const toggleSound = () => {
    const next = !soundOn;
    soundManager.enabled = next;
    setSoundOn(next);
  };

  const filteredPlayers = filterQuery.trim()
    ? ALL_PLAYERS.filter(
        (p) =>
          p.arabicName.includes(filterQuery) ||
          p.englishName.toLowerCase().includes(filterQuery.toLowerCase()) ||
          p.aliases.some((a) => a.includes(filterQuery))
      )
    : ALL_PLAYERS;

  return (
    <>
      <header className="w-full bg-slate-950/80 border-b border-white/10 px-4 py-2.5 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {onHomeClick && (
            <button
              onClick={onHomeClick}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition active:scale-95"
              title="الرئيسية"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl">⚽</span>
            <h1 className="text-base sm:text-lg font-black text-white tracking-wide">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Players Catalog Help */}
          <button
            onClick={() => setShowCatalogModal(true)}
            className="flex items-center gap-1 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-xl text-rondo-gold transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">دليل النجوم ({ALL_PLAYERS.length})</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition active:scale-95 ${
              soundOn
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
            title={soundOn ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Players Encyclopedia Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl max-h-[85vh] bg-slate-900 border border-rondo-gold/50 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-rondo-gold" />
                <h3 className="font-extrabold text-white text-base">
                  دليل نجوم الروندو ({ALL_PLAYERS.length} لاعب مسجل)
                </h3>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-black/20 border-b border-white/5">
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="ابحث عن لاعب..."
                className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-white/10 text-sm outline-none focus:border-rondo-gold"
              />
            </div>

            <div className="p-4 overflow-y-auto divide-y divide-white/5 space-y-3">
              {filteredPlayers.map((player) => (
                <div key={player.id} className="pt-2 flex items-start gap-3">
                  <span className="text-2xl">{player.avatarEmoji || '⚽'}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">
                        {player.arabicName}
                      </span>
                      <span className="text-xs text-white/50">
                        ({player.englishName})
                      </span>
                    </div>
                    <p className="text-xs text-emerald-300/80 mt-0.5">
                      {player.notableStats}
                    </p>
                    <div className="flex items-center gap-1 mt-1 flex-wrap text-[10px] text-white/50">
                      <span>الأسماء المقبولة:</span>
                      <span className="text-rondo-gold/80">
                        {[player.arabicName, ...player.shortNames].join('، ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
