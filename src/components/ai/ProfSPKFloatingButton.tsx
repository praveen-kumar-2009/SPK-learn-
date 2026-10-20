import React from 'react';
import { ProfSPKAvatar } from './ProfSPKAvatar';

interface ProfSPKFloatingButtonProps {
  onClick: () => void;
  className?: string;
}

export const ProfSPKFloatingButton: React.FC<ProfSPKFloatingButtonProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-5 right-5 z-40 bg-white/95 hover:bg-white text-slate-900 pl-2 pr-4 py-1.5 rounded-full flex items-center gap-2.5 shadow-lg border border-slate-200/90 backdrop-blur-md active:scale-95 transition-all group cursor-pointer hover:border-emerald-300 ${className}`}
      aria-label="Ask Prof. SPK"
    >
      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0">
        <ProfSPKAvatar size="sm" isWaving={false} />
      </div>
      <span className="font-semibold text-xs sm:text-sm tracking-tight text-slate-800 group-hover:text-emerald-800 transition-colors">
        Ask Prof. SPK
      </span>
    </button>
  );
};
