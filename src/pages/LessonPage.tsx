import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTopicById } from '../curriculum/curriculumData';
import { UserProgress } from '../types/curriculum';
import { Base44SlideCard } from '../components/lessons/Base44SlideCard';
import { PowerPointSlideDeck } from '../components/lessons/PowerPointSlideDeck';
import { ImportantQuestionsSection } from '../components/lessons/ImportantQuestionsSection';
import { InteractiveQuiz } from '../components/quizzes/InteractiveQuiz';
import { SlideDrawingModal } from '../components/lessons/SlideDrawingModal';
import { ProfSPKFloatingButton } from '../components/ai/ProfSPKFloatingButton';
import { LayoutGrid, ArrowLeft } from 'lucide-react';

interface LessonPageProps {
  progress: UserProgress;
  onOpenAI: (ctx?: any) => void;
  onCompleteTopic: (topicId: string) => void;
  onSaveQuizResult: (topicId: string, score: number, total: number, timeSpent: number) => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  progress,
  onOpenAI,
  onCompleteTopic,
  onSaveQuizResult,
}) => {
  const { subjectId, lessonId, topicId } = useParams<{
    subjectId: string;
    lessonId: string;
    topicId: string;
  }>();

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isDrawModalOpen, setIsDrawModalOpen] = useState<boolean>(false);
  const [isPowerPointStudioOpen, setIsPowerPointStudioOpen] = useState<boolean>(false);
  const [customSlideImages, setCustomSlideImages] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('spk_custom_slide_images');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const handleSaveSlideImage = (slideKey: string, imageUrl: string) => {
    setCustomSlideImages((prev) => {
      const updated = { ...prev, [slideKey]: imageUrl };
      try {
        localStorage.setItem('spk_custom_slide_images', JSON.stringify(updated));
      } catch (e) {
        // ignore storage quota error
      }
      return updated;
    });
  };

  const handleRemoveCustomImage = (slideKey: string) => {
    setCustomSlideImages((prev) => {
      const updated = { ...prev };
      delete updated[slideKey];
      try {
        localStorage.setItem('spk_custom_slide_images', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  const data = getTopicById(subjectId || '', lessonId || '', topicId || '');

  if (!data) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif text-[#144738]">Topic Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested topic ({topicId}) could not be located in the curriculum registry.
        </p>
        <Link to="/" className="text-emerald-700 font-bold hover:underline">
          Return to SPK Learn Home
        </Link>
      </div>
    );
  }

  const { subject, lesson, topic } = data;
  const isBotany = subject.id === 'bio-botany';
  const subjectDisplayTitle = isBotany ? 'Botany' : 'Zoology';
  const slides = topic.slides || [];
  const isCompleted = progress.completedTopics.includes(topic.id);

  const navigate = useNavigate();

  // Dynamic Textbook Sections: Show all official Samacheer Kalvi sections for this chapter
  const textbookSections = useMemo(() => {
    return lesson.topics.map((t) => ({
      number: t.number,
      title: t.title,
      tamilTitle: t.tamilTitle,
      topicId: t.id,
      isCurrent: t.id === topic.id,
      slideCount: t.slides?.length || 10,
    }));
  }, [lesson.topics, topic.id]);

  const handleSelectSection = (sec: typeof textbookSections[0]) => {
    if (sec.isCurrent) {
      setCurrentSlideIndex(0);
    } else {
      navigate(`/learn/${subject.id}/${lesson.id}/${sec.topicId}`);
      setCurrentSlideIndex(0);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      onCompleteTopic(topic.id);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f5ec]/70 via-[#f9fbf9] to-[#f4f7f5] text-slate-800 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
        {/* Breadcrumb Header matching Video 0:36 */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500">
          <Link to="/" className="font-serif font-black text-lg sm:text-xl text-[#144738] hover:opacity-90">
            SPK Learn
          </Link>
          <span className="text-slate-400 font-sans">{`>`}</span>
          <Link to={`/learn/${isBotany ? 'botany' : 'zoology'}`} className="hover:text-emerald-800 transition-colors">
            {subjectDisplayTitle}
          </Link>
          <span className="text-slate-400 font-sans">{`>`}</span>
          <Link
            to={`/learn/${isBotany ? 'botany' : 'zoology'}/${lesson.id}`}
            className="hover:text-emerald-800 transition-colors truncate max-w-[130px] sm:max-w-none text-slate-600"
          >
            {lesson.title}
          </Link>
          <span className="text-slate-400 font-sans">{`>`}</span>
          <span className="text-slate-800 font-bold">Ch {lesson.number}</span>
        </nav>

        {/* Chapter Title & Official Textbook Link (Video 0:36 matching) */}
        <div className="space-y-4 pt-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144738] tracking-tight leading-snug">
            Chapter {lesson.number} · {lesson.title}
          </h1>

          {/* Read the textbook card */}
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
                <span className="text-lg">📖</span>
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
            <span className="text-slate-400 group-hover:text-emerald-700 shrink-0 text-sm">↗</span>
          </a>

          {/* Textbook sections Card (Video 0:36 matching: tap one to open its slides) */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <h3 className="font-serif font-bold text-base text-[#144738]">Textbook sections</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Numbered as in the book — tap one to open its slides.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              {textbookSections.map((sec) => (
                <button
                  key={sec.number}
                  onClick={() => handleSelectSection(sec)}
                  className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    sec.isCurrent
                      ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-300'
                      : 'bg-[#fcfdfc] border-slate-200/70 hover:bg-[#f4f8f5] text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-black text-sm text-[#e59b22]">
                      {sec.number}
                    </span>
                    <span className="text-xs sm:text-sm font-medium">
                      {sec.title}
                    </span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${
                    sec.isCurrent ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium'
                  }`}>
                    {sec.slideCount} slides
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. SLIDE PRESENTATION VIEW (Video 0:37 matching) */}
        {!isPowerPointStudioOpen ? (
          <Base44SlideCard
            topic={topic}
            lessonTitle={lesson.title}
            subjectTitle={subject.title}
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            onNextSlide={handleNextSlide}
            onPrevSlide={handlePrevSlide}
            onAskAI={(ctx) =>
              onOpenAI({
                subjectTitle: subject.title,
                lessonTitle: lesson.title,
                topicNumber: topic.number,
                topicTitle: topic.title,
                ...ctx,
              })
            }
            onOpenDrawModal={() => setIsDrawModalOpen(true)}
            onOpenPowerPointStudio={() => setIsPowerPointStudioOpen(true)}
            customSlideImages={customSlideImages}
            onSaveSlideImage={handleSaveSlideImage}
            onRemoveCustomImage={handleRemoveCustomImage}
          />
        ) : (
          /* Fullscreen PowerPoint Widescreen Stage if student switched to studio */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsPowerPointStudioOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Return to Standard Slide Card</span>
              </button>
            </div>
            <PowerPointSlideDeck
              topic={topic}
              lessonTitle={lesson.title}
              subjectTitle={subject.title}
              onAskAI={onOpenAI}
              onCompleteTopic={onCompleteTopic}
              isCompleted={isCompleted}
            />
          </div>
        )}

        {/* 2. Public Important Questions for 12th Standard & Real Public Exam Questions */}
        <div id="important-questions-section" className="pt-2">
          <ImportantQuestionsSection
            questions={topic.importantQuestions || []}
            topicTitle={`Topic ${topic.number}: ${topic.title}`}
            topicId={topic.id}
            lessonId={lesson.id}
            subjectId={subject.id}
            onAskAI={(q) =>
              onOpenAI({
                subjectTitle: subject.title,
                lessonTitle: lesson.title,
                topicNumber: topic.number,
                topicTitle: topic.title,
                selectedPart: `Question: ${q.question} | Model Answer: ${q.answer}`,
              })
            }
          />
        </div>

        {/* 3. Quiz Challenge (Screenshot 3 & 4 matching) */}
        {topic.quiz && topic.quiz.length > 0 && (
          <div id="quiz-challenge-section" className="pt-2">
            <InteractiveQuiz
              questions={topic.quiz}
              topicId={topic.id}
              onCompleteQuiz={(score, total) => {
                onSaveQuizResult(topic.id, score, total, 30);
              }}
              onAskAI={(ctx) =>
                onOpenAI({
                  subjectTitle: subject.title,
                  lessonTitle: lesson.title,
                  topicNumber: topic.number,
                  topicTitle: topic.title,
                  ...ctx,
                })
              }
            />
          </div>
        )}
      </div>

      {/* Floating Ask Prof. SPK button */}
      <ProfSPKFloatingButton
        onClick={() =>
          onOpenAI({
            subjectTitle: subject.title,
            lessonTitle: lesson.title,
            topicNumber: topic.number,
            topicTitle: topic.title,
            slideIndex: currentSlideIndex,
            slideTitle: slides[currentSlideIndex]?.title,
          })
        }
      />

      {/* Drawing illustration modal: generates & displays AI medical illustration, allows drawing and attaching to slide */}
      <SlideDrawingModal
        isOpen={isDrawModalOpen}
        onClose={() => setIsDrawModalOpen(false)}
        slideId={slides[currentSlideIndex]?.id || `slide-${currentSlideIndex}`}
        slideTitle={slides[currentSlideIndex]?.title || topic.title}
        topicTitle={topic.title}
        initialImage={customSlideImages[slides[currentSlideIndex]?.id || `slide-${currentSlideIndex}`]}
        onSaveSlideImage={(imgUrl) => {
          const slideKey = slides[currentSlideIndex]?.id || `slide-${currentSlideIndex}`;
          handleSaveSlideImage(slideKey, imgUrl);
        }}
      />
    </div>
  );
};
