import React from 'react';

interface DiagramProps {
  selectedHotspotId?: string;
  onSelectHotspot: (id: string) => void;
}

export const OvuleDiagram: React.FC<DiagramProps> = ({ selectedHotspotId, onSelectHotspot }) => {
  return (
    <div className="relative w-full max-w-xl mx-auto aspect-4/3 flex items-center justify-center p-2 select-none">
      <svg
        viewBox="0 0 500 420"
        className="w-full h-full drop-shadow-sm transition-all duration-300"
        aria-label="Anatropous Ovule Anatomy Diagram"
      >
        <defs>
          <linearGradient id="chalazaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="integumentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1fae5" />
            <stop offset="100%" stopColor="#a7f3d0" />
          </linearGradient>
          <linearGradient id="embryoSacGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Funiculus and Raphe */}
        <path
          d="M 120 380 Q 160 380 180 340 L 210 240 Q 220 180 230 130"
          fill="none"
          stroke={selectedHotspotId === 'funiculus' ? '#059669' : '#94a3b8'}
          strokeWidth={selectedHotspotId === 'funiculus' ? '22' : '18'}
          strokeLinecap="round"
          className="cursor-pointer transition-all hover:stroke-emerald-500"
          onClick={() => onSelectHotspot('funiculus')}
        />
        <text x="110" y="395" fontSize="11" fill="#475569" fontWeight="600">
          Funiculus (சூல் காம்பு)
        </text>

        {/* Outer Integument */}
        <path
          d="M 230 130 C 230 40 370 40 370 180 C 370 300 300 370 260 370 C 250 370 248 350 252 340 C 285 340 345 280 345 180 C 345 80 250 80 240 130 Z"
          fill="url(#integumentGrad)"
          stroke={selectedHotspotId === 'integuments' ? '#059669' : '#10b981'}
          strokeWidth={selectedHotspotId === 'integuments' ? '3.5' : '2'}
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() => onSelectHotspot('integuments')}
        />

        {/* Inner Integument */}
        <path
          d="M 240 140 C 245 85 345 85 345 185 C 345 270 295 330 265 330 C 260 330 258 315 262 308 C 285 308 325 255 325 185 C 325 110 255 110 245 140 Z"
          fill="#bbf7d0"
          stroke={selectedHotspotId === 'integuments' ? '#047857' : '#059669'}
          strokeWidth="1.8"
          className="cursor-pointer hover:opacity-90"
          onClick={() => onSelectHotspot('integuments')}
        />

        {/* Chalaza Region (Top) */}
        <ellipse
          cx="290"
          cy="75"
          rx="50"
          ry="22"
          fill="url(#chalazaGrad)"
          stroke={selectedHotspotId === 'chalaza' ? '#fbbf24' : '#047857'}
          strokeWidth={selectedHotspotId === 'chalaza' ? '3' : '1.5'}
          filter={selectedHotspotId === 'chalaza' ? 'url(#glow)' : undefined}
          className="cursor-pointer hover:brightness-110"
          onClick={() => onSelectHotspot('chalaza')}
        />
        <text x="290" y="79" textAnchor="middle" fontSize="12" fill="#ffffff" fontWeight="bold">
          Chalaza (சூல் அடி)
        </text>

        {/* Nucellus Tissue */}
        <path
          d="M 255 150 C 260 120 320 120 320 185 C 320 250 290 300 270 300 C 265 295 260 270 260 250 C 255 210 252 180 255 150 Z"
          fill="#fef3c7"
          stroke="#f59e0b"
          strokeWidth="1.5"
          opacity="0.85"
        />

        {/* Embryo Sac (7-celled, 8-nucleate) */}
        <ellipse
          cx="285"
          cy="210"
          rx="26"
          ry="65"
          fill="url(#embryoSacGrad)"
          stroke="#3b82f6"
          strokeWidth="2"
          className="drop-shadow-sm"
        />

        {/* 3 Antipodal Cells (Chalazal end - Top of sac) */}
        <g
          className="cursor-pointer group"
          onClick={() => onSelectHotspot('antipodals')}
        >
          <circle cx="276" cy="165" r="6" fill={selectedHotspotId === 'antipodals' ? '#ef4444' : '#3b82f6'} />
          <circle cx="288" cy="158" r="6" fill={selectedHotspotId === 'antipodals' ? '#ef4444' : '#3b82f6'} />
          <circle cx="296" cy="166" r="6" fill={selectedHotspotId === 'antipodals' ? '#ef4444' : '#3b82f6'} />
          <circle cx="276" cy="165" r="2.5" fill="#ffffff" />
          <circle cx="288" cy="158" r="2.5" fill="#ffffff" />
          <circle cx="296" cy="166" r="2.5" fill="#ffffff" />
        </g>
        <line x1="305" y1="162" x2="385" y2="150" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
        <text x="390" y="153" fontSize="10.5" fill="#1e293b" fontWeight="600">
          3 Antipodal Cells (2n)
        </text>

        {/* Secondary Nucleus / Polar Nuclei (Center of sac) */}
        <g
          className="cursor-pointer"
          onClick={() => onSelectHotspot('secondary-nucleus')}
        >
          <ellipse
            cx="285"
            cy="210"
            rx="12"
            ry="9"
            fill={selectedHotspotId === 'secondary-nucleus' ? '#f59e0b' : '#93c5fd'}
            stroke="#1d4ed8"
            strokeWidth="1.5"
          />
          <circle cx="281" cy="210" r="2.5" fill="#1e3a8a" />
          <circle cx="289" cy="210" r="2.5" fill="#1e3a8a" />
        </g>
        <line x1="298" y1="210" x2="385" y2="210" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
        <text x="390" y="213" fontSize="10.5" fill="#1e293b" fontWeight="600">
          Secondary Nucleus (2n)
        </text>

        {/* Egg Apparatus (Micropylar end - Bottom of sac) */}
        <g
          className="cursor-pointer"
          onClick={() => onSelectHotspot('egg-apparatus')}
        >
          {/* Egg Cell */}
          <circle cx="285" cy="254" r="7.5" fill={selectedHotspotId === 'egg-apparatus' ? '#ec4899' : '#f43f5e'} />
          <circle cx="285" cy="254" r="2.5" fill="#ffffff" />
          {/* 2 Synergids */}
          <circle cx="274" cy="262" r="6" fill="#fb7185" />
          <circle cx="296" cy="262" r="6" fill="#fb7185" />
        </g>
        <line x1="298" y1="258" x2="385" y2="265" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
        <text x="390" y="268" fontSize="10.5" fill="#1e293b" fontWeight="600">
          Egg Cell & Synergids
        </text>

        {/* Micropyle Pore (Bottom entry) */}
        <g
          className="cursor-pointer"
          onClick={() => onSelectHotspot('micropyle')}
        >
          <path
            d="M 262 312 L 260 365"
            stroke={selectedHotspotId === 'micropyle' ? '#dc2626' : '#ea580c'}
            strokeWidth="3"
            strokeDasharray="4,2"
          />
          <polygon points="260,370 256,360 264,360" fill="#dc2626" />
        </g>
        <line x1="255" y1="355" x2="160" y2="355" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
        <text x="75" y="358" fontSize="11" fill="#c2410c" fontWeight="bold">
          Micropyle (சூல் துளை)
        </text>

        {/* Hilum marker */}
        <circle cx="205" cy="250" r="5" fill="#475569" />
        <text x="135" y="245" fontSize="10.5" fill="#475569" fontWeight="600">
          Hilum (சூல் தழும்பு)
        </text>
        <line x1="185" y1="245" x2="200" y2="249" stroke="#94a3b8" strokeWidth="1" />
      </svg>
    </div>
  );
};
