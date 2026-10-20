import React, { useState, useMemo } from 'react';
import { ImportantQuestion } from '../../types/curriculum';
import { getRealQuestionsForTopic } from '../../curriculum/realChapterQuestions';
import {
  Eye,
  EyeOff,
  Printer,
  GraduationCap,
  CheckCircle2,
  BookOpen,
  Award,
  Search,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface ImportantQuestionsProps {
  questions: ImportantQuestion[];
  topicTitle: string;
  topicId?: string;
  lessonId?: string;
  subjectId?: string;
  onAskAI?: (q: ImportantQuestion) => void;
}

type FilterCategory = 'all' | 'book_back' | 'public_exam' | '1mark' | '2marks' | '3marks' | '5marks';

export const ImportantQuestionsSection: React.FC<ImportantQuestionsProps> = ({
  questions: rawQuestions,
  topicTitle,
  topicId = '',
  lessonId = '',
  subjectId = '',
  onAskAI,
}) => {
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  // Merge topic questions with verified real public exam & book-back evaluation dataset
  const combinedQuestions: ImportantQuestion[] = useMemo(() => {
    const set = new Map<string, ImportantQuestion>();

    // 1. Add topic's own curriculum questions FIRST so they are never overshadowed
    if (rawQuestions && rawQuestions.length > 0) {
      rawQuestions.forEach((q) => {
        set.set(q.id, {
          ...q,
          category: q.category || (q.sourceType === 'verified_textbook' ? 'book_back' : 'high_yield'),
          sourceExam: q.sourceExam || (q.sourceType === 'verified_textbook' ? 'SCERT Textbook Evaluation' : 'Class 12 Board Practice'),
        });
      });
    }

    // 2. Augment with discipline-matching verified public exam questions
    const verified = getRealQuestionsForTopic(topicId, lessonId, subjectId);
    verified.forEach((q) => {
      if (!set.has(q.id)) {
        set.set(q.id, q);
      }
    });

    return Array.from(set.values());
  }, [topicId, lessonId, subjectId, rawQuestions]);

  const toggleAnswer = (id: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const showAll = () => {
    const all: Record<string, boolean> = {};
    combinedQuestions.forEach((q) => (all[q.id] = true));
    setRevealedAnswers(all);
  };

  const hideAll = () => {
    setRevealedAnswers({});
  };

  const handleCopyAnswer = (q: ImportantQuestion) => {
    const textToCopy = `Question (${q.marks} Mark${q.marks > 1 ? 's' : ''}): ${q.question}\n${q.tamilQuestion ? `தமிழ் வினா: ${q.tamilQuestion}\n` : ''}\nOfficial Model Answer:\n${q.answer}\n\n[Source: ${q.sourceExam || 'Tamil Nadu Samacheer Kalvi 12th Biology'}]`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return combinedQuestions.filter((q) => {
      // Category filter
      if (activeFilter === 'book_back' && q.category !== 'book_back') return false;
      if (activeFilter === 'public_exam' && q.category !== 'public_exam' && q.sourceType !== 'public_exam') return false;
      if (activeFilter === '1mark' && q.marks !== 1) return false;
      if (activeFilter === '2marks' && q.marks !== 2) return false;
      if (activeFilter === '3marks' && q.marks !== 3) return false;
      if (activeFilter === '5marks' && q.marks !== 5) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQ = q.question.toLowerCase().includes(query);
        const matchesA = q.answer.toLowerCase().includes(query);
        const matchesT = q.tamilQuestion?.toLowerCase().includes(query);
        const matchesExam = q.sourceExam?.toLowerCase().includes(query);
        const matchesTerms = q.keyTerms?.some((t) => t.toLowerCase().includes(query));
        return matchesQ || matchesA || matchesT || matchesExam || matchesTerms;
      }

      return true;
    });
  }, [combinedQuestions, activeFilter, searchQuery]);

  // Counts
  const totalCount = combinedQuestions.length;
  const bookBackCount = combinedQuestions.filter((q) => q.category === 'book_back').length;
  const publicExamCount = combinedQuestions.filter(
    (q) => q.category === 'public_exam' || q.sourceType === 'public_exam'
  ).length;

  return (
    <div className="space-y-6 pt-2 animate-fade-in">
      {/* SECTION HEADER with verified branding and real exam rubrics */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#144738] border border-emerald-200">
                <GraduationCap size={13} />
                <span>TN DGE Certified Question Bank</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Award size={12} />
                <span>2020–2025 Board Syllabus</span>
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#144738] tracking-tight">
              Real Important Questions & Model Answers
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Official Samacheer Kalvi textbook evaluation (Book-Back) questions and real Tamil Nadu Government Public Examination questions with verified marking scheme keys.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={showAll}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Eye size={13} className="text-emerald-700" />
              <span>Show all answers</span>
            </button>
            <button
              onClick={hideAll}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <EyeOff size={13} className="text-slate-400" />
              <span>Hide all</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={13} className="text-slate-500" />
              <span>Print Worksheet</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by keyword (e.g. tapetum, endothecium, ovule, pollenkitt)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#144738] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({totalCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('book_back')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all flex items-center gap-1 ${
                activeFilter === 'book_back'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
              }`}
            >
              <BookOpen size={12} />
              <span>Book-Back Evaluation ({bookBackCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('public_exam')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all flex items-center gap-1 ${
                activeFilter === 'public_exam'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200/70 hover:bg-amber-100'
              }`}
            >
              <Award size={12} />
              <span>Public Board Exams ({publicExamCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('1mark')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                activeFilter === '1mark'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              1 Mark
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('2marks')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                activeFilter === '2marks'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              2 Marks
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('3marks')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                activeFilter === '3marks'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              3 Marks
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('5marks')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                activeFilter === '5marks'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              5 Marks
            </button>
          </div>
        </div>
      </div>

      {/* QUESTION CARDS LIST */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
            <HelpCircle size={28} className="mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">No questions found matching your filter</p>
            <p className="text-xs text-slate-400">Try clearing your search query or selecting "All".</p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isRevealed = revealedAnswers[q.id];
            const isPublicExam = q.category === 'public_exam' || q.sourceType === 'public_exam';
            const isBookBack = q.category === 'book_back';
            const is5Mark = q.marks === 5;

            return (
              <div
                key={q.id}
                className={`p-5 sm:p-6 bg-white rounded-2xl border transition-all space-y-4 shadow-xs ${
                  isPublicExam
                    ? 'border-amber-200/90 hover:border-amber-400'
                    : isBookBack
                    ? 'border-emerald-200/90 hover:border-emerald-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header Row: Marks Pill + Official Exam Source Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        q.marks === 1
                          ? 'bg-sky-50 text-sky-800 border border-sky-200'
                          : q.marks === 2
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : q.marks === 3
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : 'bg-purple-50 text-purple-900 border border-purple-200'
                      }`}
                    >
                      {q.marks} Mark{q.marks > 1 ? 's' : ''}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                        isPublicExam
                          ? 'bg-amber-100/80 text-amber-900 border border-amber-300'
                          : isBookBack
                          ? 'bg-emerald-100/80 text-emerald-950 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isPublicExam ? <Award size={10} /> : <BookOpen size={10} />}
                      <span>{q.sourceExam || (isPublicExam ? 'Government Public Exam' : 'Official SCERT Textbook')}</span>
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    Q{idx + 1}
                  </span>
                </div>

                {/* English Question */}
                <div className="space-y-1.5">
                  <p className="font-semibold text-slate-900 text-sm sm:text-base leading-snug">
                    {q.question}
                  </p>

                  {/* Tamil Bilingual Translation */}
                  {q.tamilQuestion && (
                    <p className="text-xs sm:text-sm font-medium text-emerald-900/90 leading-relaxed font-sans bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/80">
                      <span className="font-bold text-emerald-950 mr-1.5">தமிழ்:</span>
                      {q.tamilQuestion}
                    </p>
                  )}
                </div>

                {/* Action Buttons: Toggle Answer + Copy + Ask AI */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#144738] hover:text-[#0b2920] transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-[#144738]/5 hover:bg-[#144738]/10"
                    >
                      {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{isRevealed ? 'Hide Model Answer' : 'Show Official Model Answer'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyAnswer(q)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      title="Copy Question & Answer"
                    >
                      {copiedId === q.id ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {onAskAI && (
                    <button
                      onClick={() => onAskAI(q)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>Ask Prof. SPK</span>
                    </button>
                  )}
                </div>

                {/* REVEALED OFFICIAL DGE MODEL ANSWER & MARKING SCHEME */}
                {isRevealed && (
                  <div className="space-y-3.5 pt-3 border-t border-emerald-200/60 animate-fade-in bg-gradient-to-br from-emerald-50/40 via-white to-slate-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#144738] flex items-center gap-1.5">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <span>Official DGE Board Key Answer</span>
                      </span>
                      {is5Mark && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200">
                          Structured 5-Mark Presentation
                        </span>
                      )}
                    </div>

                    {/* Answer Body */}
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line space-y-2">
                      {q.answer}
                    </div>

                    {/* Marking Scheme Points */}
                    {q.markingScheme && q.markingScheme.length > 0 && (
                      <div className="pt-2 border-t border-emerald-100 space-y-1.5">
                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#92400e] flex items-center gap-1">
                          <FileText size={12} />
                          <span>Official Valuation Scheme (DGE Rubric):</span>
                        </h5>
                        <ul className="space-y-1">
                          {q.markingScheme.map((scheme, sIdx) => (
                            <li
                              key={sIdx}
                              className="text-xs text-slate-700 flex items-start gap-1.5 font-medium"
                            >
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                              <span>{scheme}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* High-Yield Biological Keywords */}
                    {q.keyTerms && q.keyTerms.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">
                          Key Terms:
                        </span>
                        {q.keyTerms.map((term, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200/60"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
