import React, { useState, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles, BookOpen, Layers, CheckCircle2, X } from 'lucide-react';

export interface MindMapNode {
  id: string;
  label: string;
  tamilLabel: string;
  category: 'core' | 'anatomy' | 'process' | 'hormone' | 'exam';
  x: number;
  y: number;
  description: string;
  tamilDescription: string;
  keyExamPoints: string[];
  connections: string[]; // ids of connected nodes
}

interface BiologyConceptMindMapProps {
  topicTitle: string;
  topicNumber?: string;
  subjectId?: string;
  onAskAI?: (context?: any) => void;
  className?: string;
}

// Topic-specific mindmap templates
const TOPIC_MINDMAPS: Record<string, { rootLabel: string; rootTamil: string; nodes: MindMapNode[] }> = {
  // 1. Human Reproduction (Default / Zoology Chapter 2)
  human_reproduction: {
    rootLabel: 'Human Reproduction',
    rootTamil: 'மனித இனப்பெருக்கம்',
    nodes: [
      {
        id: 'male_system',
        label: 'Male Reproductive System',
        tamilLabel: 'ஆண் இனப்பெருக்க மண்டலம்',
        category: 'anatomy',
        x: 180,
        y: 120,
        description: 'Testes located in scrotum (2-2.5°C below core body temperature for optimal spermatogenesis). Includes seminiferous tubules, rete testis, vasa efferentia, epididymis, and vas deferens.',
        tamilDescription: 'விந்தகம் விரைப்பையில் உடலைவிட 2-2.5°C குறைந்த வெப்பநிலையில் அமைந்துள்ளது. விந்து நுண்குழல்கள், எபிடிடைமிஸ் மற்றும் விந்து நாளங்களை உள்ளடக்கியது.',
        keyExamPoints: [
          'Sertoli cells provide nourishment to developing spermatozoa.',
          'Leydig (interstitial) cells synthesize and secrete androgens (Testosterone).',
          'Accessory glands: Seminal vesicles (60-70% semen), Prostate gland (alkaline), Cowper’s (bulbourethral) glands (lubrication).',
        ],
        connections: ['spermatogenesis', 'male_hormones'],
      },
      {
        id: 'female_system',
        label: 'Female Reproductive System',
        tamilLabel: 'பெண் இனப்பெருக்க மண்டலம்',
        category: 'anatomy',
        x: 620,
        y: 120,
        description: 'Pair of ovaries, fallopian tubes (oviducts), uterus, cervix, and vagina. Uterine wall consists of perimetrium, thick myometrium (smooth muscle), and vascular glandular endometrium.',
        tamilDescription: 'அண்டகங்கள், பெலோப்பியன் குழாய்கள், கருப்பை, கருப்பை வாய் மற்றும் யோனி. கருப்பை சுவர் பெரிமெட்ரியம், மயோமெட்ரியம், எண்டோமெட்ரியம் அடுக்கு கொண்டது.',
        keyExamPoints: [
          'Ampullary-isthmic junction: precise anatomical site of fertilization.',
          'Endometrium undergoes cyclical changes during menstrual cycle and receives blastocyst during implantation.',
          'Fimbriae of fallopian funnel collect the ovum released during ovulation.',
        ],
        connections: ['oogenesis', 'female_hormones', 'menstrual_cycle'],
      },
      {
        id: 'spermatogenesis',
        label: 'Spermatogenesis',
        tamilLabel: 'விந்துவாக்கம்',
        category: 'process',
        x: 120,
        y: 280,
        description: 'Process of formation of haploid spermatozoa from diploid spermatogonia in the seminiferous tubules. Involves mitotic multiplication, growth, and two meiotic maturation divisions.',
        tamilDescription: 'இருமைய விந்து மூல செல்களிலிருந்து ஒற்றைமைய விந்து செல்கள் உருவாகும் தொடர் செயல்முறை. மியாசிஸ் பகுப்பு மூலம் 4 விந்தணுக்கள் உருவாகின்றன.',
        keyExamPoints: [
          'Primary spermatocyte (2n) undergoes Meiosis I to form 2 equal secondary spermatocytes (n).',
          'Secondary spermatocytes undergo Meiosis II to produce 4 haploid spermatids.',
          'Spermiogenesis: Transformation of non-motile circular spermatids into flagellated motile spermatozoa.',
        ],
        connections: ['sperm_anatomy', 'male_hormones'],
      },
      {
        id: 'oogenesis',
        label: 'Oogenesis',
        tamilLabel: 'அண்ட உருவாக்கம்',
        category: 'process',
        x: 680,
        y: 280,
        description: 'Formation of a mature haploid ovum from oogonia. Initiated during embryonic development before birth and arrested at Prophase I until puberty, then completed only upon sperm entry.',
        tamilDescription: 'கரு உருவான பருவத்திலேயே தொடங்கும் அண்ட உருவாக்கம். முதன்மை அண்ட செல் புரோபேஸ் I நிலையில் நின்று, பூப்படைந்த பின் மாதந்தோறும் முதிர்ச்சியடைகிறது.',
        keyExamPoints: [
          'Produces 1 functional large ovum and 3 non-functional polar bodies to conserve cytoplasm.',
          'Meiosis II is completed only when sperm penetrates the secondary oocyte, releasing the second polar body.',
          'Primary oocytes surrounded by granulosa cells form primary, secondary, and tertiary Graafian follicles.',
        ],
        connections: ['menstrual_cycle', 'fertilization'],
      },
      {
        id: 'male_hormones',
        label: 'Hormonal Control (Male)',
        tamilLabel: 'ஆண் ஹார்மோன் கட்டுப்பாடு',
        category: 'hormone',
        x: 230,
        y: 420,
        description: 'Hypothalamic GnRH stimulates anterior pituitary to secrete LH (ICSH) and FSH. LH acts on Leydig cells to stimulate testosterone; FSH acts on Sertoli cells for spermiogenesis.',
        tamilDescription: 'ஹைப்போதாலமஸின் GnRH பிட்யூட்டரியைத் தூண்டி LH மற்றும் FSH சுரக்கச் செய்கிறது. LH லீடிக் செல்களையும், FSH செர்டோலி செல்களையும் கட்டுப்படுத்துகிறது.',
        keyExamPoints: [
          'Negative feedback loop: High testosterone inhibits GnRH and LH secretion.',
          'Inhibin secreted by Sertoli cells selectively suppresses anterior pituitary FSH release.',
        ],
        connections: ['spermatogenesis'],
      },
      {
        id: 'female_hormones',
        label: 'Hormonal Control (Female)',
        tamilLabel: 'பெண் ஹார்மோன் கட்டுப்பாடு',
        category: 'hormone',
        x: 570,
        y: 420,
        description: 'Coordinated feedback between GnRH, FSH, LH, Estrogen, and Progesterone. LH surge triggers ovulation; Corpus luteum secretes high progesterone to maintain secretory endometrium.',
        tamilDescription: 'FSH நுண்பை வளர்ச்சியைத் தூண்டுகிறது; LH அலைவு (LH surge) அண்ட விடுபடுதலைத் தூண்டுகிறது; கார்ப்பஸ் லூட்டியம் புரோஜெஸ்டிரோனைச் சுரக்கிறது.',
        keyExamPoints: [
          'LH surge occurs at Day 14 of 28-day cycle, precipitating rupture of Graafian follicle and ovulation.',
          'Progesterone drops if fertilization does not occur, leading to menstrual sloughing of endometrium.',
        ],
        connections: ['menstrual_cycle', 'pregnancy'],
      },
      {
        id: 'menstrual_cycle',
        label: 'Menstrual Cycle',
        tamilLabel: 'மாதவிடாய் சுழற்சி',
        category: 'process',
        x: 400,
        y: 210,
        description: '28-day cyclical reproductive sequence divided into: 1. Menstrual phase (Days 1-5), 2. Follicular/Proliferative phase (Days 6-13), 3. Ovulatory phase (Day 14), 4. Luteal/Secretory phase (Days 15-28).',
        tamilDescription: 'மாதவிடாய் கட்டம் (1-5 நாட்கள்), நுண்பை கட்டம் (6-13 நாட்கள்), அண்ட விடுபடு கட்டம் (14-வது நாள்), லூட்டியல் கட்டம் (15-28 நாட்கள்).',
        keyExamPoints: [
          'Estrogen reaches peak just before ovulation, stimulating endometrial regeneration.',
          'Progesterone thickens uterine glands into secretory state, preparing for embryonic implantation.',
        ],
        connections: ['female_hormones', 'fertilization'],
      },
      {
        id: 'sperm_anatomy',
        label: 'Human Sperm Structure',
        tamilLabel: 'மனித விந்துவின் அமைப்பு',
        category: 'anatomy',
        x: 100,
        y: 460,
        description: 'Microscopic motile cell with 4 distinct regions: Head (condensed haploid nucleus capped by Acrosome rich in hyaluronidase), Neck with centrioles, Middle piece with spiral mitochondria, and Tail (flagellum).',
        tamilDescription: 'தலை (அக்ரோசோம் மற்றும் உட்கரு), கழுத்து, நடுப்பகுதி (சுருள் மைட்டோகாண்ட்ரியாக்கள் - நெபன்கெர்ன்), மற்றும் வால் பகுதி.',
        keyExamPoints: [
          'Acrosome derived from Golgi apparatus contains proteolytic enzymes (hyaluronidase, corona penetrating enzyme).',
          'Mitochondrial spiral (Nebenkern) produces ATP powering flagellar propulsion.',
        ],
        connections: ['spermatogenesis', 'fertilization'],
      },
      {
        id: 'fertilization',
        label: 'Fertilization & Implantation',
        tamilLabel: 'கருவுறுதல் மற்றும் பதித்தல்',
        category: 'process',
        x: 400,
        y: 350,
        description: 'Fusion of haploid sperm with secondary oocyte at the ampulla. Triggers cortical reaction preventing polyspermy. Zygote undergoes cleavage to form morula and blastocyst (which implants at day 6-7).',
        tamilDescription: 'ஆம்புல்லா பகுதியில் விந்தணு அண்டத்தோடு இணைகிறது. பல விந்து ஊடுருவலை தடுக்கும் கார்டிகல் வினை. பிளாஸ்டோசிஸ்ட் கருப்பையில் பதித்தல்.',
        keyExamPoints: [
          'Zona pellucida block / cortical reaction ensures strictly monospermic fertilization.',
          'Trophoblast layer forms chorionic villi leading to placenta; inner cell mass (ICM) develops into embryo.',
        ],
        connections: ['pregnancy'],
      },
      {
        id: 'pregnancy',
        label: 'Embryogenesis & Parturition',
        tamilLabel: 'கரு வளர்ச்சி மற்றும் மகப்பேறு',
        category: 'exam',
        x: 400,
        y: 480,
        description: 'Gestation period of 280 days. Placenta acts as endocrine gland secreting hCG, hPL, estrogen, and progesterone. Parturition is neuroendocrine reflex (Ferguson reflex) induced by oxytocin.',
        tamilDescription: 'கருக்காலம் 280 நாட்கள். நஞ்சுக்கொடி hCG, hPL ஹார்மோன்களைச் சுரக்கிறது. ஆக்ஸிடோசின் ஹார்மோன் மூலம் கருப்பை சுருங்கி குழந்தை பிறப்பு தூண்டப்படுகிறது.',
        keyExamPoints: [
          'hCG (Human Chorionic Gonadotropin) maintains corpus luteum and is diagnostic marker in urine pregnancy tests.',
          'Colostrum: First milk secreted postpartum, richly packed with IgA antibodies providing passive immunity.',
        ],
        connections: ['fertilization'],
      },
    ],
  },

  // 2. Plant Reproduction (Botany Chapter 1)
  plant_reproduction: {
    rootLabel: 'Reproduction in Plants',
    rootTamil: 'தாவரங்களில் இனப்பெருக்கம்',
    nodes: [
      {
        id: 'flower_whorls',
        label: 'Flower Morphology & Whorls',
        tamilLabel: 'மலரின் அடுக்குகள்',
        category: 'anatomy',
        x: 180,
        y: 120,
        description: 'Modified shoot specialized for sexual reproduction. Non-essential whorls: Calyx (sepals) and Corolla (petals). Essential reproductive whorls: Androecium (stamens) and Gynoecium (carpels).',
        tamilDescription: 'இனப்பெருக்கத்திற்கான மாறுபாடடைந்த தண்டு. புல்லி வட்டம், அல்லி வட்டம், மகரந்தத்தாள் வட்டம் மற்றும் சூலக வட்டம்.',
        keyExamPoints: [
          'Stamen consists of filament and 2-lobed anther (dithecous and tetrasporangiate).',
          'Carpel consists of stigma (receptive surface), style, and basal ovary housing ovules.',
        ],
        connections: ['anther_anatomy', 'ovule_anatomy'],
      },
      {
        id: 'anther_anatomy',
        label: 'Anther Structure (T.S.)',
        tamilLabel: 'மகரந்தப்பை குறுக்குவெட்டு',
        category: 'anatomy',
        x: 140,
        y: 280,
        description: 'Four wall layers: Epidermis, Endothecium (hygroscopic fibrous bands for dehiscence), Middle layers (ephemeral), and Tapetum (innermost nutritive layer).',
        tamilDescription: 'புறத்தோல், எண்டோதீசியம் (நார்கூடிய பட்டைகள் - வெடித்தல்), இடை அடுக்குகள், மற்றும் டபீட்டம் (வளரும் நுண்வித்துகளுக்கு ஊட்டமளிக்கும் உட்கூடு).',
        keyExamPoints: [
          'Tapetum secretes Ubisch bodies (sporopollenin granules) and pollenkitt in insect-pollinated flowers.',
          'Sporogenous tissue in each microsporangium undergoes meiosis to form haploid microspore tetrads.',
        ],
        connections: ['microsporogenesis'],
      },
      {
        id: 'ovule_anatomy',
        label: 'Anatropous Ovule (Megasporangium)',
        tamilLabel: 'தலைகீழ் சூழ் அமைப்பு',
        category: 'anatomy',
        x: 620,
        y: 140,
        description: 'Body of ovule inverted completely so micropyle lies close to funiculus (stalk). Consists of funiculus, hilum, chalaza, nucellus, inner/outer integuments, and embryo sac.',
        tamilDescription: 'சூல்காம்பு, தழும்பு, சலாசா, சூழ்திசு, சூல்உறைகள், சூழ் துளை (மைக்ரோபைல்) மற்றும் கருப்பை.',
        keyExamPoints: [
          'Most common ovule type (82% of angiosperm families).',
          'Chalaza: Basal tissue where integuments and nucellus merge.',
          'Micropyle: Pore left by integuments where pollen tube typically enters during porogamy.',
        ],
        connections: ['megasporogenesis', 'embryo_sac'],
      },
      {
        id: 'microsporogenesis',
        label: 'Microsporogenesis & Pollen',
        tamilLabel: 'நுண்வித்து உருவாக்கம் மற்றும் மகரந்தம்',
        category: 'process',
        x: 180,
        y: 430,
        description: 'Diploid microspore mother cells (MMC) undergo meiosis forming 4 haploid microspores. Mature pollen grain has outer exine (sporopollenin) with germ pores, inner intine (pectocellulose), vegetative cell and generative cell.',
        tamilDescription: 'நுண்வித்து தாய் செல் மியாசிஸ் பகுப்படைந்து மகரந்த துகள்களாக மாறுகிறது. எக்ஸைன் (ஸ்போரோபொல்லனின்) மற்றும் இன்டைன் அடுக்குகள்.',
        keyExamPoints: [
          'Sporopollenin is one of the most resistant organic substances known, unaffected by strong acids, alkalis, and enzymes.',
          'Generative cell divides into 2 male gametes either before shedding or within the growing pollen tube.',
        ],
        connections: ['pollination'],
      },
      {
        id: 'megasporogenesis',
        label: 'Megasporogenesis',
        tamilLabel: 'பெருவித்து உருவாக்கம்',
        category: 'process',
        x: 640,
        y: 300,
        description: 'Single diploid megaspore mother cell in the hypodermal nucellus undergoes meiosis to produce a linear tetrad of 4 megaspores. 3 degenerate; 1 chalazal megaspore remains functional (Monosporic development).',
        tamilDescription: 'பெருவித்து தாய் செல் மியாசிஸ் மூலம் 4 பெருவித்துகளை உருவாக்குகிறது. 3 சிதைந்து, சலாசா முனை பெருவித்து மட்டும் செயல்படும் பெருவித்தாகிறது.',
        keyExamPoints: [
          'Monosporic Polygonum type: Derived from 1 chalazal functional megaspore through 3 successive mitotic divisions.',
        ],
        connections: ['embryo_sac'],
      },
      {
        id: 'embryo_sac',
        label: 'Mature Female Gametophyte (7-celled, 8-nucleate)',
        tamilLabel: 'முதிர்ந்த கருப்பை அமைப்பு',
        category: 'exam',
        x: 620,
        y: 450,
        description: 'Organization: Egg apparatus at micropylar end (1 egg cell + 2 synergids with filiform apparatus), 3 antipodal cells at chalazal end, and large central cell with 2 polar nuclei.',
        tamilDescription: 'மைக்ரோபைல் முனையில் முட்டை சாதனம் (1 முட்டை + 2 சினர்ஜிட்கள்), சலாசா முனையில் 3 எதிர்பாத செல்கள், நடுவில் இரு துருவ உட்கருக்கள்.',
        keyExamPoints: [
          'Filiform apparatus: Finger-like wall ingrowths in synergids that guide pollen tube entry.',
          'Central cell contains 2 haploid polar nuclei that fuse prior to fertilization to form secondary nucleus (2n).',
        ],
        connections: ['double_fertilization'],
      },
      {
        id: 'pollination',
        label: 'Pollination Mechanisms',
        tamilLabel: 'மகரந்தச்சேர்க்கை முறைகள்',
        category: 'process',
        x: 380,
        y: 200,
        description: 'Transfer of pollen grains from anther to stigma. Autogamy (same flower), Geitonogamy (different flowers on same plant), and Xenogamy / Allogamy (cross-pollination between separate plants).',
        tamilDescription: 'தன் மகரந்தச்சேர்க்கை (ஆட்டோகேமி), கெய்டனோகேமி மற்றும் அயல் மகரந்தச்சேர்க்கை (செனோகேமி). காற்று (அனிமோபிலி), பூச்சிகள் (என்டமோபிலி).',
        keyExamPoints: [
          'Contrivances for cross-pollination: Dicliny, Dichogamy (Protandry/Protogyny), Herkogamy, Heterostyly.',
        ],
        connections: ['double_fertilization'],
      },
      {
        id: 'double_fertilization',
        label: 'Double Fertilization & Triple Fusion',
        tamilLabel: 'இரட்டை கருவுறுதல் மற்றும் மூவிணைவு',
        category: 'exam',
        x: 400,
        y: 380,
        description: 'Unique hallmark of Angiosperms discovered by S.G. Nawaschin (1898): 1st male gamete (n) + Egg (n) → Zygote (2n / Syngamy); 2nd male gamete (n) + Secondary nucleus (2n) → Primary Endosperm Nucleus (3n / Triple Fusion).',
        tamilDescription: 'நவாஷின் கண்டுபிடிப்பு: முதல் விந்தணு முட்டையுடன் இணைந்து கருவை (2n) தருகிறது; இரண்டாவது விந்தணு துருவ உட்கருவுடன் இணைந்து எண்டோஸ்பெர்ம் (3n) தருகிறது.',
        keyExamPoints: [
          'Triploid (3n) endosperm serves as nutritive tissue for developing embryo.',
          'Post-fertilization changes: Ovary becomes Fruit, Ovules become Seeds, Integuments form Seed Coat (Testa and Tegmen).',
        ],
        connections: ['apomixis'],
      },
      {
        id: 'apomixis',
        label: 'Apomixis & Polyembryony',
        tamilLabel: 'அபோமிக்ஸிஸ் மற்றும் பல்கருநிலை',
        category: 'exam',
        x: 400,
        y: 500,
        description: 'Asexual replacement of normal sexual reproduction without fertilization. Polyembryony: Occurrence of more than one embryo in a seed (e.g. Citrus, Mangifera), described by Leeuwenhoek.',
        tamilDescription: 'கருவுறுதல் இன்றி விதை உருவாகும் செயல்முறை (அபோமிக்ஸிஸ்). ஒரே விதையில் பல கருக்கள் தோன்றுதல் (பல்கருநிலை - சிட்ரஸ், மாங்காய்).',
        keyExamPoints: [
          'Adventive embryony: Embryos arise directly from diploid maternal nucellar or integument cells.',
          'Parthenocarpy: Development of fruit without fertilization (seedless fruits like banana).',
        ],
        connections: ['double_fertilization'],
      },
    ],
  },
};

export const BiologyConceptMindMap: React.FC<BiologyConceptMindMapProps> = ({
  topicTitle,
  topicNumber,
  subjectId,
  onAskAI,
  className = '',
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Select appropriate dataset based on topic title or subject
  const currentMap = useMemo(() => {
    const title = (topicTitle || '').toLowerCase();
    const sub = (subjectId || '').toLowerCase();
    if (title.includes('plant') || title.includes('botany') || title.includes('ovule') || title.includes('anther') || sub.includes('botany')) {
      return TOPIC_MINDMAPS.plant_reproduction;
    }
    return TOPIC_MINDMAPS.human_reproduction;
  }, [topicTitle, subjectId]);

  const activeNode = useMemo(() => {
    return currentMap.nodes.find((n) => n.id === selectedNodeId) || null;
  }, [currentMap, selectedNodeId]);

  // Filter nodes based on category selector
  const visibleNodes = useMemo(() => {
    if (activeCategory === 'all') return currentMap.nodes;
    return currentMap.nodes.filter((n) => n.category === activeCategory);
  }, [currentMap, activeCategory]);

  // Compute connections as Bezier curves
  const connectionPaths = useMemo(() => {
    const paths: Array<{ id: string; d: string; from: MindMapNode; to: MindMapNode; isHighlighted: boolean }> = [];
    const nodeMap = new Map(currentMap.nodes.map((n) => [n.id, n]));

    currentMap.nodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const target = nodeMap.get(targetId);
        if (target) {
          // Prevent duplicates by ensuring node.id < targetId
          if (node.id < target.id) {
            const dx = target.x - node.x;
            const dy = target.y - node.y;
            // Bezier control points
            const cx1 = node.x + dx * 0.4;
            const cy1 = node.y;
            const cx2 = target.x - dx * 0.4;
            const cy2 = target.y;

            const isHighlighted =
              selectedNodeId === node.id || selectedNodeId === target.id;

            paths.push({
              id: `${node.id}-${target.id}`,
              d: `M ${node.x} ${node.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${target.x} ${target.y}`,
              from: node,
              to: target,
              isHighlighted,
            });
          }
        }
      });
    });

    return paths;
  }, [currentMap, selectedNodeId]);

  // Category color tokens matching 60-30-10 palette
  const getCategoryStyles = (category: MindMapNode['category']) => {
    switch (category) {
      case 'anatomy':
        return {
          fill: '#ecfdf5',
          stroke: '#10b981',
          text: '#064e3b',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'process':
        return {
          fill: '#eff6ff',
          stroke: '#3b82f6',
          text: '#1e3a8a',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'hormone':
        return {
          fill: '#fef3c7',
          stroke: '#f59e0b',
          text: '#78350f',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'exam':
        return {
          fill: '#fdf2f8',
          stroke: '#ec4899',
          text: '#831843',
          badge: 'bg-pink-100 text-pink-800 border-pink-200',
        };
      default:
        return {
          fill: '#f8fafc',
          stroke: '#64748b',
          text: '#0f172a',
          badge: 'bg-slate-100 text-slate-800 border-slate-200',
        };
    }
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 1.8));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.6));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNodeId(null);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag when clicking canvas background, not on a node
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'mindmap-bg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`relative w-full rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-[#f9fcf9] via-[#ffffff] to-[#f4f7f5] overflow-hidden shadow-xs select-none ${className}`}
    >
      {/* Header Bar: Title, Category Filters, and Zoom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white/90 border-b border-emerald-100/80 backdrop-blur-sm z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Layers size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {currentMap.rootLabel} Concept Mindmap
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {currentMap.rootTamil}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Interactive structural relationship tree · Click any node to inspect syllabus facts
            </p>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'anatomy', label: 'Anatomy' },
            { id: 'process', label: 'Processes' },
            { id: 'hormone', label: 'Hormones' },
            { id: 'exam', label: 'Board 5-Mark' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in mindmap"
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out mindmap"
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset zoom and position"
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div
        className="w-full h-[400px] sm:h-[460px] relative overflow-hidden cursor-grab active:cursor-grabbing bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg
          id="mindmap-bg"
          viewBox="0 0 800 580"
          className="w-full h-full transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Connection Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Arrow Marker */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Background Connector Lines */}
          <g className="connections">
            {connectionPaths.map((p) => (
              <path
                key={p.id}
                d={p.d}
                fill="none"
                stroke={p.isHighlighted ? '#059669' : '#cbd5e1'}
                strokeWidth={p.isHighlighted ? 3 : 1.5}
                strokeDasharray={p.isHighlighted ? '6 3' : 'none'}
                className={p.isHighlighted ? 'animate-pulse' : 'transition-all'}
                opacity={activeCategory === 'all' || p.from.category === activeCategory || p.to.category === activeCategory ? 0.9 : 0.2}
              />
            ))}
          </g>

          {/* Central Root Anchor */}
          <g transform="translate(400, 40)">
            <rect
              x="-110"
              y="-20"
              width="220"
              height="40"
              rx="12"
              fill="#144738"
              className="shadow-md"
            />
            <text
              textAnchor="middle"
              y="5"
              fill="#ffffff"
              fontSize="13"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              {currentMap.rootLabel}
            </text>
          </g>

          {/* Interactive Nodes */}
          <g className="nodes">
            {visibleNodes.map((node) => {
              const styles = getCategoryStyles(node.category);
              const isSelected = selectedNodeId === node.id;
              const isHighlighted = isSelected;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <rect
                      x="-85"
                      y="-29"
                      width="170"
                      height="58"
                      rx="14"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Rect Card */}
                  <rect
                    x="-80"
                    y="-24"
                    width="160"
                    height="48"
                    rx="10"
                    fill={styles.fill}
                    stroke={isSelected ? styles.stroke : '#e2e8f0'}
                    strokeWidth={isSelected ? 2 : 1}
                    className="transition-all duration-200 group-hover:stroke-emerald-600 shadow-2xs"
                  />

                  {/* Node Category Dot */}
                  <circle
                    cx="-66"
                    cy="0"
                    r="4"
                    fill={styles.stroke}
                  />

                  {/* Node Label Text */}
                  <text
                    x="-54"
                    y="-4"
                    fill={styles.text}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    className="select-none"
                  >
                    {node.label.length > 18 ? node.label.slice(0, 17) + '…' : node.label}
                  </text>

                  {/* Tamil Subtitle */}
                  <text
                    x="-54"
                    y="12"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="sans-serif"
                    className="select-none"
                  >
                    {node.tamilLabel.length > 20 ? node.tamilLabel.slice(0, 19) + '…' : node.tamilLabel}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected Node Details Drawer / Popover */}
        {activeNode && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-96 bg-white/95 backdrop-blur-md border border-emerald-300 rounded-2xl p-4 shadow-xl z-20 space-y-3 animate-slide-up">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <span
                  className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${
                    getCategoryStyles(activeNode.category).badge
                  }`}
                >
                  {activeNode.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 leading-snug">
                  {activeNode.label}
                </h4>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">
                  {activeNode.tamilLabel}
                </p>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                aria-label="Close detail pane"
                className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Explanation Prose */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="leading-relaxed">{activeNode.description}</p>
              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                {activeNode.tamilDescription}
              </p>
            </div>

            {/* High-Yield Exam Points */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-amber-600" />
                <span>Class 12 Public Exam & NEET High-Yield:</span>
              </span>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                {activeNode.keyExamPoints.map((pt, i) => (
                  <li key={i} className="leading-normal">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct AI Tutor Hook */}
            {onAskAI && (
              <button
                type="button"
                onClick={() =>
                  onAskAI({
                    subjectTitle: subjectId === 'bio-botany' ? 'Bio-Botany' : 'Bio-Zoology',
                    topicTitle: activeNode.label,
                    initialMessage: `Please explain ${activeNode.label} (${activeNode.tamilLabel}) and its importance in Class 12 board exams with key anatomical terms.`,
                  })
                }
                className="w-full py-1.5 px-3 rounded-xl bg-[#144738] hover:bg-[#1a5b48] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles size={13} className="text-amber-300" />
                <span>Ask Prof. SPK about {activeNode.label}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <span>💡 Click any node to read board-exam takeaways or drag to explore map</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Anatomy
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Process
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Hormone
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-pink-500" /> Board 5-Mark
          </span>
        </div>
      </div>
    </div>
  );
};
