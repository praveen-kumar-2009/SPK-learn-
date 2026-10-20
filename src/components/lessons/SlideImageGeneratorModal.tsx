import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Download,
  Image as ImageIcon,
  Check,
  AlertCircle,
  RefreshCw,
  Layers,
  Settings,
  Cpu,
} from 'lucide-react';
import {
  loadStoredCredentials,
  AIEngineCredentials,
} from '../ai/AIEngineSettingsModal';

interface SlideImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  topicNumber?: string;
  subjectTitle?: string;
  onApplyImage: (imageUrl: string) => void;
  onOpenSettings: () => void;
}

export const SlideImageGeneratorModal: React.FC<SlideImageGeneratorModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
  topicNumber,
  subjectTitle,
  onApplyImage,
  onOpenSettings,
}) => {
  const [engine, setEngine] = useState<'pollinations' | 'cloudflare' | 'aihorde' | 'auto'>('auto');
  const [prompt, setPrompt] = useState<string>(() => {
    return `Scientific anatomical textbook plate illustration of ${topicTitle}, detailed biological structures, clean white background, high resolution, published in scientific medical atlas`;
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [providerBadge, setProviderBadge] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    const creds: AIEngineCredentials = loadStoredCredentials();

    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          topicTitle,
          engine,
          credentials: {
            cloudflareAccountId: creds.cloudflareAccountId,
            cloudflareApiKey: creds.cloudflareApiKey,
            aiHordeApiKey: creds.aiHordeApiKey,
          },
          pollinationsModel: creds.pollinationsModel,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setProviderBadge(data.provider || 'AI Engine');
      } else {
        setErrorMsg(data.error || 'Failed to generate image. Please try another engine.');
      }
    } catch (err: any) {
      setErrorMsg(`Generation network error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedImage) {
      onApplyImage(generatedImage);
      onClose();
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `${topicTitle.replace(/\s+/g, '_')}_illustration.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/60 rounded-xl border border-emerald-500/40">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Multi-Engine Image Studio</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200">
                  Slide Visual
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80">
                Pollinations · Cloudflare · AI Horde
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700/50 cursor-pointer transition-colors"
              title="Configure API Keys"
            >
              <Settings size={17} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700/50 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800">
          {/* Engine Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select AI Generation Provider:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setEngine('auto')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  engine === 'auto'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">Auto Engine</div>
                <div className="text-[10px] text-slate-500">Fastest available</div>
              </button>

              <button
                type="button"
                onClick={() => setEngine('pollinations')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  engine === 'pollinations'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <span>Pollinations</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">Free instant SDXL</div>
              </button>

              <button
                type="button"
                onClick={() => setEngine('cloudflare')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  engine === 'cloudflare'
                    ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/30'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold text-amber-950">Cloudflare</div>
                <div className="text-[10px] text-amber-700">SDXL Lightning</div>
              </button>

              <button
                type="button"
                onClick={() => setEngine('aihorde')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  engine === 'aihorde'
                    ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/30'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold text-blue-950">AI Horde</div>
                <div className="text-[10px] text-blue-700">Community GPUs</div>
              </button>
            </div>
          </div>

          {/* Prompt Editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Scientific Prompt:
              </label>
              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    `Scientific anatomical textbook plate illustration of ${topicTitle}, detailed biological structures, clean white background, high resolution, published in scientific medical atlas`
                  )
                }
                className="text-[11px] text-emerald-700 hover:text-emerald-950 underline font-semibold cursor-pointer"
              >
                Reset to Topic Default
              </button>
            </div>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium text-slate-800"
              placeholder="Describe the biological illustration..."
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview Canvas */}
          <div className="border border-slate-200 rounded-2xl bg-slate-50 p-3 min-h-[260px] flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-900">
                    Generating Medical Plate...
                  </span>
                  <p className="text-xs text-slate-500">
                    Routing prompt through {engine === 'auto' ? 'Pollinations & Cloudflare' : engine}...
                  </p>
                </div>
              </div>
            ) : generatedImage ? (
              <div className="w-full flex flex-col items-center gap-2">
                <div className="relative w-full max-h-[300px] overflow-hidden rounded-xl border border-slate-300 bg-white flex items-center justify-center">
                  <img
                    src={generatedImage}
                    alt={topicTitle}
                    className="max-h-[300px] w-auto object-contain rounded-lg shadow-sm"
                  />
                  {providerBadge && (
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                      {providerBadge}
                    </div>
                  )}
                </div>
                <div className="w-full flex items-center justify-between text-xs px-1">
                  <span className="text-emerald-800 font-semibold flex items-center gap-1">
                    <Check size={14} className="text-emerald-600" />
                    <span>Illustration generated successfully</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center text-slate-400 p-6">
                <ImageIcon className="w-10 h-10 text-slate-300" />
                <span className="text-xs font-semibold text-slate-500">
                  Click Generate to synthesize a high-definition anatomical plate for this slide
                </span>
                <span className="text-[11px] text-slate-400">
                  Supports Pollinations (Free), Cloudflare SDXL, and AI Horde
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles size={13} className="text-emerald-400" />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Illustration'}</span>
            </button>

            {generatedImage && (
              <button
                type="button"
                onClick={handleApply}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Check size={14} />
                <span>Set as Slide 1 Image</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
