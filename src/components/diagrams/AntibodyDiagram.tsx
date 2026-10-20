import React from 'react';

interface DiagramProps {
  selectedHotspotId?: string;
  onSelectHotspot: (id: string) => void;
}

export const AntibodyDiagram: React.FC<DiagramProps> = ({ selectedHotspotId, onSelectHotspot }) => {
  return (
    <div className="relative w-full max-w-xl mx-auto aspect-4/3 flex items-center justify-center p-2 select-none">
      <svg
        viewBox="0 0 500 420"
        className="w-full h-full drop-shadow-sm transition-all duration-300"
        aria-label="Immunoglobulin Structure Diagram"
      >
        <defs>
          <filter id="antibodyGlow">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Heavy Chains (Two inner long Y polypeptides) */}
        {/* Left Heavy Chain */}
        <path
          d="M 140 80 L 220 180 L 220 340"
          fill="none"
          stroke={selectedHotspotId === 'constant-region' ? '#1d4ed8' : '#3b82f6'}
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="cursor-pointer hover:stroke-blue-700 transition-colors"
          onClick={() => onSelectHotspot('constant-region')}
        />
        {/* Right Heavy Chain */}
        <path
          d="M 360 80 L 280 180 L 280 340"
          fill="none"
          stroke={selectedHotspotId === 'constant-region' ? '#1d4ed8' : '#3b82f6'}
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="cursor-pointer hover:stroke-blue-700 transition-colors"
          onClick={() => onSelectHotspot('constant-region')}
        />

        {/* Variable Domain of Heavy Chains (Tips) */}
        <path
          d="M 140 80 L 175 125"
          fill="none"
          stroke={selectedHotspotId === 'variable-region' ? '#f59e0b' : '#fbbf24'}
          strokeWidth="18"
          strokeLinecap="round"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('variable-region')}
        />
        <path
          d="M 360 80 L 325 125"
          fill="none"
          stroke={selectedHotspotId === 'variable-region' ? '#f59e0b' : '#fbbf24'}
          strokeWidth="18"
          strokeLinecap="round"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('variable-region')}
        />

        {/* Light Chains (Two outer shorter arms) */}
        {/* Left Light Chain */}
        <path
          d="M 100 110 L 180 210"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="14"
          strokeLinecap="round"
          className="cursor-pointer"
        />
        {/* Variable Domain of Left Light Chain */}
        <path
          d="M 100 110 L 135 155"
          fill="none"
          stroke={selectedHotspotId === 'variable-region' ? '#f59e0b' : '#fbbf24'}
          strokeWidth="14"
          strokeLinecap="round"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('variable-region')}
        />

        {/* Right Light Chain */}
        <path
          d="M 400 110 L 320 210"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="14"
          strokeLinecap="round"
          className="cursor-pointer"
        />
        {/* Variable Domain of Right Light Chain */}
        <path
          d="M 400 110 L 365 155"
          fill="none"
          stroke={selectedHotspotId === 'variable-region' ? '#f59e0b' : '#fbbf24'}
          strokeWidth="14"
          strokeLinecap="round"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('variable-region')}
        />

        {/* Disulfide Bridges (-S-S-) */}
        {/* Hinge interchain disulfide */}
        <g stroke="#dc2626" strokeWidth="3">
          <line x1="220" y1="195" x2="280" y2="195" />
          <line x1="220" y1="210" x2="280" y2="210" />
          {/* Heavy-Light Disulfides */}
          <line x1="168" y1="195" x2="190" y2="178" />
          <line x1="332" y1="195" x2="310" y2="178" />
        </g>
        <circle cx="250" cy="202" r="5" fill="#ef4444" />
        <text
          x="250"
          y="225"
          textAnchor="middle"
          fontSize="11"
          fill="#dc2626"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('hinge-region')}
        >
          Hinge Region (-S-S-)
        </text>

        {/* Antigen-Binding Sites / Paratopes (Top left and Top right pockets) */}
        {/* Left Paratope */}
        <g
          className="cursor-pointer"
          onClick={() => onSelectHotspot('antigen-binding-site')}
          filter={selectedHotspotId === 'antigen-binding-site' ? 'url(#antibodyGlow)' : undefined}
        >
          <polygon
            points="120,60 145,85 105,105 85,80"
            fill={selectedHotspotId === 'antigen-binding-site' ? '#ec4899' : '#f43f5e'}
            opacity="0.85"
          />
          <text x="110" y="50" textAnchor="middle" fontSize="10.5" fill="#be123c" fontWeight="bold">
            Paratope (VH + VL)
          </text>
        </g>

        {/* Right Paratope */}
        <g
          className="cursor-pointer"
          onClick={() => onSelectHotspot('antigen-binding-site')}
          filter={selectedHotspotId === 'antigen-binding-site' ? 'url(#antibodyGlow)' : undefined}
        >
          <polygon
            points="380,60 355,85 395,105 415,80"
            fill={selectedHotspotId === 'antigen-binding-site' ? '#ec4899' : '#f43f5e'}
            opacity="0.85"
          />
          <text x="390" y="50" textAnchor="middle" fontSize="10.5" fill="#be123c" fontWeight="bold">
            Paratope (VH + VL)
          </text>
        </g>

        {/* Fc Region / Effector Stalk */}
        <rect
          x="205"
          y="240"
          width="90"
          height="115"
          rx="12"
          fill="none"
          stroke={selectedHotspotId === 'fc-fragment' ? '#9333ea' : '#a855f7'}
          strokeWidth="2.5"
          strokeDasharray="5,4"
          className="cursor-pointer hover:stroke-purple-700"
          onClick={() => onSelectHotspot('fc-fragment')}
        />
        <text
          x="250"
          y="295"
          textAnchor="middle"
          fontSize="12"
          fill="#7e22ce"
          fontWeight="bold"
          className="cursor-pointer"
          onClick={() => onSelectHotspot('fc-fragment')}
        >
          Fc Stem (CH2 + CH3)
        </text>
        <text x="250" y="312" textAnchor="middle" fontSize="9.5" fill="#6b21a8">
          Complement / Macrophage Binding
        </text>

        {/* Fab Bracket / Annotation */}
        <text x="55" y="160" fontSize="11" fill="#0369a1" fontWeight="bold">
          Fab Fragment
        </text>
        <line x1="100" y1="160" x2="125" y2="160" stroke="#0284c7" strokeWidth="1.2" />

        {/* Chain Legend */}
        <g transform="translate(10, 360)">
          <rect x="0" y="0" width="16" height="8" rx="2" fill="#3b82f6" />
          <text x="22" y="8" fontSize="10" fill="#334155" fontWeight="600">Heavy Chain (H) ~50 kDa</text>
          <rect x="180" y="0" width="16" height="8" rx="2" fill="#06b6d4" />
          <text x="202" y="8" fontSize="10" fill="#334155" fontWeight="600">Light Chain (L) ~25 kDa</text>
          <rect x="350" y="0" width="16" height="8" rx="2" fill="#fbbf24" />
          <text x="372" y="8" fontSize="10" fill="#334155" fontWeight="600">Variable (V) Domain</text>
        </g>
      </svg>
    </div>
  );
};
