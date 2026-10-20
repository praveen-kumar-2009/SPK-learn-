import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, SubjectId } from '../../types/curriculum';
import {
  Timer,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface TimedExamProps {
  questions: QuizQuestion[];
  subjectId?: SubjectId;
  subjectTitle?: string;
  onFinishExam: (result: {
    score: number;
    total: number;
    accuracy: number;
    timeSpentSeconds: number;
  }) => void;
  onAskAI?: (quizContext: {
    quizTitle: string;
    score: number;
    total: number;
    incorrectQuestions: string[];
    mode: 'voice' | 'text';
  }) => void;
  onBack?: () => void;
}

export const TimedExam: React.FC<TimedExamProps> = ({
  questions,
  subjectId,
  subjectTitle = 'Class 12 Biology',
  onFinishExam,
  onAskAI,
  onBack,
}) => {
  // Configuration options before exam starts
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number>(10);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(
    Math.min(questions.length, 10)
  );

  // Active exam state
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(600);
  const [endTime, setEndTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start exam handler
  const handleStartExam = () => {
    // Shuffle and pick subset
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, selectedQuestionCount);
    setActiveQuestions(picked);

    const durationSec = selectedDurationMinutes * 60;
    const finishTimestamp = Date.now() + durationSec * 1000;
    setEndTime(finishTimestamp);
    setRemainingSeconds(durationSec);
    setHasStarted(true);
    setIsCompleted(false);
  };

  // Resilient Countdown Timer based on Date.now()
  useEffect(() => {
    if (!hasStarted || isCompleted) return;

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleSubmitExam(true);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, endTime, isCompleted]);

  const handleSubmitExam = (isTimeUp = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowConfirmSubmit(false);
    setIsCompleted(true);

    const spentSec = Math.round(selectedDurationMinutes * 60 - remainingSeconds);
    setTotalTimeSpent(spentSec);

    // Calculate score
    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      const selectedOpt = userAnswers[idx] !== undefined ? q.options[userAnswers[idx]] : undefined;
      if (selectedOpt && q.correctOptionIds.includes(selectedOpt.id)) {
        correctCount += 1;
      }
    });

    const total = activeQuestions.length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    onFinishExam({
      score: correctCount,
      total,
      accuracy,
      timeSpentSeconds: spentSec,
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Pre-Exam Setup View
  if (!hasStarted) {
    return (
      <div className="max-w-xl mx-auto w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Timer size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
            Timed Examination Mode
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Simulate realistic Tamil Nadu Higher Secondary Board Exam conditions for {subjectTitle}.
          </p>
        </div>

        {/* Configuration */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 uppercase tracking-wide">
              Exam Duration:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSelectedDurationMinutes(mins)}
                  className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    selectedDurationMinutes === mins
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 uppercase tracking-wide">
              Question Count:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[5, Math.min(10, questions.length), questions.length].map((cnt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedQuestionCount(cnt)}
                  className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    selectedQuestionCount === cnt
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            Examination Rules:
          </span>
          <p>• The countdown runs continuously and will automatically submit when time expires.</p>
          <p>• You may jump freely between questions using the question grid navigator.</p>
          <p>• Detailed verified textbook explanations are provided immediately upon submission.</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Back
            </button>
          )}
          <button
            onClick={handleStartExam}
            className="ml-auto text-xs sm:text-sm font-bold px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95"
          >
            Begin Examination Now
          </button>
        </div>
      </div>
    );
  }

  // Post-Exam Comprehensive Review View
  if (isCompleted) {
    let correctCount = 0;
    const incorrectList: { q: QuizQuestion; given: number }[] = [];

    activeQuestions.forEach((q, idx) => {
      const selectedOpt = userAnswers[idx] !== undefined ? q.options[userAnswers[idx]] : undefined;
      if (selectedOpt && q.correctOptionIds.includes(selectedOpt.id)) {
        correctCount += 1;
      } else {
        incorrectList.push({ q, given: userAnswers[idx] });
      }
    });

    const total = activeQuestions.length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return (
      <div className="max-w-3xl mx-auto w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Official Examination Summary
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
            {subjectTitle} Results
          </h2>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-semibold block">Score</span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {correctCount} / {total}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-semibold block">Accuracy</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {accuracy}%
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-semibold block">Time Taken</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {formatTime(totalTimeSpent)}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-semibold block">Board Rating</span>
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {accuracy >= 80 ? 'Distinction' : accuracy >= 60 ? 'First Class' : 'Needs Practice'}
            </span>
          </div>
        </div>

        {/* Ask SPKLN AI Post-Exam Review */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-sm">
              <Sparkles size={18} className="text-emerald-600" />
              <span>Still have questions? Ask SPKLN AI</span>
            </div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium hidden sm:inline">
              Personalized Board Exam Coaching
            </span>
          </div>
          <p className="text-xs text-emerald-800 dark:text-emerald-300">
            Your AI Tutor knows your test answers and can break down tricky concepts or guide you through revision topics.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() =>
                onAskAI?.({
                  quizTitle: `Timed Exam: ${subjectTitle}`,
                  score: correctCount,
                  total,
                  incorrectQuestions: incorrectList.map((item) => item.q.question),
                  mode: 'voice',
                })
              }
              className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95 flex items-center gap-2"
            >
              <span>🎙️ Ask by Voice</span>
            </button>
            <button
              onClick={() =>
                onAskAI?.({
                  quizTitle: `Timed Exam: ${subjectTitle}`,
                  score: correctCount,
                  total,
                  incorrectQuestions: incorrectList.map((item) => item.q.question),
                  mode: 'text',
                })
              }
              className="text-xs font-bold px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>💬 Ask by Text</span>
            </button>
          </div>
        </div>

        {/* Detailed Question by Question Review */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Detailed Question Review:
          </h4>
          <div className="space-y-3">
            {activeQuestions.map((q, idx) => {
              const given = userAnswers[idx];
              const selectedOpt = given !== undefined ? q.options[given] : undefined;
              const isCorrect = selectedOpt !== undefined && q.correctOptionIds.includes(selectedOpt.id);
              const correctLabel = q.options
                .filter((o) => q.correctOptionIds.includes(o.id))
                .map((o) => o.label)
                .join(', ');
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2.5 ${
                    isCorrect
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Q{idx + 1}: {q.question}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                    </span>
                  </div>

                  {q.tamilQuestion && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      {q.tamilQuestion}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block font-semibold">Your Answer:</span>
                      <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                        {selectedOpt ? selectedOpt.label : 'Unanswered'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block font-semibold">Verified Correct Answer:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {correctLabel || 'Correct answer'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">
                      Textbook Explanation:
                    </span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setHasStarted(false)}
            className="text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all"
          >
            Take Another Exam
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-all"
            >
              Exit to Subject
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active Exam Question & Navigation View
  const activeQ = activeQuestions[currentQIndex];
  const isTimeCritical = remainingSeconds < 120;

  return (
    <div className="max-w-3xl mx-auto w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Banner: Timer & Question Index */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
            {subjectTitle}
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Question {currentQIndex + 1} of {activeQuestions.length}
          </span>
        </div>

        {/* Resilient Countdown display */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base ${
            isTimeCritical
              ? 'bg-red-50 text-red-600 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800 animate-pulse'
              : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
          }`}
        >
          <Clock size={16} />
          <span>{formatTime(remainingSeconds)}</span>
        </div>
      </div>

      {/* Question Navigator Grid */}
      <div className="flex flex-wrap gap-1.5">
        {activeQuestions.map((_, idx) => {
          const isAnswered = userAnswers[idx] !== undefined;
          const isCurrent = idx === currentQIndex;
          return (
            <button
              key={idx}
              onClick={() => setCurrentQIndex(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                isCurrent
                  ? 'ring-2 ring-blue-600 bg-blue-600 text-white'
                  : isAnswered
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Box */}
      {activeQ && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {activeQ.question}
            </h3>
            {activeQ.tamilQuestion && (
              <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                {activeQ.tamilQuestion}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {activeQ.options.map((opt, optIdx) => {
              const isSelected = userAnswers[currentQIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() =>
                    setUserAnswers((prev) => ({
                      ...prev,
                      [currentQIndex]: optIdx,
                    }))
                  }
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between shadow-2xs ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <CheckCircle2 size={18} className="text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={() => setCurrentQIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentQIndex === 0}
          className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <button
          onClick={() => setShowConfirmSubmit(true)}
          className="text-xs sm:text-sm font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
        >
          Submit Exam
        </button>

        <button
          onClick={() =>
            setCurrentQIndex((prev) => Math.min(prev + 1, activeQuestions.length - 1))
          }
          disabled={currentQIndex === activeQuestions.length - 1}
          className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Submit Your Examination?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              You have answered {Object.keys(userAnswers).length} out of {activeQuestions.length} questions. You still have {formatTime(remainingSeconds)} remaining.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Return to Exam
              </button>
              <button
                onClick={() => handleSubmitExam(false)}
                className="text-xs sm:text-sm font-bold px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
