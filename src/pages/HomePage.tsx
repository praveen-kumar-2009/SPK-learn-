import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Dna, ChevronRight } from 'lucide-react';
import { UserProgress } from '../types/curriculum';
import { ProfSPKFloatingButton } from '../components/ai/ProfSPKFloatingButton';

interface HomePageProps {
  progress?: UserProgress;
  onOpenAI?: (ctx?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenAI }) => {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-10 animate-fade-in bg-gradient-to-b from-[#eef7f2] via-[#f8faf8] to-[#f4f7f5] text-slate-800">
      <div className="w-full max-w-lg mx-auto text-center space-y-6">
        {/* Top Samacheer Kalvi Badge (Video 0:01 matching) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#daf1e4] border border-emerald-300/50 text-[#144738] text-xs font-semibold shadow-2xs">
          <span className="text-emerald-700">✨</span>
          <span>Samacheer Kalvi · 2026–27 syllabus</span>
        </div>

        {/* SPK Learn Brand Title */}
        <div className="space-y-3">
          <h1 className="font-serif font-black text-5xl sm:text-6xl text-[#144738] tracking-tight">
            SPK Learn
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-md mx-auto">
            The full 12th Standard Botany and Zoology syllabus — visual lessons, timed quizzes and a voice-enabled AI guide.
          </p>
        </div>

        {/* Subject Track Cards matching Video 0:02 */}
        <div className="space-y-4 pt-3 text-left">
          {/* Botany Card */}
          <div
            onClick={() => navigate('/learn/botany')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1c7a56] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Leaf size={24} />
              </div>
              <div>
                <h2 className="font-bold text-xl text-slate-900 group-hover:text-[#144738] transition-colors leading-snug">
                  Botany
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Bio-Botany · 10 chapters
                </p>
              </div>
            </div>
            <ChevronRight
              size={20}
              className="text-slate-400 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all shrink-0"
            />
          </div>

          {/* Zoology Card */}
          <div
            onClick={() => navigate('/learn/zoology')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e59b22] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Dna size={24} />
              </div>
              <div>
                <h2 className="font-bold text-xl text-slate-900 group-hover:text-[#144738] transition-colors leading-snug">
                  Zoology
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Bio-Zoology · 12 chapters
                </p>
              </div>
            </div>
            <ChevronRight
              size={20}
              className="text-slate-400 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all shrink-0"
            />
          </div>
        </div>

        {/* Voice AI Guide Explanatory Note (Video 0:03) */}
        <p className="text-xs text-slate-500 pt-3 max-w-sm mx-auto leading-relaxed">
          🎙️ Tap the AI Assistant to talk to your guide — speech to speech, anywhere in the app.
        </p>
      </div>

      {/* Floating Ask Prof. SPK button */}
      <ProfSPKFloatingButton
        onClick={() =>
          onOpenAI?.({
            subjectTitle: 'Bio-Botany',
            lessonTitle: 'Reproduction in Plants',
          })
        }
      />
    </main>
  );
};
