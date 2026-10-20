import React, { useState, useEffect, useRef } from 'react';
import { Topic, Slide, DiagramHotspot, ThreeDModelType } from '../../types/curriculum';
import { NanoBanana3DViewer } from '../slides3d/NanoBanana3DViewer';
import { InteractiveDiagramViewer } from '../diagrams/InteractiveDiagramViewer';
import { ScientistCard } from '../common/ScientistCard';
import { get3DModelDisplayName } from '../../curriculum/curriculumEnhancer';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  CheckCircle,
  Sparkles,
  Layers,
  Eye,
  EyeOff,
  PenTool,
  Play,
  RotateCcw,
  Sliders,
  Type,
  Layout,
  Grid,
  FileText,
  Monitor,
  HelpCircle,
  Palette,
  ShieldCheck,
  Award,
  Zap,
  Box,
  Eraser,
  Volume1,
  Share2,
} from 'lucide-react';

interface PowerPointSlideDeckProps {
  topic: Topic;
  lessonTitle: string;
  subjectTitle: string;
  onAskAI: (context: {
    subjectTitle: string;
    lessonTitle: string;
    topicNumber: string;
    topicTitle: string;
    slideIndex: number;
    slideTitle: string;
    selectedPart?: string;
  }) => void;
  onCompleteTopic?: (topicId: string) => void;
  isCompleted?: boolean;
}

type RibbonTab =
  | 'home'
  | 'insert'
  | 'draw'
  | 'design'
  | 'transitions'
  | 'slideshow'
  | 'view'
  | 'nanobanana';

type ThemeMode = 'nanobanana' | 'powerpoint' | 'biolab' | 'academic' | 'obsidian';
type ViewMode = 'normal' | 'sorter' | 'reading' | 'slideshow';

export const PowerPointSlideDeck: React.FC<PowerPointSlideDeckProps> = ({
  topic,
  lessonTitle,
  subjectTitle,
  onAskAI,
  onCompleteTopic,
  isCompleted = false,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [activeRibbonTab, setActiveRibbonTab] = useState<RibbonTab>('nanobanana');
  const [themeMode, setThemeMode] = useState<ThemeMode>('nanobanana');
  const [viewMode, setViewMode] = useState<ViewMode>('normal');
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTool, setActiveTool] = useState<'select' | 'laser' | 'pen' | 'highlighter'>('select');
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});
  const [selected3DOverride, setSelected3DOverride] = useState<ThreeDModelType | null>(null);
  const [show2DDiagram, setShow2DDiagram] = useState<boolean>(false);
  const [transitionEffect, setTransitionEffect] = useState<'fade' | 'push' | 'wipe' | 'morph'>('morph');
  const [isAnimatingTransition, setIsAnimatingTransition] = useState<boolean>(false);

  // Drawing canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const prevCoordRef = useRef<{ x: number; y: number } | null>(null);
  const slideContainerRef = useRef<HTMLDivElement | null>(null);

  const [dynamicSlides, setDynamicSlides] = useState<Slide[]>([]);
  const [stageLayout, setStageLayout] = useState<'split' | 'focus3d' | 'text'>('split');

  useEffect(() => {
    setDynamicSlides([]);
    setCurrentSlideIndex(0);
    setSelected3DOverride(null);
  }, [topic.id]);

  const baseSlides = topic.slides || [];
  const slides = [...baseSlides, ...dynamicSlides];
  const currentSlide: Slide | undefined = slides[currentSlideIndex];
  const totalSlides = slides.length;

  const handleGenerateDeepDiveSlide = () => {
    const model = active3DModel;
    const newSlide: Slide = {
      id: `dynamic-${Date.now()}`,
      title: `⚡ NanoBanana Pro Deep-Dive: ${topic.title} Master Card`,
      kind: 'interactive',
      body: `Class 12 Samacheer Kalvi High-Yield Revision Matrix: Correlating ${topic.title} structural adaptations with molecular biochemistry and board evaluation rubrics.`,
      bullets: [
        `Verified 3D Structure: ${get3DModelDisplayName(model)} — observe spatial symmetry and organelle positioning.`,
        'Examiner Scoring Rule: Definitions must include biological taxonomy and precise biochemical nomenclature.',
        'Schematic Representation: Practice freehand diagram within 3 minutes; label at least 4 anatomical landmarks.',
        'Tamil Medium Bilingual Note: தேர்வு வினாக்களுக்கு ஏற்ற துல்லியமான கலைச்சொற்கள் மற்றும் வரைபடம்.',
      ],
      steps: [
        { title: 'Step 1: Structural Recognition', explanation: 'Identify key organelles using 360° orbital rotation and hotspot markers.' },
        { title: 'Step 2: Biochemical Pathway', explanation: 'Trace metabolic flux or physiological sequence according to textbook criteria.' },
        { title: 'Step 3: Exam Presentation', explanation: 'Format answers into: (i) Definition, (ii) Key Functions, (iii) Labeled Diagram.' },
      ],
      threeDModel: model,
      speakerNotes: `NanoBanana Pro AI Slide: Comprehensive synthesis of ${topic.title} for last-minute revision and 100% board exam score.`,
      tamilNotes: `${topic.title} விசேஷ விரிவான தேர்வு ஆய்வு ஸ்லைடு.`,
    };

    setDynamicSlides((prev) => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  // Infer default 3D Model for slide
  const getInferred3DModel = (s?: Slide): ThreeDModelType => {
    if (!s) return 'dna';
    if (s.threeDModel) return s.threeDModel;
    if (s.diagramType === 'anther') return 'anther';
    if (s.diagramType === 'ovule') return 'ovule';
    if (s.diagramType === 'antibody') return 'antibody';
    if (s.diagramType === 'sperm') return 'sperm';
    if (s.diagramType === 'pbr322') return 'pbr322';

    const text = `${s.title} ${s.body} ${topic.title} ${lessonTitle}`.toLowerCase();
    if (text.includes('vegetative') || text.includes('propagule') || text.includes('grafting') || text.includes('layering') || text.includes('bryophyllum') || text.includes('rhizome') || text.includes('tuber') || text.includes('runner') || text.includes('offset')) return 'vegetative_propagule';
    if (text.includes('pollination') || text.includes('anemophily') || text.includes('entomophily') || text.includes('mellitophily') || text.includes('stigma')) return 'flower_pollination';
    if (text.includes('phage') || text.includes('bacteriophage')) return 'bacteriophage';
    if (text.includes('hiv') || text.includes('aids') || text.includes('virus') || text.includes('retrovirus')) return 'virus';
    if (text.includes('chromosome') || text.includes('chromatid') || text.includes('karyotyp') || text.includes('pedigree') || text.includes('linkage') || text.includes('mendel') || text.includes('allele') || text.includes('ploidy') || text.includes('inheritance')) return 'chromosome';
    if (text.includes('dna') || text.includes('helix') || text.includes('transcription') || text.includes('translation') || text.includes('watson') || text.includes('nucleotide') || text.includes('operon') || text.includes('replication')) return 'dna';
    if (text.includes('anther') || text.includes('pollen') || text.includes('microspore') || text.includes('tapetum')) return 'anther';
    if (text.includes('ovule') || text.includes('megaspore') || text.includes('embryo sac') || text.includes('integument')) return 'ovule';
    if (text.includes('antibody') || text.includes('immunoglobulin') || text.includes('antigen') || text.includes('immunity')) return 'antibody';
    if (text.includes('sperm') || text.includes('semen') || text.includes('acrosome') || text.includes('gametogenesis') || text.includes('testis')) return 'sperm';
    if (text.includes('plasmid') || text.includes('vector') || text.includes('pbr322') || text.includes('cloning') || text.includes('recombinant') || text.includes('restriction')) return 'pbr322';
    if (text.includes('mitochondria') || text.includes('cristae') || text.includes('respiration') || text.includes('atp')) return 'mitochondria';
    if (text.includes('neuron') || text.includes('synapse') || text.includes('nerve') || text.includes('axon')) return 'neuron';
    if (text.includes('tissue culture') || text.includes('totipotency') || text.includes('protoplast') || text.includes('callus') || text.includes('cell')) return 'cell';
    if (text.includes('chloroplast') || text.includes('photosynthesis') || text.includes('thylakoid') || text.includes('grana') || text.includes('stroma')) return 'chloroplast';

    return subjectTitle.toLowerCase().includes('botany') ? 'vegetative_propagule' : 'cell';
  };

  const active3DModel = selected3DOverride || getInferred3DModel(currentSlide);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevSlide();
      } else if (e.key === 'F5') {
        e.preventDefault();
        setViewMode('slideshow');
      } else if (e.key === 'Escape') {
        if (viewMode === 'slideshow') {
          setViewMode('normal');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, totalSlides, viewMode]);

  // Handle slide change transition
  const triggerSlideTransition = (newIdx: number) => {
    setIsAnimatingTransition(true);
    setSelected3DOverride(null);
    clearCanvas();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setTimeout(() => {
      setCurrentSlideIndex(newIdx);
      setIsAnimatingTransition(false);
    }, 180);
  };

  const goToNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      triggerSlideTransition(currentSlideIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      triggerSlideTransition(currentSlideIndex - 1);
    }
  };

  // Audio read-aloud
  const handleAudioNarration = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!currentSlide) return;

    let textToSpeak = `${currentSlide.title}. ${currentSlide.body}`;
    if (currentSlide.bullets) {
      textToSpeak += `. Key Points: ${currentSlide.bullets.join('. ')}`;
    }
    if (currentSlide.steps) {
      textToSpeak += `. Step by step: ${currentSlide.steps.map((s) => `${s.title}: ${s.explanation}`).join('. ')}`;
    }
    if (currentSlide.notes) {
      textToSpeak += `. Exam Notes: ${currentSlide.notes}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Drawing canvas logic
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'pen' && activeTool !== 'highlighter') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    isDrawingRef.current = true;
    prevCoordRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const currX = e.clientX - rect.left;
    const currY = e.clientY - rect.top;

    if (activeTool === 'laser') {
      setLaserPos({ x: currX, y: currY });
    }

    if (!isDrawingRef.current || !prevCoordRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(prevCoordRef.current.x, prevCoordRef.current.y);
    ctx.lineTo(currX, currY);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'pen') {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 1.0;
    } else if (activeTool === 'highlighter') {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 14;
      ctx.globalAlpha = 0.45;
    }
    ctx.stroke();
    prevCoordRef.current = { x: currX, y: currY };
  };

  const handleCanvasPointerUp = () => {
    isDrawingRef.current = false;
    prevCoordRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  if (!currentSlide) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-3xl border">
        No slides available for this topic.
      </div>
    );
  }

  // Active diagram if available
  const activeDiagramDef = currentSlide.diagramType
    ? {
        id: `diag-${currentSlide.id}`,
        title: currentSlide.diagramTitle || currentSlide.title,
        type: currentSlide.diagramType,
        caption: '12th Standard Samacheer Kalvi Biology Scientific Diagram',
        hotspots: (currentSlide.diagramHotspots as any) || [
          {
            id: 'default-part',
            name: 'Anatomical Structure',
            description: currentSlide.body,
            function: 'Key structural and physiological component for 12th Standard examinations.',
          },
        ],
      }
    : null;

  // Theme styling presets
  const getThemeClass = () => {
    switch (themeMode) {
      case 'nanobanana':
        return 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border-amber-500/30';
      case 'powerpoint':
        return 'bg-white text-slate-900 border-red-500/40 shadow-xl';
      case 'biolab':
        return 'bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 text-white border-emerald-500/40';
      case 'academic':
        return 'bg-amber-50/70 text-slate-900 border-amber-300';
      case 'obsidian':
        return 'bg-black text-white border-slate-800';
      default:
        return 'bg-slate-900 text-white border-amber-500/30';
    }
  };

  return (
    <div
      className={`w-full flex flex-col font-sans transition-all duration-300 select-none ${
        viewMode === 'slideshow'
          ? 'fixed inset-0 z-50 bg-black text-white'
          : 'rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 shadow-2xl overflow-hidden'
      }`}
    >
      {/* 1. WINDOW TITLE BAR (PowerPoint Desktop Aesthetic) */}
      {viewMode !== 'slideshow' && (
        <div className="bg-[#C43E1C] text-white px-3 sm:px-4 py-2 flex items-center justify-between text-xs font-medium border-b border-red-700 select-none shadow-xs">
          {/* Left: PowerPoint App Icon & Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-5 h-5 rounded bg-white text-[#C43E1C] font-black text-xs flex items-center justify-center shadow-xs">
              P
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold tracking-tight">SPK_Learn_12th_Samacheer_Kalvi_NanoBananaPro.pptx</span>
              <span className="opacity-80 hidden md:inline">- PowerPoint</span>
            </div>
            <div className="hidden lg:flex items-center gap-1 ml-3 px-2 py-0.5 rounded bg-black/20 text-[11px] font-semibold text-amber-300 border border-amber-400/30">
              <Sparkles size={11} className="text-amber-400" />
              <span>NanoBanana Pro Studio</span>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('slideshow')}
              className="px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
              title="Start Slide Show (F5)"
            >
              <Play size={12} className="fill-current" />
              <span className="hidden sm:inline">Slide Show (F5)</span>
            </button>
            <div className="flex items-center gap-1 ml-1 text-white/80">
              <span className="w-3 h-0.5 bg-white/70 inline-block" />
              <span className="w-2.5 h-2.5 border border-white/70 inline-block" />
              <span className="text-sm font-bold leading-none px-1">✕</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. POWERPOINT OFFICE RIBBON TABS */}
      {viewMode !== 'slideshow' && (
        <div className="bg-[#f3f3f3] dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800">
          {/* Tab Strip */}
          <div className="flex items-center gap-0.5 px-2 pt-1 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto scrollbar-none">
            <button className="px-3 py-1 font-bold bg-[#C43E1C] text-white rounded-t hover:bg-red-700">
              File
            </button>
            {(
              [
                { id: 'home', label: 'Home' },
                { id: 'insert', label: 'Insert 3D' },
                { id: 'draw', label: 'Draw & Laser' },
                { id: 'design', label: 'Design' },
                { id: 'transitions', label: 'Transitions' },
                { id: 'slideshow', label: 'Slide Show' },
                { id: 'view', label: 'View' },
                { id: 'nanobanana', label: 'NanoBanana Pro ✨' },
              ] as { id: RibbonTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRibbonTab(tab.id)}
                className={`px-3 py-1 rounded-t font-semibold transition-colors text-xs whitespace-nowrap ${
                  activeRibbonTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-[#C43E1C] dark:text-amber-400 border-t-2 border-[#C43E1C] dark:border-amber-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Ribbon Action Bar */}
          <div className="bg-white dark:bg-slate-800/90 px-3 py-2 flex items-center justify-between gap-3 overflow-x-auto text-xs">
            {/* Contextual items per tab */}
            {activeRibbonTab === 'nanobanana' && (
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200 dark:border-slate-700">
                  <span className="font-extrabold text-amber-500 flex items-center gap-1">
                    <Sparkles size={14} /> NanoBanana Pro
                  </span>
                </div>

                {/* Quick 3D Model Switcher */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold text-[11px]">3D Model:</span>
                  <select
                    value={active3DModel}
                    onChange={(e) => setSelected3DOverride(e.target.value as ThreeDModelType)}
                    className="px-2 py-1 rounded-lg border border-amber-500/40 bg-amber-50 dark:bg-slate-900 text-amber-900 dark:text-amber-300 font-bold text-xs"
                  >
                    <option value="dna">🧬 DNA Double Helix</option>
                    <option value="chloroplast">🍃 Chloroplast & Grana</option>
                    <option value="anther">🌾 Anther & Pollen Grain</option>
                    <option value="ovule">🌸 Anatropous Ovule</option>
                    <option value="antibody">🛡️ Antibody IgG Molecule</option>
                    <option value="sperm">🔬 Spermatozoon Cell</option>
                    <option value="pbr322">🧪 pBR322 Plasmid Vector</option>
                    <option value="bacteriophage">🦠 T4 Bacteriophage</option>
                    <option value="mitochondria">⚡ Mitochondria & Cristae</option>
                    <option value="neuron">🧠 Multipolar Neuron</option>
                    <option value="chromosome">🧬 Metaphase Chromosome</option>
                    <option value="virus">🔬 Enveloped Virus / HIV</option>
                    <option value="cell">🌿 Plant / Animal Cell</option>
                  </select>
                </div>

                {/* Auto-Create Deep-Dive Slide (Generated automatically by app) */}
                <button
                  onClick={handleGenerateDeepDiveSlide}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-extrabold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                  title="Generate Exam Revision & 3D Deep-Dive Slide for this Topic"
                >
                  <Sparkles size={13} className="text-amber-200" />
                  <span>+ Auto-Generate Revision Slide</span>
                </button>

                {/* AI Explainer Callout */}
                <button
                  onClick={() =>
                    onAskAI({
                      subjectTitle,
                      lessonTitle,
                      topicNumber: topic.number,
                      topicTitle: topic.title,
                      slideIndex: currentSlideIndex,
                      slideTitle: currentSlide.title,
                    })
                  }
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles size={13} />
                  <span>NanoBanana Pro AI Explainer</span>
                </button>

                {/* Stage Layout Toggles */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700">
                  <button
                    onClick={() => setStageLayout('split')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      stageLayout === 'split' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    Split
                  </button>
                  <button
                    onClick={() => setStageLayout('focus3d')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      stageLayout === 'focus3d' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    3D Focus
                  </button>
                  <button
                    onClick={() => setStageLayout('text')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      stageLayout === 'text' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    Slide
                  </button>
                </div>

                {/* Audio Narration */}
                <button
                  onClick={handleAudioNarration}
                  className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1.5 transition-colors ${
                    isSpeaking
                      ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300'
                      : 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  <span>{isSpeaking ? 'Stop Read-Aloud' : 'Read Slide Aloud'}</span>
                </button>
              </div>
            )}

            {activeRibbonTab === 'insert' && (
              <div className="flex items-center gap-2 shrink-0 overflow-x-auto py-0.5">
                <span className="text-slate-500 font-semibold text-[11px]">Insert 3D Illustration:</span>
                {(
                  [
                    { id: 'dna', label: '🧬 DNA' },
                    { id: 'chloroplast', label: '🍃 Chloroplast' },
                    { id: 'anther', label: '🌾 Anther' },
                    { id: 'ovule', label: '🌸 Ovule' },
                    { id: 'antibody', label: '🛡️ Antibody' },
                    { id: 'sperm', label: '🔬 Sperm' },
                    { id: 'pbr322', label: '🧪 pBR322' },
                    { id: 'bacteriophage', label: '🦠 Phage' },
                    { id: 'mitochondria', label: '⚡ Mitochondria' },
                    { id: 'neuron', label: '🧠 Neuron' },
                    { id: 'chromosome', label: '🧬 Chromosome' },
                    { id: 'virus', label: '🔬 Virus' },
                    { id: 'cell', label: '🌿 Cell' },
                  ] as { id: ThreeDModelType; label: string }[]
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelected3DOverride(m.id);
                      setShow2DDiagram(false);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-all ${
                      active3DModel === m.id && !show2DDiagram
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}

            {activeRibbonTab === 'draw' && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-500 font-semibold text-[11px]">Presenter Tools:</span>
                <button
                  onClick={() => setActiveTool('select')}
                  className={`px-3 py-1 rounded-md font-bold border ${
                    activeTool === 'select' ? 'bg-[#C43E1C] text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  Pointer (Select)
                </button>
                <button
                  onClick={() => setActiveTool('laser')}
                  className={`px-3 py-1 rounded-md font-bold border flex items-center gap-1 ${
                    activeTool === 'laser' ? 'bg-red-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  Laser Pointer
                </button>
                <button
                  onClick={() => setActiveTool('pen')}
                  className={`px-3 py-1 rounded-md font-bold border flex items-center gap-1 ${
                    activeTool === 'pen' ? 'bg-red-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <PenTool size={13} />
                  Pen
                </button>
                <button
                  onClick={() => setActiveTool('highlighter')}
                  className={`px-3 py-1 rounded-md font-bold border flex items-center gap-1 ${
                    activeTool === 'highlighter' ? 'bg-yellow-400 text-slate-900' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  Highlighter
                </button>
                <button
                  onClick={clearCanvas}
                  className="px-2.5 py-1 rounded-md border border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1 text-slate-600 dark:text-slate-300"
                >
                  <Eraser size={13} /> Clear Inking
                </button>
              </div>
            )}

            {activeRibbonTab === 'design' && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-500 font-semibold text-[11px]">Slide Deck Theme:</span>
                {[
                  { id: 'nanobanana', label: '🍌 NanoBanana Pro Gold', bg: 'bg-amber-500 text-slate-950' },
                  { id: 'powerpoint', label: '🟥 Office Modern Crimson', bg: 'bg-[#C43E1C] text-white' },
                  { id: 'biolab', label: '🍃 BioLab Cyber Emerald', bg: 'bg-emerald-600 text-white' },
                  { id: 'academic', label: '📜 Academic Ivory', bg: 'bg-amber-100 text-slate-900' },
                  { id: 'obsidian', label: '⬛ Deep Obsidian Dark', bg: 'bg-slate-950 text-white' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setThemeMode(th.id as ThemeMode)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                      themeMode === th.id ? `${th.bg} shadow-xs scale-105` : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            )}

            {activeRibbonTab === 'transitions' && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-500 font-semibold text-[11px]">Slide Transitions:</span>
                {['morph', 'fade', 'push', 'wipe'].map((tr) => (
                  <button
                    key={tr}
                    onClick={() => setTransitionEffect(tr as any)}
                    className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                      transitionEffect === tr
                        ? 'bg-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tr}
                  </button>
                ))}
              </div>
            )}

            {activeRibbonTab === 'home' && (
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">Subject:</span>
                  <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {subjectTitle}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">Lesson:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {lessonTitle}
                  </span>
                </div>
              </div>
            )}

            {activeRibbonTab === 'slideshow' && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setCurrentSlideIndex(0);
                    setViewMode('slideshow');
                  }}
                  className="px-3 py-1 rounded-md bg-[#C43E1C] text-white font-bold flex items-center gap-1.5"
                >
                  <Play size={13} /> From Beginning (F5)
                </button>
                <button
                  onClick={() => setViewMode('slideshow')}
                  className="px-3 py-1 rounded-md bg-emerald-600 text-white font-bold flex items-center gap-1.5"
                >
                  <Play size={13} /> From Current Slide
                </button>
              </div>
            )}

            {activeRibbonTab === 'view' && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setViewMode('normal')}
                  className={`px-3 py-1 rounded-md font-bold border ${
                    viewMode === 'normal' ? 'bg-[#C43E1C] text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setViewMode('sorter')}
                  className={`px-3 py-1 rounded-md font-bold border ${
                    viewMode === 'sorter' ? 'bg-[#C43E1C] text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  Slide Sorter
                </button>
              </div>
            )}

            {/* Right: Slide Count indicator */}
            <div className="ml-auto flex items-center gap-2 shrink-0 text-slate-500 font-mono text-xs">
              <span>Slide {currentSlideIndex + 1} of {totalSlides}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE: SLIDE SORTER VIEW OR NORMAL DUAL-PANE */}
      {viewMode === 'sorter' ? (
        /* SLIDE SORTER VIEW (PowerPoint Grid) */
        <div className="p-6 bg-slate-200 dark:bg-slate-900 min-h-[500px] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
              Slide Sorter — Topic {topic.number}: {topic.title}
            </h3>
            <button
              onClick={() => setViewMode('normal')}
              className="px-3 py-1.5 rounded-lg bg-[#C43E1C] text-white font-bold text-xs"
            >
              Back to Normal View
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setViewMode('normal');
                }}
                className={`p-3 rounded-xl cursor-pointer border-2 transition-all bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:scale-[1.02] ${
                  idx === currentSlideIndex
                    ? 'border-[#C43E1C] ring-2 ring-red-400/40'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                <div className="aspect-video bg-slate-900 rounded-lg p-3 text-white flex flex-col justify-between overflow-hidden relative">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">
                    {s.kind}
                  </span>
                  <h4 className="text-xs font-bold line-clamp-2">{s.title}</h4>
                  <span className="text-[10px] text-slate-400 self-end font-mono">
                    #{idx + 1}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold">Slide {idx + 1}</span>
                  <span className="text-[11px] truncate max-w-[120px]">{s.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* NORMAL SPLIT WORKSPACE */
        <div className="flex flex-1 min-h-[540px] bg-[#e6e6e6] dark:bg-slate-950 relative overflow-hidden">
          {/* LEFT SLIDE THUMBNAILS FILMSTRIP (Windows PowerPoint Style) */}
          {viewMode !== 'slideshow' && isSidebarOpen && (
            <div className="w-48 sm:w-56 shrink-0 bg-[#f7f7f7] dark:bg-slate-900/90 border-r border-slate-300 dark:border-slate-800 p-2 overflow-y-auto space-y-2.5 max-h-[640px]">
              <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Slides ({totalSlides})</span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="hover:text-slate-800 dark:hover:text-white p-0.5"
                  title="Collapse Thumbnail Pane"
                >
                  ◀
                </button>
              </div>

              {slides.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => triggerSlideTransition(idx)}
                  className={`flex items-start gap-1.5 p-1 rounded-lg cursor-pointer transition-all ${
                    idx === currentSlideIndex
                      ? 'bg-white dark:bg-slate-800 ring-2 ring-[#C43E1C] shadow-sm'
                      : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/60 opacity-85 hover:opacity-100'
                  }`}
                >
                  <span className="text-[11px] font-mono font-bold text-slate-400 w-4 text-right pt-1">
                    {idx + 1}
                  </span>
                  <div className="flex-1 aspect-video rounded-md bg-slate-900 p-2 text-white flex flex-col justify-between overflow-hidden border border-slate-700/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-extrabold text-amber-400 uppercase tracking-wider">
                        {s.kind}
                      </span>
                      {s.threeDModel && (
                        <span className="text-[8px] text-emerald-400 font-mono">3D</span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold line-clamp-2 leading-tight">
                      {s.title}
                    </p>
                    <div className="w-full h-0.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${((idx + 1) / totalSlides) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Expand Thumbnail button if collapsed */}
          {viewMode !== 'slideshow' && !isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="absolute left-2 top-2 z-20 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-md text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1"
              title="Show Slide Thumbnails"
            >
              <span>Slides ▶</span>
            </button>
          )}

          {/* CENTER 16:9 PRESENTATION STAGE CANVAS */}
          <div
            ref={slideContainerRef}
            className={`flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto relative ${
              viewMode === 'slideshow' ? 'p-0 sm:p-4 bg-black' : ''
            }`}
          >
            {/* The 16:9 Slide Surface */}
            <div
              className={`w-full max-w-5xl aspect-video rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between relative transition-all duration-300 ${getThemeClass()} ${
                isAnimatingTransition ? 'opacity-0 scale-98 transition-all duration-200' : 'opacity-100 scale-100'
              }`}
              style={{
                transform: viewMode === 'normal' && zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                transformOrigin: 'top center',
              }}
            >
              {/* SLIDE HEADER BAR */}
              <div className="px-5 sm:px-8 pt-4 pb-2 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1">
                    <Sparkles size={12} /> {subjectTitle}
                  </span>
                  <span className="opacity-40">•</span>
                  <span className="opacity-80 font-medium truncate max-w-[200px] sm:max-w-none">
                    Topic {topic.number}: {topic.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Stage Layout Selector */}
                  <div className="hidden sm:flex items-center gap-0.5 bg-black/30 p-0.5 rounded-lg border border-white/10 text-[10px]">
                    <button
                      onClick={() => setStageLayout('split')}
                      className={`px-2 py-0.5 rounded font-bold transition-all ${
                        stageLayout === 'split' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                      title="Split View: Slide + 3D Model"
                    >
                      Split
                    </button>
                    <button
                      onClick={() => setStageLayout('focus3d')}
                      className={`px-2 py-0.5 rounded font-bold transition-all flex items-center gap-1 ${
                        stageLayout === 'focus3d' ? 'bg-emerald-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                      title="3D Studio Focus"
                    >
                      <Box size={10} /> 3D Focus
                    </button>
                    <button
                      onClick={() => setStageLayout('text')}
                      className={`px-2 py-0.5 rounded font-bold transition-all ${
                        stageLayout === 'text' ? 'bg-sky-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                      title="Slide Text Focus"
                    >
                      Slide
                    </button>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/15 backdrop-blur-sm border border-white/20">
                    {currentSlide.kind}
                  </span>
                  <span className="text-xs font-mono opacity-60">
                    {currentSlideIndex + 1}/{totalSlides}
                  </span>
                </div>
              </div>

              {/* SLIDE MAIN CONTENT BODY (RESPONSIVE DUAL / 3D FOCUS LAYOUT) */}
              <div
                className={`flex-1 px-5 sm:px-8 py-4 overflow-y-auto ${
                  stageLayout === 'focus3d'
                    ? 'flex flex-col relative p-2 h-full'
                    : 'grid grid-cols-1 md:grid-cols-12 gap-5 items-center'
                }`}
              >
                {/* LEFT COLUMN: TITLE, BULLETS, STEPS, REVEAL */}
                <div
                  className={`${
                    stageLayout === 'split'
                      ? 'md:col-span-7 space-y-3.5 pr-2'
                      : stageLayout === 'text'
                      ? 'md:col-span-12 space-y-4 max-w-3xl mx-auto w-full'
                      : 'hidden'
                  }`}
                >
                  {stageLayout === 'text' && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Box size={14} /> 3D Model Available: {get3DModelDisplayName(active3DModel)}
                      </span>
                      <button
                        onClick={() => setStageLayout('split')}
                        className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-colors"
                      >
                        Show 3D Split View 🌐
                      </button>
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-snug">
                      {currentSlide.title}
                    </h2>
                    {topic.tamilTitle && currentSlideIndex === 0 && (
                      <p className="text-sm font-semibold text-emerald-400 mt-1">
                        {topic.tamilTitle}
                      </p>
                    )}
                  </div>

                  {/* Body Paragraph */}
                  {currentSlide.body && (
                    <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs sm:text-sm leading-relaxed">
                      {currentSlide.body}
                    </div>
                  )}

                  {/* Ordered Process Steps */}
                  {currentSlide.steps && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                        Process Sequence:
                      </span>
                      <div className="space-y-1.5">
                        {currentSlide.steps.map((st, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs"
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-[10px]">
                              {sIdx + 1}
                            </span>
                            <div>
                              <strong className="block font-bold">{st.title}</strong>
                              <span className="opacity-80 text-[11px] leading-relaxed">
                                {st.explanation}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bullets List */}
                  {currentSlide.bullets && (
                    <div className="space-y-1.5">
                      {currentSlide.bullets.map((b, bIdx) => (
                        <div
                          key={bIdx}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2 text-xs leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comparison Table (Official Textbook Data & Differences) */}
                  {currentSlide.comparisonTable && (
                    <div className="overflow-x-auto rounded-xl border border-white/20 bg-black/40 p-2.5 my-2 shadow-inner">
                      {currentSlide.comparisonTable.caption && (
                        <div className="text-[11px] font-black text-amber-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <span>📊</span>
                          <span>{currentSlide.comparisonTable.caption}</span>
                        </div>
                      )}
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/20 bg-white/10">
                            {currentSlide.comparisonTable.headers.map((h, i) => (
                              <th key={i} className="p-2 font-black text-amber-300">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentSlide.comparisonTable.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className="border-b border-white/10 hover:bg-white/5 transition-colors"
                            >
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`p-2 leading-relaxed ${
                                    cIdx === 0 ? 'font-bold text-white' : 'text-slate-200'
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Do You Know Fact Card (Official Textbook Feature) */}
                  {currentSlide.doYouKnowFact && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-xs text-amber-200 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                        DYK
                      </div>
                      <div className="flex-1">
                        <span className="font-extrabold text-amber-300 block text-[11px] uppercase tracking-wider">
                          💡 Textbook Fact / Do You Know:
                        </span>
                        <p className="leading-relaxed text-slate-100 mt-0.5">
                          {currentSlide.doYouKnowFact}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Source Reference Citation */}
                  {currentSlide.sourceReference && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono py-1">
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-semibold">
                        📖 {currentSlide.sourceReference.textbook}
                      </span>
                      <span>Chapter {currentSlide.sourceReference.chapter}</span>
                      {currentSlide.sourceReference.pageNumber && (
                        <span>• Page {currentSlide.sourceReference.pageNumber}</span>
                      )}
                      {currentSlide.sourceReference.section && (
                        <span>• Sec {currentSlide.sourceReference.section}</span>
                      )}
                    </div>
                  )}

                  {/* Scientist Card */}
                  {currentSlide.scientist && (
                    <ScientistCard scientist={currentSlide.scientist} />
                  )}

                  {/* Checkpoint / Reveal Card */}
                  {currentSlide.revealCard && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                          💡 12th Board Checkpoint:
                        </span>
                        <button
                          onClick={() =>
                            setRevealedCards((prev) => ({
                              ...prev,
                              [currentSlide.id]: !prev[currentSlide.id],
                            }))
                          }
                          className="px-2 py-0.5 rounded text-[11px] font-bold bg-white/20 hover:bg-white/30 text-white flex items-center gap-1"
                        >
                          {revealedCards[currentSlide.id] ? <EyeOff size={11} /> : <Eye size={11} />}
                          <span>{revealedCards[currentSlide.id] ? 'Hide' : 'Reveal Answer'}</span>
                        </button>
                      </div>
                      <p className="text-xs font-bold">{currentSlide.revealCard.prompt}</p>
                      {revealedCards[currentSlide.id] && (
                        <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/40 text-xs text-emerald-300 space-y-1 animate-fade-in">
                          <strong className="block text-white">Answer:</strong>
                          <p>{currentSlide.revealCard.answer}</p>
                          {currentSlide.revealCard.examTip && (
                            <span className="text-[10px] text-amber-300 block font-semibold pt-1">
                              Exam Tip: {currentSlide.revealCard.examTip}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: INTERACTIVE 3D ILLUSTRATION IMAGE */}
                <div
                  className={`${
                    stageLayout === 'split'
                      ? 'md:col-span-5 h-full flex flex-col justify-center space-y-2'
                      : stageLayout === 'focus3d'
                      ? 'w-full h-full flex flex-col justify-center space-y-2 relative min-h-[360px]'
                      : 'hidden'
                  }`}
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Box size={12} /> {get3DModelDisplayName(active3DModel)}
                    </span>
                    <div className="flex items-center gap-2">
                      {stageLayout === 'focus3d' && (
                        <button
                          onClick={() => setStageLayout('split')}
                          className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white"
                        >
                          Exit 3D Focus
                        </button>
                      )}
                      {activeDiagramDef && (
                        <button
                          onClick={() => setShow2DDiagram(!show2DDiagram)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20"
                        >
                          {show2DDiagram ? 'Switch to 3D' : 'Switch to 2D Diagram'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 3D Viewer or 2D Diagram */}
                  {show2DDiagram && activeDiagramDef ? (
                    <div className="w-full rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-white/20 p-2 shadow-inner">
                      <InteractiveDiagramViewer
                        diagram={activeDiagramDef}
                        onAskAI={(part) =>
                          onAskAI({
                            subjectTitle,
                            lessonTitle,
                            topicNumber: topic.number,
                            topicTitle: topic.title,
                            slideIndex: currentSlideIndex,
                            slideTitle: currentSlide.title,
                            selectedPart: `${part.name}: ${part.description}`,
                          })
                        }
                        topicTitle={topic.title}
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/60 relative ${
                        stageLayout === 'focus3d' ? 'h-[380px] sm:h-[440px]' : 'aspect-square sm:aspect-auto sm:h-[300px] md:h-[320px]'
                      }`}
                    >
                      <NanoBanana3DViewer
                        modelType={active3DModel}
                        title={currentSlide.diagramTitle || currentSlide.title}
                        tamilTitle={topic.tamilTitle}
                        onSelectPart={(name, desc) =>
                          onAskAI({
                            subjectTitle,
                            lessonTitle,
                            topicNumber: topic.number,
                            topicTitle: topic.title,
                            slideIndex: currentSlideIndex,
                            slideTitle: currentSlide.title,
                            selectedPart: `3D Organelle: ${name} - ${desc}`,
                          })
                        }
                      />

                      {/* Floating HUD Notes in 3D Focus Mode */}
                      {stageLayout === 'focus3d' && (
                        <div className="absolute bottom-3 left-3 z-10 max-w-sm p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/20 text-xs text-white space-y-1.5 shadow-xl pointer-events-auto">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles size={11} /> {currentSlide.title}
                            </span>
                            <span className="text-[9px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/20">
                              3D Studio HUD
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                            {currentSlide.body}
                          </p>
                          {currentSlide.bullets && currentSlide.bullets[0] && (
                            <p className="text-[10px] text-amber-300 font-medium truncate">
                              • {currentSlide.bullets[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* SLIDE FOOTER BANNER */}
              <div className="px-5 sm:px-8 py-2.5 flex items-center justify-between border-t border-white/10 text-[11px] opacity-75 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400">NanoBanana Pro Biology Deck</span>
                  <span>•</span>
                  <span>TN Samacheer Kalvi 2026-2027</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Confidential Classroom Lecture</span>
                  <span>Page {currentSlideIndex + 1}</span>
                </div>
              </div>

              {/* OVERLAY DRAWING & LASER CANVAS */}
              <canvas
                ref={canvasRef}
                width={960}
                height={540}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
                className={`absolute inset-0 w-full h-full z-30 ${
                  activeTool === 'select'
                    ? 'pointer-events-none'
                    : activeTool === 'laser'
                    ? 'cursor-none pointer-events-auto'
                    : 'cursor-crosshair pointer-events-auto'
                }`}
              />

              {/* LASER POINTER RED GLOWING BEAM */}
              {activeTool === 'laser' && laserPos && (
                <div
                  className="absolute pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: laserPos.x, top: laserPos.y }}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_15px_6px_rgba(239,68,68,0.9)] animate-ping" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white absolute top-0.5 left-0.5 shadow-sm" />
                </div>
              )}
            </div>

            {/* FULLSCREEN / SLIDESHOW FLOATING CONTROLLER */}
            {viewMode === 'slideshow' && (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 text-white flex items-center gap-3 shadow-2xl">
                <button
                  onClick={goToPrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40"
                  title="Previous Slide (PageUp / Left)"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-mono font-bold">
                  {currentSlideIndex + 1} / {totalSlides}
                </span>
                <button
                  onClick={goToNextSlide}
                  disabled={currentSlideIndex === totalSlides - 1}
                  className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40"
                  title="Next Slide (Space / Right)"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="w-px h-4 bg-slate-700" />
                <button
                  onClick={() => setActiveTool(activeTool === 'laser' ? 'select' : 'laser')}
                  className={`p-1.5 rounded-lg text-xs font-bold ${
                    activeTool === 'laser' ? 'bg-red-600 text-white' : 'hover:bg-slate-800'
                  }`}
                  title="Laser Pointer"
                >
                  🔴 Laser
                </button>
                <button
                  onClick={handleAudioNarration}
                  className="p-1.5 rounded-lg hover:bg-slate-800"
                  title="Audio Voice"
                >
                  {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  onClick={() => setViewMode('normal')}
                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                  title="Exit Slide Show (Esc)"
                >
                  Exit (Esc)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. BOTTOM SPEAKER NOTES DRAWER (PowerPoint Notes Pane) */}
      {viewMode !== 'slideshow' && isNotesOpen && (
        <div className="bg-white dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 px-4 sm:px-6 py-2.5 text-xs text-slate-700 dark:text-slate-300 transition-all max-h-36 overflow-y-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#C43E1C] dark:text-amber-400 flex items-center gap-1.5">
              <FileText size={13} /> Presenter Notes (12th Samacheer Kalvi Exam Insights):
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAudioNarration}
                className="hover:text-emerald-500 font-semibold flex items-center gap-1"
              >
                <Volume2 size={12} /> {isSpeaking ? 'Stop Voice' : 'Play Voice'}
              </button>
              <button
                onClick={() => setIsNotesOpen(false)}
                className="hover:text-slate-900 dark:hover:text-white"
                title="Minimize Notes"
              >
                ✕
              </button>
            </div>
          </div>
          <p className="leading-relaxed opacity-90">
            {currentSlide.notes ||
              `Key Exam Focus: Pay attention to the anatomical arrangement in ${currentSlide.title}. Remember that questions testing this concept carry 2 marks or 3 marks in the Tamil Nadu Higher Secondary public examinations.`}
          </p>
        </div>
      )}

      {/* 5. BOTTOM STATUS BAR (PowerPoint Status Bar) */}
      {viewMode !== 'slideshow' && (
        <div className="bg-[#f0f0f0] dark:bg-slate-950 border-t border-slate-300 dark:border-slate-800 px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 select-none">
          {/* Left status indicators */}
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold">
              Slide {currentSlideIndex + 1} of {totalSlides}
            </span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span className="hidden sm:inline">English (India) / தமிழ்</span>
            <span className="hidden md:inline opacity-40">|</span>
            <span className="hidden md:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck size={12} /> Syllabus Verified
            </span>
          </div>

          {/* Center: Previous / Next Slide Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevSlide}
              disabled={currentSlideIndex === 0}
              className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 font-bold flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              onClick={goToNextSlide}
              disabled={currentSlideIndex === totalSlides - 1}
              className="px-2.5 py-1 rounded bg-[#C43E1C] hover:bg-red-700 text-white font-bold flex items-center gap-1 disabled:opacity-30"
            >
              Next <ChevronRight size={14} />
            </button>
            {currentSlideIndex === totalSlides - 1 && (
              <button
                onClick={() => onCompleteTopic?.(topic.id)}
                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center gap-1"
              >
                <CheckCircle size={13} /> Complete Topic
              </button>
            )}
          </div>

          {/* Right: Notes toggle, View options, Zoom */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsNotesOpen(!isNotesOpen)}
              className={`hover:text-slate-900 dark:hover:text-white font-semibold flex items-center gap-1 ${
                isNotesOpen ? 'text-[#C43E1C] dark:text-amber-400' : ''
              }`}
            >
              <FileText size={13} /> Notes
            </button>

            {/* View Mode icons */}
            <div className="flex items-center gap-0.5 border-l border-slate-300 dark:border-slate-700 pl-2">
              <button
                onClick={() => setViewMode('normal')}
                className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${
                  viewMode === 'normal' ? 'text-[#C43E1C] font-bold' : ''
                }`}
                title="Normal View"
              >
                <Layout size={14} />
              </button>
              <button
                onClick={() => setViewMode('sorter')}
                className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${
                  viewMode === 'sorter' ? 'text-[#C43E1C] font-bold' : ''
                }`}
                title="Slide Sorter"
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode('slideshow')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-[#C43E1C]"
                title="Slide Show (F5)"
              >
                <Monitor size={14} />
              </button>
            </div>

            {/* Zoom Slider */}
            <div className="hidden sm:flex items-center gap-1 border-l border-slate-300 dark:border-slate-700 pl-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                className="px-1 hover:text-slate-900"
              >
                -
              </button>
              <span className="font-mono text-[11px] w-9 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                className="px-1 hover:text-slate-900"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
