import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllQuizQuestions } from '../curriculum/curriculumData';
import { InteractiveQuiz } from '../components/quizzes/InteractiveQuiz';
import { TimedExam } from '../components/quizzes/TimedExam';
import { QuizQuestion, SubjectId } from '../types/curriculum';
import {
  Trophy,
  Timer,
  Leaf,
  Dna,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface QuizHubProps {
  onSaveQuizScore: (quizId: string, score: number, total: number) => void;
  onSaveExamResult: (result: any) => void;
  onOpenAI: (quizContext: any) => void;
}

export const QuizHubPage: React.FC<QuizHubProps> = ({
  onSaveQuizScore,
  onSaveExamResult,
  onOpenAI,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'timed' ? 'timed' : 'practice';
  const initialSubject = (searchParams.get('subject') as SubjectId) || 'all';

  const [activeTab, setActiveTab] = useState<'practice' | 'timed'>(initialMode);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (searchParams.get('mode') === 'timed') {
      setActiveTab('timed');
    }
  }, [searchParams]);

  const questions = getAllQuizQuestions(selectedSubject === 'all' ? undefined : selectedSubject);

  const handleStartPractice = () => {
    setIsPlaying(true);
  };

  const subjectLabel =
    selectedSubject === 'bio-botany'
      ? 'Bio-Botany'
      : selectedSubject === 'bio-zoology'
      ? 'Bio-Zoology'
      : 'Class 12 Biology (Combined)';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Quiz Hub Header Banner */}
      {!isPlaying && (
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-6 sm:p-10 text-white border border-emerald-700/60 shadow-md">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20">
                Evaluation & Revision Center
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">
                <ShieldCheck size={14} /> Samacheer Kalvi Class 12
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Biology Practice & Timed Examinations
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Consolidate high-yield concepts from Bio-Botany and Bio-Zoology with instant explanations and official board exam timing.
            </p>
          </div>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      {!isPlaying && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Practice vs Timed Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
              <button
                onClick={() => {
                  setActiveTab('practice');
                  setSearchParams({});
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'practice'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Trophy size={16} className="text-amber-500" />
                <span>Interactive Quiz Game</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('timed');
                  setSearchParams({ mode: 'timed' });
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'timed'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Timer size={16} className="text-blue-500" />
                <span>Timed Exam Mode</span>
              </button>
            </div>

            {/* Subject Selector Filter */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedSubject('all')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                  selectedSubject === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                All Subjects
              </button>
              <button
                onClick={() => setSelectedSubject('bio-botany')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
                  selectedSubject === 'bio-botany'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Leaf size={13} />
                <span>Bio-Botany</span>
              </button>
              <button
                onClick={() => setSelectedSubject('bio-zoology')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
                  selectedSubject === 'bio-zoology'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Dna size={13} />
                <span>Bio-Zoology</span>
              </button>
            </div>
          </div>

          {/* Practice Mode Intro Card */}
          {activeTab === 'practice' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                  <Trophy size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  Interactive Quiz Game: {subjectLabel}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Earn streak multipliers, get immediate explanations for every question, and retry missed questions to achieve a perfect score.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400 block font-semibold">Available Questions:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-base">{questions.length} Questions</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400 block font-semibold">Gamification:</span>
                  <span className="font-bold text-amber-600 text-base">Streaks & Badges</span>
                </div>
              </div>

              <button
                onClick={handleStartPractice}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Start Interactive Quiz</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Render Active Component */}
      {activeTab === 'practice' && isPlaying && (
        <InteractiveQuiz
          title={`Interactive Biology Quiz: ${subjectLabel}`}
          questions={questions}
          onCompleteQuiz={(score, total) => {
            onSaveQuizScore(`quiz-${selectedSubject}`, score, total);
          }}
          onAskAI={onOpenAI}
          onBack={() => setIsPlaying(false)}
        />
      )}

      {activeTab === 'timed' && (
        <TimedExam
          questions={questions}
          subjectId={selectedSubject === 'all' ? undefined : (selectedSubject as SubjectId)}
          subjectTitle={subjectLabel}
          onFinishExam={(res) => {
            onSaveExamResult({
              id: `exam-${Date.now()}`,
              date: new Date().toLocaleDateString(),
              score: res.score,
              total: res.total,
              timeSpentSeconds: res.timeSpentSeconds,
              subjectId: selectedSubject === 'all' ? undefined : (selectedSubject as SubjectId),
              accuracy: res.accuracy,
            });
          }}
          onAskAI={onOpenAI}
          onBack={() => {
            setActiveTab('practice');
            setSearchParams({});
          }}
        />
      )}
    </div>
  );
};
