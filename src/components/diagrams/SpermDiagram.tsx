import React from 'react';

interface DiagramProps {
  selectedHotspotId?: string;
  onSelectHotspot: (id: string) => void;
}

export const SpermDiagram: React.FC<DiagramProps> = ({ selectedHotspotId, onSelectHotspot }) => {
  return (
    <div className="relative w-full max-w-xl mx-auto aspect-4/3 flex items-center justify-center p-2 select-none">
      <svg
        viewBox="0 0 500 420"
        className="w-full h-full drop-shadow-sm transition-all duration-300"
        aria-label="Human Spermatozoon Anatomy Diagram"
      >
        <defs>
          <linearGradient id="spermHeadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
          <linearGradient id="acrosomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>

        {/* Tail (Long Flagellum) */}
        <path
          d="M 250 240 Q 220 280 260 320 T 240 380 T 255 410"
          fill="none"
          stroke={selectedHotspotId === 'tail' ? '#2563eb' : '#64748b'}
          strokeWidth={selectedHotspotId === 'tail' ? '6' : '4'}
          strokeLinecap="round"
          className="cursor-pointer hover:stroke-blue-600 transition-all"
          onClick={() => onSelectHotspot('tail')}
        />
        <text
          x="310"
          y="350"
          fontSize="11"
          fill="#475569"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('tail')}
        >
          Tail / Flagellum (வால் பகுதி)
        </text>
        <line x1="250" y1="350" x2="300" y2="350" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />

        {/* Middle Piece Body */}
        <rect
          x="238"
          y="160"
          width="24"
          height="80"
          rx="5"
          fill={selectedHotspotId === 'middle-piece' ? '#fed7aa' : '#fde68a'}
          stroke={selectedHotspotId === 'middle-piece' ? '#ea580c' : '#d97706'}
          strokeWidth="2"
          className="cursor-pointer hover:brightness-105"
          onClick={() => onSelectHotspot('middle-piece')}
        />
        {/* Spiral Mitochondria (Nebenkern coils) */}
        <g
          stroke="#ea580c"
          strokeWidth="2.5"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('middle-piece')}
        >
          <line x1="240" y1="175" x2="260" y2="182" />
          <line x1="240" y1="190" x2="260" y2="197" />
          <line x1="240" y1="205" x2="260" y2="212" />
          <line x1="240" y1="220" x2="260" y2="227" />
        </g>
        <text
          x="300"
          y="205"
          fontSize="11"
          fill="#c2410c"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('middle-piece')}
        >
          Middle Piece: Mitochondria (ATP)
        </text>
        <line x1="262" y1="202" x2="295" y2="202" stroke="#ea580c" strokeWidth="1" strokeDasharray="3,2" />

        {/* Neck Region */}
        <rect
          x="243"
          y="148"
          width="14"
          height="12"
          fill={selectedHotspotId === 'neck-centrioles' ? '#a78bfa' : '#c4b5fd'}
          stroke="#7c3aed"
          strokeWidth="1.5"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('neck-centrioles')}
        />
        {/* Centrioles */}
        <circle cx="247" cy="154" r="2" fill="#4c1d95" />
        <circle cx="253" cy="154" r="2" fill="#4c1d95" />
        <text
          x="120"
          y="155"
          fontSize="11"
          fill="#6d28d9"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('neck-centrioles')}
        >
          Neck & Centrioles
        </text>
        <line x1="205" y1="154" x2="240" y2="154" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3,2" />

        {/* Head Base & Nucleus */}
        <ellipse
          cx="250"
          cy="95"
          rx="32"
          ry="48"
          fill="url(#spermHeadGrad)"
          stroke={selectedHotspotId === 'nucleus' ? '#0284c7' : '#0369a1'}
          strokeWidth={selectedHotspotId === 'nucleus' ? '3' : '2'}
          className="cursor-pointer hover:brightness-105"
          onClick={() => onSelectHotspot('nucleus')}
        />
        {/* Condensed Chromatin / Nucleus Core */}
        <ellipse
          cx="250"
          cy="108"
          rx="22"
          ry="30"
          fill="#0284c7"
          opacity="0.8"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('nucleus')}
        />
        <text x="250" y="112" textAnchor="middle" fontSize="10.5" fill="#ffffff" fontWeight="bold">
          Nucleus (23, n)
        </text>
        <text
          x="100"
          y="110"
          fontSize="11"
          fill="#0369a1"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('nucleus')}
        >
          Haploid Nucleus
        </text>
        <line x1="175" y1="108" x2="225" y2="108" stroke="#0284c7" strokeWidth="1" strokeDasharray="3,2" />

        {/* Acrosome Cap (Anterior Cap) */}
        <path
          d="M 218 80 C 218 45 282 45 282 80 C 270 70 230 70 218 80 Z"
          fill="url(#acrosomeGrad)"
          stroke={selectedHotspotId === 'acrosome' ? '#be185d' : '#9d174d'}
          strokeWidth={selectedHotspotId === 'acrosome' ? '3' : '1.8'}
          className="cursor-pointer hover:brightness-110"
          onClick={() => onSelectHotspot('acrosome')}
        />
        <text
          x="250"
          y="35"
          textAnchor="middle"
          fontSize="12"
          fill="#be185d"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('acrosome')}
        >
          Acrosome (அக்ரோசோம்)
        </text>
        <line x1="250" y1="40" x2="250" y2="55" stroke="#db2777" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
