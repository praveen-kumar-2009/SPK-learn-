import React from 'react';

interface DiagramProps {
  selectedHotspotId?: string;
  onSelectHotspot: (id: string) => void;
}

export const AntherDiagram: React.FC<DiagramProps> = ({ selectedHotspotId, onSelectHotspot }) => {
  return (
    <div className="relative w-full max-w-xl mx-auto aspect-4/3 flex items-center justify-center p-2 select-none">
      <svg
        viewBox="0 0 500 420"
        className="w-full h-full drop-shadow-sm transition-all duration-300"
        aria-label="Cross section of Dithecous Anther Diagram"
      >
        <defs>
          <radialGradient id="pollenGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </radialGradient>
        </defs>

        {/* Central Connective Tissue */}
        <circle
          cx="250"
          cy="210"
          r="48"
          fill={selectedHotspotId === 'connective' ? '#fed7aa' : '#ffedd5'}
          stroke="#ea580c"
          strokeWidth="2.5"
          className="cursor-pointer hover:brightness-105"
          onClick={() => onSelectHotspot('connective')}
        />
        {/* Vascular Bundle */}
        <circle cx="250" cy="210" r="14" fill="#991b1b" opacity="0.8" />
        <text x="250" y="214" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold">
          Xy / Ph
        </text>
        <text x="250" y="245" textAnchor="middle" fontSize="11" fill="#9a3412" fontWeight="600">
          Connective (இணைப்புத் திசு)
        </text>

        {/* Butterfly-shaped Anther Lobes (4 Microsporangia) */}
        {/* Lobe 1 (Top-Left) */}
        <path
          d="M 230 170 C 180 130 110 130 90 190 C 80 230 100 270 140 270 C 190 270 220 230 230 190 Z"
          fill="#f0fdf4"
          stroke={selectedHotspotId === 'epidermis' ? '#10b981' : '#22c55e'}
          strokeWidth="2"
        />
        {/* Lobe 2 (Bottom-Left) */}
        <path
          d="M 230 230 C 180 270 110 270 90 210 C 80 170 100 130 140 130 C 190 130 220 170 230 210 Z"
          fill="#f0fdf4"
          stroke="#22c55e"
          strokeWidth="2"
        />

        {/* Lobe 3 (Top-Right) */}
        <path
          d="M 270 170 C 320 130 390 130 410 190 C 420 230 400 270 360 270 C 310 270 280 230 270 190 Z"
          fill="#f0fdf4"
          stroke="#22c55e"
          strokeWidth="2"
        />
        {/* Lobe 4 (Bottom-Right) */}
        <path
          d="M 270 230 C 320 270 390 270 410 210 C 420 170 400 130 360 130 C 310 130 280 170 270 210 Z"
          fill="#f0fdf4"
          stroke="#22c55e"
          strokeWidth="2"
        />

        {/* Epidermis & Endothecium Outlines */}
        <path
          d="M 220 100 C 140 90 70 140 60 210 C 70 280 140 330 220 320 L 250 290 L 280 320 C 360 330 430 280 440 210 C 430 140 360 90 280 100 L 250 130 Z"
          fill="none"
          stroke={selectedHotspotId === 'epidermis' ? '#15803d' : '#86efac'}
          strokeWidth="4"
          className="cursor-pointer hover:stroke-emerald-600"
          onClick={() => onSelectHotspot('epidermis')}
        />

        {/* Endothecium Radial Thickenings Accent */}
        <path
          d="M 215 110 C 145 102 82 145 74 210 C 82 275 145 318 215 310"
          fill="none"
          stroke={selectedHotspotId === 'endothecium' ? '#b45309' : '#d97706'}
          strokeWidth="3"
          strokeDasharray="4,3"
          className="cursor-pointer hover:stroke-amber-600"
          onClick={() => onSelectHotspot('endothecium')}
        />

        {/* 4 Microspore Sacs (Pollen Chambers) */}
        {/* Sac 1: Top-Left */}
        <g
          className="cursor-pointer group"
          onClick={() => onSelectHotspot('pollen-chamber')}
        >
          <circle cx="150" cy="165" r="32" fill="url(#pollenGrad)" stroke="#ca8a04" strokeWidth="2" />
          {/* Pollen Grains */}
          <circle cx="140" cy="155" r="4" fill="#a16207" />
          <circle cx="158" cy="150" r="4" fill="#a16207" />
          <circle cx="160" cy="172" r="4" fill="#a16207" />
          <circle cx="142" cy="174" r="4" fill="#a16207" />
          <circle cx="150" cy="165" r="4.5" fill="#854d0e" />
        </g>

        {/* Sac 2: Bottom-Left */}
        <g className="cursor-pointer" onClick={() => onSelectHotspot('pollen-chamber')}>
          <circle cx="150" cy="255" r="32" fill="url(#pollenGrad)" stroke="#ca8a04" strokeWidth="2" />
          <circle cx="140" cy="245" r="4" fill="#a16207" />
          <circle cx="158" cy="240" r="4" fill="#a16207" />
          <circle cx="160" cy="265" r="4" fill="#a16207" />
          <circle cx="142" cy="265" r="4" fill="#a16207" />
        </g>

        {/* Sac 3: Top-Right */}
        <g className="cursor-pointer" onClick={() => onSelectHotspot('pollen-chamber')}>
          <circle cx="350" cy="165" r="32" fill="url(#pollenGrad)" stroke="#ca8a04" strokeWidth="2" />
          <circle cx="340" cy="155" r="4" fill="#a16207" />
          <circle cx="358" cy="150" r="4" fill="#a16207" />
          <circle cx="360" cy="172" r="4" fill="#a16207" />
          <circle cx="342" cy="174" r="4" fill="#a16207" />
        </g>

        {/* Sac 4: Bottom-Right */}
        <g className="cursor-pointer" onClick={() => onSelectHotspot('pollen-chamber')}>
          <circle cx="350" cy="255" r="32" fill="url(#pollenGrad)" stroke="#ca8a04" strokeWidth="2" />
          <circle cx="340" cy="245" r="4" fill="#a16207" />
          <circle cx="358" cy="240" r="4" fill="#a16207" />
          <circle cx="360" cy="265" r="4" fill="#a16207" />
          <circle cx="342" cy="265" r="4" fill="#a16207" />
        </g>

        {/* Tapetum border around Sac 3 */}
        <circle
          cx="350"
          cy="165"
          r="36"
          fill="none"
          stroke={selectedHotspotId === 'tapetum' ? '#9333ea' : '#c084fc'}
          strokeWidth={selectedHotspotId === 'tapetum' ? '4' : '2.5'}
          strokeDasharray="6,4"
          className="cursor-pointer hover:stroke-purple-600"
          onClick={() => onSelectHotspot('tapetum')}
        />

        {/* Callouts */}
        {/* Epidermis */}
        <line x1="70" y1="130" x2="20" y2="90" stroke="#64748b" strokeWidth="1.2" />
        <text x="10" y="80" fontSize="11" fill="#15803d" fontWeight="bold">
          Epidermis (புறத்தோல்)
        </text>

        {/* Endothecium */}
        <line x1="65" y1="210" x2="15" y2="210" stroke="#64748b" strokeWidth="1.2" />
        <text x="10" y="225" fontSize="11" fill="#b45309" fontWeight="bold">
          Endothecium (எண்டோதீசியம்)
        </text>

        {/* Tapetum */}
        <line x1="385" y1="150" x2="435" y2="120" stroke="#64748b" strokeWidth="1.2" />
        <text x="390" y="110" fontSize="11" fill="#7e22ce" fontWeight="bold">
          Tapetum (டபீட்டம்)
        </text>

        {/* Pollen grains */}
        <line x1="380" y1="265" x2="430" y2="295" stroke="#64748b" strokeWidth="1.2" />
        <text x="375" y="315" fontSize="11" fill="#a16207" fontWeight="bold">
          Pollen Grains (மகரந்த துகள்கள்)
        </text>

        {/* Stomium Dehiscence lines */}
        <path d="M 60 210 L 80 210" stroke="#ef4444" strokeWidth="3" />
        <path d="M 420 210 L 440 210" stroke="#ef4444" strokeWidth="3" />
        <text x="445" y="214" fontSize="10" fill="#dc2626" fontWeight="bold">
          Stomium (வெடிக்கும் பகுதி)
        </text>
      </svg>
    </div>
  );
};
