import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Leaf size={16} />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">
              SPK <span className="text-emerald-400">Learn</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-xs">
              12th Standard Biology & Bio-Botany
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link to="/subject/biology" className="hover:text-emerald-400 transition-colors">
              Biology Lessons
            </Link>
            <Link to="/subject/bio-botany" className="hover:text-emerald-400 transition-colors">
              Bio-Botany Lessons
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} SPK Learn. 12th Standard Samacheer Kalvi educational platform.</p>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck size={13} />
            <span>Structured for Board Exam Preparation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
