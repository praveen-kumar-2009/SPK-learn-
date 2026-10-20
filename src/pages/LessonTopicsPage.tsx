import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLessonById } from '../curriculum/curriculumData';
import { UserProgress } from '../types/curriculum';
import { BookOpen, ExternalLink, ListFilter } from 'lucide-react';
import { ProfSPKFloatingButton } from '../components/ai/ProfSPKFloatingButton';

interface LessonTopicsPageProps {
  progress: UserProgress;
  onOpenAI: (ctx?: any) => void;
}

export const LessonTopicsPage: React.FC<LessonTopicsPageProps> = ({ progress, onOpenAI }) => {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>();
  const navigate = useNavigate();

  const data = getLessonById(subjectId || '', lessonId || '');

  if (!data) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif text-[#144738]">Chapter Not Found</h2>
        <Link to={`/subject/${subjectId}`} className="text-emerald-700 font-bold hover:underline">
          Back to Lessons
        </Link>
      </div>
    );
  }

  const { subject, lesson } = data;
  const isBotany = subject.id === 'bio-botany';
  const subjectDisplayTitle = isBotany ? 'Botany' : 'Zoology';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f5ec]/70 via-[#f9fbf9] to-[#f4f7f5] text-slate-800 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Breadcrumb matching Screenshot 10 & 11 */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500">
          <Link to="/" className="font-serif font-black text-lg sm:text-xl text-[#144738] hover:opacity-90">
            SPK Learn
          </Link>
          <span className="text-slate-400 font-sans">{`>`}</span>
          <Link to={`/subject/${subject.id}`} className="hover:text-emerald-800 transition-colors">
            {subjectDisplayTitle}
          </Link>
          <span className="text-slate-400 font-sans">{`>`}</span>
          <span className="truncate max-w-[140px] sm:max-w-none text-slate-600">
            {lesson.title}
          </span>
          <span className="text-slate-400 font-sans">{`>`}</span>
          <span className="text-slate-800 font-bold">Ch {lesson.number}</span>
        </nav>

        {/* Big Serif Heading */}
        <div className="space-y-1.5 pt-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144738] tracking-tight leading-snug">
            Chapter {lesson.number} · {lesson.title}
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Samacheer Kalvi 12th Standard · 2026–27 syllabus · Progress is saved on this device only.
          </p>
        </div>

        {/* Read the textbook card (Screenshot 10 matching) */}
        <a
          href={
            isBotany
              ? 'https://www.tntextbooks.in/p/12th-bio-botany.html'
              : 'https://www.tntextbooks.in/p/12th-bio-zoology.html'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-emerald-800 transition-colors">
                Read the textbook — {subject.title} · Class 12, Chapter {lesson.number}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official Samacheer Kalvi textbook · opens in a new tab
              </p>
            </div>
          </div>
          <ExternalLink size={16} className="text-slate-400 group-hover:text-emerald-700 shrink-0" />
        </a>

        {/* Lesson Topics / Sections List */}
        <div className="space-y-3.5 pt-1">
          {lesson.topics.map((t, idx) => {
            const isCompleted = progress.completedTopics.includes(t.id);
            return (
              <div
                key={t.id}
                className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4 group hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="font-serif font-black text-2xl sm:text-3xl text-[#e59b22] shrink-0 w-12 text-center">
                    {t.number || `${lesson.number}.${idx + 1}`}
                  </span>
                  <div>
                    <h3 className="font-semibold text-base text-slate-900 group-hover:text-[#144738] transition-colors leading-snug">
                      {t.title}
                    </h3>
                    {t.tamilTitle && (
                      <p className="text-xs text-emerald-800 font-medium mt-0.5">
                        {t.tamilTitle}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                      <span
                        className={`w-2 h-2 rounded-full inline-block ${
                          isCompleted
                            ? 'bg-emerald-600 border border-emerald-600'
                            : 'border border-slate-400'
                        }`}
                      />
                      <span>
                        {isCompleted ? 'Completed' : 'Not started'} · ~{t.estimatedMinutes || 15} min · {t.slides?.length || 10} slides
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/learn/${subject.id || (isBotany ? 'bio-botany' : 'bio-zoology')}/${lesson.id}/${t.id}`
                    )
                  }
                  className="px-5 py-2 rounded-full bg-[#1c4e3f] hover:bg-[#153f33] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  Open
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Ask Prof. SPK button */}
      <ProfSPKFloatingButton
        onClick={() =>
          onOpenAI({
            subjectId: subject.id,
            subjectTitle: subject.title,
            lessonTitle: lesson.title,
          })
        }
      />
    </div>
  );
};
