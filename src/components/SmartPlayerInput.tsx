import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FootballPlayer } from '../types/rondo';
import { RondoEngine } from '../engine/rondoEngine';

interface SmartPlayerInputProps {
  onPass: (playerQuery: string) => void;
  disabled: boolean;
  placeholder?: string;
  feedback?: {
    type: 'error' | 'success';
    message: string;
  } | null;
}

export const SmartPlayerInput: React.FC<SmartPlayerInputProps> = ({
  onPass,
  disabled,
  placeholder = 'اكتب اسم اللاعب للتمرير... (مثال: ميسي، رونالدو، زيدان)',
  feedback,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FootballPlayer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Live autocomplete lookup
  useEffect(() => {
    if (query.trim().length >= 2 && !disabled) {
      const results = RondoEngine.resolvePlayers(query, 4);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, disabled]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (disabled || !query.trim()) return;

    onPass(query.trim());
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (player: FootballPlayer) => {
    if (disabled) return;
    onPass(player.arabicName);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={disabled}
            placeholder={disabled ? 'انتظر دورك...' : placeholder}
            className={`w-full bg-slate-900/90 text-white placeholder-white/40 text-sm sm:text-base font-bold px-4 py-3 sm:py-3.5 pr-10 rounded-xl border-2 transition-all outline-none ${
              disabled
                ? 'border-white/10 opacity-60 cursor-not-allowed'
                : 'border-rondo-gold/60 focus:border-rondo-gold focus:ring-2 focus:ring-rondo-gold/30 shadow-lg'
            }`}
            autoComplete="off"
            dir="rtl"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-rondo-gold/70 pointer-events-none" />
        </div>

        <button
          type="submit"
          disabled={disabled || !query.trim()}
          className={`flex items-center justify-center gap-1.5 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-black text-sm sm:text-base transition-all shadow-md active:scale-95 ${
            disabled || !query.trim()
              ? 'bg-slate-800 text-white/40 cursor-not-allowed'
              : 'bg-gradient-to-r from-rondo-goldDark via-rondo-gold to-rondo-goldLight text-black hover:brightness-110 shadow-glow-gold'
          }`}
        >
          <span>مرّر</span>
          <Send className="w-4 h-4 rtl:rotate-180" />
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {showSuggestions && !disabled && (
        <div className="absolute z-30 bottom-full mb-1.5 w-full bg-slate-900 border border-rondo-gold/50 rounded-xl shadow-2xl overflow-hidden divide-y divide-white/10 backdrop-blur-md">
          <div className="px-3 py-1 bg-black/40 text-[10px] font-bold text-rondo-gold flex justify-between items-center">
            <span>اقتراحات سريعة: انقر للتمرير فوراً</span>
            <span>⚡ سريع</span>
          </div>
          {suggestions.map((player) => (
            <button
              key={player.id}
              type="button"
              onClick={() => handleSelectSuggestion(player)}
              className="w-full text-right px-3.5 py-2.5 hover:bg-emerald-950/60 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{player.avatarEmoji || '⚽'}</span>
                <div>
                  <div className="text-sm font-extrabold text-white group-hover:text-rondo-gold transition">
                    {player.arabicName}
                  </div>
                  <div className="text-[10px] text-white/60">
                    {player.englishName}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                مرّر ⚽
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Feedback Toast Banner */}
      {feedback && (
        <div
          className={`mt-2 flex items-center gap-2 p-2.5 rounded-xl text-xs sm:text-sm font-bold border transition animate-bounce-subtle ${
            feedback.type === 'error'
              ? 'bg-rose-950/90 border-rose-600 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
          }`}
        >
          {feedback.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
};
