import React from 'react';

interface BotanicalIllustrationProps {
  type?: string;
  topicTitle?: string;
  className?: string;
}

export const BotanicalIllustration: React.FC<BotanicalIllustrationProps> = ({
  type = 'flower',
  topicTitle = '',
  className = '',
}) => {
  const combined = ((type || '') + ' ' + (topicTitle || '')).toLowerCase();

  // 1. Thermal Adaptations in Extreme Cold (Chapter 10: Organisms & Populations)
  if (
    combined.includes('cold') ||
    combined.includes('thermal') ||
    combined.includes('allen') ||
    combined.includes('adaptation') ||
    combined.includes('blubber') ||
    combined.includes('adipose') ||
    combined.includes('polar')
  ) {
    return (
      <div className={`relative flex flex-col items-center justify-center p-2 ${className}`}>
        <svg
          viewBox="0 0 340 280"
          className="w-full max-w-[320px] h-auto drop-shadow-sm select-none bg-gradient-to-b from-sky-50 to-white rounded-2xl p-2 border border-sky-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="blubberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="furGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="vesselRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="vesselBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>

          {/* Header Banner */}
          <rect x="10" y="8" width="320" height="24" rx="5" fill="#0369a1" />
          <text x="170" y="24" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
            CH 10: THERMAL ADAPTATIONS IN EXTREME COLD
          </text>

          {/* Section 1: Subcutaneous Blubber Layer Cross-Section */}
          <g transform="translate(15, 38)">
            <rect x="0" y="0" width="145" height="150" rx="8" fill="#ffffff" stroke="#93c5fd" strokeWidth="1" />
            <text x="72" y="14" fontSize="7.5" fontWeight="bold" fill="#0369a1" textAnchor="middle">
              Skin & Blubber Insulation
            </text>

            {/* Dense Fur Layer */}
            <rect x="10" y="22" width="125" height="18" fill="url(#furGrad)" stroke="#94a3b8" strokeWidth="0.8" />
            <text x="72" y="34" fontSize="6.5" fill="#334155" textAnchor="middle" fontWeight="bold">
              Dense Water-Repellent Fur
            </text>

            {/* Epidermis */}
            <rect x="10" y="42" width="125" height="10" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
            <text x="72" y="50" fontSize="6" fill="#831843" textAnchor="middle">
              Epidermis & Dermis
            </text>

            {/* Subcutaneous Adipose Blubber */}
            <rect x="10" y="54" width="125" height="52" fill="url(#blubberGrad)" stroke="#d97706" strokeWidth="1" />
            <text x="72" y="76" fontSize="7.5" fill="#78350f" textAnchor="middle" fontWeight="bold">
              Thick Adipose Blubber
            </text>
            <text x="72" y="90" fontSize="6.5" fill="#92400e" textAnchor="middle">
              Thermal Barrier (Prevents Heat Loss)
            </text>

            {/* Muscle Core */}
            <rect x="10" y="108" width="125" height="32" fill="#fda4af" stroke="#e11d48" strokeWidth="0.8" />
            <text x="72" y="126" fontSize="6.5" fill="#9f1239" textAnchor="middle" fontWeight="bold">
              Warm Core Muscle (37°C)
            </text>
          </g>

          {/* Section 2: Allen's Rule & Appendage Adaptations */}
          <g transform="translate(175, 38)">
            <rect x="0" y="0" width="150" height="150" rx="8" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
            <text x="75" y="14" fontSize="7.5" fontWeight="bold" fill="#0284c7" textAnchor="middle">
              Allen's & Bergmann's Rules
            </text>

            {/* Ear comparison sketch */}
            <rect x="10" y="22" width="60" height="50" rx="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            <path d="M 25 60 C 20 40 30 30 40 60" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.2" />
            <text x="40" y="66" fontSize="6" fill="#475569" textAnchor="middle">
              Arctic Fox: Short Ears
            </text>

            <rect x="80" y="22" width="60" height="50" rx="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            <path d="M 95 62 C 90 25 115 25 110 62" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.2" />
            <text x="110" y="66" fontSize="6" fill="#475569" textAnchor="middle">
              Desert Fox: Large Ears
            </text>

            {/* Counter-current heat exchange */}
            <g transform="translate(10, 80)">
              <rect x="0" y="0" width="130" height="60" rx="5" fill="#ffffff" stroke="#93c5fd" strokeWidth="0.8" />
              <text x="65" y="12" fontSize="6.5" fontWeight="bold" fill="#0369a1" textAnchor="middle">
                Counter-Current Heat Exchanger
              </text>
              {/* Artery flowing down */}
              <path d="M 20 22 L 110 22" stroke="url(#vesselRed)" strokeWidth="3" strokeLinecap="round" />
              <text x="15" y="32" fontSize="5.5" fill="#b91c1c">Warm Artery (35°C → 15°C)</text>
              {/* Vein flowing back */}
              <path d="M 110 42 L 20 42" stroke="url(#vesselBlue)" strokeWidth="3" strokeLinecap="round" />
              <text x="15" y="52" fontSize="5.5" fill="#1d4ed8">Cool Vein heated before core</text>
            </g>
          </g>

          {/* Physiological Summary Box */}
          <g transform="translate(15, 196)">
            <rect x="0" y="0" width="310" height="52" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <text x="10" y="14" fontSize="7.5" fontWeight="bold" fill="#0f172a">
              Key State Board Physiological Adaptations:
            </text>
            <text x="10" y="28" fontSize="7" fill="#475569">
              • Allen's Rule: Mammals in colder climates have shorter ears & limbs to minimize heat loss.
            </text>
            <text x="10" y="40" fontSize="7" fill="#475569">
              • Blubber: Subcutaneous fat in seals & whales prevents conduction of body heat into freezing waters.
            </text>
          </g>
        </svg>

        <p className="text-[11px] text-slate-500 font-medium text-center mt-1">
          10.1 Thermal Adaptations in Extreme Cold & Allen's Rule
        </p>
      </div>
    );
  }

  // 2. Male Reproductive System (Only if specifically male reproduction)
  if (
    combined.includes('male reproductive') ||
    combined.includes('spermatogenesis') ||
    (combined.includes('human') && combined.includes('male'))
  ) {
    return (
      <div className={`relative flex flex-col items-center justify-center p-2 ${className}`}>
        <svg
          viewBox="0 0 340 320"
          className="w-full max-w-[320px] h-auto drop-shadow-sm select-none bg-[#f8faf9] rounded-2xl p-2 border border-slate-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="8" width="320" height="26" rx="6" fill="#144738" />
          <text x="170" y="25" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
            2. HUMAN REPRODUCTION — 2.1 MALE REPRODUCTIVE SYSTEM
          </text>

          <ellipse cx="120" cy="180" rx="42" ry="54" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.5" />
          <path
            d="M 135 130 C 170 140 175 220 135 230 C 145 220 155 150 135 130 Z"
            fill="#fdba74"
            stroke="#ea580c"
            strokeWidth="1.5"
          />

          <path
            d="M 140 230 C 180 240 210 200 210 120 C 210 80 180 80 170 110"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <ellipse cx="140" cy="90" rx="32" ry="24" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <text x="140" y="94" fontSize="8" fill="#854d0e" fontWeight="bold" textAnchor="middle">
            Urinary Bladder
          </text>

          <ellipse cx="160" cy="130" rx="16" ry="12" fill="#d8b4fe" stroke="#9333ea" strokeWidth="1.2" />
          <text x="160" y="133" fontSize="7" fill="#6b21a8" fontWeight="bold" textAnchor="middle">
            Prostate
          </text>

          <g transform="translate(210, 160)">
            <rect x="0" y="0" width="115" height="135" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="57" y="14" fontSize="8" fontWeight="bold" fill="#144738" textAnchor="middle">
              Tubule Cross-Section
            </text>
            <circle cx="57" cy="65" r="40" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
            <path d="M 40 40 L 57 65 L 45 75 Z" fill="#bbf7d0" stroke="#15803d" strokeWidth="1" />
            <path d="M 75 40 L 57 65 L 68 75 Z" fill="#bbf7d0" stroke="#15803d" strokeWidth="1" />
            <circle cx="57" cy="65" r="3" fill="#0284c7" />
            <circle cx="52" cy="60" r="2.5" fill="#0284c7" />
            <circle cx="62" cy="62" r="2.5" fill="#0284c7" />
            <circle cx="15" cy="115" r="5" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />
            <text x="25" y="118" fontSize="7" fill="#881337" fontWeight="bold">
              Leydig Cell (Testosterone)
            </text>
            <text x="10" y="130" fontSize="7" fill="#15803d" fontWeight="bold">
              Sertoli Cell (Nutrient)
            </text>
          </g>

          <g transform="translate(15, 245)">
            <rect x="0" y="0" width="180" height="60" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
            <text x="10" y="14" fontSize="8" fontWeight="bold" fill="#144738">
              Hormonal Control of Spermatogenesis
            </text>
            <text x="10" y="28" fontSize="7" fill="#1e293b">
              • GnRH (Hypothalamus) → Anterior Pituitary
            </text>
            <text x="10" y="40" fontSize="7" fill="#1e293b">
              • LH acts on Leydig cells → Testosterone
            </text>
            <text x="10" y="52" fontSize="7" fill="#1e293b">
              • FSH acts on Sertoli cells → Spermiogenesis
            </text>
          </g>
        </svg>

        <p className="text-[11px] text-slate-500 font-medium text-center mt-1">
          2.1 Male Reproductive System Diagram
        </p>
      </div>
    );
  }

  // 3. Female Reproductive System (Only if specifically female reproduction)
  if (
    combined.includes('female reproductive') ||
    combined.includes('oogenesis') ||
    (combined.includes('human') && (combined.includes('female') || combined.includes('menstrual') || combined.includes('ovary')))
  ) {
    return (
      <div className={`relative flex flex-col items-center justify-center p-2 ${className}`}>
        <svg
          viewBox="0 0 340 330"
          className="w-full max-w-[320px] h-auto drop-shadow-sm select-none bg-[#fdf8f9] rounded-2xl p-2 border border-slate-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="8" width="320" height="26" rx="6" fill="#831843" />
          <text x="170" y="25" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
            2. HUMAN REPRODUCTION — 2.2 FEMALE REPRODUCTIVE SYSTEM
          </text>

          <path
            d="M 120 180 C 120 120 135 90 170 90 C 205 90 220 120 220 180 C 220 215 190 230 180 250 L 160 250 C 150 230 120 215 120 180 Z"
            fill="#fbcfe8"
            stroke="#db2777"
            strokeWidth="2"
          />
          <path
            d="M 140 175 C 140 135 150 115 170 115 C 190 115 200 135 200 175 C 200 195 185 205 170 215 C 155 205 140 195 140 175 Z"
            fill="#f43f5e"
            opacity="0.8"
          />
          <text x="170" y="160" fontSize="7.5" fill="#ffffff" fontWeight="bold" textAnchor="middle">
            Endometrium
          </text>

          <path
            d="M 135 105 C 100 85 70 85 55 105 C 45 118 48 135 40 145"
            fill="none"
            stroke="#f472b6"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M 40 145 Q 32 150 35 158 M 40 145 Q 42 152 46 156" stroke="#db2777" strokeWidth="2" fill="none" />

          <path
            d="M 205 105 C 240 85 270 85 285 105 C 295 118 292 135 300 145"
            fill="none"
            stroke="#f472b6"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M 300 145 Q 308 150 305 158 M 300 145 Q 298 152 294 156" stroke="#db2777" strokeWidth="2" fill="none" />

          <ellipse cx="65" cy="155" rx="18" ry="12" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="65" cy="155" r="4" fill="#f59e0b" />
          <ellipse cx="275" cy="155" rx="18" ry="12" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="275" cy="155" r="4" fill="#f59e0b" />

          <text x="65" y="178" fontSize="7" fill="#854d0e" fontWeight="bold" textAnchor="middle">
            Ovary (Follicles)
          </text>
          <text x="75" y="78" fontSize="7" fill="#9d174d" fontWeight="bold" textAnchor="middle">
            Ampulla (Fertilization)
          </text>
          <text x="170" y="270" fontSize="7.5" fill="#831843" fontWeight="bold" textAnchor="middle">
            Cervix & Vagina
          </text>

          <g transform="translate(15, 275)">
            <rect x="0" y="0" width="310" height="42" rx="6" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="1" />
            <text x="10" y="14" fontSize="7.5" fontWeight="bold" fill="#831843">
              28-Day Menstrual Cycle Regulation
            </text>
            <text x="10" y="26" fontSize="6.8" fill="#475569">
              • Follicular Phase (Days 1–13): FSH stimulates follicle growth & estrogen surge
            </text>
            <text x="10" y="36" fontSize="6.8" fill="#475569">
              • Ovulatory & Luteal Phase (Days 14–28): LH surge triggers ovulation; progesterone sustains endometrium
            </text>
          </g>
        </svg>

        <p className="text-[11px] text-slate-500 font-medium text-center mt-1">
          2.2 Female Reproductive System Diagram
        </p>
      </div>
    );
  }

  // 4. Plant Reproduction & Botany (Default for botany or plants)
  if (
    combined.includes('plant') ||
    combined.includes('botany') ||
    combined.includes('floral') ||
    combined.includes('seed') ||
    combined.includes('anther') ||
    combined.includes('ovule') ||
    combined.includes('flower')
  ) {
    return (
      <div className={`relative flex flex-col items-center justify-center p-2 ${className}`}>
        <svg
          viewBox="0 0 340 280"
          className="w-full max-w-[320px] h-auto drop-shadow-sm select-none bg-white rounded-2xl p-2 border border-slate-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="6" width="320" height="24" rx="5" fill="#144738" />
          <text x="170" y="22" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
            PLANT REPRODUCTION & MORPHOLOGY
          </text>

          <g transform="translate(15, 36)">
            <rect x="0" y="0" width="145" height="225" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
            <rect x="0" y="0" width="145" height="20" rx="5" fill="#166534" />
            <text x="72" y="14" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle">
              VEGETATIVE PROPAGATION
            </text>

            <path d="M 20 80 Q 50 65 80 80" stroke="#65a30d" strokeWidth="2" fill="none" />
            <circle cx="20" cy="80" r="4" fill="#84cc16" />
            <circle cx="80" cy="80" r="4" fill="#84cc16" />
            <text x="72" y="98" fontSize="7" fill="#365314" textAnchor="middle">
              Runner (Centella / Fragaria)
            </text>

            <ellipse cx="72" cy="140" rx="28" ry="18" fill="#d97706" opacity="0.8" />
            <circle cx="65" cy="135" r="2" fill="#78350f" />
            <circle cx="80" cy="142" r="2" fill="#78350f" />
            <text x="72" y="170" fontSize="7" fill="#78350f" textAnchor="middle">
              Stem Tuber (Eyes & Buds)
            </text>

            <path d="M 40 205 Q 72 185 105 205 Q 72 220 40 205 Z" fill="#4ade80" stroke="#15803d" strokeWidth="1" />
            <text x="72" y="220" fontSize="7" fill="#14532d" textAnchor="middle">
              Foliar Buds (Bryophyllum)
            </text>
          </g>

          <g transform="translate(175, 36)">
            <rect x="0" y="0" width="150" height="225" rx="6" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="1" />
            <rect x="0" y="0" width="150" height="20" rx="5" fill="#be185d" />
            <text x="75" y="14" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle">
              ANGIOSPERM REPRODUCTION
            </text>

            <circle cx="75" cy="80" r="25" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
            <path d="M 75 60 L 75 95" stroke="#15803d" strokeWidth="3" />
            <circle cx="75" cy="60" r="5" fill="#84cc16" />
            <text x="75" y="112" fontSize="7" fill="#9d174d" textAnchor="middle">
              Pollen Transfer (Pollination)
            </text>

            <ellipse cx="75" cy="145" rx="20" ry="14" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
            <circle cx="70" cy="145" r="4" fill="#2563eb" />
            <circle cx="80" cy="145" r="4" fill="#f59e0b" />
            <text x="75" y="172" fontSize="7" fill="#c2410c" textAnchor="middle">
              Double Fertilization (Syngamy & 3n)
            </text>

            <circle cx="75" cy="200" rx="16" ry="16" fill="#ef4444" opacity="0.9" />
            <ellipse cx="75" cy="200" rx="6" ry="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            <text x="75" y="224" fontSize="7" fill="#991b1b" textAnchor="middle">
              Seed & Fruit Development
            </text>
          </g>
        </svg>

        <p className="text-[11px] text-slate-500 font-medium text-center mt-1">
          Class 12 Angiosperm Reproductive Cycle & Anatomy
        </p>
      </div>
    );
  }

  // 5. Default: Clean Biological Architecture Diagram
  return (
    <div className={`relative flex flex-col items-center justify-center p-2 ${className}`}>
      <svg
        viewBox="0 0 320 250"
        className="w-full max-w-[280px] h-auto drop-shadow-sm select-none bg-gradient-to-b from-emerald-50 to-white rounded-2xl p-3 border border-emerald-200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="8" width="300" height="24" rx="5" fill="#144738" />
        <text x="160" y="24" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
          SAMACHEER KALVI 12TH BIOLOGY FOUNDATION
        </text>

        {/* Central Cellular Organelle Diagram */}
        <circle cx="160" cy="130" r="65" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="160" cy="130" r="32" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
        <text x="160" y="133" fontSize="8" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          Nucleus & DNA
        </text>

        {/* Mitochondria & Ribosomes */}
        <ellipse cx="125" cy="100" rx="12" ry="6" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
        <ellipse cx="195" cy="160" rx="12" ry="6" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />

        <circle cx="120" cy="155" r="3" fill="#16a34a" />
        <circle cx="200" cy="105" r="3" fill="#16a34a" />
        <circle cx="170" cy="80" r="3" fill="#16a34a" />

        {/* Caption */}
        <text x="160" y="225" fontSize="8" fill="#334155" fontWeight="bold" textAnchor="middle">
          Eukaryotic Cellular Ultrastructure & Physiological Homeostasis
        </text>
      </svg>

      <p className="text-[11px] text-slate-500 font-medium text-center mt-1">
        Biological Conceptual Atlas · Class 12 Higher Secondary
      </p>
    </div>
  );
};
