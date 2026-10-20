import React from 'react';

interface DiagramProps {
  selectedHotspotId?: string;
  onSelectHotspot: (id: string) => void;
}

export const Pbr322Diagram: React.FC<DiagramProps> = ({ selectedHotspotId, onSelectHotspot }) => {
  return (
    <div className="relative w-full max-w-xl mx-auto aspect-4/3 flex items-center justify-center p-2 select-none">
      <svg
        viewBox="0 0 500 420"
        className="w-full h-full drop-shadow-sm transition-all duration-300"
        aria-label="Cloning Vector pBR322 Genetic Map"
      >
        <defs>
          <filter id="pbrGlow">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Circular Double Stranded Plasmid DNA */}
        <circle cx="250" cy="210" r="120" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="22" />
        <circle cx="250" cy="210" r="109" fill="none" stroke="#475569" strokeWidth="1.5" />
        <circle cx="250" cy="210" r="131" fill="none" stroke="#475569" strokeWidth="1.5" />

        {/* Center Title */}
        <text x="250" y="205" textAnchor="middle" fontSize="18" fill="#1e293b" fontWeight="800">
          pBR322
        </text>
        <text x="250" y="225" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
          4,361 bp (4.36 kb)
        </text>

        {/* ampR Gene Arc (Left side, ~210 deg to 330 deg) */}
        <path
          d="M 146 150 A 120 120 0 0 0 146 270"
          fill="none"
          stroke={selectedHotspotId === 'ampr' ? '#059669' : '#10b981'}
          strokeWidth="22"
          className="cursor-pointer hover:stroke-emerald-600 transition-colors"
          onClick={() => onSelectHotspot('ampr')}
        />
        <text
          x="125"
          y="215"
          textAnchor="middle"
          fontSize="12"
          fill="#065f46"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('ampr')}
        >
          ampR
        </text>

        {/* tetR Gene Arc (Right side, ~30 deg to 150 deg) */}
        <path
          d="M 354 150 A 120 120 0 0 1 354 270"
          fill="none"
          stroke={selectedHotspotId === 'tetr' ? '#ea580c' : '#f97316'}
          strokeWidth="22"
          className="cursor-pointer hover:stroke-orange-600 transition-colors"
          onClick={() => onSelectHotspot('tetr')}
        />
        <text
          x="375"
          y="215"
          textAnchor="middle"
          fontSize="12"
          fill="#9a3412"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('tetr')}
        >
          tetR
        </text>

        {/* Ori Region Arc (Bottom left) */}
        <path
          d="M 180 306 A 120 120 0 0 0 250 330"
          fill="none"
          stroke={selectedHotspotId === 'ori' ? '#2563eb' : '#3b82f6'}
          strokeWidth="22"
          className="cursor-pointer hover:stroke-blue-600 transition-colors"
          onClick={() => onSelectHotspot('ori')}
        />
        <text
          x="210"
          y="355"
          textAnchor="middle"
          fontSize="12"
          fill="#1e40af"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('ori')}
        >
          ori
        </text>

        {/* rop Gene Arc (Bottom right) */}
        <path
          d="M 250 330 A 120 120 0 0 0 320 306"
          fill="none"
          stroke={selectedHotspotId === 'rop' ? '#7c3aed' : '#8b5cf6'}
          strokeWidth="22"
          className="cursor-pointer hover:stroke-purple-600 transition-colors"
          onClick={() => onSelectHotspot('rop')}
        />
        <text
          x="290"
          y="355"
          textAnchor="middle"
          fontSize="12"
          fill="#5b21b6"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('rop')}
        >
          rop
        </text>

        {/* Restriction Enzyme Sites */}
        {/* Inside ampR: PstI, PvuI */}
        <g stroke="#047857" strokeWidth="1.5">
          <line x1="130" y1="160" x2="90" y2="140" />
          <line x1="125" y1="180" x2="80" y2="175" />
        </g>
        <text x="75" y="135" fontSize="10.5" fill="#047857" fontWeight="bold">Pst I</text>
        <text x="65" y="175" fontSize="10.5" fill="#047857" fontWeight="bold">Pvu I</text>

        {/* Inside tetR: BamHI, SalI */}
        <g stroke="#c2410c" strokeWidth="1.5">
          <line x1="370" y1="160" x2="410" y2="140" />
          <line x1="375" y1="180" x2="420" y2="175" />
        </g>
        <text x="415" y="140" fontSize="10.5" fill="#c2410c" fontWeight="bold">BamH I</text>
        <text x="425" y="180" fontSize="10.5" fill="#c2410c" fontWeight="bold">Sal I</text>

        {/* Top Polylinker: EcoRI, ClaI, HindIII */}
        <g
          stroke="#475569"
          strokeWidth="1.5"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('polylinker-sites')}
        >
          <line x1="225" y1="92" x2="210" y2="45" />
          <line x1="250" y1="90" x2="250" y2="40" />
          <line x1="275" y1="92" x2="290" y2="45" />
        </g>
        <text
          x="190"
          y="35"
          fontSize="10.5"
          fill="#0369a1"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('polylinker-sites')}
        >
          EcoR I
        </text>
        <text
          x="250"
          y="32"
          textAnchor="middle"
          fontSize="10.5"
          fill="#0369a1"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('polylinker-sites')}
        >
          Cla I
        </text>
        <text
          x="305"
          y="35"
          fontSize="10.5"
          fill="#0369a1"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('polylinker-sites')}
        >
          Hind III
        </text>

        {/* rop enzyme: PvuII */}
        <line x1="310" y1="320" x2="350" y2="350" stroke="#6d28d9" strokeWidth="1.5" />
        <text x="355" y="360" fontSize="10" fill="#6d28d9" fontWeight="bold">Pvu II</text>
      </svg>
    </div>
  );
};
