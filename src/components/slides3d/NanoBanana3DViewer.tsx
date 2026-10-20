import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ThreeDModelType } from '../../types/curriculum';
import { Tripo3DModal } from './Tripo3DModal';
import {
  RotateCcw,
  Play,
  Pause,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Camera,
  Eye,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Sliders,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Box,
  RefreshCw,
} from 'lucide-react';

interface NanoBanana3DViewerProps {
  modelType: ThreeDModelType;
  title?: string;
  tamilTitle?: string;
  className?: string;
  interactive?: boolean;
  onSelectPart?: (partName: string, description: string) => void;
  customGlbUrl?: string;
}

interface HotspotItem {
  id: string;
  name: string;
  tamilName?: string;
  description: string;
  position: [number, number, number];
}

const AVAILABLE_MODELS: { type: ThreeDModelType; label: string }[] = [
  { type: 'vegetative_propagule', label: 'Vegetative Propagule & Foliar Buds' },
  { type: 'anther', label: 'T.S. of Mature Anther & Pollen' },
  { type: 'ovule', label: 'Anatropous Ovule & Embryo Sac' },
  { type: 'flower_pollination', label: 'Stigma Pollination & Siphonogamy' },
  { type: 'sperm', label: 'Human Spermatozoon Cell Anatomy' },
  { type: 'human_reproduction', label: 'Female Reproductive Organs' },
  { type: 'dna', label: 'B-DNA Double Helix (Watson-Crick)' },
  { type: 'pbr322', label: 'pBR322 Cloning Vector Plasmid' },
  { type: 'chloroplast', label: 'Chloroplast & Thylakoid Grana' },
  { type: 'mitochondria', label: 'Mitochondria & Cristae' },
  { type: 'bacteriophage', label: 'Bacteriophage T4 Virus' },
  { type: 'neuron', label: 'Multipolar Neuron' },
  { type: 'cell', label: 'Eukaryotic Cell Ultrastructure' },
  { type: 'chromosome', label: 'Metaphase Chromosome' },
];

export const NanoBanana3DViewer: React.FC<NanoBanana3DViewerProps> = ({
  modelType: initialModelType,
  title,
  tamilTitle,
  className = '',
  interactive = true,
  onSelectPart,
  customGlbUrl,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Active model can be overridden by user switcher
  const [currentModelType, setCurrentModelType] = useState<ThreeDModelType>(initialModelType);
  const [activeGlbUrl, setActiveGlbUrl] = useState<string | null>(customGlbUrl || null);
  const [isTripoModalOpen, setIsTripoModalOpen] = useState<boolean>(false);
  const [isLoadingGlb, setIsLoadingGlb] = useState<boolean>(false);

  useEffect(() => {
    setCurrentModelType(initialModelType);
  }, [initialModelType]);

  useEffect(() => {
    if (customGlbUrl) {
      setActiveGlbUrl(customGlbUrl);
    }
  }, [customGlbUrl]);

  // Interaction states
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<HotspotItem | null>(null);
  const [isFullscreenModal, setIsFullscreenModal] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  // Internal animated references with damping
  const animStateRef = useRef({
    time: 0,
    explodeProgress: 0,
    targetExplode: 0,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    rotX: 0.25,
    rotY: 0.45,
    targetRotX: 0.25,
    targetRotY: 0.45,
    distance: 7,
    targetDistance: 7,
  });

  // Hotspots definitions per model type
  const getHotspotsForModel = (type: ThreeDModelType): HotspotItem[] => {
    switch (type) {
      case 'vegetative_propagule':
        return [
          {
            id: 'foliar_bud',
            name: 'Foliar Epiphyllous Bud (Bryophyllum)',
            tamilName: 'இலைமேல் மொட்டு (Bryophyllum)',
            description: 'Adventitious vegetative bud in leaf crenate notches that sprouts roots and grows into an independent clone.',
            position: [1.4, 0.6, 0],
          },
          {
            id: 'stem_node',
            name: 'Stem Node & Axillary Bud',
            tamilName: 'தண்டு கணு மற்றும் கோண மொட்டு',
            description: 'Active meristematic region generating lateral branches, scale leaves, and perennating diaspores.',
            position: [0, 0.4, 0],
          },
          {
            id: 'runner_stolon',
            name: 'Sub-aerial Stolon / Runner',
            tamilName: 'ஓடு தண்டு (Runner / Stolon)',
            description: 'Horizontal prostrate branch with elongated internodes rooting at distant nodes (Fragaria / Centella).',
            position: [-1.4, -1.2, 0.2],
          },
          {
            id: 'adventitious_roots',
            name: 'Adventitious Root Cluster',
            tamilName: 'வேற்றிட வேர்கள்',
            description: 'Fibrous adventitious roots arising from stem nodes ensuring rapid subterranean anchorage and mineral absorption.',
            position: [0, -2.4, 0],
          },
        ];
      case 'flower_pollination':
        return [
          {
            id: 'stigma_papillae',
            name: 'Receptive Stigma & Papillae',
            tamilName: 'சூலக முடி மற்றும் சுரப்பு காம்புகள்',
            description: 'Secretes sugary stigmatic exudates to hydrate compatible pollen and stimulate pollen tube emergence.',
            position: [0, 1.9, 0],
          },
          {
            id: 'germinating_pollen',
            name: 'Germinating Pollen Grain',
            tamilName: 'முளைக்கும் மகரந்தத் துகள்',
            description: 'Exine ruptures at germ pore; cellulosic intine protrudes as chemotropic pollen tube.',
            position: [0.3, 2.1, 0.2],
          },
          {
            id: 'pollen_tube',
            name: 'Chemotropic Pollen Tube (Siphonogamy)',
            tamilName: 'மகரந்தக் குழாய் (Siphonogamy)',
            description: 'Elongating tube traversing style transmitting two haploid male gametes towards the micropyle.',
            position: [0.1, 0.4, 0.1],
          },
          {
            id: 'ovary_chamber',
            name: 'Swollen Ovary with Ovule',
            tamilName: 'சூலக அறை மற்றும் சூல்',
            description: 'Basal chamber housing the female gametophyte; develops into fruit pericarp post-fertilization.',
            position: [0, -1.2, 0],
          },
        ];
      case 'dna':
        return [
          {
            id: 'backbone',
            name: 'Sugar-Phosphate Backbone',
            tamilName: 'சர்க்கரை-பாஸ்பேட் முதுகெலும்பு',
            description: "Composed of alternating deoxyribose sugar and phosphate units joined by 3'-5' phosphodiester bonds.",
            position: [-1.2, 1.5, 0],
          },
          {
            id: 'nitrogenous_bases',
            name: 'Nitrogenous Base Pairs (A=T, G≡C)',
            tamilName: 'நைட்ரஜன் கார இணைகள்',
            description: 'Purines pair specifically with Pyrimidines via Hydrogen bonds: 2 bonds between A & T, 3 bonds between G & C.',
            position: [0, 0, 0],
          },
          {
            id: 'major_groove',
            name: 'Major & Minor Grooves',
            tamilName: 'பெரிய மற்றும் சிறிய பள்ளங்கள்',
            description: 'Spiral indentations where regulatory transcription factors and DNA polymerase interact with nucleotide bases.',
            position: [1.2, -1.2, 0],
          },
        ];
      case 'chloroplast':
        return [
          {
            id: 'envelope',
            name: 'Double Membrane Envelope',
            tamilName: 'இரட்டை சவ்வு உறை',
            description: 'Outer permeable membrane and selectively permeable inner membrane enclosing the stroma.',
            position: [0, 2.2, 0],
          },
          {
            id: 'grana',
            name: 'Thylakoid Grana Stacks',
            tamilName: 'தைலகாய்டு கிரானா அடுக்குகள்',
            description: 'Sites of Light-dependent photochemical reactions, Photosystems I & II, and photophosphorylation.',
            position: [-1, 0, 0.5],
          },
          {
            id: 'stroma',
            name: 'Stroma Matrix',
            tamilName: 'ஸ்ட்ரோமா தளப்பொருள்',
            description: 'Semi-fluid matrix containing RuBisCO, 70S ribosomes, circular cpDNA, and enzymes for the Calvin Cycle.',
            position: [1.2, -0.5, 0],
          },
        ];
      case 'anther':
        return [
          {
            id: 'tapetum',
            name: 'Nutritive Tapetum Layer',
            tamilName: 'உணவூட்ட உறை (டபீட்டம்)',
            description: 'Innermost anther wall layer providing nutrition to developing microspores. Secretes Ubisch bodies and sporopollenin.',
            position: [-1.2, 1, 0.8],
          },
          {
            id: 'pollen_grains',
            name: 'Mature Pollen Grains (Microspores)',
            tamilName: 'முதிர்ந்த மகரந்தத் துகள்கள்',
            description: 'Male gametophytes featuring resilient sculptured Exine (sporopollenin), germ pores, vegetative and generative cells.',
            position: [0, 0, 0],
          },
          {
            id: 'endothecium',
            name: 'Endothecium Fibrous Layer',
            tamilName: 'எண்டோதீசியம் நார்த்தன்மை அடுக்கு',
            description: 'Sub-epidermal layer with hygroscopic alpha-cellulosic fibrous bands aiding anther dehiscence at maturity.',
            position: [1.8, 0.5, 0],
          },
        ];
      case 'ovule':
        return [
          {
            id: 'embryo_sac',
            name: 'Embryo Sac (Female Gametophyte)',
            tamilName: 'கருப்பை (7-செல்கள், 8-உட்கருக்கள்)',
            description: 'Monosporic Polygonum type with Egg apparatus (egg cell + 2 synergids), 2 polar nuclei in central cell, and 3 antipodals.',
            position: [0, 0, 0],
          },
          {
            id: 'integuments',
            name: 'Integuments & Micropyle',
            tamilName: 'சூல் உறைகள் மற்றும் சூல்துளை',
            description: 'Protective coats surrounding nucellus; micropyle provides entry path for pollen tube during siphonogamy.',
            position: [1.3, -1.2, 0],
          },
          {
            id: 'funicle',
            name: 'Funicle & Chalaza',
            tamilName: 'சூல் காம்பு மற்றும் சலாசா',
            description: 'Funicle attaches ovule to placenta; chalaza represents basal region where nucellus and integuments merge.',
            position: [-1.2, 1.6, 0],
          },
        ];
      case 'antibody':
        return [
          {
            id: 'antigen_binding',
            name: 'Antigen Binding Site (Fab Region)',
            tamilName: 'ஆன்டிஜென் பிணைப்பு பகுதி (Fab)',
            description: 'Hypervariable complementarity-determining regions (CDRs) that specifically lock onto antigen epitopes with lock-and-key fit.',
            position: [-1.5, 1.8, 0],
          },
          {
            id: 'heavy_light_chains',
            name: 'Heavy (H) & Light (L) Chains',
            tamilName: 'கனமான (H) மற்றும் இலகுவான (L) சங்கிலிகள்',
            description: 'Formed of 2 identical heavy chains (approx 50 kDa) and 2 identical light chains (approx 25 kDa) in an H2L2 monomer configuration.',
            position: [0, 0, 0],
          },
          {
            id: 'fc_stem',
            name: 'Constant Stem (Fc Region)',
            tamilName: 'நிலையான தண்டு பகுதி (Fc)',
            description: 'Crystallizable fragment responsible for biological effector functions like complement fixation and macrophage Fc receptor binding.',
            position: [0, -1.8, 0],
          },
        ];
      case 'sperm':
        return [
          {
            id: 'acrosome',
            name: 'Acrosome Cap & Nucleus',
            tamilName: 'அக்ரோசோம் தொப்பி மற்றும் உட்கரு',
            description: 'Modified Golgi cap containing hyaluronidase and acrosin (sperm lysins) to penetrate zona pellucida of ovum.',
            position: [-2, 0, 0],
          },
          {
            id: 'mitochondria_spiral',
            name: 'Mitochondrial Spiral (Nebenkern)',
            tamilName: 'சுருள் மைட்டோகாண்ட்ரியா',
            description: 'Packed around axial filament in middle piece, producing copious ATP for vigorous flagellar propulsion.',
            position: [0, 0, 0],
          },
          {
            id: 'flagellum',
            name: 'Axoneme Tail (Flagellum 9+2)',
            tamilName: 'வால் இழை (9+2 மைக்ரோடியூபுல் அமைப்பு)',
            description: 'Central axoneme of 9+2 doublet microtubules driving whiplike undulating motility towards the fallopian ampulla.',
            position: [2.2, 0, 0],
          },
        ];
      case 'pbr322':
        return [
          {
            id: 'ampr',
            name: 'ampR Gene (Ampicillin Resistance)',
            tamilName: 'ஆம்ப்பிசிலின் எதிர்ப்பு மரபணு (ampR)',
            description: 'Selectable marker gene containing restriction cleavage sites for PstI and PvuI.',
            position: [-1.5, 0.8, 0],
          },
          {
            id: 'tetr',
            name: 'tetR Gene (Tetracycline Resistance)',
            tamilName: 'டெட்ராசைக்ளின் எதிர்ப்பு மரபணு (tetR)',
            description: 'Selectable marker gene containing BamHI and SalI sites.',
            position: [1.5, 0.8, 0],
          },
          {
            id: 'ori',
            name: 'ori (Origin of Replication) & rop',
            tamilName: 'இரட்டிப்பாதல் தொடங்கும் இடம் (ori) மற்றும் rop',
            description: 'Specific DNA sequence initiating autonomous replication and controlling high plasmid copy number.',
            position: [0, -1.6, 0],
          },
        ];
      default:
        return [
          {
            id: 'core_organelle',
            name: 'Anatomical Structure',
            tamilName: 'உயிரியல் கட்டமைப்பு',
            description: 'Key structural and physiological unit required for Class 12 Samacheer Kalvi Biology examinations.',
            position: [0, 0, 0],
          },
        ];
    }
  };

  const hotspots = getHotspotsForModel(currentModelType);

  // Initialize and build 3D Scene with Studio Lighting & Ground Contact Shadow
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, animStateRef.current.distance);
    cameraRef.current = camera;

    // 3. Modern Renderer setup with ACESFilmicToneMapping & SRGBColorSpace
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous elements
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Studio Environment Reflection (RoomEnvironment) for cinematic specular highlights
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      const roomEnv = new RoomEnvironment();
      scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    } catch (envErr) {
      console.warn('RoomEnvironment notice:', envErr);
    }

    // Studio 3-Point Warm/Cool Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x1e293b, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 1.6);
    keyLight.position.set(6, 8, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(-6, -4, -6);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0x10b981, 1.0, 15);
    accentLight.position.set(2, 3, 3);
    scene.add(accentLight);

    // 5. Soft Radial Ground Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0,0,0,0.5)');
    grad.addColorStop(0.4, 'rgba(0,0,0,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.6,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.8;
    scene.add(shadowPlane);

    // 6. Main Model Group
    const mainGroup = new THREE.Group();
    groupRef.current = mainGroup;
    scene.add(mainGroup);

    // Build model geometry or load external GLTF/GLB asset
    if (activeGlbUrl) {
      setIsLoadingGlb(true);
      const loader = new GLTFLoader();
      const targetUrl = activeGlbUrl.startsWith('http')
        ? `/api/ai/tripo/proxy-model?url=${encodeURIComponent(activeGlbUrl)}`
        : activeGlbUrl;

      loader.load(
        targetUrl,
        (gltf) => {
          setIsLoadingGlb(false);
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxAxis = Math.max(size.x, size.y, size.z) || 1;
          gltf.scene.position.sub(center);
          gltf.scene.scale.multiplyScalar(4.5 / maxAxis);

          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          mainGroup.add(gltf.scene);
        },
        undefined,
        (err) => {
          console.warn('Tripo GLB load notice, rendering procedural model:', err);
          setIsLoadingGlb(false);
          buildBiologicalModel(mainGroup, currentModelType);
        }
      );
    } else {
      buildBiologicalModel(mainGroup, currentModelType);
    }

    // 7. Handle Resizing
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Render Animation Loop with Exponential Damping
    let lastTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      animStateRef.current.time += delta;

      // Explode progress damping
      const currentExp = animStateRef.current.explodeProgress;
      const targetExp = animStateRef.current.targetExplode;
      animStateRef.current.explodeProgress += (targetExp - currentExp) * 0.1;

      // Auto-rotate
      if (isAutoRotate && !animStateRef.current.isDragging) {
        animStateRef.current.targetRotY += 0.006;
      }

      // Smooth exponential damping for orbit angles
      animStateRef.current.rotX += (animStateRef.current.targetRotX - animStateRef.current.rotX) * 0.12;
      animStateRef.current.rotY += (animStateRef.current.targetRotY - animStateRef.current.rotY) * 0.12;

      // Camera distance damping
      animStateRef.current.distance += (animStateRef.current.targetDistance - animStateRef.current.distance) * 0.15;
      if (camera) {
        camera.position.z = animStateRef.current.distance;
      }

      // Apply rotation to main model group
      if (mainGroup) {
        mainGroup.rotation.x = animStateRef.current.rotX;
        mainGroup.rotation.y = animStateRef.current.rotY;

        // Custom model animations
        animateCustomModel(currentModelType, mainGroup, animStateRef.current.time, animStateRef.current.explodeProgress);
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      disposeScene(scene);
    };
  }, [currentModelType, activeGlbUrl]);

  // Update exploded target
  useEffect(() => {
    animStateRef.current.targetExplode = isExploded ? 1 : 0;
  }, [isExploded]);

  // Update wireframe mode
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = isWireframe));
        } else {
          child.material.wireframe = isWireframe;
        }
      }
    });
  }, [isWireframe]);

  // Mouse / Touch orbit controls
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    animStateRef.current.isDragging = true;
    animStateRef.current.prevMouseX = e.clientX;
    animStateRef.current.prevMouseY = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!animStateRef.current.isDragging) return;
    const deltaX = e.clientX - animStateRef.current.prevMouseX;
    const deltaY = e.clientY - animStateRef.current.prevMouseY;
    animStateRef.current.prevMouseX = e.clientX;
    animStateRef.current.prevMouseY = e.clientY;

    animStateRef.current.targetRotY += deltaX * 0.007;
    animStateRef.current.targetRotX += deltaY * 0.007;
    animStateRef.current.targetRotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, animStateRef.current.targetRotX));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    animStateRef.current.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!interactive) return;
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.005;
    animStateRef.current.targetDistance = Math.max(3.5, Math.min(13, animStateRef.current.targetDistance + zoomDelta));
  };

  const handleZoomIn = () => {
    animStateRef.current.targetDistance = Math.max(3.5, animStateRef.current.targetDistance - 1.2);
  };

  const handleZoomOut = () => {
    animStateRef.current.targetDistance = Math.min(13, animStateRef.current.targetDistance + 1.2);
  };

  const resetView = () => {
    animStateRef.current.targetRotX = 0.25;
    animStateRef.current.targetRotY = 0.45;
    animStateRef.current.targetDistance = 7;
  };

  const takeSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Biological_3D_${currentModelType}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleHotspotClick = (spot: HotspotItem) => {
    setActiveHotspot(spot);
    onSelectPart?.(spot.name, spot.description);
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-inner group select-none ${
        isFullscreenModal ? 'fixed inset-4 z-50 rounded-3xl shadow-2xl border-2 border-emerald-500' : className
      }`}
    >
      {/* Top Header: Static Spec Badge & Model Title & Tripo 3D Generator */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none flex-wrap gap-2">
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-emerald-400 font-bold text-xs shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Interactive 3D Studio</span>
          </div>

          {/* Model Switcher Dropdown */}
          <select
            value={currentModelType}
            onChange={(e) => {
              setCurrentModelType(e.target.value as ThreeDModelType);
              setActiveGlbUrl(null);
            }}
            className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-xs"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.type} value={m.type} className="bg-slate-900 text-slate-100">
                {m.label}
              </option>
            ))}
          </select>

          {/* Tripo 3D AI Button */}
          <button
            type="button"
            onClick={() => setIsTripoModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/90 hover:bg-purple-900 border border-purple-500/60 text-purple-200 hover:text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            title="Generate AI 3D Mesh via Tripo 3D API"
          >
            <Sparkles size={12} className="text-purple-400" />
            <span>Tripo 3D AI</span>
          </button>

          {/* Active Tripo GLB Indicator */}
          {activeGlbUrl && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-900/80 border border-purple-400 text-purple-100 text-xs font-semibold animate-fade-in">
              <Box size={12} className="text-purple-300" />
              <span>Tripo Model Active</span>
              <button
                type="button"
                onClick={() => setActiveGlbUrl(null)}
                className="ml-1 text-[10px] text-purple-300 hover:text-white underline cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Snapshot & Fullscreen in top-right corner */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={takeSnapshot}
            className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Download PNG snapshot"
          >
            <Camera size={13} />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreenModal(!isFullscreenModal)}
            className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isFullscreenModal ? 'Exit Fullscreen' : 'Expand 3D Studio'}
          >
            {isFullscreenModal ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Loading GLB Indicator */}
      {isLoadingGlb && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-xs text-white gap-2 pointer-events-none">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
          <span className="text-xs font-bold text-purple-200">Loading Tripo 3D GLB Model...</span>
        </div>
      )}

      {/* Main 100% Unobstructed WebGL Canvas Mount */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing min-h-[340px]"
      />

      {/* ERGONOMIC UNIFIED BOTTOM CONTROL DOCK (Three.js Constituted Design) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-lg flex flex-col items-center gap-1 pointer-events-auto">
        {/* Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="px-3 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-[10px] font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1 shadow-xs cursor-pointer"
        >
          {isDockCollapsed ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          <span>{isDockCollapsed ? 'Show 3D Controls' : 'Hide Controls (Zen View)'}</span>
        </button>

        {/* The Dock Container */}
        {!isDockCollapsed && (
          <div className="w-full p-2 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl flex flex-col gap-2 animate-fade-in">
            {/* Row 1: Primary Controls */}
            <div className="flex items-center justify-between gap-1 px-1">
              {/* Play / Pause Auto-Rotate */}
              <button
                type="button"
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isAutoRotate ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isAutoRotate ? <Pause size={12} /> : <Play size={12} />}
                <span>{isAutoRotate ? 'Rotating' : 'Paused'}</span>
              </button>

              {/* Explode / Dissect Layers */}
              <button
                type="button"
                onClick={() => setIsExploded(!isExploded)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isExploded ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Layers size={12} />
                <span>{isExploded ? 'Exploded' : 'Dissect'}</span>
              </button>

              {/* Wireframe Toggle */}
              <button
                type="button"
                onClick={() => setIsWireframe(!isWireframe)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isWireframe ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Eye size={12} />
                <span>Wireframe</span>
              </button>

              {/* Zoom Controls & Reset */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn size={12} />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut size={12} />
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Reset Camera"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>

            {/* Row 2: Anatomical Hotspot Pills */}
            {hotspots.length > 0 && (
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 pt-1 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 shrink-0 px-1">
                  Inspect:
                </span>
                {hotspots.map((spot) => (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => handleHotspotClick(spot)}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold shrink-0 cursor-pointer transition-colors ${
                      activeHotspot?.id === spot.id
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {spot.name.split('(')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ACTIVE HOTSPOT ANATOMICAL CARD */}
      {activeHotspot && (
        <div className="absolute top-14 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm z-30 p-3.5 rounded-2xl bg-slate-950/95 border border-emerald-500/70 shadow-2xl text-slate-100 animate-fade-in space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-emerald-400">
                {activeHotspot.name}
              </h4>
              {activeHotspot.tamilName && (
                <p className="text-[11px] font-semibold text-emerald-300">
                  {activeHotspot.tamilName}
                </p>
              )}
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {activeHotspot.description}
          </p>
        </div>
      )}

      {/* Tripo 3D Generator Modal */}
      <Tripo3DModal
        isOpen={isTripoModalOpen}
        onClose={() => setIsTripoModalOpen(false)}
        initialPrompt={title || currentModelType.replace(/_/g, ' ')}
        onLoadGlbModel={(glbUrl) => {
          setActiveGlbUrl(glbUrl);
          setIsTripoModalOpen(false);
        }}
      />
    </div>
  );
};

// ----------------------------------------------------
// THREE.JS 3D MODEL BUILDERS
// ----------------------------------------------------

function buildBiologicalModel(group: THREE.Group, type: ThreeDModelType) {
  switch (type) {
    case 'vegetative_propagule':
      buildVegetativePropagule(group);
      break;
    case 'flower_pollination':
      buildFlowerPollination(group);
      break;
    case 'anther':
      buildAntherCrossSection(group);
      break;
    case 'ovule':
      buildAnatropousOvule(group);
      break;
    case 'sperm':
      buildSpermatozoon(group);
      break;
    case 'human_reproduction':
      buildHumanReproductionModel(group);
      break;
    case 'dna':
      buildDnaHelix(group);
      break;
    case 'pbr322':
      buildPbr322Plasmid(group);
      break;
    case 'chloroplast':
      buildChloroplast(group);
      break;
    case 'mitochondria':
      buildMitochondria(group);
      break;
    case 'bacteriophage':
      buildBacteriophage(group);
      break;
    case 'antibody':
      buildAntibodyIgG(group);
      break;
    case 'neuron':
      buildNeuron(group);
      break;
    case 'cell':
      buildEukaryoticCell(group);
      break;
    case 'chromosome':
      buildMetaphaseChromosome(group);
      break;
    default:
      buildVegetativePropagule(group);
      break;
  }
}

// 1. Vegetative Propagule & Plant Shoot
function buildVegetativePropagule(group: THREE.Group) {
  const plant = new THREE.Group();
  plant.name = 'vegetativePropaguleModel';

  // Primary Silhouette: Main Stem Axis with translucent green cortex
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -2.4, 0),
    new THREE.Vector3(0.08, -1.2, 0),
    new THREE.Vector3(-0.05, 0.4, 0),
    new THREE.Vector3(0, 1.8, 0),
    new THREE.Vector3(0.08, 2.5, 0),
  ]);
  const stemGeo = new THREE.TubeGeometry(stemCurve, 32, 0.22, 16, false);
  const stemMat = new THREE.MeshPhysicalMaterial({
    color: 0x22c55e,
    roughness: 0.35,
    clearcoat: 0.3,
  });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  plant.add(stem);

  // Nodes & Axillary Buds
  const nodePositions = [
    { y: -1.2, x: 0.08 },
    { y: 0.4, x: -0.05 },
    { y: 1.8, x: 0 },
  ];

  nodePositions.forEach((pos, idx) => {
    const nodeRingGeo = new THREE.TorusGeometry(0.25, 0.07, 12, 24);
    const nodeRingMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.4,
    });
    const nodeRing = new THREE.Mesh(nodeRingGeo, nodeRingMat);
    nodeRing.rotation.x = Math.PI / 2;
    nodeRing.position.set(pos.x, pos.y, 0);
    plant.add(nodeRing);

    // Axillary Buds at nodes
    const budGeo = new THREE.ConeGeometry(0.1, 0.28, 8);
    const budMat = new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.3 });
    const bud = new THREE.Mesh(budGeo, budMat);
    bud.position.set(pos.x + (idx % 2 === 0 ? 0.26 : -0.26), pos.y + 0.12, 0);
    bud.rotation.z = idx % 2 === 0 ? -Math.PI / 4 : Math.PI / 4;
    plant.add(bud);
  });

  // Secondary Read: Succulent Bryophyllum Foliar Leaf Blade (at node 2)
  const leafGroup = new THREE.Group();
  leafGroup.position.set(0.2, 0.45, 0);
  leafGroup.rotation.z = -0.2;

  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.bezierCurveTo(0.8, 0.5, 1.8, 0.4, 2.4, 0);
  leafShape.bezierCurveTo(1.8, -0.6, 0.8, -0.5, 0, 0);

  const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
  const leafGeo = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
  const leafMat = new THREE.MeshPhysicalMaterial({
    color: 0x15803d,
    roughness: 0.25,
    clearcoat: 0.5,
  });
  const leafMesh = new THREE.Mesh(leafGeo, leafMat);
  leafMesh.position.set(0, 0, -0.04);
  leafGroup.add(leafMesh);

  // Sprouting Epiphyllous Plantlet on leaf margin
  const plantlet = new THREE.Group();
  plantlet.position.set(1.6, 0.35, 0.08);

  const pStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8);
  const pStemMat = new THREE.MeshStandardMaterial({ color: 0x4ade80 });
  const pStem = new THREE.Mesh(pStemGeo, pStemMat);
  pStem.position.y = 0.25;
  plantlet.add(pStem);

  const pLeafGeo = new THREE.SphereGeometry(0.12, 8, 8);
  pLeafGeo.scale(1.8, 0.6, 0.3);
  const pLeafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
  const pLeaf1 = new THREE.Mesh(pLeafGeo, pLeafMat);
  pLeaf1.position.set(0.16, 0.45, 0);
  pLeaf1.rotation.z = 0.4;
  plantlet.add(pLeaf1);

  const pLeaf2 = new THREE.Mesh(pLeafGeo, pLeafMat);
  pLeaf2.position.set(-0.16, 0.45, 0);
  pLeaf2.rotation.z = -0.4;
  plantlet.add(pLeaf2);

  // Adventitious root hairs dangling from foliar bud
  for (let r = 0; r < 4; r++) {
    const rootCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3((r - 1.5) * 0.08, -0.3, (r % 2) * 0.05),
      new THREE.Vector3((r - 1.5) * 0.12, -0.65, 0),
    ]);
    const rootGeo = new THREE.TubeGeometry(rootCurve, 8, 0.02, 6, false);
    const rootMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 });
    const rootMesh = new THREE.Mesh(rootGeo, rootMat);
    plantlet.add(rootMesh);
  }
  leafGroup.add(plantlet);
  plant.add(leafGroup);

  // Stolon / Runner branching out from lower node
  const stolonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.05, -1.2, 0),
    new THREE.Vector3(-1.0, -1.6, 0.2),
    new THREE.Vector3(-2.2, -2.2, 0.4),
  ]);
  const stolonGeo = new THREE.TubeGeometry(stolonCurve, 20, 0.1, 10, false);
  const stolonMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });
  const stolon = new THREE.Mesh(stolonGeo, stolonMat);
  plant.add(stolon);

  // Subterranean Adventitious Roots at base
  const rootGroup = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const rCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -2.3, 0),
      new THREE.Vector3(Math.cos(angle) * 0.4, -2.6, Math.sin(angle) * 0.4),
      new THREE.Vector3(Math.cos(angle) * 1.0, -2.85, Math.sin(angle) * 1.0),
    ]);
    const rGeo = new THREE.TubeGeometry(rCurve, 12, 0.035, 6, false);
    const rMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
    const rMesh = new THREE.Mesh(rGeo, rMat);
    rootGroup.add(rMesh);
  }
  plant.add(rootGroup);

  group.add(plant);
}

// 2. Flower Pollination & Chemotropic Siphonogamy
function buildFlowerPollination(group: THREE.Group) {
  const model = new THREE.Group();
  model.name = 'flowerPollinationModel';

  // Swollen Ovary (translucent)
  const ovaryGeo = new THREE.SphereGeometry(1.2, 32, 24);
  ovaryGeo.scale(1.0, 1.3, 1.0);
  const ovaryMat = new THREE.MeshPhysicalMaterial({
    color: 0x86efac,
    transparent: true,
    opacity: 0.45,
    roughness: 0.2,
    clearcoat: 0.6,
  });
  const ovary = new THREE.Mesh(ovaryGeo, ovaryMat);
  ovary.position.y = -1.2;
  model.add(ovary);

  // Internal Ovule
  const ovuleGeo = new THREE.SphereGeometry(0.5, 16, 16);
  ovuleGeo.scale(0.8, 1.2, 0.8);
  const ovuleMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xd97706,
    emissiveIntensity: 0.3,
  });
  const ovuleInside = new THREE.Mesh(ovuleGeo, ovuleMat);
  ovuleInside.position.set(0, -1.2, 0);
  model.add(ovuleInside);

  // Style Column
  const styleGeo = new THREE.CylinderGeometry(0.18, 0.22, 2.6, 20);
  const styleMat = new THREE.MeshPhysicalMaterial({
    color: 0x4ade80,
    roughness: 0.3,
    clearcoat: 0.4,
  });
  const style = new THREE.Mesh(styleGeo, styleMat);
  style.position.y = 0.5;
  model.add(style);

  // 3-Lobed Stigma Head
  const stigmaGroup = new THREE.Group();
  stigmaGroup.position.y = 1.8;
  for (let s = 0; s < 3; s++) {
    const sAngle = (s / 3) * Math.PI * 2;
    const lobeGeo = new THREE.SphereGeometry(0.35, 16, 16);
    lobeGeo.scale(1.2, 0.7, 0.9);
    const lobeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });
    const lobe = new THREE.Mesh(lobeGeo, lobeMat);
    lobe.position.set(Math.cos(sAngle) * 0.35, 0.15, Math.sin(sAngle) * 0.35);
    stigmaGroup.add(lobe);
  }
  model.add(stigmaGroup);

  // Pollen Grains
  const pGeo = new THREE.SphereGeometry(0.14, 12, 12);
  const pMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.25,
    metalness: 0.2,
    emissive: 0xd97706,
    emissiveIntensity: 0.3,
  });
  const p1 = new THREE.Mesh(pGeo, pMat);
  p1.position.set(0.3, 2.1, 0.2);
  model.add(p1);

  // Pollen Tube traversing style into ovary
  const tubeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.3, 2.1, 0.2),
    new THREE.Vector3(0.12, 1.5, 0.05),
    new THREE.Vector3(0.06, 0.6, 0.02),
    new THREE.Vector3(0.02, -0.4, 0.05),
    new THREE.Vector3(0, -1.0, 0.2),
  ]);
  const tubeGeo = new THREE.TubeGeometry(tubeCurve, 32, 0.055, 8, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.5,
  });
  const pollenTube = new THREE.Mesh(tubeGeo, tubeMat);
  model.add(pollenTube);

  group.add(model);
}

// 3. Mature Anther & Pollen Grains
function buildAntherCrossSection(group: THREE.Group) {
  const antherBody = new THREE.Group();
  antherBody.name = 'antherLobes';

  const lobeCoords = [
    [-1.2, 0.9, 0],
    [1.2, 0.9, 0],
    [-1.2, -0.9, 0],
    [1.2, -0.9, 0],
  ];

  lobeCoords.forEach((coord, idx) => {
    const wallGeo = new THREE.TorusGeometry(0.8, 0.28, 16, 28, Math.PI * 1.5);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(coord[0], coord[1], coord[2]);
    wall.rotation.z = idx < 2 ? 0 : Math.PI;
    antherBody.add(wall);

    const tapGeo = new THREE.TorusGeometry(0.68, 0.12, 12, 24, Math.PI * 1.5);
    const tapMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    const tap = new THREE.Mesh(tapGeo, tapMat);
    tap.position.set(coord[0], coord[1], coord[2]);
    tap.rotation.z = idx < 2 ? 0 : Math.PI;
    antherBody.add(tap);

    const chamberGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const chamberMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      transparent: true,
      opacity: 0.6,
    });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.set(coord[0] * 0.7, coord[1] * 0.7, coord[2]);
    antherBody.add(chamber);
  });

  const connGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.2, 16);
  const connMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 });
  const conn = new THREE.Mesh(connGeo, connMat);
  antherBody.add(conn);

  // Pollen Grains
  const pollenGroup = new THREE.Group();
  for (let p = 0; p < 14; p++) {
    const angle = (p / 14) * Math.PI * 2;
    const r = 1.6 + (p % 3) * 0.3;
    const grainSphereGeo = new THREE.SphereGeometry(0.16, 12, 12);
    const grainSphereMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2, metalness: 0.3 });
    const gs = new THREE.Mesh(grainSphereGeo, grainSphereMat);
    gs.position.set(Math.cos(angle) * r, Math.sin(angle) * r, ((p % 5) - 2) * 0.4);
    pollenGroup.add(gs);
  }

  group.add(antherBody);
  group.add(pollenGroup);
}

// 4. Anatropous Ovule
function buildAnatropousOvule(group: THREE.Group) {
  const ovule = new THREE.Group();

  // Curved Body (Inverted 180 degrees)
  const bodyGeo = new THREE.SphereGeometry(1.4, 32, 24);
  bodyGeo.scale(0.85, 1.4, 0.85);
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.5,
    roughness: 0.25,
    clearcoat: 0.5,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.position.set(0.3, 0.2, 0);
  ovule.add(bodyMesh);

  // Funicle Stalk
  const funicleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.2, -2.4, 0),
    new THREE.Vector3(-1.1, -1.0, 0),
    new THREE.Vector3(-0.9, 0.8, 0),
    new THREE.Vector3(-0.2, 1.8, 0),
  ]);
  const funicleGeo = new THREE.TubeGeometry(funicleCurve, 32, 0.16, 12, false);
  const funicleMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 });
  const funicle = new THREE.Mesh(funicleGeo, funicleMat);
  ovule.add(funicle);

  // 7-Celled Embryo Sac
  const sacGeo = new THREE.SphereGeometry(0.65, 24, 24);
  sacGeo.scale(0.8, 1.3, 0.8);
  const sacMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xd97706,
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.85,
  });
  const sac = new THREE.Mesh(sacGeo, sacMat);
  sac.position.set(0.3, 0.2, 0);
  ovule.add(sac);

  // Egg cell & Polar nuclei
  const eggGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const eggMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
  const egg = new THREE.Mesh(eggGeo, eggMat);
  egg.position.set(0.3, -0.4, 0);
  ovule.add(egg);

  group.add(ovule);
}

// 5. Human Spermatozoon Anatomy
function buildSpermatozoon(group: THREE.Group) {
  const sperm = new THREE.Group();

  // Head with Nucleus
  const headGeo = new THREE.SphereGeometry(0.6, 24, 24);
  headGeo.scale(1.4, 0.8, 0.8);
  const headMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.2, clearcoat: 0.6 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.set(-1.4, 0, 0);
  sperm.add(head);

  // Acrosome Cap (Golden amber)
  const acroGeo = new THREE.SphereGeometry(0.48, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  acroGeo.scale(1.4, 0.82, 0.82);
  const acroMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.3 });
  const acro = new THREE.Mesh(acroGeo, acroMat);
  acro.rotation.z = -Math.PI / 2;
  acro.position.set(-1.8, 0, 0);
  sperm.add(acro);

  // Middle Piece with Spiral Mitochondria
  const midGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.5, 16);
  const midMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
  const mid = new THREE.Mesh(midGeo, midMat);
  mid.position.set(-0.2, 0, 0);
  mid.rotation.z = Math.PI / 2;
  sperm.add(mid);

  // Spiral Mitochondrial Helix (Nebenkern)
  const spiralCurve = new THREE.CatmullRomCurve3(
    Array.from({ length: 24 }).map((_, i) => {
      const t = i / 24;
      const angle = t * Math.PI * 6;
      return new THREE.Vector3(-0.9 + t * 1.4, Math.cos(angle) * 0.3, Math.sin(angle) * 0.3);
    })
  );
  const spiralGeo = new THREE.TubeGeometry(spiralCurve, 32, 0.06, 8, false);
  const spiralMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
  const spiralMesh = new THREE.Mesh(spiralGeo, spiralMat);
  sperm.add(spiralMesh);

  // Tail Flagellum
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.55, 0, 0),
    new THREE.Vector3(1.6, 0.3, 0),
    new THREE.Vector3(2.8, -0.3, 0),
    new THREE.Vector3(4.0, 0.1, 0),
  ]);
  const tailGeo = new THREE.TubeGeometry(tailCurve, 32, 0.08, 8, false);
  const tailMat = new THREE.MeshStandardMaterial({ color: 0x7dd3fc });
  const tail = new THREE.Mesh(tailGeo, tailMat);
  sperm.add(tail);

  group.add(sperm);
}

// 6. Female Reproductive Model
function buildHumanReproductionModel(group: THREE.Group) {
  const modelGroup = new THREE.Group();

  // Uterine Body
  const uterusGeo = new THREE.CylinderGeometry(1.2, 0.5, 2.2, 32);
  const uterusMat = new THREE.MeshPhysicalMaterial({
    color: 0xf43f5e,
    roughness: 0.35,
    clearcoat: 0.4,
  });
  const uterus = new THREE.Mesh(uterusGeo, uterusMat);
  uterus.position.y = 0.2;
  modelGroup.add(uterus);

  // Fallopian Tubes (Left & Right)
  const leftTubeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.6, 0.8, 0),
    new THREE.Vector3(-1.5, 1.3, 0),
    new THREE.Vector3(-2.2, 0.6, 0),
  ]);
  const tubeMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 });
  const leftTube = new THREE.Mesh(new THREE.TubeGeometry(leftTubeCurve, 24, 0.14, 12, false), tubeMat);
  modelGroup.add(leftTube);

  const rightTubeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.6, 0.8, 0),
    new THREE.Vector3(1.5, 1.3, 0),
    new THREE.Vector3(2.2, 0.6, 0),
  ]);
  const rightTube = new THREE.Mesh(new THREE.TubeGeometry(rightTubeCurve, 24, 0.14, 12, false), tubeMat);
  modelGroup.add(rightTube);

  // Ovaries
  const ovaryGeo = new THREE.SphereGeometry(0.42, 24, 24);
  const ovaryMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 });
  const leftOvary = new THREE.Mesh(ovaryGeo, ovaryMat);
  leftOvary.position.set(-2.2, 0.1, 0);
  modelGroup.add(leftOvary);

  const rightOvary = new THREE.Mesh(ovaryGeo, ovaryMat);
  rightOvary.position.set(2.2, 0.1, 0);
  modelGroup.add(rightOvary);

  group.add(modelGroup);
}

// 7. DNA Double Helix
function buildDnaHelix(group: THREE.Group) {
  const strandGroup = new THREE.Group();
  const rungsCount = 32;
  const radius = 1.3;
  const height = 5.5;
  const twistRate = Math.PI * 3.2;

  const baseColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b];

  for (let i = 0; i < rungsCount; i++) {
    const t = i / rungsCount;
    const y = (t - 0.5) * height;
    const angle = t * twistRate;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;

    const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const nodeMat1 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const s1 = new THREE.Mesh(nodeGeo, nodeMat1);
    s1.position.set(x1, y, z1);
    strandGroup.add(s1);

    const s2 = new THREE.Mesh(nodeGeo, nodeMat1);
    s2.position.set(x2, y, z2);
    strandGroup.add(s2);

    // Rung connecting bases
    const rungGeo = new THREE.CylinderGeometry(0.06, 0.06, radius * 1.8, 10);
    const rungMat = new THREE.MeshStandardMaterial({ color: baseColors[i % 4], roughness: 0.4 });
    const rung = new THREE.Mesh(rungGeo, rungMat);
    rung.position.set(0, y, 0);
    rung.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x1, 0, z1).normalize());
    strandGroup.add(rung);
  }

  group.add(strandGroup);
}

// 8. pBR322 Plasmid Vector
function buildPbr322Plasmid(group: THREE.Group) {
  const plasmid = new THREE.Group();

  const ringGeo = new THREE.TorusGeometry(2.0, 0.12, 16, 64);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  plasmid.add(ring);

  // ampR Arc (Green)
  const ampArcGeo = new THREE.TorusGeometry(2.0, 0.16, 16, 32, Math.PI * 0.45);
  const ampMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
  const ampArc = new THREE.Mesh(ampArcGeo, ampMat);
  ampArc.rotation.z = Math.PI * 0.6;
  plasmid.add(ampArc);

  // tetR Arc (Amber)
  const tetArcGeo = new THREE.TorusGeometry(2.0, 0.16, 16, 32, Math.PI * 0.5);
  const tetMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
  const tetArc = new THREE.Mesh(tetArcGeo, tetMat);
  tetArc.rotation.z = -Math.PI * 0.15;
  plasmid.add(tetArc);

  group.add(plasmid);
}

// 9. Chloroplast with Thylakoid Grana Stacks
function buildChloroplast(group: THREE.Group) {
  const chloro = new THREE.Group();

  const envGeo = new THREE.SphereGeometry(2.2, 32, 24);
  envGeo.scale(1.4, 0.85, 0.85);
  const envMat = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.4,
    roughness: 0.2,
  });
  const env = new THREE.Mesh(envGeo, envMat);
  chloro.add(env);

  // Grana Stacks
  const stackPositions = [
    [-0.8, -0.2, 0],
    [0.6, 0.1, 0],
    [-0.2, 0.3, 0.2],
  ];

  stackPositions.forEach((pos, sIdx) => {
    const stack = new THREE.Group();
    for (let c = 0; c < 5; c++) {
      const discGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16);
      const discMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3 });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.position.y = (c - 2.5) * 0.12;
      stack.add(disc);
    }
    stack.position.set(pos[0], pos[1], pos[2]);
    chloro.add(stack);
  });

  group.add(chloro);
}

// 10. Mitochondria with Cristae
function buildMitochondria(group: THREE.Group) {
  const mito = new THREE.Group();

  const outGeo = new THREE.SphereGeometry(2.2, 32, 24);
  outGeo.scale(1.5, 0.85, 0.85);
  const outMat = new THREE.MeshPhysicalMaterial({
    color: 0xf97316,
    transparent: true,
    opacity: 0.4,
    roughness: 0.2,
  });
  const outer = new THREE.Mesh(outGeo, outMat);
  mito.add(outer);

  // Cristae folds
  for (let c = -4; c <= 4; c++) {
    const cristaGeo = new THREE.BoxGeometry(0.14, 1.2, 1.1);
    const cristaMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });
    const crista = new THREE.Mesh(cristaGeo, cristaMat);
    crista.position.set(c * 0.5, 0, 0);
    mito.add(crista);
  }

  group.add(mito);
}

// 11. Bacteriophage T4
function buildBacteriophage(group: THREE.Group) {
  const phage = new THREE.Group();

  const headGeo = new THREE.IcosahedronGeometry(1.1, 0);
  const headMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3, metalness: 0.3 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 1.6;
  phage.add(head);

  const sheathGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.5, 16);
  const sheathMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.3 });
  const sheath = new THREE.Mesh(sheathGeo, sheathMat);
  sheath.position.y = 0.1;
  phage.add(sheath);

  const plateGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 6);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0x0369a1 });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.y = -0.7;
  phage.add(plate);

  group.add(phage);
}

// 12. Antibody (IgG Monomer)
function buildAntibodyIgG(group: THREE.Group) {
  const ab = new THREE.Group();

  // Y-shape Stem & Arms
  const stemGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.8, 16);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = -0.9;
  ab.add(stem);

  // Left & Right Fab Arms
  const armGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.8, 16);
  const leftArm = new THREE.Mesh(armGeo, stemMat);
  leftArm.position.set(-0.8, 0.6, 0);
  leftArm.rotation.z = Math.PI / 4;
  ab.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, stemMat);
  rightArm.position.set(0.8, 0.6, 0);
  rightArm.rotation.z = -Math.PI / 4;
  ab.add(rightArm);

  // Variable antigen binding tips (Red)
  const tipGeo = new THREE.SphereGeometry(0.24, 12, 12);
  const tipMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
  const leftTip = new THREE.Mesh(tipGeo, tipMat);
  leftTip.position.set(-1.4, 1.3, 0);
  ab.add(leftTip);

  const rightTip = new THREE.Mesh(tipGeo, tipMat);
  rightTip.position.set(1.4, 1.3, 0);
  ab.add(rightTip);

  group.add(ab);
}

// 13. Multipolar Neuron
function buildNeuron(group: THREE.Group) {
  const neuron = new THREE.Group();

  const somaGeo = new THREE.SphereGeometry(0.8, 16, 16);
  const somaMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4 });
  const soma = new THREE.Mesh(somaGeo, somaMat);
  soma.position.set(-1.8, 0, 0);
  neuron.add(soma);

  // Axon
  const axonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.0, 0, 0),
    new THREE.Vector3(0.5, 0, 0),
    new THREE.Vector3(2.0, 0, 0),
  ]);
  const axonGeo = new THREE.TubeGeometry(axonCurve, 20, 0.12, 8, false);
  const axonMat = new THREE.MeshStandardMaterial({ color: 0xa855f7 });
  const axon = new THREE.Mesh(axonGeo, axonMat);
  neuron.add(axon);

  group.add(neuron);
}

// 14. Eukaryotic Cell
function buildEukaryoticCell(group: THREE.Group) {
  const cell = new THREE.Group();

  const wallGeo = new THREE.SphereGeometry(2.3, 32, 24, 0, Math.PI * 1.65, 0, Math.PI);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    roughness: 0.3,
  });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  cell.add(wall);

  const nucGeo = new THREE.SphereGeometry(0.75, 24, 24);
  const nucMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4 });
  const nuc = new THREE.Mesh(nucGeo, nucMat);
  nuc.position.set(-0.8, 0.4, 0.3);
  cell.add(nuc);

  group.add(cell);
}

// 15. Metaphase Chromosome
function buildMetaphaseChromosome(group: THREE.Group) {
  const chromo = new THREE.Group();

  const armMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.4 });
  const makeArm = (length: number, posX: number, posY: number, rotZ: number) => {
    const armGeo = new THREE.CylinderGeometry(0.28, 0.28, length, 16);
    const arm = new THREE.Mesh(armGeo, armMat);
    arm.position.set(posX, posY, 0);
    arm.rotation.z = rotZ;
    return arm;
  };

  chromo.add(makeArm(1.4, -0.3, 0.8, -0.15));
  chromo.add(makeArm(2.1, -0.3, -1.0, 0.15));
  chromo.add(makeArm(1.4, 0.3, 0.8, 0.15));
  chromo.add(makeArm(2.1, 0.3, -1.0, -0.15));

  // Centromere
  const centGeo = new THREE.SphereGeometry(0.32, 16, 16);
  const centMat = new THREE.MeshStandardMaterial({ color: 0x4338ca, roughness: 0.2 });
  const cent = new THREE.Mesh(centGeo, centMat);
  chromo.add(cent);

  group.add(chromo);
}

// Animation per tick
function animateCustomModel(
  type: ThreeDModelType,
  group: THREE.Group,
  time: number,
  explodeProgress: number
) {
  // If exploded, push children outwards
  if (explodeProgress > 0) {
    group.children.forEach((child, idx) => {
      if (child.name !== 'vegetativePropaguleModel') {
        const factor = 1 + explodeProgress * 0.35;
        child.scale.set(factor, factor, factor);
      }
    });
  } else {
    group.children.forEach((child) => {
      child.scale.set(1, 1, 1);
    });
  }
}

// Memory Cleanup Helper
function disposeScene(scene: THREE.Scene) {
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
  });
}
