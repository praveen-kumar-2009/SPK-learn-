import React, { useState } from 'react';
import { DiagramDefinition, DiagramHotspot } from '../../types/curriculum';
import { OvuleDiagram } from './OvuleDiagram';
import { AntherDiagram } from './AntherDiagram';
import { AntibodyDiagram } from './AntibodyDiagram';
import { SpermDiagram } from './SpermDiagram';
import { Pbr322Diagram } from './Pbr322Diagram';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Volume2,
  Info,
  CheckCircle2,
  HelpCircle,
  Table,
} from 'lucide-react';

interface ViewerProps {
  diagram?: DiagramDefinition;
  type?: 'ovule' | 'anther' | 'antibody' | 'sperm' | 'pbr322';
  onAskAI?: (part: DiagramHotspot) => void;
  topicTitle?: string;
}

const DEFAULT_DIAGRAMS: Record<'ovule' | 'anther' | 'antibody' | 'sperm' | 'pbr322', DiagramDefinition> = {
  sperm: {
    id: 'diag-sperm',
    title: 'Structure of Human Spermatozoon',
    tamilTitle: 'மனித விந்து செல்லின் அமைப்பு',
    type: 'sperm',
    caption: 'Microscopic structure of a mature human sperm cell (head, neck, middle piece, and tail)',
    hotspots: [
      {
        id: 'acrosome',
        name: 'Acrosome',
        tamilName: 'அக்ரோசோம்',
        description: 'Cap-like structure filled with proteolytic enzymes (hyaluronidase, corona penetrating enzyme) enabling ovum penetration.',
        function: 'Enzymatic dissolution of corona radiata and zona pellucida during fertilisation.',
      },
      {
        id: 'nucleus',
        name: 'Haploid Nucleus',
        tamilName: 'ஒற்றைமய உட்கரு',
        description: 'Elongated nucleus containing highly condensed paternal DNA with protamines.',
        function: 'Carries 23 chromosomes (22 autosomes + X or Y sex chromosome) to restore diploidy.',
      },
      {
        id: 'middle_piece',
        name: 'Middle Piece (Nebenkern Mitochondria)',
        tamilName: 'நடுப்பகுதி (மைட்டோகாண்ட்ரியா)',
        description: 'Spiral sheath of mitochondria wrapped around the central axial filament.',
        function: 'Generates ATP energy required for active sperm motility and flagellar lashing.',
      },
      {
        id: 'tail',
        name: 'Axoneme & Flagellar Tail',
        tamilName: 'வால் பகுதி (பிளஜெல்லா)',
        description: 'Slender motile axoneme arranged in a 9+2 microtubular doublet configuration.',
        function: 'Propels sperm through the female reproductive tract towards the ampulla.',
      },
    ],
  },
  ovule: {
    id: 'diag-ovule',
    title: 'Structure of Anatropous Ovule (Megasporangium)',
    tamilTitle: 'தலைகீழ் சூழ் (அனாட்ரோபஸ் சூழ்) அமைப்பு',
    type: 'ovule',
    caption: 'Longitudinal cross-section of an angiosperm anatropous ovule showing female gametophyte',
    hotspots: [
      {
        id: 'micropyle',
        name: 'Micropyle',
        tamilName: 'சூல்துளை',
        description: 'Pore or opening left by the integuments through which pollen tube enters.',
        function: 'Entry pore for pollen tube during porogamous fertilisation.',
      },
      {
        id: 'embryo_sac',
        name: 'Embryo Sac (Female Gametophyte)',
        tamilName: 'கருப்பை (பெண் கேமிட்டோபைட்)',
        description: '7-celled, 8-nucleate structure containing egg apparatus, central cell, and antipodals.',
        function: 'Site of double fertilisation forming diploid zygote (2n) and triploid endosperm (3n).',
      },
      {
        id: 'integuments',
        name: 'Integuments',
        tamilName: 'சூலுறைகள்',
        description: 'Protective cellular envelopes enclosing the nucellus.',
        function: 'Develop into seed coats (outer testa and inner tegmen) after fertilisation.',
      },
    ],
  },
  anther: {
    id: 'diag-anther',
    title: 'Transverse Section of Mature Anther (Microsporangium)',
    tamilTitle: 'மகரந்தப்பையின் குறுக்குவெட்டுத் தோற்றம்',
    type: 'anther',
    caption: 'Four-lobed tetrasporangiate anther cross-section displaying microsporangial wall layers',
    hotspots: [
      {
        id: 'tapetum',
        name: 'Tapetum',
        tamilName: 'டபீட்டம்',
        description: 'Innermost nourishing wall layer composed of dense cytoplasm and polyploid nuclei.',
        function: 'Nourishes developing microspores and secretes pollen wall materials (sporopollenin & pollenkitt).',
      },
      {
        id: 'endothecium',
        name: 'Endothecium',
        tamilName: 'எண்டோதீசியம்',
        description: 'Sub-epidermal layer with hygroscopic radial alpha-cellulose fibrous bands.',
        function: 'Aids in stomium dehiscence and pollen dispersal upon anther desiccation.',
      },
    ],
  },
  antibody: {
    id: 'diag-antibody',
    title: 'Structure of Immunoglobulin (IgG Antibody)',
    tamilTitle: 'இம்யூனோகுளோபுலின் (எதிர்ப்பொருள்) அமைப்பு',
    type: 'antibody',
    caption: 'Y-shaped tetrameric glycoprotein molecule composed of two heavy (H) and two light (L) chains',
    hotspots: [
      {
        id: 'fab_region',
        name: 'Antigen-Binding Fragment (Fab)',
        tamilName: 'ஆன்டிஜென் பிணைப்பு பகுதி (Fab)',
        description: 'Hypervariable complementarity-determining regions (CDRs) at the amino-terminal ends.',
        function: 'Specifically recognizes and neutralizes unique epitope antigens like lock and key.',
      },
      {
        id: 'fc_region',
        name: 'Crystallizable Constant Fragment (Fc)',
        tamilName: 'படிகமாகும் மாறா பகுதி (Fc)',
        description: 'Carboxy-terminal constant domains mediating effector functions.',
        function: 'Binds complement proteins and macrophage Fc receptors to induce phagocytosis.',
      },
    ],
  },
  pbr322: {
    id: 'diag-pbr322',
    title: 'pBR322 Cloning Vector Plasmid Map',
    tamilTitle: 'pBR322 பிளாஸ்மிட் மரபணு வரைபடம்',
    type: 'pbr322',
    caption: 'Standard cloning vector engineered by Bolivar and Rodriguez containing 4361 base pairs',
    hotspots: [
      {
        id: 'ori',
        name: 'Origin of Replication (ori)',
        tamilName: 'பெருக்கத்தின் தோற்றம் (ori)',
        description: 'Specific DNA nucleotide sequence where DNA replication initiates in the host bacterium.',
        function: 'Controls plasmid autonomous replication and regulates copy number.',
      },
      {
        id: 'ampr',
        name: 'Ampicillin Resistance Gene (ampR)',
        tamilName: 'ஆம்பிசிலின் எதிர்ப்பு மரபணு',
        description: 'Selectable marker gene encoding beta-lactamase enzyme.',
        function: 'Distinguishes transformant bacteria from non-transformants on antibiotic plates.',
      },
    ],
  },
};

export const InteractiveDiagramViewer: React.FC<ViewerProps> = ({
  diagram: inputDiagram,
  type = 'sperm',
  onAskAI,
  topicTitle = 'Biology Concept',
}) => {
  const diagram = inputDiagram || DEFAULT_DIAGRAMS[type] || DEFAULT_DIAGRAMS.sperm;
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>(
    diagram.hotspots[0]?.id || ''
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const activeHotspot = diagram.hotspots.find((h) => h.id === selectedHotspotId) || diagram.hotspots[0];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const renderSpecificDiagram = () => {
    switch (diagram.type) {
      case 'ovule':
        return <OvuleDiagram selectedHotspotId={selectedHotspotId} onSelectHotspot={setSelectedHotspotId} />;
      case 'anther':
        return <AntherDiagram selectedHotspotId={selectedHotspotId} onSelectHotspot={setSelectedHotspotId} />;
      case 'antibody':
        return <AntibodyDiagram selectedHotspotId={selectedHotspotId} onSelectHotspot={setSelectedHotspotId} />;
      case 'sperm':
        return <SpermDiagram selectedHotspotId={selectedHotspotId} onSelectHotspot={setSelectedHotspotId} />;
      case 'pbr322':
        return <Pbr322Diagram selectedHotspotId={selectedHotspotId} onSelectHotspot={setSelectedHotspotId} />;
      default:
        return <OvuleDiagram selectedHotspotId={selectedHotspotId} onSelectHotspot={setSelectedHotspotId} />;
    }
  };

  return (
    <div className="w-full bg-slate-900/5 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 transition-all">
      {/* Diagram Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Interactive Scientific Diagram
            </span>
            <span className="text-xs text-slate-500 font-medium">Click regions or labels to inspect</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {diagram.title}
          </h3>
          {diagram.tamilTitle && (
            <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              {diagram.tamilTitle}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-xs">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono font-medium text-slate-500 px-1 select-none">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            <RotateCcw size={16} />
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
          <button
            onClick={() => setShowTable(!showTable)}
            title="Toggle Accessible Table View"
            className={`p-1.5 rounded-md transition-colors ${
              showTable
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Table size={16} />
          </button>
        </div>
      </div>

      {showTable ? (
        /* Accessible Table View for fast revision */
        <div className="overflow-x-auto my-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                <th className="pb-2">Part / Structure</th>
                <th className="pb-2">Tamil Term</th>
                <th className="pb-2">Function & Description</th>
                <th className="pb-2">Class 12 Exam Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {diagram.hotspots.map((h) => (
                <tr
                  key={h.id}
                  onClick={() => {
                    setSelectedHotspotId(h.id);
                    setShowTable(false);
                  }}
                  className="hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{h.name}</td>
                  <td className="py-2.5 text-emerald-700 dark:text-emerald-400 font-medium">{h.tamilName || '-'}</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">{h.function}</td>
                  <td className="py-2.5 text-amber-700 dark:text-amber-400 text-xs">{h.examNote || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Visual Diagram Canvas & Interactive Inspector */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Canvas Box */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs relative">
            <div
              className="w-full flex items-center justify-center p-2 transition-transform duration-200 origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {renderSpecificDiagram()}
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
              <span>{diagram.caption}</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {diagram.hotspots.length} interactive hotspots
              </span>
            </div>
          </div>

          {/* Inspector Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Hotspot Chips selector */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Anatomical Structures
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {diagram.hotspots.map((h) => {
                  const isSelected = h.id === selectedHotspotId;
                  return (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHotspotId(h.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all text-left flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {isSelected && <CheckCircle2 size={12} className="shrink-0" />}
                      <span>{h.name.split(' (')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Part Inspector Card */}
            {activeHotspot && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-emerald-500/40 dark:border-emerald-500/30 p-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {activeHotspot.name}
                    </h4>
                    {activeHotspot.tamilName && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        {activeHotspot.tamilName}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handleSpeak(
                        `${activeHotspot.name}. ${activeHotspot.description}. Function: ${activeHotspot.function}. ${activeHotspot.examNote || ''}`
                      )
                    }
                    title="Read Aloud"
                    className={`p-2 rounded-lg transition-colors ${
                      isSpeaking
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                {/* Description */}
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                      Structure & Location:
                    </span>
                    <p className="leading-relaxed">{activeHotspot.description}</p>
                    {activeHotspot.tamilDescription && (
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 font-medium">
                        {activeHotspot.tamilDescription}
                      </p>
                    )}
                  </div>

                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/60">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-0.5">
                      Physiological Function:
                    </span>
                    <p className="leading-relaxed text-emerald-950 dark:text-emerald-200">
                      {activeHotspot.function}
                    </p>
                  </div>

                  {activeHotspot.examNote && (
                    <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60 flex items-start gap-2">
                      <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900 dark:text-amber-200">
                        <span className="font-bold block">Class 12 Board Exam Tip:</span>
                        {activeHotspot.examNote}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ask AI Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Need more depth?</span>
                  <button
                    onClick={() => onAskAI?.(activeHotspot)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95"
                  >
                    <Sparkles size={14} />
                    <span>Ask SPKLN AI about this</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
