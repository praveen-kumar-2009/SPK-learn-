import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { SubjectDashboard } from './pages/SubjectDashboard';
import { LessonTopicsPage } from './pages/LessonTopicsPage';
import { LessonPage } from './pages/LessonPage';
import { QuizHubPage } from './pages/QuizHubPage';
import { ProgressPage } from './pages/ProgressPage';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { ProfSPKAvatar } from './components/ai/ProfSPKAvatar';
import { UserProgress, AIContext, StructuredAIAction, TimedExamResult } from './types/curriculum';
import { findTopicByGlobalNumber } from './curriculum/curriculumData';
import { Sparkles } from 'lucide-react';

const STORAGE_KEY = 'spk_learn_progress_v2';

const defaultProgress: UserProgress = {
  completedTopics: ['topic-1.1'],
  completedSlides: {},
  quizAttempts: {},
  streakDays: 3,
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load progress from localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse local progress:', e);
    }
    return defaultProgress;
  });

  // Save progress on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save local progress:', e);
    }
  }, [progress]);

  // AI Assistant Modal State
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [aiContext, setAIContext] = useState<AIContext>({});

  // Dynamic context update based on URL location
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/subject/bio-botany')) {
      setAIContext((prev) => ({ ...prev, subjectId: 'bio-botany', subjectTitle: 'Bio-Botany' }));
    } else if (path.includes('/subject/biology')) {
      setAIContext((prev) => ({ ...prev, subjectId: 'biology', subjectTitle: 'Biology' }));
    }
  }, [location.pathname]);

  const handleOpenAI = (customContext?: Partial<AIContext>) => {
    if (customContext) {
      setAIContext((prev) => ({ ...prev, ...customContext }));
    }
    setIsAIOpen(true);
  };

  const handleCompleteTopic = (topicId: string) => {
    setProgress((prev) => {
      if (prev.completedTopics.includes(topicId)) return prev;
      return {
        ...prev,
        completedTopics: [...prev.completedTopics, topicId],
      };
    });
  };

  const handleSaveQuizResult = (
    topicId: string,
    score: number,
    total: number,
    timeSpent: number
  ) => {
    setProgress((prev) => ({
      ...prev,
      quizAttempts: {
        ...prev.quizAttempts,
        [topicId]: {
          score,
          total,
          accuracy: total > 0 ? Math.round((score / total) * 100) : 0,
          timeSpent,
          date: new Date().toLocaleDateString(),
        },
      },
    }));
  };

  const handleResetProgress = () => {
    setProgress({
      completedTopics: [],
      completedSlides: {},
      quizAttempts: {},
      timedExamResults: [],
      streakDays: 1,
    });
  };

  const handleSaveQuizScore = (quizId: string, score: number, total: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...(prev.quizScores || {}),
        [quizId]: {
          attempts: ((prev.quizScores && prev.quizScores[quizId]?.attempts) || 0) + 1,
          highscore: Math.max((prev.quizScores && prev.quizScores[quizId]?.highscore) || 0, score * 10),
        },
      },
      quizAttempts: {
        ...prev.quizAttempts,
        [quizId]: {
          score,
          total,
          accuracy: total > 0 ? Math.round((score / total) * 100) : 0,
          timeSpent: 60,
          date: new Date().toLocaleDateString(),
        },
      },
    }));
  };

  const handleSaveExamResult = (result: any) => {
    const examRecord: TimedExamResult = {
      id: 'exam-' + Date.now(),
      subjectId: 'class-12-biology',
      score: result.score,
      total: result.total,
      accuracy: result.accuracy,
      timeSpentSeconds: result.timeSpentSeconds,
      date: new Date().toLocaleDateString(),
    };
    setProgress((prev) => ({
      ...prev,
      timedExamResults: [examRecord, ...(prev.timedExamResults || [])],
    }));
  };

  // Safe navigation action executor for AI Assistant
  const handleExecuteAction = (action: StructuredAIAction) => {
    switch (action.action) {
      case 'OPEN_SUBJECT':
        if (action.subjectId) {
          const sub = action.subjectId.toLowerCase().includes('zoo') ? 'zoology' : 'botany';
          navigate(`/learn/${sub}`);
        }
        break;
      case 'OPEN_LESSON':
        if (action.subjectId && action.lessonId) {
          const sub = action.subjectId.toLowerCase().includes('zoo') ? 'zoology' : 'botany';
          navigate(`/learn/${sub}/${action.lessonId}`);
        }
        break;
      case 'OPEN_TOPIC':
        if (action.subjectId && action.lessonId && action.topicId) {
          const sub = action.subjectId.toLowerCase().includes('zoo') ? 'zoology' : 'botany';
          navigate(`/learn/${sub}/${action.lessonId}/${action.topicId}`);
        } else if (action.topicNumber) {
          const found = findTopicByGlobalNumber(action.topicNumber);
          if (found) {
            const sub = found.subject.id.toLowerCase().includes('zoo') ? 'zoology' : 'botany';
            navigate(`/learn/${sub}/${found.lesson.id}/${found.topic.id}`);
          }
        }
        break;
      case 'TAKE_QUIZ':
        navigate('/quizzes');
        break;
      default:
        console.warn('Unhandled navigation action:', action);
    }
    setIsAIOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header Navbar */}
      <Navbar onOpenAI={() => handleOpenAI()} />

      {/* Main Screen Routes */}
      <main className="flex-1">
        <Routes>
          {/* Screen A: Home */}
          <Route path="/" element={<HomePage progress={progress} onOpenAI={() => handleOpenAI()} />} />

          {/* Learn Route Aliases matching video */}
          <Route
            path="/learn/:subjectId"
            element={<SubjectDashboard progress={progress} onOpenAI={handleOpenAI} />}
          />
          <Route
            path="/learn/:subjectId/:lessonId"
            element={<LessonTopicsPage progress={progress} onOpenAI={handleOpenAI} />}
          />
          <Route
            path="/learn/:subjectId/:lessonId/:topicId"
            element={
              <LessonPage
                progress={progress}
                onCompleteTopic={handleCompleteTopic}
                onSaveQuizResult={handleSaveQuizResult}
                onOpenAI={handleOpenAI}
              />
            }
          />

          {/* Screen B: Subject Lesson Titles List */}
          <Route
            path="/subject/:subjectId"
            element={<SubjectDashboard progress={progress} onOpenAI={handleOpenAI} />}
          />

          {/* Screen C: Lesson Numbered Topic List */}
          <Route
            path="/subject/:subjectId/lesson/:lessonId"
            element={<LessonTopicsPage progress={progress} onOpenAI={handleOpenAI} />}
          />

          {/* Screen D: Topic Slide Lesson + Important Questions + Timed Quiz */}
          <Route
            path="/subject/:subjectId/lesson/:lessonId/topic/:topicId"
            element={
              <LessonPage
                progress={progress}
                onCompleteTopic={handleCompleteTopic}
                onSaveQuizResult={handleSaveQuizResult}
                onOpenAI={handleOpenAI}
              />
            }
          />

          {/* Direct topic lookup shortcut routes */}
          <Route
            path="/topic/:topicId"
            element={
              <LessonPage
                progress={progress}
                onCompleteTopic={handleCompleteTopic}
                onSaveQuizResult={handleSaveQuizResult}
                onOpenAI={handleOpenAI}
              />
            }
          />
          <Route
            path="/lesson/:topicId"
            element={
              <LessonPage
                progress={progress}
                onCompleteTopic={handleCompleteTopic}
                onSaveQuizResult={handleSaveQuizResult}
                onOpenAI={handleOpenAI}
              />
            }
          />

          {/* Screen E: Quiz Challenges & Timed Exams Hub */}
          <Route
            path="/quizzes"
            element={
              <QuizHubPage
                onSaveQuizScore={handleSaveQuizScore}
                onSaveExamResult={handleSaveExamResult}
                onOpenAI={handleOpenAI}
              />
            }
          />
          <Route
            path="/quiz"
            element={
              <QuizHubPage
                onSaveQuizScore={handleSaveQuizScore}
                onSaveExamResult={handleSaveExamResult}
                onOpenAI={handleOpenAI}
              />
            }
          />

          {/* Screen F: Student Progress Analytics & Badges */}
          <Route
            path="/progress"
            element={
              <ProgressPage
                progress={progress}
                onResetProgress={handleResetProgress}
                onOpenAI={handleOpenAI}
              />
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<HomePage progress={progress} onOpenAI={() => handleOpenAI()} />} />
        </Routes>
      </main>

      {/* Persistent Floating Real Human AI Assistant Launcher (Prof. SPK with Waving Hands) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => handleOpenAI()}
          className="relative group flex items-center gap-3 pl-2 pr-5 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm shadow-2xl shadow-emerald-950/40 hover:shadow-emerald-950/60 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-emerald-500/40 backdrop-blur-md"
          aria-label="Ask Human AI Biology Assistant Prof. SPK"
        >
          <span className="absolute -inset-1 rounded-full bg-emerald-500/25 blur-md group-hover:bg-emerald-400/40 transition-colors animate-pulse pointer-events-none" />

          {/* Real Human Avatar with Shaking Hands */}
          <div className="relative w-11 h-11 shrink-0">
            <ProfSPKAvatar size="sm" isWaving={true} className="w-11 h-11" />
          </div>

          <div className="text-left leading-tight pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wide text-emerald-400 uppercase">
                Prof. SPK · AI Tutor
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>Ask AI Assistant</span>
              <Sparkles size={13} className="text-amber-400" />
            </div>
          </div>
        </button>
      </div>

      {/* AI Assistant Modal / Side Panel with Animated Guide */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        context={aiContext}
        onExecuteAction={handleExecuteAction}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
