import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../curriculum/curriculumData';
import { UserProgress } from '../types/curriculum';
import { Search, BookOpen, ExternalLink, ChevronRight } from 'lucide-react';
import { ProfSPKFloatingButton } from '../components/ai/ProfSPKFloatingButton';

interface SubjectLessonsPageProps {
  progress: UserProgress;
  onOpenAI: (ctx?: any) => void;
}

export const SubjectDashboard: React.FC<SubjectLessonsPageProps> = ({ progress, onOpenAI }) => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const subject = getSubjectById(subjectId || 'bio-botany');

  if (!subject) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif text-[#144738]">Subject Not Found</h2>
        <Link to="/" className="text-emerald-700 font-bold hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const isBotany = subject.id === 'bio-botany';
  const subjectDisplayTitle = isBotany ? 'Botany' : 'Zoology';

  const filteredLessons = subject.lessons.filter((l) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      l.title.toLowerCase().includes(q) ||
      (l.tamilTitle && l.tamilTitle.toLowerCase().includes(q)) ||
      l.number.toString().includes(q) ||
      l.topics.some((t) => t.title.toLowerCase().includes(q) || t.number.includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f5ec]/70 via-[#f9fbf9] to-[#f4f7f5] text-slate-800 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Breadcrumb matching Screenshot 12 */}
        <nav className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Link to="/" className="font-serif font-black text-xl text-[#144738] hover:opacity-90">
            SPK Learn
          </Link>
          <span className="text-slate-400 font-sans">{`>`}</span>
          <span className="font-sans text-slate-700">{subjectDisplayTitle}</span>
        </nav>

        {/* Big Serif Heading */}
        <div className="space-y-2 pt-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#144738] tracking-tight">
            {subjectDisplayTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Tamil Nadu Samacheer Kalvi 12th Standard, 2026–27 syllabus. Unit and chapter titles follow the Bio-Botany and Bio-Zoology textbooks; the notes, questions and quizzes are original summaries written for SPK Learn. Open the textbook link for the full official text.
          </p>
        </div>

        {/* Read the official e-book card (Screenshot 12 matching) */}
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
                Read the official e-book — {subject.title} · Class 12
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                TN School E-Books · opens in a new tab
              </p>
            </div>
          </div>
          <ExternalLink size={16} className="text-slate-400 group-hover:text-emerald-700 shrink-0" />
        </a>

        {/* Search Bar matching screenshot */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons"
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-slate-200/80 text-sm text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Lesson Cards List matching Screenshot 12 */}
        <div className="space-y-3 pt-1">
          {filteredLessons.map((lesson) => {
            return (
              <div
                key={lesson.id}
                onClick={() => navigate(`/subject/${subject.id}/lesson/${lesson.id}`)}
                className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-400/60 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  {/* Golden Chapter Number */}
                  <span className="font-serif font-bold text-3xl text-[#e59b22] shrink-0 w-8 text-center">
                    {lesson.number}
                  </span>

                  <div>
                    <h2 className="font-semibold text-base text-slate-900 group-hover:text-[#144738] transition-colors leading-snug">
                      {lesson.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {lesson.topics.length} topics · Samacheer Kalvi 12th Standard · 2026–27 syllabus
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="text-slate-400 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-all shrink-0"
                />
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
          })
        }
      />
    </div>
  );
};
