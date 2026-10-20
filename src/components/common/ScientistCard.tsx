import React from 'react';
import { ScientistInfo } from '../../types/curriculum';
import { Award, BookOpen, Sparkles, GraduationCap } from 'lucide-react';

interface ScientistCardProps {
  scientist: ScientistInfo;
}

export const ScientistCard: React.FC<ScientistCardProps> = ({ scientist }) => {
  const isMendel = scientist.name.toLowerCase().includes('mendel');
  const isPearl = scientist.name.toLowerCase().includes('pearl') || scientist.name.toLowerCase().includes('reed');
  const isDarwin = scientist.name.toLowerCase().includes('darwin');
  const isHaeckel = scientist.name.toLowerCase().includes('haeckel');

  return (
    <div className="bg-gradient-to-tr from-amber-50/90 via-orange-50/40 to-emerald-50/30 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border-2 border-amber-300/80 dark:border-amber-700/60 rounded-3xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row items-center gap-6 max-w-2xl mx-auto my-6 animate-fade-in relative overflow-hidden group">
      {/* Decorative background watermark */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

      {/* Historical Scientist Portrait / Illustrated Medallion */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-400 dark:border-amber-700 flex items-center justify-center text-amber-800 dark:text-amber-200 shrink-0 shadow-inner overflow-hidden relative">
        <svg viewBox="0 0 120 120" className="w-full h-full p-2" aria-label={scientist.name}>
          <defs>
            <linearGradient id="medallionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
            <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#1c1917" />
            </linearGradient>
          </defs>

          {/* Golden Medallion Ring */}
          <circle cx="60" cy="60" r="54" fill="url(#medallionGrad)" stroke="#d97706" strokeWidth="2.5" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="#b45309" strokeWidth="1" strokeDasharray="3 3" />

          {/* Historical Bust Portrait */}
          {isMendel ? (
            // Gregor Mendel: monk vestment, spectacles, gentle contemplative expression
            <g>
              {/* Monk Habit / Coat */}
              <path d="M 30 95 C 30 76 45 70 60 70 C 75 70 90 76 90 95 Z" fill="url(#suitGrad)" />
              {/* White Collar Cross */}
              <polygon points="56,72 64,72 60,82" fill="#ffffff" />
              {/* Head */}
              <ellipse cx="60" cy="48" rx="16" ry="19" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
              {/* Hair (parted receding hairline) */}
              <path d="M 44 48 C 44 32 54 28 66 30 C 76 32 76 44 76 48 C 72 40 50 38 44 48 Z" fill="#78350f" />
              {/* Spectacles / Glasses */}
              <circle cx="53" cy="48" r="4.5" fill="none" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="67" cy="48" r="4.5" fill="none" stroke="#78350f" strokeWidth="1.5" />
              <line x1="57.5" y1="48" x2="62.5" y2="48" stroke="#78350f" strokeWidth="1.5" />
              {/* Gentle smile */}
              <path d="M 56 59 Q 60 62 64 59" fill="none" stroke="#78350f" strokeWidth="1.2" />
            </g>
          ) : isDarwin ? (
            // Charles Darwin: distinctive full white beard
            <g>
              <path d="M 30 95 C 30 76 45 70 60 70 C 75 70 90 76 90 95 Z" fill="url(#suitGrad)" />
              <ellipse cx="60" cy="46" rx="15" ry="18" fill="#fef08a" />
              {/* Bald top with side hair */}
              <path d="M 45 42 Q 44 28 60 28 Q 76 28 75 42" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              {/* Famous Full Beard */}
              <path d="M 48 52 C 48 76 54 84 60 84 C 66 84 72 76 72 52 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="54" cy="45" r="1.5" fill="#451a03" />
              <circle cx="66" cy="45" r="1.5" fill="#451a03" />
            </g>
          ) : (
            // Classical Scientist Silhouette with Laurel Wreath
            <g>
              <path d="M 32 95 C 32 78 44 72 60 72 C 76 72 88 78 88 95 Z" fill="url(#suitGrad)" />
              <ellipse cx="60" cy="46" rx="15" ry="18" fill="#fde68a" stroke="#b45309" strokeWidth="1" />
              <path d="M 45 40 Q 60 28 75 40 Q 60 32 45 40 Z" fill="#78350f" />
              {/* Side profile glasses */}
              <line x1="50" y1="46" x2="70" y2="46" stroke="#78350f" strokeWidth="1.5" />
            </g>
          )}

          {/* Laurel Branch Border */}
          <path d="M 22 55 Q 16 38 28 26" stroke="#b45309" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 98 55 Q 104 38 92 26" stroke="#b45309" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>

        {/* Year Badge */}
        {scientist.year && (
          <span className="absolute bottom-1 bg-amber-900/90 text-amber-200 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-600 shadow-xs">
            {scientist.year}
          </span>
        )}
      </div>

      {/* Scientist Content */}
      <div className="space-y-2 text-center sm:text-left flex-1">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
            <Award size={13} className="text-amber-600 dark:text-amber-400" />
            Syllabus Scientist Spotlight
          </span>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <GraduationCap size={13} />
            12th Board Milestone
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {scientist.name}
        </h3>

        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
          {scientist.discovery}
        </p>

        {scientist.caption && (
          <p className="text-xs text-amber-900 dark:text-amber-300/90 font-medium italic">
            "{scientist.caption}"
          </p>
        )}

        {scientist.attribution && (
          <p className="text-[10px] text-slate-400 pt-1 border-t border-amber-200/60 dark:border-slate-800">
            Historical Archive: {scientist.attribution}
          </p>
        )}
      </div>
    </div>
  );
};
