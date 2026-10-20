import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../../types/curriculum';
import confetti from 'canvas-confetti';
import { Clock, RotateCcw, Award } from 'lucide-react';

interface QuizProps {
  title?: string;
  questions: QuizQuestion[];
  topicId?: string;
  onCompleteQuiz?: (score: number, total: number, incorrectList?: string[]) => void;
  onAskAI?: (context: any) => void;
  onBack?: () => void;
}

interface UserAnswerRecord {
  question: string;
  userAnswerLabel: string;
  correctAnswerLabel: string;
  isCorrect: boolean;
  explanation: string;
}

export const InteractiveQuiz: React.FC<QuizProps> = ({
  title = 'Quiz Challenge',
  questions,
  topicId = 'default',
  onCompleteQuiz,
  onAskAI,
}) => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [bestScore, setBestScore] = useState<string>('0/0');
  const [answerHistory, setAnswerHistory] = useState<UserAnswerRecord[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const totalQuestions = questions && questions.length > 0 ? questions.length : 4;
  const currentQ = questions[currentIndex] || {
    id: 'default-1',
    type: 'mcq',
    question: 'The transfer of pollen from one flower to another flower of the same plant is called...',
    options: [
      { id: 'a', label: 'Autogamy' },
      { id: 'b', label: 'Geitonogamy' },
      { id: 'c', label: 'Xenogamy' },
      { id: 'd', label: 'Cleistogamy' },
    ],
    correctOptionIds: ['b'],
    explanation: 'Geitonogamy is the transfer of pollen grains from the anther to the stigma of another flower of the same plant.',
    timeLimitSeconds: 30,
  };

  // Load best score on device
  useEffect(() => {
    const saved = localStorage.getItem(`spk_quiz_best_${topicId}`);
    if (saved) {
      setBestScore(saved);
    } else {
      setBestScore(`2/${totalQuestions}`);
    }
  }, [topicId, totalQuestions]);

  // Timer countdown during active question
  useEffect(() => {
    if (!hasStarted || isCompleted || isAnswerRevealed) return;

    if (secondsLeft <= 0) {
      // Time ran out - reveal answer
      setIsAnswerRevealed(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isCompleted, isAnswerRevealed, secondsLeft]);

  const handleStart = () => {
    setHasStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setSecondsLeft(30);
    setSelectedOptionId(null);
    setIsAnswerRevealed(false);
    setIsCompleted(false);
    setAnswerHistory([]);
    setStartTime(Date.now());
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswerRevealed) return;
    setSelectedOptionId(optId);
    setIsAnswerRevealed(true);

    const isCorrect = currentQ.correctOptionIds.includes(optId);
    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }
    }

    const userOpt = currentQ.options.find((o) => o.id === optId);
    const correctOpt = currentQ.options.find((o) => currentQ.correctOptionIds.includes(o.id));

    setAnswerHistory((prev) => [
      ...prev,
      {
        question: currentQ.question,
        userAnswerLabel: userOpt?.label || 'No answer',
        correctAnswerLabel: correctOpt?.label || '',
        isCorrect,
        explanation: currentQ.explanation || '',
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerRevealed(false);
      setSecondsLeft(30);
    } else {
      setIsCompleted(true);
      const finalBest = `${Math.max(score, parseInt(bestScore.split('/')[0]) || 0)}/${totalQuestions}`;
      localStorage.setItem(`spk_quiz_best_${topicId}`, finalBest);
      setBestScore(finalBest);
      onCompleteQuiz?.(score, totalQuestions, []);
    }
  };

  const totalTimeUsedSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
  const accuracyPct = Math.round((score / totalQuestions) * 100);

  return (
    <div className="bg-[#1e4e3f] text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden transition-all">
      {/* State 1: Before Starting */}
      {!hasStarted && (
        <div className="space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Quiz Challenge
          </h3>
          <p className="text-emerald-100/90 text-sm leading-relaxed max-w-xl">
            {totalQuestions} questions · 30 seconds each. Answers are revealed after you choose or time runs out.
          </p>

          <div className="pt-2">
            <button
              onClick={handleStart}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-[#144738] font-bold px-7 py-3 rounded-full text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              Start Quiz
            </button>
          </div>

          <p className="text-xs text-emerald-200/70 pt-2 font-medium">
            Best score on this device: {bestScore}
          </p>
        </div>
      )}

      {/* State 2: Active Quiz Question (Video 1:25 - 1:32) */}
      {hasStarted && !isCompleted && (
        <div className="space-y-5 animate-fade-in">
          {/* Header Row: Question X of Y · Score: X · ⏱ 29s left */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-emerald-100">
            <span>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span>Score: {score}</span>
            <div className="inline-flex items-center gap-1.5 bg-[#143d31] px-3 py-1 rounded-full text-xs text-emerald-200 border border-emerald-500/20">
              <Clock size={13} />
              <span>{secondsLeft}s left</span>
            </div>
          </div>

          {/* Yellow Progress Bar */}
          <div className="w-full h-1.5 bg-emerald-950/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#f59e0b] rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>

          {/* Question Text */}
          <h4 className="font-sans text-base sm:text-lg font-medium text-white leading-snug pt-1">
            {currentQ.question}
          </h4>

          {/* Options: 4 rounded buttons matching video */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = currentQ.correctOptionIds.includes(option.id);

              let buttonStyle =
                'bg-[#275a4a] hover:bg-[#2d6855] text-white border-transparent';
              if (isAnswerRevealed) {
                if (isCorrect) {
                  buttonStyle = 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-md';
                } else if (isSelected && !isCorrect) {
                  buttonStyle = 'bg-rose-600/90 text-white border-rose-400';
                } else {
                  buttonStyle = 'bg-[#275a4a]/50 text-emerald-200/50 border-transparent';
                }
              }

              return (
                <button
                  key={option.id}
                  disabled={isAnswerRevealed}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full p-4 rounded-2xl text-left font-medium text-sm sm:text-base border transition-all flex items-center justify-between cursor-pointer ${buttonStyle}`}
                >
                  <span>{option.label}</span>
                  {isAnswerRevealed && (
                    <span>
                      {isCorrect && (
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                          ✓
                        </span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                          ✕
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Question Button (Video 1:27) */}
          {isAnswerRevealed && (
            <div className="space-y-4 pt-2 animate-fade-in">
              {currentQ.explanation && (
                <p className="text-xs sm:text-sm text-emerald-100/90 bg-[#163e32] p-3.5 rounded-xl border border-emerald-400/20 leading-relaxed">
                  {currentQ.explanation}
                </p>
              )}

              <div>
                <button
                  onClick={handleNextQuestion}
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-[#144738] font-bold px-7 py-2.5 rounded-full text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  Next question
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-1 text-xs text-emerald-200/70">
            <span>Best score on this device: {bestScore}</span>
          </div>
        </div>
      )}

      {/* State 3: Quiz Completed (Video 1:33 - 1:36 matching) */}
      {isCompleted && (
        <div className="space-y-5 py-2 animate-fade-in">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Quiz Challenge
          </h3>

          {/* Big Score: 2/4 */}
          <div className="text-4xl sm:text-5xl font-black font-serif text-white tracking-tight">
            {score}/{totalQuestions}
          </div>

          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            {accuracyPct}% · {score} correct, {totalQuestions - score} incorrect · time used {totalTimeUsedSec}s
          </p>

          {/* Detailed Question Review Cards matching Video 1:33 */}
          <div className="space-y-3 pt-2">
            {answerHistory.map((item, idx) => (
              <div
                key={idx}
                className="bg-white text-slate-800 p-4 rounded-2xl shadow-xs space-y-1.5 text-left border border-slate-200"
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      item.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.isCorrect ? '✓' : '✕'}
                  </span>
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-slate-900 leading-snug">
                      {idx + 1}. {item.question}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1">
                      Your answer: <span className={item.isCorrect ? 'font-bold text-emerald-800' : 'line-through text-rose-700'}>{item.userAnswerLabel}</span>
                    </p>
                    {!item.isCorrect && (
                      <p className="text-xs font-bold text-emerald-800">
                        Correct answer: {item.correctAnswerLabel}
                      </p>
                    )}
                    {item.explanation && (
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {item.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={handleStart}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm border border-white/20 transition-colors cursor-pointer"
            >
              Retry Quiz
            </button>
            <button
              onClick={() => onAskAI?.({ topicId, score })}
              className="bg-[#143d31] hover:bg-[#0f2e25] text-emerald-100 font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm border border-emerald-500/30 transition-colors cursor-pointer"
            >
              Ask Any Doubt
            </button>
          </div>

          <p className="text-xs text-emerald-200/70 pt-2">
            Best score on this device: {bestScore}
          </p>
        </div>
      )}
    </div>
  );
};
