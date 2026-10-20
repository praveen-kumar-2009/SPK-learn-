import React, { useState, useMemo } from 'react';
import { Slide, Topic, ThreeDModelType } from '../../types/curriculum';
import { BotanicalIllustration } from './BotanicalIllustration';
import { BiologicalAtlasPlate } from './BiologicalAtlasPlate';
import { NanoBanana3DViewer } from '../slides3d/NanoBanana3DViewer';
import { Tripo3DModal } from '../slides3d/Tripo3DModal';
import { InteractiveDiagramViewer } from '../diagrams/InteractiveDiagramViewer';
import { BiologyConceptMindMap } from './BiologyConceptMindMap';
import { SlideImageGeneratorModal } from './SlideImageGeneratorModal';
import { AIEngineSettingsModal, loadStoredCredentials } from '../ai/AIEngineSettingsModal';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  PenTool,
  Box,
  Image as ImageIcon,
  Tag,
  Maximize2,
  Eye,
  Award,
  RefreshCw,
  Layers,
  Cpu,
  Check,
  AlertCircle,
} from 'lucide-react';

interface Base44SlideCardProps {
  topic: Topic;
  lessonTitle: string;
  subjectTitle: string;
  slides: Slide[];
  currentSlideIndex: number;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  onAskAI: (ctx?: any) => void;
  onOpenDrawModal: () => void;
  onOpenPowerPointStudio?: () => void;
  customSlideImages?: Record<string, string>;
  onSaveSlideImage?: (slideId: string, imageUrl: string) => void;
  onRemoveCustomImage?: (slideId: string) => void;
}

export const Base44SlideCard: React.FC<Base44SlideCardProps> = ({
  topic,
  lessonTitle,
  subjectTitle,
  slides,
  currentSlideIndex,
  onNextSlide,
  onPrevSlide,
  onAskAI,
  onOpenDrawModal,
  onOpenPowerPointStudio,
  customSlideImages = {},
  onSaveSlideImage,
  onRemoveCustomImage,
}) => {
  const currentSlide = slides[currentSlideIndex] || slides[0];
  const totalSlides = slides.length;
  const [visualMode, setVisualMode] = useState<'illustration' | 'threed' | 'diagram' | 'mindmap'>('illustration');
  const [revealedCheckpoints, setRevealedCheckpoints] = useState<Record<string, boolean>>({});
  const [isImageGenModalOpen, setIsImageGenModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isTripoModalOpen, setIsTripoModalOpen] = useState<boolean>(false);
  const [isGeneratingRefImage, setIsGeneratingRefImage] = useState<boolean>(false);
  const [refImageProvider, setRefImageProvider] = useState<string | null>(null);
  const [refImageError, setRefImageError] = useState<string | null>(null);
  const [customGlbUrl, setCustomGlbUrl] = useState<string | null>(null);

  // Slide unique key
  const currentSlideKey = currentSlide?.id || `slide-${currentSlideIndex}`;
  const currentSlideCustomImage = customSlideImages[currentSlideKey];

  // Infer 3D model type matching the exact biological topic
  const active3DModel: ThreeDModelType = useMemo(() => {
    if (currentSlide?.threeDModel) return currentSlide.threeDModel;
    const t = (topic.title || '').toLowerCase();
    const l = (lessonTitle || '').toLowerCase();
    const s = (subjectTitle || '').toLowerCase();
    const num = topic.number || '';

    // Botany Specific
    if (s.includes('botany') || (num.startsWith('1.') && !num.includes('z')) || l.includes('botany') || l.includes('plants')) {
      if (num === '1.2' || t.includes('anther') || t.includes('microspore')) return 'anther';
      if (num === '1.3' || t.includes('ovule') || t.includes('megaspore')) return 'ovule';
      if (num === '1.4' || t.includes('pollination')) return 'flower_pollination';
      if (num === '1.1' || t.includes('vegetative') || t.includes('asexual') || t.includes('propagation')) return 'vegetative_propagule';
      if (num === '1.5' || t.includes('fertiliz')) return 'ovule';
      if (t.includes('chloroplast') || t.includes('photosynthesis')) return 'chloroplast';
      if (t.includes('dna') || t.includes('watson')) return 'dna';
      if (t.includes('plasmid') || t.includes('pbr322')) return 'pbr322';
      return 'vegetative_propagule';
    }

    // Zoology Specific
    if (s.includes('zoology') || num.includes('z') || num.startsWith('2.') || l.includes('zoology') || l.includes('animal')) {
      if (t.includes('sperm') || t.includes('male') || num === '2.1-z') return 'sperm';
      if (t.includes('embryo') || t.includes('blastocyst') || t.includes('pregnancy')) return 'embryo';
      if (t.includes('female') || t.includes('oogenesis') || t.includes('ovary') || t.includes('menstrual') || num === '2.2-z') return 'human_reproduction';
      if (t.includes('fission') || t.includes('budding') || t.includes('regeneration') || num === '1.1-z' || num === '1.2-z') return 'cell';
      if (t.includes('antibody') || t.includes('immunity')) return 'antibody';
      if (t.includes('virus') || t.includes('aids') || t.includes('phage')) return 'bacteriophage';
      if (t.includes('neuron') || t.includes('nerve')) return 'neuron';
      if (t.includes('dna')) return 'dna';
      if (t.includes('mitochondria')) return 'mitochondria';
      if (t.includes('pbr322')) return 'pbr322';
      return 'cell';
    }

    // Fallbacks
    if (t.includes('anther')) return 'anther';
    if (t.includes('ovule')) return 'ovule';
    if (t.includes('pollination')) return 'flower_pollination';
    if (t.includes('sperm')) return 'sperm';
    if (t.includes('vegetative')) return 'vegetative_propagule';
    if (t.includes('dna')) return 'dna';
    if (t.includes('antibody')) return 'antibody';
    if (t.includes('pbr322')) return 'pbr322';
    if (t.includes('chloroplast')) return 'chloroplast';
    if (t.includes('mitochondria')) return 'mitochondria';

    return 'cell';
  }, [currentSlide?.threeDModel, topic.title, topic.number, lessonTitle, subjectTitle]);

  // Slide progress percentage
  const progressPercent = Math.round(((currentSlideIndex + 1) / totalSlides) * 100);

  const isSlide1 = currentSlideIndex === 0;
  const isKeyTermsSlide =
    currentSlide?.title.toLowerCase().includes('key term') ||
    currentSlide?.kind === 'conclusion' ||
    (currentSlide?.keyTerms && currentSlide.keyTerms.length > 0);
  const isVisualModelSlide =
    currentSlide?.kind === 'threed' ||
    currentSlide?.title.toLowerCase().includes('visual model') ||
    currentSlideIndex === 5;
  const isComparisonSlide = currentSlide?.kind === 'comparison' || !!currentSlide?.comparisonTable;
  const isCheckpointSlide = currentSlide?.kind === 'checkpoint' || !!currentSlide?.revealCard;
  const isProcessSlide = currentSlide?.kind === 'process' || (currentSlide?.steps && currentSlide.steps.length > 0);
  const isScientistSlide = currentSlide?.kind === 'scientist_profile' || !!currentSlide?.scientistProfile;

  const [revealedKeyTerms, setRevealedKeyTerms] = useState<Record<string, boolean>>({});

  // Slide 1 Default Authentic Real AI Biological Specimen (Always Visible on Slide 1 Without Changes)
  const slide1DefaultAIImage = useMemo(() => {
    const t = (topic.title || '').toLowerCase();
    const s = (subjectTitle || '').toLowerCase();
    const num = (topic.number || '').toLowerCase();
    const id = (topic.id || '').toLowerCase();

    const isZoology =
      s.includes('zoology') ||
      id.endsWith('-z') ||
      num.includes('z') ||
      id.includes('sz-') ||
      id.includes('zoo');

    if (isZoology) {
      // Zoology Chapter 1: Reproduction in Organisms (Amoeba, Paramecium, Hydra, Spongilla)
      if (num.startsWith('1.') || t.includes('modes of reproduction') || t.includes('fission') || t.includes('budding') || t.includes('parthenogenesis')) {
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(
          'detailed scientific biological chart illustration of animal reproduction modes, binary fission in Amoeba, transverse fission in Paramecium, gemmules in Spongilla, clean white background, educational textbook diagram, high resolution, labeled'
        )}?width=1024&height=768&model=turbo&nologo=true`;
      }

      // Zoology Chapter 2 Topic 2.1: Human Reproduction & Male System
      if (num === '2.1' || num === '2.1-z' || t.includes('male') || t.includes('human reproduction')) {
        return '/assets/slides/human_reproduction_atlas.png';
      }

      // Zoology Chapter 2 Topic 2.2+: Female Reproductive System, Graafian Follicle, Oogenesis
      if (num.startsWith('2.') || t.includes('female') || t.includes('gametogenesis') || t.includes('menstrual') || t.includes('follicle')) {
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(
          'detailed medical histological chart of human mature Graafian follicle and female reproductive organs, antrum, zona pellucida, corona radiata, theca layers, clean white background, educational anatomical atlas, high resolution, labeled'
        )}?width=1024&height=768&model=turbo&nologo=true`;
      }

      return `https://image.pollinations.ai/prompt/${encodeURIComponent(
        'detailed scientific biological chart illustration of ' + topic.title + ', clean white background, educational zoological textbook diagram, labeled parts, high resolution'
      )}?width=1024&height=768&model=turbo&nologo=true`;
    }

    // Botany: Strictly Botanical specimens
    // Topic 1.1: Vegetative Propagation
    if (num === '1.1' || t.includes('vegetative') || t.includes('asexual')) {
      return '/assets/slides/plant_reproduction_atlas.png';
    }

    // Topic 1.2: T.S. of Mature Anther & Pollen Wall Layers
    if (num === '1.2' || t.includes('anther') || t.includes('androecium') || t.includes('microspore')) {
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(
        'detailed scientific botanical chart illustration of transverse section of mature anther, 4 wall layers epidermis endothecium middle layers tapetum, microspore tetrads, pollen sacs, clean white background, educational atlas plate, high resolution, labeled'
      )}?width=1024&height=768&model=turbo&nologo=true`;
    }

    // Topic 1.3: Anatropous Ovule
    if (num === '1.3' || t.includes('ovule') || t.includes('megaspore')) {
      return '/assets/slides/anatropous_ovule_atlas.png';
    }

    // Topic 1.4: Pollination & Double Fertilization
    if (num === '1.4' || num === '1.5' || t.includes('pollination') || t.includes('fertiliz')) {
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(
        'detailed scientific botanical chart illustration of angiosperm double fertilization and siphonogamy, pollen tube entering micropyle, syngamy and triple fusion into primary endosperm nucleus, clean white background, educational textbook diagram, high resolution, labeled'
      )}?width=1024&height=768&model=turbo&nologo=true`;
    }

    // Chapter 2: Classical Genetics & Gregor Mendel
    if (num.startsWith('2.') || t.includes('genetic') || t.includes('mendel') || t.includes('heredity')) {
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(
        'detailed scientific botanical chart illustration of Gregor Mendel classical genetics, Pisum sativum pea monohybrid cross, 7 contrasting traits, Punnett square 3 to 1 ratio, clean white background, educational atlas plate, high resolution, labeled'
      )}?width=1024&height=768&model=turbo&nologo=true`;
    }

    return `https://image.pollinations.ai/prompt/${encodeURIComponent(
      'detailed scientific botanical chart illustration of ' + topic.title + ', clean white background, educational plant biology diagram, labeled parts, high resolution'
    )}?width=1024&height=768&model=turbo&nologo=true`;
  }, [topic.title, topic.number, topic.id, subjectTitle]);

  // Priority-based reference image generator: Cloudflare -> AI Horde -> Pollination
  const handleGenerateReferenceImage = async () => {
    setIsGeneratingRefImage(true);
    setRefImageError(null);
    try {
      const creds = loadStoredCredentials();
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${currentSlide?.title || topic.title}, scientific biological chart`,
          topicTitle: topic.title,
          engine: creds.defaultImageEngine || 'auto', // Priority: Cloudflare -> AI Horde -> Pollination
          credentials: {
            cloudflareAccountId: creds.cloudflareAccountId,
            cloudflareApiKey: creds.cloudflareApiKey,
            aiHordeApiKey: creds.aiHordeApiKey,
          },
          pollinationsModel: creds.pollinationsModel || 'flux',
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        onSaveSlideImage?.(currentSlideKey, data.imageUrl);
        setRefImageProvider(data.provider);
      } else {
        throw new Error(data.error || 'Failed to generate reference image');
      }
    } catch (err: any) {
      setRefImageError(err.message || 'Image generation notice');
    } finally {
      setIsGeneratingRefImage(false);
    }
  };

  const handleOpen3DViewerWithTripo = () => {
    setVisualMode('threed');
    setIsTripoModalOpen(true);
  };

  const toggleKeyTerm = (term: string) => {
    setRevealedKeyTerms((prev) => ({
      ...prev,
      [term]: !prev[term],
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 relative transition-all">
      {/* Top Bar: Slide X of Y ... ✨ Ask AI about this slide */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
        <span className="flex items-center gap-2">
          <span>Slide {currentSlideIndex + 1} of {totalSlides}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-bold uppercase tracking-wider">
            {currentSlide?.kind || 'curriculum'}
          </span>
        </span>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {onOpenPowerPointStudio && (
            <button
              onClick={onOpenPowerPointStudio}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              <Maximize2 size={13} />
              <span>Canvas Mode</span>
            </button>
          )}

          <button
            onClick={() =>
              onAskAI({
                subjectTitle,
                lessonTitle,
                topicNumber: topic.number,
                topicTitle: topic.title,
                slideIndex: currentSlideIndex,
                slideTitle: currentSlide?.title,
                slideBody: currentSlide?.body,
              })
            }
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>Ask AI about this slide</span>
          </button>
        </div>
      </div>

      {/* Emerald Green Progress Bar */}
      <div className="w-full h-1.5 bg-[#e8f3ee] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#257257] rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Slide Title & Section */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#144738] tracking-tight leading-snug">
            {currentSlide?.title}
          </h2>
          {currentSlide?.sourceReference?.section && (
            <span className="shrink-0 text-xs font-serif font-black px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
              Sec {currentSlide.sourceReference.section}
            </span>
          )}
        </div>

        {/* Visual Mode Selector Tabs (Syllabus View, 3D Model, Interactive Callouts, Concept Mindmap) */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setVisualMode('illustration')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              visualMode === 'illustration'
                ? 'bg-[#144738] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ImageIcon size={13} className={visualMode === 'illustration' ? 'text-amber-300' : 'text-slate-400'} />
            <span>Syllabus View</span>
          </button>

          <button
            type="button"
            onClick={() => setVisualMode('threed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              visualMode === 'threed'
                ? 'bg-[#144738] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Box size={13} className={visualMode === 'threed' ? 'text-amber-300' : 'text-slate-400'} />
            <span>3D Model & Illusion</span>
          </button>

          <button
            type="button"
            onClick={() => setVisualMode('diagram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              visualMode === 'diagram'
                ? 'bg-[#144738] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Tag size={13} className={visualMode === 'diagram' ? 'text-amber-300' : 'text-slate-400'} />
            <span>Interactive Callouts</span>
          </button>

          <button
            type="button"
            onClick={() => setVisualMode('mindmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              visualMode === 'mindmap'
                ? 'bg-[#144738] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers size={13} className={visualMode === 'mindmap' ? 'text-amber-300' : 'text-slate-400'} />
            <span>Concept Mindmap</span>
          </button>
        </div>
      </div>

      {/* ON NEXT SLIDES (SLIDES 2+): Dedicated Reference Image & 3D Viewer Buttons */}
      {!isSlide1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-slate-50 to-teal-50/80 border border-emerald-200/90 shadow-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleGenerateReferenceImage}
              disabled={isGeneratingRefImage}
              className="px-4 py-2 rounded-xl bg-[#144738] hover:bg-[#0e352a] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-transform active:scale-95 disabled:opacity-60"
              title="Generate reference image in Priority Order: Cloudflare → AI Horde → Pollinations"
            >
              {isGeneratingRefImage ? (
                <RefreshCw size={14} className="animate-spin text-amber-300" />
              ) : (
                <Sparkles size={14} className="text-amber-300" />
              )}
              <span>
                {isGeneratingRefImage
                  ? 'Generating Reference Image (Priority Order)...'
                  : currentSlideCustomImage
                  ? 'Reference Image'
                  : 'Reference Image'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleOpen3DViewerWithTripo}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-transform active:scale-95"
              title="Open 3D Viewer & Generate Biological 3D Model with Tripo AI"
            >
              <Box size={14} className="text-amber-200" />
              <span>3D Viewer</span>
            </button>

            {refImageProvider && (
              <span className="text-[11px] font-semibold text-emerald-800 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 flex items-center gap-1">
                <Check size={12} className="text-emerald-700" />
                <span>{refImageProvider}</span>
              </span>
            )}

            {refImageError && (
              <span className="text-[11px] font-medium text-amber-700 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>{refImageError}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-800 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Cpu size={13} className="text-slate-500" />
              <span>Priority: CF → Horde → Pollination</span>
            </button>
          </div>
        </div>
      )}

      {/* OVERRIDE: IF USER EXPLICITLY SWITCHED TO CONCEPT MINDMAP ON ANY SLIDE */}
      {visualMode === 'mindmap' && (
        <div className="py-2 space-y-3 animate-fade-in">
          <BiologyConceptMindMap
            topicTitle={topic.title}
            topicNumber={topic.number}
            subjectId={subjectTitle.toLowerCase().includes('botany') ? 'bio-botany' : 'bio-zoology'}
            onAskAI={onAskAI}
          />
        </div>
      )}

      {/* OVERRIDE: IF USER EXPLICITLY SWITCHED TO 3D ON ANY SLIDE */}
      {visualMode === 'threed' && !isVisualModelSlide && (
        <div className="py-2 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Box size={14} className="text-amber-600" />
              <span>3D Interactive Biological Viewer</span>
            </span>
            <button
              type="button"
              onClick={() => setIsTripoModalOpen(true)}
              className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Sparkles size={12} className="text-amber-200" />
              <span>Generate with Tripo AI</span>
            </button>
          </div>
          <NanoBanana3DViewer
            modelType={active3DModel}
            title={`${currentSlide?.title || topic.title} (3D Illusion)`}
            customGlbUrl={customGlbUrl || undefined}
            className="h-[340px] sm:h-[380px]"
          />
          <p className="text-[11px] text-slate-400 font-medium text-center">
            3D interactive spatial illusion · Three.js WebGL & Holographic Depth
          </p>
        </div>
      )}

      {/* OVERRIDE: IF USER EXPLICITLY SWITCHED TO INTERACTIVE DIAGRAM ON ANY SLIDE */}
      {visualMode === 'diagram' && !isVisualModelSlide && (
        <div className="py-2 space-y-3 animate-fade-in">
          <InteractiveDiagramViewer
            type={
              topic.title.toLowerCase().includes('sperm') || topic.title.toLowerCase().includes('male') || topic.title.toLowerCase().includes('reproduction')
                ? 'sperm'
                : topic.title.toLowerCase().includes('ovule')
                ? 'ovule'
                : topic.title.toLowerCase().includes('anther')
                ? 'anther'
                : topic.title.toLowerCase().includes('antibody')
                ? 'antibody'
                : 'pbr322'
            }
          />
        </div>
      )}

      {/* SLIDE 1 LAYOUT: Big Golden Amber Number + Real AI Biological Specimen (Always Visible on Slide 1 Without Changes) + LEARNING GOALS */}
      {isSlide1 && visualMode === 'illustration' && (
        <div className="space-y-6 animate-fade-in">
          {/* Big Golden Amber Number */}
          <div className="flex justify-center my-1">
            <span className="font-serif font-black text-4xl sm:text-5xl text-[#e59b22]">
              {topic.number ? topic.number.split('.')[0] : '2'}
            </span>
          </div>

          {/* AI Generator & Atlas Controls Bar */}
          <div className="w-full max-w-xl mx-auto flex items-center justify-between px-1 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsImageGenModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold shadow-xs cursor-pointer transition-all"
                title="Synthesize custom illustration with Cloudflare, AI Horde, or Pollinations"
              >
                <Sparkles size={13} className="text-emerald-300" />
                <span>Regenerate AI Image</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold cursor-pointer shadow-2xs"
                title="Configure Cloudflare, AI Horde, Pollinations, or Tripo API keys"
              >
                <Cpu size={13} className="text-slate-500" />
                <span>AI Engines</span>
              </button>
            </div>

            {currentSlideCustomImage && onRemoveCustomImage && (
              <button
                type="button"
                onClick={() => onRemoveCustomImage(currentSlideKey)}
                className="text-xs text-slate-500 hover:text-red-600 font-semibold underline cursor-pointer"
              >
                Reset to Default
              </button>
            )}
          </div>

          {/* Primary Visual: Real AI Biological Specimen (Always Visible on Slide 1 Without Changes) */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-xl p-3.5 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50/70 rounded-2xl border border-emerald-300 shadow-sm space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-emerald-950 inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>AI Biological Atlas Specimen</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                    Priority: Cloudflare · AI Horde · Pollinations
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenDrawModal}
                    className="text-[11px] text-emerald-800 hover:text-emerald-950 cursor-pointer font-bold underline"
                  >
                    Draw / Annotate
                  </button>
                  {currentSlideCustomImage && onRemoveCustomImage && (
                    <button
                      type="button"
                      onClick={() => onRemoveCustomImage(currentSlideKey)}
                      className="text-[11px] text-slate-400 hover:text-red-600 cursor-pointer font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-emerald-200 bg-white flex items-center justify-center min-h-[280px] max-h-[420px] shadow-inner relative group">
                <img
                  src={currentSlideCustomImage || slide1DefaultAIImage}
                  alt={currentSlide?.title || topic.title}
                  className="w-full h-auto max-h-[400px] object-contain rounded-lg transition-transform hover:scale-102 duration-300 select-none"
                />
              </div>
            </div>
          </div>

          {/* LEARNING GOALS with Amber Bullets */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Learning Goals
            </h4>
            <div className="space-y-2">
              {(currentSlide?.bullets && currentSlide.bullets.length > 0
                ? currentSlide.bullets
                : topic.learningObjectives || []
              ).map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-800 leading-snug">
                  <span className="w-2 h-2 rounded-full bg-[#d97706] mt-1.5 shrink-0" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 6: VISUAL MODEL (3D ILLUSION & WEBGL) */}
      {!isSlide1 && isVisualModelSlide && (
        <div className="py-2 space-y-4 animate-fade-in">
          {currentSlide?.body && (
            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
              {currentSlide.body}
            </p>
          )}

          <div className="w-full flex flex-col items-center pt-1">
            <NanoBanana3DViewer
              modelType={active3DModel}
              title={currentSlide?.title || topic.title}
              className="h-[360px] sm:h-[400px]"
            />
          </div>

          <p className="text-[11px] text-slate-400 font-medium text-center">
            3D interactive spatial illusion · Three.js WebGL & Holographic Depth
          </p>
        </div>
      )}

      {/* COMPARISON SLIDE: Table format */}
      {!isSlide1 && !isVisualModelSlide && isComparisonSlide && visualMode === 'illustration' && (
        <div className="space-y-4 py-2 animate-fade-in">
          {currentSlide?.body && (
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
              {currentSlide.body}
            </p>
          )}

          {currentSlide?.comparisonTable && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm">
                {currentSlide.comparisonTable.caption && (
                  <caption className="p-3 font-serif font-bold text-slate-800 bg-slate-50 text-left border-b border-slate-200">
                    {currentSlide.comparisonTable.caption}
                  </caption>
                )}
                <thead>
                  <tr className="bg-emerald-900 text-white font-bold">
                    {currentSlide.comparisonTable.headers.map((h, i) => (
                      <th key={i} className="p-3 border-r border-emerald-800 last:border-r-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentSlide.comparisonTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`p-3 text-slate-700 ${cIdx === 0 ? 'font-bold text-slate-900' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentSlideCustomImage && (
            <div className="pt-2 flex flex-col items-center">
              <div className="w-full max-w-lg p-2.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/90 space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-emerald-950 inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Attached AI Illustration</span>
                  </span>
                  {onRemoveCustomImage && (
                    <button
                      type="button"
                      onClick={() => onRemoveCustomImage(currentSlideKey)}
                      className="text-[11px] text-slate-400 hover:text-red-600 cursor-pointer font-medium"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
                <div className="rounded-xl overflow-hidden border border-emerald-300 bg-white flex items-center justify-center max-h-[360px]">
                  <img
                    src={currentSlideCustomImage}
                    alt={currentSlide?.title}
                    className="w-full h-auto max-h-[350px] object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PROCESS / STEP-BY-STEP SLIDE */}
      {!isSlide1 && !isVisualModelSlide && isProcessSlide && !isComparisonSlide && visualMode === 'illustration' && (
        <div className="space-y-4 py-2 animate-fade-in">
          {currentSlide?.body && (
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
              {currentSlide.body}
            </p>
          )}

          {currentSlide?.steps && (
            <div className="space-y-2.5">
              {currentSlide.steps.map((st, i) => (
                <div key={i} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
                  <h4 className="font-bold text-sm text-[#144738] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span>{st.title}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
                    {st.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {currentSlideCustomImage && (
            <div className="pt-2 flex flex-col items-center">
              <div className="w-full max-w-lg p-2.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/90 space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-emerald-950 inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Attached AI Illustration</span>
                  </span>
                  {onRemoveCustomImage && (
                    <button
                      type="button"
                      onClick={() => onRemoveCustomImage(currentSlideKey)}
                      className="text-[11px] text-slate-400 hover:text-red-600 cursor-pointer font-medium"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
                <div className="rounded-xl overflow-hidden border border-emerald-300 bg-white flex items-center justify-center max-h-[360px]">
                  <img
                    src={currentSlideCustomImage}
                    alt={currentSlide?.title}
                    className="w-full h-auto max-h-[350px] object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHECKPOINT SLIDE: Exam Question & Reveal Key */}
      {!isSlide1 && !isVisualModelSlide && isCheckpointSlide && visualMode === 'illustration' && (
        <div className="space-y-4 py-2 animate-fade-in">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 flex items-center gap-1.5">
              <Award size={13} />
              <span>Public Exam Question</span>
            </span>
            <p className="text-base font-serif font-bold text-slate-900 leading-snug">
              {currentSlide?.body}
            </p>
          </div>

          {currentSlide?.revealCard && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() =>
                  setRevealedCheckpoints((prev) => ({
                    ...prev,
                    [currentSlide.id]: !prev[currentSlide.id],
                  }))
                }
                className="px-4 py-2 rounded-xl bg-[#144738] hover:bg-[#0e352a] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Eye size={14} />
                <span>
                  {revealedCheckpoints[currentSlide.id] ? 'Hide Model Answer Key' : 'Tap to Reveal DGE Model Answer Key'}
                </span>
              </button>

              {revealedCheckpoints[currentSlide.id] && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md space-y-3 animate-fade-in">
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {currentSlide.revealCard.answer}
                  </div>
                  {currentSlide.revealCard.examTip && (
                    <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      💡 {currentSlide.revealCard.examTip}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {currentSlideCustomImage && (
            <div className="pt-2 flex flex-col items-center">
              <div className="w-full max-w-lg p-2.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/90 space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-emerald-950 inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Attached AI Illustration</span>
                  </span>
                  {onRemoveCustomImage && (
                    <button
                      type="button"
                      onClick={() => onRemoveCustomImage(currentSlideKey)}
                      className="text-[11px] text-slate-400 hover:text-red-600 cursor-pointer font-medium"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
                <div className="rounded-xl overflow-hidden border border-emerald-300 bg-white flex items-center justify-center max-h-[360px]">
                  <img
                    src={currentSlideCustomImage}
                    alt={currentSlide?.title}
                    className="w-full h-auto max-h-[350px] object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SCIENTIST PROFILE SLIDE */}
      {!isSlide1 && !isVisualModelSlide && isScientistSlide && visualMode === 'illustration' && (
        <div className="space-y-4 py-2 animate-fade-in">
          {currentSlide?.scientistProfile && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg font-serif">
                  {currentSlide.scientistProfile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                    {currentSlide.scientistProfile.name}
                  </h3>
                  <p className="text-xs text-emerald-800 font-semibold">
                    {currentSlide.scientistProfile.title} ({currentSlide.scientistProfile.era})
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {currentSlide.scientistProfile.discovery}
              </p>

              {currentSlide.scientistProfile.quote && (
                <blockquote className="text-xs italic text-slate-600 border-l-2 border-emerald-600 pl-3 py-0.5">
                  "{currentSlide.scientistProfile.quote}"
                </blockquote>
              )}
            </div>
          )}

          {currentSlideCustomImage && (
            <div className="pt-2 flex flex-col items-center">
              <div className="w-full max-w-lg p-2.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/90 space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-emerald-950 inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Attached AI Illustration</span>
                  </span>
                  {onRemoveCustomImage && (
                    <button
                      type="button"
                      onClick={() => onRemoveCustomImage(currentSlideKey)}
                      className="text-[11px] text-slate-400 hover:text-red-600 cursor-pointer font-medium"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
                <div className="rounded-xl overflow-hidden border border-emerald-300 bg-white flex items-center justify-center max-h-[360px]">
                  <img
                    src={currentSlideCustomImage}
                    alt={currentSlide?.title}
                    className="w-full h-auto max-h-[350px] object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONCEPT / TEXTBOOK SLIDE: Body & Bullets & Illustration (SINGLE, NO DUPLICATE) */}
      {!isSlide1 &&
        !isVisualModelSlide &&
        !isKeyTermsSlide &&
        !isComparisonSlide &&
        !isCheckpointSlide &&
        !isProcessSlide &&
        !isScientistSlide &&
        visualMode === 'illustration' && (
          <div className="space-y-4 py-2 animate-fade-in">
            {currentSlide?.body && (
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
                {currentSlide.body}
              </p>
            )}

            {currentSlide?.bullets && currentSlide.bullets.length > 0 && (
              <div className="space-y-3 pt-1">
                {currentSlide.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm sm:text-base text-slate-800 leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-[#d97706] mt-2 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}

            {currentSlide?.doYouKnowFact && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>Did You Know?</span>
                </span>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                  {currentSlide.doYouKnowFact}
                </p>
              </div>
            )}

            {/* Custom Attached Illustration OR Default BotanicalIllustration (NEVER BOTH) */}
            {currentSlideCustomImage ? (
              <div className="pt-2 flex flex-col items-center">
                <div className="w-full max-w-lg p-2.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/90 space-y-2">
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="font-bold text-emerald-950 inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      <span>Attached AI Illustration</span>
                    </span>
                    {onRemoveCustomImage && (
                      <button
                        type="button"
                        onClick={() => onRemoveCustomImage(currentSlideKey)}
                        className="text-[11px] text-slate-400 hover:text-red-600 cursor-pointer font-medium"
                      >
                        Reset to Default
                      </button>
                    )}
                  </div>
                  <div className="rounded-xl overflow-hidden border border-emerald-300 bg-white flex items-center justify-center max-h-[360px]">
                    <img
                      src={currentSlideCustomImage}
                      alt={currentSlide?.title}
                      className="w-full h-auto max-h-[350px] object-contain rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ) : currentSlide?.illustrationType ? (
              <div className="pt-2 flex flex-col items-center">
                <BotanicalIllustration type={currentSlide.illustrationType} topicTitle={topic.title} />
              </div>
            ) : null}
          </div>
        )}

      {/* KEY TERMS / CONCLUSION SLIDE */}
      {!isSlide1 && isKeyTermsSlide && visualMode === 'illustration' && (
        <div className="space-y-3 py-2 animate-fade-in">
          {currentSlide?.body && (
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed mb-3">
              {currentSlide.body}
            </p>
          )}

          {(currentSlide?.keyTerms || [
            {
              term: topic.title,
              definition: 'Fundamental conceptual topic in 12th Standard Higher Secondary Biology.',
            },
            {
              term: 'Board Exam Essential Keyword',
              definition: 'Exact biological terminology evaluated in Directorate of Government Examinations answer keys.',
            },
          ]).map((item) => {
            const isRevealed = revealedKeyTerms[item.term];
            return (
              <div
                key={item.term}
                onClick={() => toggleKeyTerm(item.term)}
                className="p-4 rounded-2xl bg-[#f0f7f3] border border-emerald-200/60 hover:border-emerald-400 transition-all cursor-pointer shadow-2xs space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base sm:text-lg text-[#144738] group-hover:text-emerald-900 transition-colors">
                    {item.term}
                  </h4>
                  {!isRevealed && (
                    <span className="text-xs text-slate-500 font-medium">Tap to reveal</span>
                  )}
                </div>
                {isRevealed && (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1 animate-fade-in">
                    {item.definition}
                  </p>
                )}
              </div>
            );
          })}

          {currentSlideCustomImage && (
            <div className="pt-2 flex flex-col items-center">
              <div className="w-full max-w-lg p-2.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/90 space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-emerald-950 inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Attached AI Illustration</span>
                  </span>
                  {onRemoveCustomImage && (
                    <button
                      type="button"
                      onClick={() => onRemoveCustomImage(currentSlideKey)}
                      className="text-[11px] text-slate-400 hover:text-red-600 cursor-pointer font-medium"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
                <div className="rounded-xl overflow-hidden border border-emerald-300 bg-white flex items-center justify-center max-h-[360px]">
                  <img
                    src={currentSlideCustomImage}
                    alt={currentSlide?.title}
                    className="w-full h-auto max-h-[350px] object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons: Draw and AI Image Generator */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          type="button"
          onClick={onOpenDrawModal}
          className={`px-4 py-2.5 rounded-xl border font-semibold text-xs inline-flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer ${
            currentSlideCustomImage
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
              : 'border-slate-200/90 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <PenTool size={14} className={currentSlideCustomImage ? 'text-emerald-700' : 'text-[#144738]'} />
          <span>
            {currentSlideCustomImage
              ? 'Draw / Edit illustration for this slide'
              : 'Draw an illustration for this slide'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsImageGenModalOpen(true)}
          className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs inline-flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <Sparkles size={14} className="text-emerald-600" />
          <span>AI Image Generator (Pollinations · Cloudflare · AI Horde)</span>
        </button>
      </div>

      {/* Navigation Buttons: < Previous & Next > */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          onClick={onPrevSlide}
          disabled={currentSlideIndex === 0}
          className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-semibold shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} />
          <span>Previous</span>
        </button>

        <button
          onClick={onNextSlide}
          disabled={currentSlideIndex === totalSlides - 1}
          className="px-6 py-2.5 rounded-full bg-[#1c4e3f] hover:bg-[#153f33] disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Slide Image Generator Modal */}
      <SlideImageGeneratorModal
        isOpen={isImageGenModalOpen}
        onClose={() => setIsImageGenModalOpen(false)}
        topicTitle={currentSlide?.title || topic.title}
        topicNumber={topic.number}
        subjectTitle={subjectTitle}
        onApplyImage={(imgUrl) => {
          onSaveSlideImage?.(currentSlideKey, imgUrl);
          setIsImageGenModalOpen(false);
        }}
        onOpenSettings={() => {
          setIsImageGenModalOpen(false);
          setIsSettingsModalOpen(true);
        }}
      />

      {/* AI Engine Settings Modal */}
      <AIEngineSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Tripo 3D Generator Modal */}
      <Tripo3DModal
        isOpen={isTripoModalOpen}
        onClose={() => setIsTripoModalOpen(false)}
        initialPrompt={currentSlide?.title || topic.title}
        onLoadGlbModel={(glbUrl: string) => {
          setCustomGlbUrl(glbUrl);
          setVisualMode('threed');
        }}
      />
    </div>
  );
};
