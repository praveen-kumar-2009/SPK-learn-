import React from 'react';

interface ProfSPKAvatarProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isSpeaking?: boolean;
  isListening?: boolean;
  isWaving?: boolean;
}

export const ProfSPKAvatar: React.FC<ProfSPKAvatarProps> = ({
  className = '',
  size = 'md',
  isSpeaking = false,
  isListening = false,
  isWaving = true,
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36 sm:w-44 sm:h-44',
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      {/* Outer concentric pulsing aura rings when speaking or listening */}
      {(isSpeaking || isListening) && (
        <>
          <div className="absolute -inset-3 rounded-full bg-emerald-400/20 animate-ping opacity-60 pointer-events-none" />
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-emerald-500/30 to-teal-400/30 animate-pulse pointer-events-none" />
        </>
      )}

      {/* Main Circular Portrait Container */}
      <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#d8ebe1] via-[#e6f4ed] to-[#cbe5d7] border-2 border-emerald-600/30 shadow-md relative flex items-center justify-center">
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin Tone Gradients for handsome young Indian professor */}
            <linearGradient id="spkIndianSkin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d9996a" />
              <stop offset="50%" stopColor="#c58455" />
              <stop offset="100%" stopColor="#aa6a3c" />
            </linearGradient>
            <linearGradient id="spkSkinHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e3a779" />
              <stop offset="100%" stopColor="#c58455" />
            </linearGradient>

            {/* Hair & Beard Dark Gradients */}
            <linearGradient id="spkBeardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#241b18" />
              <stop offset="100%" stopColor="#140e0c" />
            </linearGradient>
            <linearGradient id="spkHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#302320" />
              <stop offset="50%" stopColor="#1d1513" />
              <stop offset="100%" stopColor="#0c0908" />
            </linearGradient>

            {/* Dark Navy Button-Down Shirt */}
            <linearGradient id="spkNavyShirt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="spkShirtCollar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Soft Studio Background Vignette */}
            <radialGradient id="spkStudioBg" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#d5ede0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#b2dfc8" stopOpacity="1" />
            </radialGradient>

            {/* CSS Animation for Hand Waving / Shaking Hands */}
            <style>
              {`
                @keyframes spkWavingArm {
                  0% { transform: rotate(0deg); }
                  20% { transform: rotate(18deg) translate(-1px, -2px); }
                  40% { transform: rotate(-8deg) translate(1px, 1px); }
                  60% { transform: rotate(16deg) translate(-1px, -2px); }
                  80% { transform: rotate(-5deg); }
                  100% { transform: rotate(0deg); }
                }
                .spk-waving-arm {
                  transform-origin: 125px 125px;
                  animation: spkWavingArm 2.2s ease-in-out infinite;
                }
              `}
            </style>
          </defs>

          {/* Background circle */}
          <circle cx="80" cy="80" r="78" fill="url(#spkStudioBg)" />

          {/* Shoulders / Navy Shirt Body */}
          <path
            d="M 18 160 C 20 135 40 120 62 118 L 80 124 L 98 118 C 120 120 140 135 142 160 Z"
            fill="url(#spkNavyShirt)"
          />

          {/* Shirt Placket & Buttons */}
          <path d="M 77 124 L 77 160 L 83 160 L 83 124 Z" fill="#090d16" />
          <circle cx="80" cy="133" r="1.5" fill="#94a3b8" />
          <circle cx="80" cy="143" r="1.5" fill="#94a3b8" />
          <circle cx="80" cy="153" r="1.5" fill="#94a3b8" />

          {/* Neck */}
          <path
            d="M 68 88 L 68 118 C 72 121 88 121 92 118 L 92 88 Z"
            fill="url(#spkIndianSkin)"
          />
          {/* Neck Shadow under chin */}
          <path d="M 68 90 C 74 98 86 98 92 90 L 92 96 C 86 103 74 103 68 96 Z" fill="#9a5a2e" opacity="0.6" />

          {/* Shirt Collars */}
          <polygon points="62,118 78,124 72,136 56,126" fill="url(#spkShirtCollar)" stroke="#0f172a" strokeWidth="0.8" />
          <polygon points="98,118 82,124 88,136 104,126" fill="url(#spkShirtCollar)" stroke="#0f172a" strokeWidth="0.8" />

          {/* Head & Jaw Structure */}
          <path
            d="M 52 64 C 52 44 64 34 80 34 C 96 34 108 44 108 64 C 108 82 98 98 80 98 C 62 98 52 82 52 64 Z"
            fill="url(#spkIndianSkin)"
          />

          {/* Ears */}
          <path d="M 52 62 C 48 62 46 68 47 74 C 48 78 51 81 53 80 Z" fill="url(#spkIndianSkin)" />
          <path d="M 108 62 C 112 62 114 68 113 74 C 112 78 109 81 107 80 Z" fill="url(#spkIndianSkin)" />

          {/* Forehead Shadow & Cheekbone Highlights */}
          <ellipse cx="80" cy="62" rx="22" ry="18" fill="url(#spkSkinHighlight)" opacity="0.4" />

          {/* Trimmed Beard & Stubble along Jawline */}
          <path
            d="M 54 68 C 53 82 62 96 80 97 C 98 96 107 82 106 68 C 106 76 99 92 80 93 C 61 92 54 76 54 68 Z"
            fill="url(#spkBeardGrad)"
            opacity="0.95"
          />

          {/* Chin Beard fullness */}
          <path
            d="M 68 84 C 72 94 88 94 92 84 C 91 92 86 96 80 96 C 74 96 69 92 68 84 Z"
            fill="url(#spkBeardGrad)"
          />

          {/* Mustache - groomed and connected to beard */}
          <path
            d="M 68 79 C 72 75 78 76 80 77 C 82 76 88 75 92 79 C 88 82 83 80 80 81 C 77 80 72 82 68 79 Z"
            fill="url(#spkBeardGrad)"
          />

          {/* Mouth: Animated Talking when speaking, Smiling when idle */}
          {isSpeaking ? (
            <g className="animate-pulse">
              <ellipse cx="80" cy="84" rx="7.5" ry="3.8" fill="#581c1c" />
              <path d="M 74 83 Q 80 81 86 83" stroke="#ffffff" strokeWidth="1.4" fill="none" />
              <path d="M 75 85 Q 80 87 85 85" stroke="#991b1b" strokeWidth="1" fill="none" />
            </g>
          ) : (
            <g>
              <path
                d="M 70 82 C 73 87 87 87 90 82 C 86 86 74 86 70 82 Z"
                fill="#7f1d1d"
              />
              <path
                d="M 72 82 C 75 85 85 85 88 82 C 85 83 75 83 72 82 Z"
                fill="#ffffff"
              />
            </g>
          )}

          {/* Nose */}
          <path
            d="M 79 58 L 77 71 C 75 72 76 74 78 74 C 80 74 80 74 82 74 C 84 74 85 72 83 71 L 81 58 Z"
            fill="#b87243"
            opacity="0.75"
          />

          {/* Expressive Brown Eyes */}
          {/* Left Eye */}
          <ellipse cx="68" cy="59" rx="5" ry="3.5" fill="#ffffff" />
          <circle cx="68.5" cy="59" r="2.4" fill="#2d1a10" />
          <circle cx="69" cy="58.2" r="0.8" fill="#ffffff" />
          <path d="M 63 58 Q 68 55 73 58" stroke="#1d1513" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Right Eye */}
          <ellipse cx="92" cy="59" rx="5" ry="3.5" fill="#ffffff" />
          <circle cx="91.5" cy="59" r="2.4" fill="#2d1a10" />
          <circle cx="92" cy="58.2" r="0.8" fill="#ffffff" />
          <path d="M 87 58 Q 92 55 97 58" stroke="#1d1513" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Eyebrows */}
          <path d="M 62 53 Q 68 49 74 52" stroke="#1d1513" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 86 52 Q 92 49 98 53" stroke="#1d1513" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Modern Styled Hair */}
          <path
            d="M 52 56 C 50 44 54 30 70 24 C 80 20 94 22 104 29 C 111 35 110 46 108 56 C 105 48 103 40 96 36 C 88 32 72 32 64 38 C 58 42 55 49 52 56 Z"
            fill="url(#spkHairGrad)"
          />
          <path
            d="M 60 30 C 70 18 90 19 100 27 C 94 23 80 22 70 25 C 64 27 61 29 60 30 Z"
            fill="#45312c"
            opacity="0.8"
          />

          {/* Realistic Human Waving / Shaking Hand */}
          {isWaving && (
            <g className="spk-waving-arm">
              {/* Forearm & Sleeve */}
              <path
                d="M 125 140 L 128 116 L 136 118 L 133 142 Z"
                fill="url(#spkNavyShirt)"
              />
              {/* Hand Palm */}
              <ellipse
                cx="130"
                cy="110"
                rx="8"
                ry="9.5"
                fill="url(#spkIndianSkin)"
                transform="rotate(-12 130 110)"
              />
              {/* Waving Fingers */}
              <path
                d="M 124 104 L 123 93 C 123 91 126 91 126 93 L 127 103
                   M 128 102 L 129 89 C 129 87 132 87 132 89 L 132 102
                   M 133 102 L 135 91 C 135 89 138 89 138 91 L 137 103
                   M 137 104 L 140 96 C 140 94 143 94 142 97 L 139 108"
                stroke="url(#spkIndianSkin)"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Thumb */}
              <path d="M 125 108 Q 118 106 120 101 Q 124 101 126 106" fill="url(#spkIndianSkin)" />
            </g>
          )}
        </svg>
      </div>

      {/* Online Active Indicator Dot */}
      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
    </div>
  );
};
