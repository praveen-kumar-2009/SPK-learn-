import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, Topic } from '../../types/curriculum';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Flame,
  Volume2,
  VolumeX,
  Zap,
  Target,
  Award,
} from 'lucide-react';

interface TopicTimedQuizProps {
  topic: Topic;
  onSaveResult?: (score: number, total: number, timeSpent: number) => void;
  onAskAnyDoubt: (context: {
    doubtPrompt: string;
    topicId: string;
    topicTitle: string;
    score: number;
    total: number;
    incorrectQuestions: string[];
  }) => void;
}

// Synthesized Web Audio Sound Effects (Zero External Asset Dependency)
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playTick() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      // Arpeggio C5 -> E5 -> G5
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.18);
      });
    } catch (e) {}
  }

  playWrong() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.07, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.45);
      });
    } catch (e) {}
  }
}

const sfx = new SoundFX();

export const TopicTimedQuiz: React.FC<TopicTimedQuizProps> = ({
  topic,
  onSaveResult,
  onAskAnyDoubt,
}) => {
  const questions = topic.quiz || [];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Per-question countdown timer (20s per question)
  const currentQ = questions[currentIndex];
  const questionTimeLimit = currentQ?.timeLimitSeconds || 20;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(questionTimeLimit);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync sound toggle
  useEffect(() => {
    sfx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Total elapsed timer
  useEffect(() => {
    if (isCompleted || questions.length === 0) return;
    totalTimerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, [isCompleted, questions.length]);

  // Per-question countdown
  useEffect(() => {
    if (isCompleted || !currentQ) return;
    setRemainingSeconds(currentQ.timeLimitSeconds || 20);
    setIsAnswerSubmitted(false);
    setSelectedOptionId(null);

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 4 && prev > 1) {
          sfx.playTick();
        }
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isCompleted]);

  const handleTimeExpired = () => {
    setIsAnswerSubmitted(true);
    setStreak(0);
    sfx.playWrong();
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleConfirmAnswer = () => {
    if (selectedOptionId === null || isAnswerSubmitted) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswerSubmitted(true);

    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: selectedOptionId,
    }));

    const isCorrect = currentQ.correctOptionIds.includes(selectedOptionId);
    if (isCorrect) {
      // Speed bonus: +10 base + up to +5 for fast response
      const speedBonus = Math.floor((remainingSeconds / questionTimeLimit) * 5);
      const points = 10 + speedBonus;
      setScore((prev) => prev + points);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      sfx.playCorrect();

      // Confetti burst for streak or correct
      if (newStreak >= 2) {
        try {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.7 },
          });
        } catch (e) {}
      }
    } else {
      setStreak(0);
      sfx.playWrong();
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsCompleted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);

    let finalScore = 0;
    questions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans && q.correctOptionIds.includes(ans)) {
        finalScore += 10;
      }
    });

    onSaveResult?.(finalScore, questions.length * 10, timeSpent);
    sfx.playFanfare();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setScore(0);
    setStreak(0);
    setTimeSpent(0);
    setIsCompleted(false);
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
        No quiz questions configured for this topic yet.
      </div>
    );
  }

  // Render Visual Scenario Art (e.g. Polar Bear in Arctic ice with Blubber layer)
  const renderVisualScenario = () => {
    const isPolarBearQuestion =
      currentQ?.question?.toLowerCase().includes('polar bear') ||
      currentQ?.question?.toLowerCase().includes('blubber') ||
      currentQ?.question?.toLowerCase().includes('allen') ||
      topic.number === '10.1';

    const isAntherQuestion =
      currentQ?.question?.toLowerCase().includes('anther') ||
      currentQ?.question?.toLowerCase().includes('tapetum') ||
      topic.number === '1.4';

    const isMendelQuestion =
      currentQ?.question?.toLowerCase().includes('mendel') ||
      currentQ?.question?.toLowerCase().includes('cross') ||
      topic.number === '2.1';

    const isSpermQuestion =
      currentQ?.question?.toLowerCase().includes('sperm') ||
      currentQ?.question?.toLowerCase().includes('acrosome') ||
      topic.number === '2.3';

    if (isPolarBearQuestion) {
      return (
        <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-400 via-cyan-600 to-slate-900 border-2 border-cyan-300/40 shadow-inner flex items-center justify-center p-3 select-none">
          {/* Arctic Snowfall & Ice Scene */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_50%)] pointer-events-none" />

          {/* Iceberg silhouette */}
          <svg viewBox="0 0 400 160" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="iceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="60%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </linearGradient>
            </defs>

            {/* Aurora borealis sky ribbons */}
            <path d="M 0 30 Q 100 10 200 25 T 400 20" stroke="#34d399" strokeWidth="12" strokeOpacity="0.3" fill="none" />
            <path d="M 0 45 Q 120 20 250 35 T 400 30" stroke="#38bdf8" strokeWidth="8" strokeOpacity="0.25" fill="none" />

            {/* Freezing Arctic Ocean Water */}
            <rect x="0" y="105" width="400" height="55" fill="url(#waterGrad)" />
            <path d="M 0 105 Q 100 108 200 104 T 400 106 L 400 160 L 0 160 Z" fill="#0284c7" fillOpacity="0.6" />

            {/* Floating Ice Floe / Glacier */}
            <polygon points="50,115 110,85 280,88 340,115 310,128 70,126" fill="url(#iceGrad)" stroke="#7dd3fc" strokeWidth="2" />
            <polygon points="110,85 280,88 270,102 120,100" fill="#f8fafc" />

            {/* Polar Bear Standing On Ice Floe */}
            <g transform="translate(160, 48)">
              {/* Outer Translucent Fur Coat (White Camouflage) */}
              <ellipse cx="45" cy="36" rx="28" ry="17" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
              {/* Polar Bear Head & Snout (Short Ears - Allen's Rule) */}
              <ellipse cx="16" cy="30" rx="12" ry="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
              <circle cx="9" cy="30" r="2.2" fill="#0f172a" /> {/* Black nose tip */}
              <circle cx="16" cy="27" r="1.5" fill="#0f172a" /> {/* Dark eye */}
              <circle cx="21" cy="22" r="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" /> {/* Short rounded ear */}

              {/* Legs on Ice */}
              <rect x="22" y="44" width="9" height="15" rx="4" fill="#ffffff" stroke="#cbd5e1" />
              <rect x="36" y="44" width="9" height="15" rx="4" fill="#ffffff" stroke="#cbd5e1" />
              <rect x="54" y="44" width="9" height="15" rx="4" fill="#ffffff" stroke="#cbd5e1" />
              <rect x="66" y="44" width="9" height="15" rx="4" fill="#ffffff" stroke="#cbd5e1" />

              {/* Cutaway Callout: Blubber Layer Insulation */}
              <g transform="translate(42, 22)">
                <ellipse cx="0" cy="0" rx="14" ry="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" strokeDasharray="2 2" fillOpacity="0.75" />
                <text x="0" y="3" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#78350f">
                  BLUBBER (11cm)
                </text>
              </g>
            </g>

            {/* Temperature & Biome Tags */}
            <g transform="translate(15, 20)">
              <rect x="0" y="0" width="85" height="22" rx="11" fill="rgba(15,23,42,0.75)" stroke="#38bdf8" strokeWidth="1" />
              <text x="10" y="15" fill="#e0f2fe" fontSize="10" fontWeight="bold">❄️ Arctic: -40°C</text>
            </g>

            <g transform="translate(300, 20)">
              <rect x="0" y="0" width="85" height="22" rx="11" fill="rgba(15,23,42,0.75)" stroke="#fbbf24" strokeWidth="1" />
              <text x="8" y="15" fill="#fef08a" fontSize="10" fontWeight="bold">🛡️ Blubber Fat</text>
            </g>
          </svg>

          {/* Environmental Caption Overlay */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-400/30">
            <span>Scenario: Polar Bear Survival in Arctic Sub-zero Ice</span>
            <span className="text-cyan-300">துருவ கரடி மற்றும் பிளப்பர் தகவமைப்பு</span>
          </div>
        </div>
      );
    }

    if (isAntherQuestion) {
      return (
        <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-400/30 shadow-inner flex items-center justify-center p-3 select-none">
          <svg viewBox="0 0 400 150" className="w-full h-full object-contain">
            <defs>
              <linearGradient id="tapetumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            {/* Dithecous Bilobed Anther TS Silhouette */}
            <path
              d="M 120 75 C 90 20 180 20 200 65 C 220 20 310 20 280 75 C 310 130 220 130 200 85 C 180 130 90 130 120 75 Z"
              fill="#064e3b"
              stroke="#10b981"
              strokeWidth="3"
            />
            {/* 4 Microsporangia chambers */}
            <circle cx="150" cy="50" r="16" fill="url(#tapetumGrad)" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="250" cy="50" r="16" fill="url(#tapetumGrad)" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="150" cy="100" r="16" fill="url(#tapetumGrad)" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="250" cy="100" r="16" fill="url(#tapetumGrad)" stroke="#fef08a" strokeWidth="1.5" />

            {/* Pollen grains inside */}
            <circle cx="148" cy="48" r="3" fill="#ffffff" />
            <circle cx="154" cy="52" r="3" fill="#ffffff" />
            <circle cx="248" cy="48" r="3" fill="#ffffff" />
            <circle cx="254" cy="52" r="3" fill="#ffffff" />

            <text x="200" y="140" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="bold">
              Transverse Section: 4 Anther Wall Layers & Nutritive Tapetum
            </text>
          </svg>
        </div>
      );
    }

    if (isMendelQuestion) {
      return (
        <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-lime-950 via-slate-900 to-emerald-950 border-2 border-lime-400/30 shadow-inner flex items-center justify-center p-3 select-none">
          <svg viewBox="0 0 400 150" className="w-full h-full object-contain">
            <g transform="translate(60, 20)">
              <rect x="0" y="0" width="120" height="100" rx="12" fill="#14532d" stroke="#4ade80" strokeWidth="2" />
              <text x="60" y="24" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold">Monohybrid (F2)</text>
              <line x1="10" y1="35" x2="110" y2="35" stroke="#4ade80" strokeWidth="1" />
              <text x="60" y="58" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">3 Tall : 1 Dwarf</text>
              <text x="60" y="82" textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold">Genotype 1:2:1</text>
            </g>
            <g transform="translate(230, 25)">
              <circle cx="45" cy="45" r="40" fill="#047857" stroke="#34d399" strokeWidth="2" />
              <text x="45" y="42" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Gregor Mendel</text>
              <text x="45" y="58" textAnchor="middle" fill="#a7f3d0" fontSize="10">1865 Discovery</text>
            </g>
          </svg>
        </div>
      );
    }

    // Default Biological Visual Scenario Canvas
    return (
      <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/30 shadow-inner flex items-center justify-center p-4 text-center">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
            Topic {topic.number} • Visual Scenario Challenge
          </span>
          <h4 className="text-base sm:text-lg font-black text-white">{topic.title}</h4>
          <p className="text-xs text-emerald-200">12th Standard State Board Interactive Game Round</p>
        </div>
      </div>
    );
  };

  // Completed results view (Game Victory screen)
  if (isCompleted) {
    let correctCount = 0;
    const incorrectQuestions: string[] = [];

    questions.forEach((q, idx) => {
      const given = userAnswers[idx];
      if (given && q.correctOptionIds.includes(given)) {
        correctCount += 1;
      } else {
        incorrectQuestions.push(q.question);
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <section className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-10 space-y-8 shadow-xl text-center animate-fade-in">
        {/* Victory Badge */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-400 blur-lg opacity-40 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg">
            <Trophy size={40} className="stroke-[2.5]" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Game Round Finished!
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {passed ? 'Outstanding Biology Mastery! 🎉' : 'Good Effort! Keep Revising! 📚'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {passed
              ? 'You have successfully proven your conceptual knowledge in this 12th standard scenario.'
              : 'Review the verified explanations below or summon Prof. SPK for guidance.'}
          </p>
        </div>

        {/* Game Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 font-bold uppercase block">Score</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {score} pts
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 font-bold uppercase block">Accuracy</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {percentage}%
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 font-bold uppercase block">Max Streak</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Flame size={22} /> {highestStreak}x
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 font-bold uppercase block">Time Spent</span>
            <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
              {timeSpent}s
            </span>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="text-left space-y-3 max-w-2xl mx-auto pt-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" />
            Detailed Question Review & Model Explanations:
          </h4>
          <div className="space-y-3">
            {questions.map((q, idx) => {
              const givenId = userAnswers[idx];
              const isCorrect = givenId && q.correctOptionIds.includes(givenId);
              const correctOpt = q.options.find((o) => q.correctOptionIds.includes(o.id));
              const givenOpt = q.options.find((o) => o.id === givenId);

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-red-50/60 dark:bg-red-950/20 border-red-300 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-black text-slate-900 dark:text-slate-100">
                      {idx + 1}. {q.question}
                    </span>
                    <span className="shrink-0 mt-0.5">
                      {isCorrect ? (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      ) : (
                        <XCircle size={18} className="text-red-500" />
                      )}
                    </span>
                  </div>

                  {q.tamilQuestion && (
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      {q.tamilQuestion}
                    </p>
                  )}

                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Correct Answer:</span>{' '}
                    {correctOpt?.label}
                  </div>

                  {!isCorrect && givenOpt && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      <span className="font-bold">Your choice:</span> {givenOpt.label}
                    </div>
                  )}

                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 leading-relaxed">
                    💡 <span className="font-semibold">Textbook Fact:</span> {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw size={16} />
            <span>Play Quiz Again</span>
          </button>

          <button
            onClick={() =>
              onAskAnyDoubt({
                doubtPrompt: `I just completed the quiz for Topic ${topic.number} (${topic.title}). I scored ${correctCount}/${questions.length}. Can you explain where I made mistakes and teach me key memory tricks for board exams?`,
                topicId: topic.id,
                topicTitle: topic.title,
                score: correctCount,
                total: questions.length,
                incorrectQuestions,
              })
            }
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Sparkles size={16} />
            <span>Ask Prof. SPK to Explain Doubts</span>
          </button>
        </div>
      </section>
    );
  }

  // Active Question Game Round
  const isTimeUrgent = remainingSeconds <= 5;
  const timerPercentage = (remainingSeconds / questionTimeLimit) * 100;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/30 p-5 sm:p-8 space-y-6 shadow-lg animate-fade-in">
      {/* Top Game Bar: Header, Streak, Score, Timer, Sound */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
            🎮
          </span>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Visual Scenario Quiz • Game Mode
            </div>
            <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
              Question {currentIndex + 1} of {questions.length}
            </div>
          </div>
        </div>

        {/* Game Stats Pills */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Combo Badge */}
          {streak > 0 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 font-black text-xs animate-bounce">
              <Flame size={14} className="fill-amber-500" />
              <span>{streak}x Streak!</span>
            </div>
          )}

          {/* Current Score */}
          <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono font-black text-xs">
            {score} pts
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 cursor-pointer transition-colors"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* Progress & Countdown Timer Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-bold">Round Time:</span>
          <span
            className={`font-black flex items-center gap-1 ${
              isTimeUrgent ? 'text-red-500 animate-pulse text-sm' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            <Clock size={14} />
            {remainingSeconds}s
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              isTimeUrgent
                ? 'bg-red-500'
                : timerPercentage > 40
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-amber-500'
            }`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
      </div>

      {/* Interactive Visual Scenario (e.g. Polar Bear on Arctic Ice with Blubber) */}
      {renderVisualScenario()}

      {/* Question Card */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
          {currentQ.question}
        </h3>
        {currentQ.tamilQuestion && (
          <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {currentQ.tamilQuestion}
          </p>
        )}
      </div>

      {/* Option Cards (Grid Layout with Visual Selection) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOptionId === opt.id;
          const isCorrect = currentQ.correctOptionIds.includes(opt.id);

          let optionStyle =
            'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-800 dark:text-slate-200';

          if (isSelected && !isAnswerSubmitted) {
            optionStyle =
              'bg-emerald-500/10 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm';
          }

          if (isAnswerSubmitted) {
            if (isCorrect) {
              optionStyle =
                'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm';
            } else if (isSelected && !isCorrect) {
              optionStyle =
                'bg-red-500/20 border-2 border-red-500 text-red-900 dark:text-red-200 shadow-sm animate-shake';
            } else {
              optionStyle =
                'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 opacity-60 text-slate-500';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              disabled={isAnswerSubmitted}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.98] ${optionStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-white/70 dark:bg-slate-700/70 border border-slate-300 dark:border-slate-600 flex items-center justify-center font-mono font-black text-xs text-slate-700 dark:text-slate-300 shrink-0 group-hover:scale-105 transition-transform">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xs sm:text-sm font-semibold leading-relaxed">
                  {opt.label}
                </span>
              </div>

              {isAnswerSubmitted && isCorrect && (
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              )}
              {isAnswerSubmitted && isSelected && !isCorrect && (
                <XCircle size={18} className="text-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation & Immediate Feedback */}
      {isAnswerSubmitted && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 font-black text-emerald-700 dark:text-emerald-300">
            <Zap size={16} />
            <span>Textbook Rationale:</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() =>
            onAskAnyDoubt({
              doubtPrompt: `In Topic ${topic.number} (${topic.title}), for the question: "${currentQ.question}", can you explain the correct concept clearly?`,
              topicId: topic.id,
              topicTitle: topic.title,
              score,
              total: questions.length,
              incorrectQuestions: [],
            })
          }
          className="text-xs font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <HelpCircle size={15} />
          <span>Need a Hint from Prof. SPK?</span>
        </button>

        {!isAnswerSubmitted ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={selectedOptionId === null}
            className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              selectedOptionId !== null
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Lock Answer</span>
            <CheckCircle2 size={16} />
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </section>
  );
};
