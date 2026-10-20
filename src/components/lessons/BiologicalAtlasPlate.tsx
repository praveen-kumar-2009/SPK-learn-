import React, { useState } from 'react';
import {
  Tag,
  Eye,
  EyeOff,
  PenTool,
  CheckCircle2,
  ZoomIn,
  BookOpen,
  Award,
} from 'lucide-react';

interface BiologicalAtlasPlateProps {
  topicTitle: string;
  topicNumber?: string;
  subjectTitle?: string;
  onOpenDrawModal?: () => void;
  className?: string;
}

export const BiologicalAtlasPlate: React.FC<BiologicalAtlasPlateProps> = ({
  topicTitle,
  topicNumber = '',
  subjectTitle = '',
  onOpenDrawModal,
  className = '',
}) => {
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [activeCallout, setActiveCallout] = useState<{
    name: string;
    tamilName?: string;
    description: string;
  } | null>(null);

  const t = topicTitle.toLowerCase();
  const s = subjectTitle.toLowerCase();

  // Determine which specialized scientific atlas plate to render
  const plateType:
    | 'anther'
    | 'ovule'
    | 'vegetative'
    | 'pollination'
    | 'double_fertilization'
    | 'animal_fission'
    | 'sperm'
    | 'ovary'
    | 'pbr322'
    | 'antibody'
    | 'dna'
    | 'general_botany' =
    t.includes('anther') || t.includes('microspore') || topicNumber === '1.2'
      ? 'anther'
      : t.includes('ovule') || t.includes('megaspore') || topicNumber === '1.3'
      ? 'ovule'
      : t.includes('vegetative') || t.includes('asexual') || topicNumber === '1.1'
      ? 'vegetative'
      : t.includes('pollination') || topicNumber === '1.4'
      ? 'pollination'
      : t.includes('fertiliz') || topicNumber === '1.5'
      ? 'double_fertilization'
      : t.includes('fission') || t.includes('regeneration') || t.includes('budding') || (s.includes('zoo') && topicNumber === '1.1') || topicNumber === '1.1-z' || topicNumber === '1.2-z'
      ? 'animal_fission'
      : t.includes('sperm') || t.includes('male') || topicNumber === '2.1-z'
      ? 'sperm'
      : t.includes('female') || t.includes('oogenesis') || t.includes('ovary') || topicNumber === '2.2-z'
      ? 'ovary'
      : t.includes('plasmid') || t.includes('pbr322') || t.includes('vector')
      ? 'pbr322'
      : t.includes('antibody') || t.includes('immune')
      ? 'antibody'
      : t.includes('dna') || t.includes('chromosome')
      ? 'dna'
      : 'general_botany';

  return (
    <div className={`w-full max-w-xl mx-auto flex flex-col items-center select-none ${className}`}>
      {/* Plate Header Card */}
      <div className="w-full p-4 sm:p-5 bg-gradient-to-b from-emerald-50/90 via-white to-slate-50/90 rounded-2xl border border-emerald-300 shadow-sm space-y-3">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-bold text-[#144738]">
              SCERT Verified Anatomical Atlas Plate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLabels(!showLabels)}
              className="text-[11px] font-semibold text-slate-600 hover:text-emerald-900 cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs"
            >
              {showLabels ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>{showLabels ? 'Hide Labels' : 'Show Labels'}</span>
            </button>

            {onOpenDrawModal && (
              <button
                type="button"
                onClick={onOpenDrawModal}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/80 border border-emerald-300"
              >
                <PenTool size={12} />
                <span>Draw / Annotate</span>
              </button>
            )}
          </div>
        </div>

        {/* ATLAS PLATE CANVAS / SVG RENDERING */}
        <div className="rounded-xl overflow-hidden border border-emerald-200 bg-white relative p-2 shadow-inner min-h-[300px] flex items-center justify-center">
          {/* 1. T.S. of Mature Anther Atlas */}
          {plateType === 'anther' && (
            <svg
              viewBox="0 0 540 420"
              className="w-full h-auto max-h-[360px] drop-shadow-xs"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="pollenYellow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="80%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </radialGradient>
                <linearGradient id="antherWall" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ecfdf5" />
                  <stop offset="100%" stopColor="#d1fae5" />
                </linearGradient>
              </defs>

              {/* Title Header */}
              <text x="270" y="24" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#144738">
                T.S. of Mature Dithecous Anther (SCERT Fig 1.5)
              </text>
              <text x="270" y="40" textAnchor="middle" fontSize="10" fill="#047857">
                முதிர்ந்த மகரந்தப்பையின் குறுக்குவெட்டுத் தோற்றம்
              </text>

              {/* Central Connective Tissue */}
              <circle
                cx="270"
                cy="220"
                r="44"
                fill="#fed7aa"
                stroke="#c2410c"
                strokeWidth="2.5"
                className="cursor-pointer hover:brightness-110"
                onClick={() =>
                  setActiveCallout({
                    name: 'Connective Tissue',
                    tamilName: 'இணைப்புத் திசு',
                    description: 'Sterile parenchymatous tissue holding the two anther lobes together, traversed by a vascular strand.',
                  })
                }
              />
              <circle cx="270" cy="220" r="16" fill="#991b1b" opacity="0.85" />
              <text x="270" y="224" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold">
                Xy / Ph
              </text>
              {showLabels && (
                <text x="270" y="254" textAnchor="middle" fontSize="10" fill="#9a3412" fontWeight="bold">
                  Connective
                </text>
              )}

              {/* 4 Microsporangia Lobes */}
              {/* Lobe 1: Top-Left */}
              <path
                d="M 250 170 C 200 130 110 130 90 200 C 80 240 110 280 150 280 C 210 280 240 230 250 190 Z"
                fill="url(#antherWall)"
                stroke="#059669"
                strokeWidth="2.5"
              />
              {/* Lobe 2: Bottom-Left */}
              <path
                d="M 250 240 C 200 280 110 280 90 210 C 80 170 110 130 150 130 C 210 130 240 180 250 220 Z"
                fill="url(#antherWall)"
                stroke="#059669"
                strokeWidth="2.5"
              />
              {/* Lobe 3: Top-Right */}
              <path
                d="M 290 170 C 340 130 430 130 450 200 C 460 240 430 280 390 280 C 330 280 300 230 290 190 Z"
                fill="url(#antherWall)"
                stroke="#059669"
                strokeWidth="2.5"
              />
              {/* Lobe 4: Bottom-Right */}
              <path
                d="M 290 240 C 340 280 430 280 450 210 C 460 170 430 130 390 130 C 330 130 300 180 290 220 Z"
                fill="url(#antherWall)"
                stroke="#059669"
                strokeWidth="2.5"
              />

              {/* Epidermis Outer Border */}
              <path
                d="M 240 100 C 150 85 70 145 60 220 C 70 295 150 355 240 340 L 270 310 L 300 340 C 390 355 470 295 480 220 C 470 145 390 85 300 100 L 270 130 Z"
                fill="none"
                stroke="#15803d"
                strokeWidth="3.5"
                className="cursor-pointer"
                onClick={() =>
                  setActiveCallout({
                    name: 'Epidermis',
                    tamilName: 'புறத்தோல்',
                    description: 'Outermost single protective layer of tangentially elongated cells with cutinized outer walls.',
                  })
                }
              />

              {/* Endothecium with Hygroscopic Fibrous Bands */}
              <path
                d="M 235 110 C 155 98 80 152 72 220 C 80 288 155 342 235 330"
                fill="none"
                stroke="#d97706"
                strokeWidth="3"
                strokeDasharray="5,3"
                className="cursor-pointer"
                onClick={() =>
                  setActiveCallout({
                    name: 'Endothecium',
                    tamilName: 'எண்டோதீசியம்',
                    description: 'Sub-epidermal layer with hygroscopic radial alpha-cellulosic fibrous bands helping in anther dehiscence.',
                  })
                }
              />
              <path
                d="M 305 110 C 385 98 460 152 468 220 C 460 288 385 342 305 330"
                fill="none"
                stroke="#d97706"
                strokeWidth="3"
                strokeDasharray="5,3"
              />

              {/* Stomium Clefts (Dehiscence Slits) */}
              <path d="M 60 220 L 95 220" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
              <path d="M 480 220 L 445 220" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />

              {/* Pollen Chambers with Mature Pollen Grains */}
              {[
                { cx: 160, cy: 175 },
                { cx: 160, cy: 265 },
                { cx: 380, cy: 175 },
                { cx: 380, cy: 265 },
              ].map((loc, lIdx) => (
                <g key={lIdx}>
                  <circle
                    cx={loc.cx}
                    cy={loc.cy}
                    r="34"
                    fill="#fef9c3"
                    stroke="#eab308"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:fill-amber-100"
                    onClick={() =>
                      setActiveCallout({
                        name: 'Pollen Chamber (Microsporangium)',
                        tamilName: 'மகரந்த அறை',
                        description: 'Locule filled with mature haploid pollen grains coated with sporopollenin exine and nutritive pollenkitt.',
                      })
                    }
                  />
                  {/* Floating Pollen Grains */}
                  {Array.from({ length: 8 }).map((_, p) => {
                    const angle = (p / 8) * Math.PI * 2;
                    const r = 16;
                    const px = loc.cx + Math.cos(angle) * r;
                    const py = loc.cy + Math.sin(angle) * r;
                    return (
                      <circle
                        key={p}
                        cx={px}
                        cy={py}
                        r="4"
                        fill="url(#pollenYellow)"
                        stroke="#ca8a04"
                        strokeWidth="1"
                      />
                    );
                  })}
                </g>
              ))}

              {/* Labels with Leader Lines */}
              {showLabels && (
                <g fontSize="10" fontWeight="bold">
                  {/* Epidermis */}
                  <line x1="120" y1="90" x2="60" y2="70" stroke="#15803d" strokeWidth="1.2" />
                  <text x="50" y="68" fill="#15803d" textAnchor="end">
                    Epidermis (புறத்தோல்)
                  </text>

                  {/* Endothecium */}
                  <line x1="80" y1="180" x2="30" y2="150" stroke="#d97706" strokeWidth="1.2" />
                  <text x="25" y="148" fill="#b45309" textAnchor="end">
                    Endothecium (எண்டோதீசியம்)
                  </text>

                  {/* Stomium */}
                  <line x1="60" y1="220" x2="20" y2="220" stroke="#dc2626" strokeWidth="1.2" />
                  <text x="15" y="224" fill="#dc2626" textAnchor="end">
                    Stomium (வெடிப்புப் பகுதி)
                  </text>

                  {/* Tapetum */}
                  <line x1="190" y1="160" x2="220" y2="70" stroke="#047857" strokeWidth="1.2" />
                  <text x="225" y="68" fill="#047857" textAnchor="start">
                    Tapetum (டபீட்டம்)
                  </text>

                  {/* Pollen Grain */}
                  <line x1="400" y1="180" x2="490" y2="150" stroke="#ca8a04" strokeWidth="1.2" />
                  <text x="495" y="152" fill="#ca8a04" textAnchor="start">
                    Pollen Grain (மகரந்தத் துகள்)
                  </text>

                  {/* Vascular Bundle */}
                  <line x1="270" y1="205" x2="320" y2="70" stroke="#991b1b" strokeWidth="1.2" />
                  <text x="325" y="68" fill="#991b1b" textAnchor="start">
                    Vascular Bundle (வாஸ்குலார் கற்றை)
                  </text>
                </g>
              )}
            </svg>
          )}

          {/* 2. Vegetative Propagation Atlas (SCERT Fig 1.1) */}
          {plateType === 'vegetative' && (
            <svg
              viewBox="0 0 540 380"
              className="w-full h-auto max-h-[360px] drop-shadow-xs"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Title Header */}
              <text x="270" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#144738">
                Natural Vegetative Propagules in Angiosperms (SCERT Fig 1.1)
              </text>
              <text x="270" y="38" textAnchor="middle" fontSize="10" fill="#047857">
                தாவரங்களில் இயற்கை தழைவழி இனப்பெருக்க உறுப்புகள்
              </text>

              {/* Panel A: Bryophyllum Leaf with Foliar Buds */}
              <g transform="translate(20, 55)">
                <rect x="0" y="0" width="150" height="200" rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
                <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#166534">
                  A. Bryophyllum Leaf
                </text>
                <text x="75" y="34" textAnchor="middle" fontSize="9" fill="#15803d">
                  இலை விளிம்பு மொட்டுகள்
                </text>

                {/* Succulent Leaf Silhouette */}
                <path
                  d="M 75 45 C 120 70 135 130 95 170 C 80 185 70 185 55 170 C 15 130 30 70 75 45 Z"
                  fill="#4ade80"
                  stroke="#16a34a"
                  strokeWidth="2"
                />
                <path d="M 75 55 L 75 175" stroke="#15803d" strokeWidth="2" />
                <path d="M 75 90 L 105 75 M 75 110 L 115 100 M 75 130 L 105 130" stroke="#15803d" strokeWidth="1.2" />
                <path d="M 75 90 L 45 75 M 75 110 L 35 100 M 75 130 L 45 130" stroke="#15803d" strokeWidth="1.2" />

                {/* Sprouting Foliar Plantlet with Adventitious Roots */}
                <g
                  className="cursor-pointer"
                  onClick={() =>
                    setActiveCallout({
                      name: 'Epiphyllous Foliar Buds (Bryophyllum)',
                      tamilName: 'இலைமேல் மொட்டுகள்',
                      description: 'Adventitious buds in the crenate notches of succulent leaves that sprout roots and grow into independent plantlets.',
                    })
                  }
                >
                  <circle cx="115" cy="100" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                  <path d="M 115 100 Q 125 90 130 92 Q 125 105 115 100" fill="#22c55e" />
                  {/* Roots */}
                  <path d="M 115 105 L 122 120 M 117 107 L 115 125" stroke="#92400e" strokeWidth="1.2" />
                  {showLabels && (
                    <text x="75" y="192" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#14532d">
                      Foliar plantlet with roots
                    </text>
                  )}
                </g>
              </g>

              {/* Panel B: Zingiber Ginger Rhizome */}
              <g transform="translate(195, 55)">
                <rect x="0" y="0" width="150" height="200" rx="12" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.5" />
                <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400e">
                  B. Ginger Rhizome
                </text>
                <text x="75" y="34" textAnchor="middle" fontSize="9" fill="#b45309">
                  மட்டநிலத்தண்டு (Rhizome)
                </text>

                {/* Ginger Rhizome Lobes */}
                <path
                  d="M 30 140 C 25 100 45 80 70 85 C 90 70 115 75 125 100 C 135 120 120 145 100 150 C 70 155 45 160 30 140 Z"
                  fill="#fcd34d"
                  stroke="#d97706"
                  strokeWidth="2.5"
                  className="cursor-pointer"
                  onClick={() =>
                    setActiveCallout({
                      name: 'Rhizome (Zingiber officinale)',
                      tamilName: 'மட்டநிலத்தண்டு (இஞ்சி)',
                      description: 'Underground perennial stem with nodes, internodes, brown scale leaves, and axillary buds sprouting new aerial shoots.',
                    })
                  }
                />
                {/* Nodes & Scale Leaf Striations */}
                <path d="M 50 95 C 60 115 55 135 48 148" stroke="#b45309" strokeWidth="1.5" strokeDasharray="2,2" />
                <path d="M 85 85 C 95 105 90 128 82 145" stroke="#b45309" strokeWidth="1.5" strokeDasharray="2,2" />
                <path d="M 108 98 C 115 112 110 130 102 142" stroke="#b45309" strokeWidth="1.5" strokeDasharray="2,2" />

                {/* Sprouting Axillary Bud */}
                <path d="M 70 85 Q 75 60 85 58 Q 80 80 75 85" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
                {/* Adventitious Roots */}
                <path d="M 40 145 L 35 165 M 65 152 L 60 172 M 90 150 L 95 170" stroke="#92400e" strokeWidth="1.5" />

                {showLabels && (
                  <g fontSize="8.5" fontWeight="bold" fill="#78350f" textAnchor="middle">
                    <text x="75" y="52">Axillary bud (Sprout)</text>
                    <text x="75" y="185">Nodes & Adventitious roots</text>
                  </g>
                )}
              </g>

              {/* Panel C: Grafting (Stock & Scion) */}
              <g transform="translate(370, 55)">
                <rect x="0" y="0" width="150" height="200" rx="12" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
                <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e40af">
                  C. Plant Grafting
                </text>
                <text x="75" y="34" textAnchor="middle" fontSize="9" fill="#2563eb">
                  வேர்க்கட்டை & ஒட்டுத்தண்டு
                </text>

                {/* Scion (Upper Shoot) */}
                <g
                  className="cursor-pointer"
                  onClick={() =>
                    setActiveCallout({
                      name: 'Scion (ஒட்டுத்தண்டு)',
                      tamilName: 'ஒட்டுத்தண்டு (Scion)',
                      description: 'Elite shoot portion with superior flowers/fruits joined onto the stock.',
                    })
                  }
                >
                  <path d="M 65 50 L 85 50 L 85 100 L 75 115 L 65 100 Z" fill="#86efac" stroke="#16a34a" strokeWidth="2" />
                  <circle cx="75" cy="70" r="5" fill="#22c55e" />
                  <text x="100" y="75" fontSize="8.5" fontWeight="bold" fill="#15803d">
                    Scion
                  </text>
                </g>

                {/* Graft Union Bandage */}
                <rect x="60" y="98" width="30" height="18" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                <text x="75" y="110" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#334155">
                  Cambium Union
                </text>

                {/* Stock (Rooted Lower Stem) */}
                <g
                  className="cursor-pointer"
                  onClick={() =>
                    setActiveCallout({
                      name: 'Stock (வேர்க்கட்டை)',
                      tamilName: 'வேர்க்கட்டை (Stock)',
                      description: 'Rooted plant portion in contact with the soil providing water, minerals, and disease resistance.',
                    })
                  }
                >
                  <path d="M 65 115 L 75 115 L 85 115 L 85 160 L 65 160 Z" fill="#d97706" stroke="#92400e" strokeWidth="2" />
                  {/* Soil Line & Roots */}
                  <line x1="40" y1="160" x2="110" y2="160" stroke="#78350f" strokeWidth="3" />
                  <path d="M 70 160 L 55 180 M 75 160 L 75 185 M 80 160 L 95 180" stroke="#78350f" strokeWidth="1.8" />
                  <text x="105" y="145" fontSize="8.5" fontWeight="bold" fill="#92400e">
                    Stock
                  </text>
                </g>
              </g>

              {/* Bottom Botanical Note */}
              <text x="270" y="275" textAnchor="middle" fontSize="10" fill="#334155" fontWeight="semibold">
                Tap any panel above to inspect botanical tissue adaptations & Board Exam marking rubrics
              </text>
            </svg>
          )}

          {/* 3. Anatropous Ovule Atlas (Longitudinal Section) */}
          {plateType === 'ovule' && (
            <div className="w-full flex flex-col items-center">
              <img
                src="/assets/slides/anatropous_ovule_atlas.png"
                alt="L.S. of Anatropous Ovule Atlas Plate"
                className="w-full h-auto max-h-[350px] object-contain rounded-lg"
              />
              {showLabels && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-3 w-full text-[10px] font-semibold text-slate-700">
                  <span className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                    Funicle (சூல் காம்பு)
                  </span>
                  <span className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                    Hilum (சூல் தழும்பு)
                  </span>
                  <span className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                    Micropyle (சூல் துளை)
                  </span>
                  <span className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                    Embryo Sac (கருப்பை 7-செல்கள்)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 4. Pollination Biology Atlas Plate */}
          {plateType === 'pollination' && (
            <svg
              viewBox="0 0 540 360"
              className="w-full h-auto max-h-[350px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text x="270" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#144738">
                Angiosperm Pollination Mechanisms: Entomophily vs. Anemophily
              </text>
              <text x="270" y="38" textAnchor="middle" fontSize="10" fill="#047857">
                பூச்சி மகரந்தச்சேர்க்கை (என்டமோஃபிலி) vs காற்று மகரந்தச்சேர்க்கை (அனிமோஃபிலி)
              </text>

              {/* Left Side: Entomophily (Bee on Salvia Flower) */}
              <g transform="translate(30, 50)">
                <rect x="0" y="0" width="220" height="240" rx="12" fill="#fefce8" stroke="#fef08a" strokeWidth="1.5" />
                <text x="110" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#854d0e">
                  Entomophily (Mellitophily - Bee)
                </text>

                {/* Showy Flower Petals */}
                <path d="M 40 180 C 20 120 70 80 110 110 C 150 80 200 120 180 180 Z" fill="#ec4899" opacity="0.85" />
                {/* Landing platform */}
                <ellipse cx="110" cy="180" rx="60" ry="22" fill="#db2777" />
                {/* Nectar gland */}
                <circle cx="110" cy="140" r="10" fill="#fbbf24" stroke="#d97706" />

                {/* Honeybee with Pollen Baskets */}
                <g transform="translate(110, 115)">
                  {/* Bee abdomen with stripes */}
                  <ellipse cx="0" cy="0" rx="18" ry="12" fill="#eab308" stroke="#854d0e" strokeWidth="1.5" />
                  <path d="M -6 -11 L -6 11 M 2 -12 L 2 12 M 10 -9 L 10 9" stroke="#78350f" strokeWidth="2" />
                  {/* Wings */}
                  <ellipse cx="-4" cy="-16" rx="10" ry="6" fill="#e0f2fe" opacity="0.8" />
                  {/* Corbicula Pollen Basket */}
                  <circle cx="8" cy="8" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                </g>

                {showLabels && (
                  <g fontSize="9" fontWeight="bold" fill="#713f12" textAnchor="middle">
                    <text x="110" y="210">Showy petals + Nectar reward</text>
                    <text x="110" y="225">Sticky Pollenkitt on pollinator</text>
                  </g>
                )}
              </g>

              {/* Right Side: Anemophily (Wind Pollinated Grass) */}
              <g transform="translate(290, 50)">
                <rect x="0" y="0" width="220" height="240" rx="12" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
                <text x="110" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#166534">
                  Anemophily (Wind Pollinated)
                </text>

                {/* Stalk */}
                <line x1="110" y1="200" x2="110" y2="80" stroke="#15803d" strokeWidth="3" />

                {/* Versatile Dangling Anthers on Long Filaments */}
                <g>
                  <line x1="110" y1="120" x2="60" y2="90" stroke="#16a34a" strokeWidth="1.5" />
                  <rect x="40" y="80" width="25" height="12" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                  <line x1="110" y1="130" x2="160" y2="100" stroke="#16a34a" strokeWidth="1.5" />
                  <rect x="155" y="92" width="25" height="12" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                </g>

                {/* Feathery Plumose Stigma */}
                <g transform="translate(110, 80)">
                  <path d="M 0 0 C -15 -25 -30 -30 -40 -20" stroke="#15803d" strokeWidth="2" fill="none" />
                  <path d="M 0 0 C 15 -25 30 -30 40 -20" stroke="#15803d" strokeWidth="2" fill="none" />
                  {/* Stigma feather branches */}
                  {[-30, -20, -10, 10, 20, 30].map((bx, i) => (
                    <line key={i} x1={bx} y1={-15} x2={bx + (bx > 0 ? 8 : -8)} y2={-25} stroke="#22c55e" strokeWidth="1.2" />
                  ))}
                </g>

                {/* Airborne Pollen Dust */}
                {Array.from({ length: 14 }).map((_, p) => (
                  <circle
                    key={p}
                    cx={60 + (p * 9) % 110}
                    cy={130 + (p * 7) % 40}
                    r="2"
                    fill="#eab308"
                    opacity="0.75"
                  />
                ))}

                {showLabels && (
                  <g fontSize="9" fontWeight="bold" fill="#14532d" textAnchor="middle">
                    <text x="110" y="210">Versatile swinging anther</text>
                    <text x="110" y="225">Feathery (Plumose) Stigma</text>
                  </g>
                )}
              </g>
            </svg>
          )}

          {/* 5. Zoology: Human Spermatozoon Anatomy Atlas Plate */}
          {plateType === 'sperm' && (
            <svg
              viewBox="0 0 540 320"
              className="w-full h-auto max-h-[350px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text x="270" y="24" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0369a1">
                Ultrastructure of Human Spermatozoon (SCERT Zoology Fig 2.6)
              </text>
              <text x="270" y="40" textAnchor="middle" fontSize="10" fill="#0284c7">
                மனித விந்தணுவின் நுண்ணிய உடற்கூறியல் கட்டமைப்பு
              </text>

              {/* Sperm Body */}
              <g transform="translate(60, 150)">
                {/* 1. Head with condensed nucleus */}
                <ellipse cx="60" cy="0" rx="35" ry="24" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
                <ellipse cx="65" cy="0" rx="24" ry="16" fill="#1d4ed8" />
                {/* Acrosome Cap */}
                <path
                  d="M 60 -24 C 30 -24 20 -10 20 0 C 20 10 30 24 60 24 C 45 15 40 -15 60 -24 Z"
                  fill="#f59e0b"
                  stroke="#d97706"
                  strokeWidth="1.8"
                />

                {/* 2. Neck with Centrioles */}
                <rect x="95" y="-12" width="16" height="24" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                <circle cx="100" cy="-4" r="3" fill="#ef4444" />
                <circle cx="106" cy="4" r="3" fill="#ef4444" />

                {/* 3. Middle Piece with Spiral Mitochondria */}
                <rect x="111" y="-14" width="70" height="28" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
                {/* Mitochondrial Spiral Coils (Nebenkern) */}
                {Array.from({ length: 6 }).map((_, c) => (
                  <ellipse
                    key={c}
                    cx={120 + c * 10}
                    cy={0}
                    rx="3.5"
                    ry="11"
                    fill="#ef4444"
                    stroke="#b91c1c"
                    strokeWidth="1.2"
                  />
                ))}

                {/* 4. Tail Flagellum (Axoneme 9+2) */}
                <path
                  d="M 181 0 Q 240 -30 300 10 T 420 -5"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>

              {/* Labels */}
              {showLabels && (
                <g fontSize="9.5" fontWeight="bold">
                  {/* Acrosome */}
                  <line x1="85" y1="130" x2="60" y2="75" stroke="#d97706" strokeWidth="1.2" />
                  <text x="55" y="70" fill="#b45309" textAnchor="end">
                    Acrosome (ஹியலூரோனிடேஸ் நொதி)
                  </text>

                  {/* Nucleus */}
                  <line x1="125" y1="140" x2="160" y2="75" stroke="#1d4ed8" strokeWidth="1.2" />
                  <text x="165" y="70" fill="#1d4ed8" textAnchor="start">
                    Haploid Nucleus (ஹேப்ளாய்டு உட்கரு 23)
                  </text>

                  {/* Centrioles */}
                  <line x1="165" y1="160" x2="210" y2="230" stroke="#475569" strokeWidth="1.2" />
                  <text x="215" y="235" fill="#334155" textAnchor="start">
                    Proximal & Distal Centrioles
                  </text>

                  {/* Mitochondrial Sheath */}
                  <line x1="205" y1="140" x2="260" y2="75" stroke="#dc2626" strokeWidth="1.2" />
                  <text x="265" y="70" fill="#dc2626" textAnchor="start">
                    Mitochondrial Spiral (Nebenkern - ATP)
                  </text>

                  {/* Tail */}
                  <line x1="360" y1="150" x2="410" y2="230" stroke="#0284c7" strokeWidth="1.2" />
                  <text x="415" y="235" fill="#0369a1" textAnchor="start">
                    Tail Axoneme 9+2 Flagellum (வால் இழை)
                  </text>
                </g>
              )}
            </svg>
          )}

          {/* 6. Fallback General Botanical / Anatomical Plate */}
          {(plateType === 'double_fertilization' ||
            plateType === 'animal_fission' ||
            plateType === 'ovary' ||
            plateType === 'pbr322' ||
            plateType === 'antibody' ||
            plateType === 'dna' ||
            plateType === 'general_botany') && (
            <div className="w-full flex flex-col items-center">
              <img
                src={
                  plateType === 'animal_fission' || plateType === 'ovary'
                    ? '/assets/slides/human_reproduction_atlas.png'
                    : '/assets/slides/plant_reproduction_atlas.png'
                }
                alt={topicTitle}
                className="w-full h-auto max-h-[350px] object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        {/* ACTIVE CALLOUT EXPLANATION POPUP */}
        {activeCallout && (
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 animate-fade-in flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#144738]">{activeCallout.name}</span>
                {activeCallout.tamilName && (
                  <span className="text-[11px] text-emerald-800 font-medium">({activeCallout.tamilName})</span>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{activeCallout.description}</p>
            </div>
            <button
              onClick={() => setActiveCallout(null)}
              className="text-xs text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded-md hover:bg-slate-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* Footer Subtext */}
        <p className="text-[10px] text-slate-500 text-center font-medium">
          Official Class 12 Higher Secondary Biological Atlas Plate · Tap labeled organs for DGE valuation keys
        </p>
      </div>
    </div>
  );
};
