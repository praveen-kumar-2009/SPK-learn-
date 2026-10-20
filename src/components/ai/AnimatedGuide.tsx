import React from 'react';
import { ProfSPKAvatar } from './ProfSPKAvatar';

interface AnimatedGuideProps {
  status: 'idle' | 'listening' | 'processing' | 'speaking';
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const AnimatedGuide: React.FC<AnimatedGuideProps> = ({ status, size = 'md' }) => {
  const avatarSize = size === 'hero' ? '2xl' : size === 'lg' ? 'xl' : size === 'sm' ? 'sm' : 'md';

  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      {/* Dynamic Animated Status Glow */}
      <div
        className={`absolute -inset-4 rounded-full blur-xl transition-all duration-500 pointer-events-none ${
          status === 'speaking'
            ? 'bg-gradient-to-r from-emerald-500/40 via-teal-400/40 to-blue-500/40 animate-pulse scale-110'
            : status === 'listening'
            ? 'bg-emerald-400/50 animate-ping scale-105'
            : status === 'processing'
            ? 'bg-amber-500/40 animate-pulse scale-105'
            : 'bg-emerald-500/20 group-hover:scale-105'
        }`}
      />

      {/* Realistic Human Assistant Avatar with Animated Waving Hands */}
      <div className="relative transition-transform duration-300">
        <ProfSPKAvatar
          size={avatarSize}
          isSpeaking={status === 'speaking'}
          isListening={status === 'listening'}
          isWaving={true}
        />
      </div>

      {/* Guide Identity Badge */}
      <div className="mt-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-md border border-slate-700/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Prof. SPK · AI Biology Tutor</span>
        </div>
      </div>
    </div>
  );
};
