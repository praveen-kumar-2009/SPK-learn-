import React from 'react';
import { Link } from 'react-router-dom';
import { UserProgress } from '../types/curriculum';
import { getAllVerifiedTopics } from '../curriculum/curriculumData';
import {
  Trophy,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ProgressPageProps {
  progress: UserProgress;
  onResetProgress?: () => void;
  onOpenAI: (ctx?: any) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  progress,
  onResetProgress,
  onOpenAI,
}) => {
  const verifiedTopics = getAllVerifiedTopics();
  const totalTopics = verifiedTopics.length;
  const completedTopicsCount = progress.completedTopics.length;
  const overallPercentage = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

  // Compute quiz stats
  const quizAttemptsArray = Object.values(progress.quizAttempts || {});
  const totalQuizAttempts = quizAttemptsArray.length;
  const totalQuizPoints = quizAttemptsArray.reduce((acc, q) => acc + q.score * 10, 0);
  const timedExams = progress.timedExamResults || [];

  // List of standard biology achievements
  const achievements = [
    {
      id: 'first_step',
      title: 'Botanical Explorer',
      description: 'Completed your first Bio-Botany lesson',
      isUnlocked: progress.completedTopics.some((id) => id.includes('1.1') || id.startsWith('botany')),
      icon: '🌿',
    },
    {
      id: 'ovule_master',
      title: 'Master of Megasporangium',
      description: 'Completed Anatropous Ovule visual diagram and check',
      isUnlocked: progress.completedTopics.includes('topic-1.5') || progress.completedTopics.includes('botany-1.5'),
      icon: '🔬',
    },
    {
      id: 'immune_shield',
      title: 'Immune Defender',
      description: 'Mastered Immunoglobulin IgG molecular structure',
      isUnlocked: progress.completedTopics.includes('topic-7.2') || progress.completedTopics.includes('zoology-7.2'),
      icon: '🛡️',
    },
    {
      id: 'exam_veteran',
      title: 'Board Exam Ready',
      description: 'Attempted at least 1 Timed Examination',
      isUnlocked: timedExams.length > 0,
      icon: '⏱️',
    },
    {
      id: 'quiz_streak',
      title: 'Genetics Prodigy',
      description: 'Scored over 50 points in biology quizzes',
      isUnlocked: totalQuizPoints >= 50,
      icon: '🔥',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Student Analytics & Milestones
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            My Biology Learning Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tamil Nadu Class 12 Samacheer Kalvi Biology (2026–2027)
          </p>
        </div>

        {/* Local storage indicator */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-right">
          <span className="text-[11px] font-semibold text-slate-400 block">
            Storage Status:
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            Locally Cached on this device
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Syllabus Completion</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {overallPercentage}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({completedTopicsCount}/{totalTopics} topics)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${overallPercentage}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Daily Study Streak</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-amber-500">
              {progress.streakDays || 1}
            </span>
            <span className="text-xs text-slate-500 font-medium">Days active 🔥</span>
          </div>
          <p className="text-[11px] text-slate-400">Consistency boosts retention</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Quiz Points Earned</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {totalQuizPoints}
            </span>
            <span className="text-xs text-slate-500 font-medium">pts</span>
          </div>
          <p className="text-[11px] text-slate-400">{totalQuizAttempts} total quiz attempts</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Timed Exams Taken</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400">
              {timedExams.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">mock tests</span>
          </div>
          <p className="text-[11px] text-slate-400">Board exam simulation</p>
        </div>
      </div>

      {/* Suggested Revision Topics */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-emerald-600" />
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
              High-Yield Recommended Revision Lessons
            </h3>
          </div>
          <span className="text-xs text-slate-500">Tamil Nadu State Board Essentials</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {verifiedTopics.map((top) => {
            const isDone = progress.completedTopics.includes(top.id);
            return (
              <div
                key={top.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Topic {top.topicNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">Ch {top.chapterNumber}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {top.title}
                  </h4>
                  {top.tamilTitle && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                      {top.tamilTitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700 text-xs">
                  <span className={isDone ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                    {isDone ? 'Completed' : 'Pending Revision'}
                  </span>
                  <Link
                    to={`/lesson/${top.id}`}
                    className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    Launch <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges and Achievements */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-amber-500" />
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
            Biology Mastery Badges
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                ach.isUnlocked
                  ? 'border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/20 text-slate-400 opacity-60'
              }`}
            >
              <div className="text-3xl">{ach.icon}</div>
              <div>
                <h5 className="font-bold text-xs sm:text-sm">{ach.title}</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {ach.description}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                  ach.isUnlocked
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {ach.isUnlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timed Exam History Table */}
      {timedExams.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
              Timed Exam Log
            </h3>
            <span className="text-xs text-slate-500">Recent Test Submissions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Accuracy</th>
                  <th className="pb-2">Time Spent</th>
                  <th className="pb-2">Review with AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {timedExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="py-3 font-medium text-slate-700 dark:text-slate-300">{exam.date}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-slate-100">
                      {exam.score} / {exam.total}
                    </td>
                    <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {exam.accuracy}%
                    </td>
                    <td className="py-3 text-slate-500 font-mono">
                      {Math.floor(exam.timeSpentSeconds / 60)}m {exam.timeSpentSeconds % 60}s
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() =>
                          onOpenAI({
                            recentQuizScore: {
                              score: exam.score,
                              total: exam.total,
                              quizTitle: 'Class 12 Timed Exam',
                              incorrect: [],
                            },
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        <Sparkles size={13} />
                        <span>Ask AI</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Local storage note & Reset Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
        <p>
          Note: In this version of SPK learn, your progress is saved locally on this browser. It does not synchronize across different devices.
        </p>
        {onResetProgress && (
          <button
            onClick={onResetProgress}
            className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 shrink-0"
          >
            <RotateCcw size={13} />
            <span>Reset Local Progress</span>
          </button>
        )}
      </div>
    </div>
  );
};
