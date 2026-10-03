import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FootballCategory, FootballPlayer, GameMode, AIDifficulty, RondoPhase, PassRecord } from '../types/rondo';
import { RondoPitchArena } from '../components/RondoPitchArena';
import { FootballCategoryBanner } from '../components/FootballCategoryBanner';
import { SmartPlayerInput } from '../components/SmartPlayerInput';
import { PassHistoryStrip } from '../components/PassHistoryStrip';
import { MatchOverModal } from '../components/MatchOverModal';
import { RondoEngine } from '../engine/rondoEngine';
import { soundManager } from '../engine/soundManager';
import { RotateCcw, ArrowLeft } from 'lucide-react';

interface RondoGameScreenProps {
  category: FootballCategory;
  mode: GameMode;
  levelNumber?: number;
  aiDifficulty: AIDifficulty;
  onFinishMatch: (won: boolean, score: number, nextLevel?: boolean) => void;
  onBack: () => void;
}

const POINTS_TO_WIN = 5;

export const RondoGameScreen: React.FC<RondoGameScreenProps> = ({
  category,
  mode,
  levelNumber,
  aiDifficulty,
  onFinishMatch,
  onBack,
}) => {
  const isP2AI = mode !== 'LOCAL_2P';
  const p1Name = 'أنت (اللاعب 1)';
  const p2Name = isP2AI ? `الذكاء الاصطناعي (${aiDifficulty})` : 'اللاعب 2 (صديقك)';

  const [phase, setPhase] = useState<RondoPhase>('READY');
  const [countdownNum, setCountdownNum] = useState(3);
  const [turnOwner, setTurnOwner] = useState<'P1' | 'P2' | 'AI'>('P1');
  const [remainingSeconds, setRemainingSeconds] = useState(category.timerSeconds);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Streak, setP1Streak] = useState(0);
  const [p2Streak, setP2Streak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [usedPlayerIds, setUsedPlayerIds] = useState<Set<string>>(new Set());
  const [passes, setPasses] = useState<PassRecord[]>([]);
  const [lastPassedName, setLastPassedName] = useState<string | undefined>();
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const [showMatchOver, setShowMatchOver] = useState(false);
  const [matchWinner, setMatchWinner] = useState<'P1' | 'P2' | 'AI' | 'DRAW'>('P1');

  const turnStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<number | null>(null);
  const aiTimeoutRef = useRef<number | null>(null);

  // Clear timers
  const clearAllTimers = useCallback(() => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (aiTimeoutRef.current) {
      window.clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
  }, []);

  // Handle Foul / Timeout
  const handleTimeoutOrFoul = useCallback(
    (reason: string) => {
      clearAllTimers();
      setPhase('TIMEOUT_FOUL');
      soundManager.playFoulBuzzer();

      setFeedback({ type: 'error', message: reason });

      const loser = turnOwner;
      const winner = loser === 'P1' ? (isP2AI ? 'AI' : 'P2') : 'P1';

      let newP1Score = p1Score;
      let newP2Score = p2Score;

      if (winner === 'P1') {
        newP1Score = p1Score + 1;
        setP1Score(newP1Score);
        setP1Streak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
        setP2Streak(0);
      } else {
        newP2Score = p2Score + 1;
        setP2Score(newP2Score);
        setP2Streak((s) => s + 1);
        setP1Streak(0);
      }

      // Check if match won
      if (newP1Score >= POINTS_TO_WIN || newP2Score >= POINTS_TO_WIN) {
        window.setTimeout(() => {
          setPhase('MATCH_OVER');
          const finalWinner = newP1Score >= POINTS_TO_WIN ? 'P1' : isP2AI ? 'AI' : 'P2';
          setMatchWinner(finalWinner);
          if (finalWinner === 'P1') {
            soundManager.playCrowdCheer();
          }
          setShowMatchOver(true);
        }, 1200);
      } else {
        // Next round after short pause
        window.setTimeout(() => {
          setUsedPlayerIds(new Set());
          setFeedback(null);
          // Loser serves next round
          startTurn(loser);
        }, 1600);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [turnOwner, isP2AI, p1Score, p2Score, clearAllTimers]
  );

  // Turn management
  const startTurn = useCallback(
    (nextOwner: 'P1' | 'P2' | 'AI') => {
      clearAllTimers();
      setTurnOwner(nextOwner);
      setRemainingSeconds(category.timerSeconds);
      setPhase('PLAYING');
      turnStartTimeRef.current = Date.now();

      // Countdown timer loop
      const intervalMs = 100;
      timerIntervalRef.current = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          const next = Math.max(0, prev - intervalMs / 1000);

          // Urgent sound warning
          if (next <= 1.8 && next > 0 && Math.round(next * 10) % 5 === 0) {
            soundManager.playUrgentTick();
          }

          if (next <= 0) {
            handleTimeoutOrFoul(
              nextOwner === 'P1'
                ? 'نفد الوقت! انقطعت الكرة منك!'
                : `نفد وقت ${nextOwner === 'AI' ? 'الذكاء الاصطناعي' : 'اللاعب 2'}!`
            );
            return 0;
          }
          return next;
        });
      }, intervalMs);

      // AI turn automation
      if (nextOwner === 'AI') {
        const aiDecision = RondoEngine.pickAIPlayer(category, usedPlayerIds, aiDifficulty);
        const thinkingTimeMs = aiDecision
          ? Math.min(aiDecision.thinkingSeconds * 1000, category.timerSeconds * 1000 - 400)
          : category.timerSeconds * 1000;

        aiTimeoutRef.current = window.setTimeout(() => {
          if (!aiDecision) {
            handleTimeoutOrFoul('الذكاء الاصطناعي عجز عن تذكر لاعب مطابق!');
          } else {
            handleSuccessfulPass(aiDecision.player, 'AI', p2Name);
          }
        }, thinkingTimeMs);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, usedPlayerIds, aiDifficulty, p2Name, clearAllTimers, handleTimeoutOrFoul]
  );

  // Handle successful pass
  const handleSuccessfulPass = (
    player: FootballPlayer,
    passer: 'P1' | 'P2' | 'AI',
    passerName: string
  ) => {
    soundManager.playBallKick();

    const timeSpent = (Date.now() - turnStartTimeRef.current) / 1000;
    setPasses((prev) => [
      ...prev,
      {
        player,
        passer,
        passerName,
        timeSpentSeconds: timeSpent,
        roundNumber: p1Score + p2Score + 1,
        timestamp: Date.now(),
      },
    ]);

    setUsedPlayerIds((prev) => new Set(prev).add(player.id));
    setLastPassedName(`${player.arabicName} (${passerName})`);
    setFeedback({
      type: 'success',
      message: `تمريرة صحيحة! ${player.arabicName} ⚽`,
    });

    // Switch turn
    const nextOwner = passer === 'P1' ? (isP2AI ? 'AI' : 'P2') : 'P1';
    window.setTimeout(() => {
      startTurn(nextOwner);
    }, 250);
  };

  // Player submission handler
  const handlePlayerSubmit = (query: string) => {
    if (phase !== 'PLAYING') return;
    if (turnOwner !== 'P1' && turnOwner !== 'P2') return;

    const validation = RondoEngine.validateAnswer(query, category, usedPlayerIds);

    if (validation.type === 'VALID') {
      const passer = turnOwner;
      const passerName = turnOwner === 'P1' ? p1Name : p2Name;
      handleSuccessfulPass(validation.player, passer, passerName);
    } else if (validation.type === 'ALREADY_USED') {
      soundManager.playFoulBuzzer();
      setFeedback({
        type: 'error',
        message: `تم استخدام (${validation.player.arabicName}) مسبقاً في هذه الجولة!`,
      });
    } else if (validation.type === 'CATEGORY_MISMATCH') {
      soundManager.playFoulBuzzer();
      setFeedback({
        type: 'error',
        message: validation.reasonAr,
      });
    } else {
      soundManager.playFoulBuzzer();
      setFeedback({
        type: 'error',
        message: `لم نتمكن من العثور على لاعب باسم "${query}". تأكد من الاسم!`,
      });
    }
  };

  // Start initial match countdown
  useEffect(() => {
    setPhase('COUNTDOWN');
    setCountdownNum(3);

    const interval = window.setInterval(() => {
      setCountdownNum((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          soundManager.playWhistle();
          startTurn('P1');
          return 0;
        }
        soundManager.playTick();
        return prev - 1;
      });
    }, 900);

    return () => {
      window.clearInterval(interval);
      clearAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRematch = () => {
    clearAllTimers();
    setP1Score(0);
    setP2Score(0);
    setP1Streak(0);
    setP2Streak(0);
    setPasses([]);
    setUsedPlayerIds(new Set());
    setFeedback(null);
    setShowMatchOver(false);
    setPhase('COUNTDOWN');
    setCountdownNum(3);

    const interval = window.setInterval(() => {
      setCountdownNum((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          soundManager.playWhistle();
          startTurn('P1');
          return 0;
        }
        soundManager.playTick();
        return prev - 1;
      });
    }, 900);
  };

  const avgResponseTime =
    passes.length > 0
      ? passes.reduce((acc, p) => acc + p.timeSpentSeconds, 0) / passes.length
      : 2.1;

  const isInputDisabled =
    phase !== 'PLAYING' ||
    (isP2AI && turnOwner === 'AI') ||
    (!isP2AI && false); // Local 2P both use input

  const inputPlaceholder =
    turnOwner === 'P1'
      ? `دور ${p1Name}... اكتب اسم لاعب!`
      : `دور ${p2Name}... اكتب اسم لاعب!`;

  return (
    <div className="w-full max-w-xl mx-auto p-3 sm:p-4 flex flex-col gap-3 animate-fade-in relative pb-8">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>مغادرة</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-rondo-gold bg-rondo-gold/10 px-3 py-1 rounded-full border border-rondo-gold/30">
            الهدف: {POINTS_TO_WIN} نقاط للفوز 🏆
          </span>
        </div>

        <button
          onClick={handleRematch}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition"
          title="إعادة المباراة"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Banner */}
      <FootballCategoryBanner category={category} levelNumber={levelNumber} />

      {/* The Stadium Pitch Arena */}
      <RondoPitchArena
        turnOwner={turnOwner}
        phase={phase}
        remainingSeconds={remainingSeconds}
        totalTurnSeconds={category.timerSeconds}
        p1Name={p1Name}
        p1Score={p1Score}
        p1Streak={p1Streak}
        p2Name={p2Name}
        p2Score={p2Score}
        p2Streak={p2Streak}
        isP2AI={isP2AI}
        lastPassedPlayerName={lastPassedName}
      />

      {/* Player Input Area */}
      <SmartPlayerInput
        onPass={handlePlayerSubmit}
        disabled={isInputDisabled}
        placeholder={inputPlaceholder}
        feedback={feedback}
      />

      {/* Passed players list */}
      <PassHistoryStrip passes={passes} />

      {/* Pre-match Countdown Modal */}
      {phase === 'COUNTDOWN' && countdownNum > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="flex flex-col items-center animate-bounce-subtle">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-rondo-goldDark via-rondo-gold to-rondo-goldLight flex items-center justify-center shadow-glow-gold">
              <span className="text-6xl font-black text-black">
                {countdownNum}
              </span>
            </div>
            <span className="mt-4 text-xl font-black text-white">
              استعد للتمرير... ⚽
            </span>
          </div>
        </div>
      )}

      {/* Match Over Modal */}
      {showMatchOver && (
        <MatchOverModal
          winner={matchWinner}
          winnerName={matchWinner === 'P1' ? p1Name : p2Name}
          p1Score={p1Score}
          p2Score={p2Score}
          p1Name={p1Name}
          p2Name={p2Name}
          totalPasses={passes.length}
          bestStreak={bestStreak}
          avgResponseSeconds={avgResponseTime}
          onRematch={handleRematch}
          onNextLevel={
            levelNumber && levelNumber < 10
              ? () => onFinishMatch(matchWinner === 'P1', p1Score, true)
              : undefined
          }
          onHome={() => onFinishMatch(matchWinner === 'P1', p1Score, false)}
          hasNextLevel={Boolean(levelNumber && levelNumber < 10)}
        />
      )}
    </div>
  );
};
