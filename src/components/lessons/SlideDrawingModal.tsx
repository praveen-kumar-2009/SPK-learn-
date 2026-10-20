import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, RotateCcw, Download, Check, Pen, Sparkles, RefreshCw, Cpu } from 'lucide-react';

interface SlideDrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slideTitle: string;
  topicTitle?: string;
  slideId?: string;
  initialImage?: string;
  onSaveSlideImage?: (imageUrl: string) => void;
}

export const SlideDrawingModal: React.FC<SlideDrawingModalProps> = ({
  isOpen,
  onClose,
  slideTitle,
  topicTitle = '',
  slideId = '',
  initialImage,
  onSaveSlideImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#166534');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [hasSaved, setHasSaved] = useState<boolean>(false);

  // AI Generated Image state
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [providerUsed, setProviderUsed] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [selectedEngine, setSelectedEngine] = useState<'auto' | 'pollinations' | 'cloudflare'>('auto');
  const [showPromptEdit, setShowPromptEdit] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ai_illustration' | 'sketch_canvas'>('ai_illustration');

  // Trigger generation or load image automatically when opened
  useEffect(() => {
    if (!isOpen) return;

    if (initialImage) {
      setGeneratedImage(initialImage);
      setProviderUsed('Medical Atlas Illustration');
      return;
    }

    // Check localStorage cache first
    const cacheKey = `ai_atlas_img_${slideId || slideTitle}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setGeneratedImage(cached);
      setProviderUsed('Verified Biological Atlas Engine');
      return;
    }

    // Auto-generate on open
    generateImageForSlide();
  }, [isOpen, slideTitle, slideId, initialImage]);

  const generateImageForSlide = async (overridePrompt?: string, forceEngine?: 'auto' | 'pollinations' | 'cloudflare') => {
    setIsGenerating(true);
    const engineToUse = forceEngine || selectedEngine;
    const promptToSend =
      overridePrompt ||
      customPrompt ||
      `detailed scientific textbook biological illustration of ${slideTitle}, ${topicTitle}, clear anatomical structures, high resolution, white background`;

    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          topicTitle: topicTitle || slideTitle,
          engine: engineToUse,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setProviderUsed(data.provider || 'Pollinations & Cloudflare SDXL');
        // Save to cache
        const cacheKey = `ai_atlas_img_${slideId || slideTitle}`;
        try {
          localStorage.setItem(cacheKey, data.imageUrl);
        } catch (e) {
          // ignore storage limit
        }
      }
    } catch (err) {
      console.error('Failed to generate slide image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Drawing Canvas setup
  useEffect(() => {
    if (!isOpen || activeTab !== 'sketch_canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white or draw background image if available
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (generatedImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = generatedImage;
    }
  }, [isOpen, activeTab, generatedImage]);

  if (!isOpen) return null;

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? lineWidth * 4 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (generatedImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = generatedImage;
    }
  };

  const saveToSlide = () => {
    let finalImageUrl = generatedImage;

    // If student sketched on the canvas, use the annotated canvas image
    if (activeTab === 'sketch_canvas') {
      const canvas = canvasRef.current;
      if (canvas) {
        finalImageUrl = canvas.toDataURL('image/png');
      }
    }

    if (finalImageUrl && onSaveSlideImage) {
      onSaveSlideImage(finalImageUrl);
      setHasSaved(true);
      setTimeout(() => {
        setHasSaved(false);
        onClose();
      }, 700);
    }
  };

  const downloadImage = () => {
    let url = generatedImage;
    if (activeTab === 'sketch_canvas') {
      const canvas = canvasRef.current;
      if (canvas) url = canvas.toDataURL('image/png');
    }
    if (!url) return;

    const a = document.createElement('a');
    a.href = url;
    a.download = `${slideTitle.replace(/[^a-zA-Z0-9]/g, '_')}_illustration.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-serif font-bold text-lg text-[#144738]">
                Biological Atlas & Drawing Canvas
              </h3>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-md mt-0.5">{slideTitle}</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ai_illustration')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'ai_illustration'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles size={13} className={activeTab === 'ai_illustration' ? 'text-amber-300' : 'text-slate-400'} />
              <span>AI Medical Illustration</span>
            </button>

            <button
              onClick={() => setActiveTab('sketch_canvas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'sketch_canvas'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Pen size={13} className={activeTab === 'sketch_canvas' ? 'text-amber-300' : 'text-slate-400'} />
              <span>Sketch & Annotate</span>
            </button>
          </div>

          <button
            onClick={() => setShowPromptEdit(!showPromptEdit)}
            className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer flex items-center gap-1"
          >
            <RefreshCw size={12} />
            <span>Customize Prompt & Engine</span>
          </button>
        </div>

        {/* Custom Prompt & Engine Bar if expanded */}
        {showPromptEdit && (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shrink-0 animate-fade-in">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={`Describe exact diagram elements (e.g. "detailed cross section of ${slideTitle}")...`}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {/* Engine Selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Cpu size={13} className="text-emerald-700" />
                <span className="font-semibold text-[11px]">Engine:</span>
                <select
                  value={selectedEngine}
                  onChange={(e) => setSelectedEngine(e.target.value as any)}
                  className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
                >
                  <option value="auto">Auto (Pollinations + Cloudflare)</option>
                  <option value="pollinations">Pollinations SDXL Turbo</option>
                  <option value="cloudflare">Cloudflare SDXL Lightning</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => generateImageForSlide()}
                  disabled={isGenerating}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate New Variation'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px] flex flex-col justify-center">
          {activeTab === 'ai_illustration' ? (
            /* AI GENERATED ILLUSTRATION VIEW */
            <div className="relative w-full h-full min-h-[300px] max-h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-2">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-8 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 animate-spin">
                    <RefreshCw size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Synthesizing Biological Illustration</h4>
                    <p className="text-xs text-slate-500 mt-1">Generating high-definition medical atlas diagram...</p>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <img
                    src={generatedImage}
                    alt={slideTitle}
                    className="w-full h-auto max-h-[380px] object-contain rounded-xl select-none"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-slate-700/80 flex items-center gap-1 shadow-md">
                    <Sparkles size={10} className="text-amber-400" />
                    <span>{providerUsed || 'Cloudflare & Pollinations SDXL'}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 space-y-2 text-center">
                  <p className="text-xs text-slate-500">No image generated yet.</p>
                  <button
                    onClick={() => generateImageForSlide()}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Generate Illustration
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* SKETCH & ANNOTATE CANVAS */
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                {/* Color Palette */}
                <div className="flex items-center gap-1.5">
                  {['#166534', '#0284c7', '#dc2626', '#d97706', '#9333ea', '#0f172a'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setColor(c);
                        setIsEraser(false);
                      }}
                      className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                        color === c && !isEraser ? 'scale-125 ring-2 ring-emerald-500' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                {/* Line width */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Size:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(Number(e.target.value))}
                    className="w-20 accent-emerald-700"
                  />
                </div>

                {/* Eraser and Clear */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEraser(!isEraser)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      isEraser ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Eraser size={12} />
                    <span>Eraser</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* HTML5 Canvas */}
              <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-white">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={320}
                  className="w-full h-full touch-none cursor-crosshair"
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerLeave={stopDrawing}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadImage}
              disabled={!generatedImage}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Download size={13} />
              <span>Download Image</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>

            {onSaveSlideImage && (
              <button
                type="button"
                onClick={saveToSlide}
                disabled={!generatedImage || hasSaved}
                className="px-5 py-1.5 rounded-xl bg-[#144738] hover:bg-[#1a5b48] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-40"
              >
                {hasSaved ? (
                  <>
                    <Check size={14} className="text-emerald-300" />
                    <span>Attached to Slide!</span>
                  </>
                ) : (
                  <span>Attach to Slide</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
