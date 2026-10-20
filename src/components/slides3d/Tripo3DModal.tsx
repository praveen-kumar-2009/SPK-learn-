import React, { useState } from 'react';
import {
  X,
  Box,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Key,
  Layers,
} from 'lucide-react';
import {
  loadStoredCredentials,
  saveStoredCredentials,
} from '../ai/AIEngineSettingsModal';

interface Tripo3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onLoadGlbModel: (glbUrl: string, previewUrl?: string) => void;
}

const BIOLOGY_3D_SUGGESTIONS = [
  'Anatropous ovule with micropyle, funicle, and female gametophyte embryo sac',
  'Transverse section of mature angiosperm anther with pollen grains',
  'Human spermatozoon cell with acrosome cap, nebenkern mitochondria, and flagellum tail',
  'B-DNA Watson-Crick double helix showing major and minor grooves',
  'Plant chloroplast organelle with thylakoid grana stacks and stroma',
  'Bacteriophage T4 virus with icosahedral capsid head and contractile tail sheath',
  'pBR322 bacterial plasmid circular cloning vector',
  'Antibody IgG Y-shaped immunoglobulin monomer with antigen binding sites',
];

export const Tripo3DModal: React.FC<Tripo3DModalProps> = ({
  isOpen,
  onClose,
  initialPrompt = 'Detailed biological anatomical organ',
  onLoadGlbModel,
}) => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [tripoApiKey, setTripoApiKey] = useState<string>(() => {
    return loadStoredCredentials().tripoApiKey || '';
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    const key = tripoApiKey.trim();
    if (!key) {
      setErrorMsg('Tripo API Key is required. Please enter your Tripo API key from platform.tripo3d.ai');
      return;
    }

    // Save key to local credentials
    const creds = loadStoredCredentials();
    creds.tripoApiKey = key;
    saveStoredCredentials(creds);

    setIsGenerating(true);
    setErrorMsg(null);
    setProgress(5);
    setStatusText('Submitting prompt to Tripo 3D neural mesh generator...');

    try {
      const res = await fetch('/api/ai/tripo/create-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          tripoApiKey: key,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.taskId) {
        setErrorMsg(data.error || 'Failed to initialize Tripo 3D task. Check your API key.');
        setIsGenerating(false);
        return;
      }

      const currentTaskId = data.taskId;
      setTaskId(currentTaskId);
      setStatusText('Task queued in Tripo 3D cluster. Generating biological geometry...');
      setProgress(15);

      // Poll status every 2.5s for up to 3 minutes
      let completed = false;
      let attempts = 0;
      const maxAttempts = 75;

      while (!completed && attempts < maxAttempts) {
        attempts++;
        await new Promise((r) => setTimeout(r, 2500));

        const statusRes = await fetch(`/api/ai/tripo/task-status/${currentTaskId}`, {
          headers: {
            'Authorization': `Bearer ${key}`,
          },
        });

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          const taskProgress = statusData.progress || Math.min(90, 15 + attempts * 3);
          setProgress(taskProgress);

          if (statusData.status === 'success' && statusData.modelUrl) {
            completed = true;
            setProgress(100);
            setStatusText('3D Asset ready! Loading into Three.js studio...');
            onLoadGlbModel(statusData.modelUrl, statusData.renderedImage);
            setTimeout(() => {
              onClose();
            }, 1200);
            return;
          } else if (statusData.status === 'failed') {
            setErrorMsg('Tripo 3D generation task reported a failure. Please try a different prompt.');
            setIsGenerating(false);
            return;
          } else {
            setStatusText(`Synthesizing 3D vertices and materials... (${taskProgress}%)`);
          }
        }
      }

      if (!completed) {
        setErrorMsg('Generation timed out. Tripo 3D task is still processing. Check platform.tripo3d.ai');
        setIsGenerating(false);
      }
    } catch (err: any) {
      setErrorMsg(`Communication error: ${err.message}`);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-800/60 rounded-xl border border-purple-500/40">
              <Box className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Tripo 3D Biological Studio</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-200">
                  AI GLB Mesh
                </span>
              </h3>
              <p className="text-xs text-purple-200/80">
                Generate real 3D assets via Tripo API
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-purple-200 hover:text-white rounded-lg hover:bg-purple-800/50 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800">
          {/* API Key field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Key size={13} className="text-purple-600" />
                <span>Tripo API Key</span>
              </label>
              <a
                href="https://platform.tripo3d.ai"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-purple-700 hover:text-purple-950 underline inline-flex items-center gap-1 font-semibold"
              >
                <span>Get API Key</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <input
              type="password"
              value={tripoApiKey}
              onChange={(e) => setTripoApiKey(e.target.value)}
              placeholder="Enter your Tripo 3D API key (e.g. tsk_...)"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-slate-800"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Key is stored securely in your local browser storage for future generations.
            </p>
          </div>

          {/* Biological Prompt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              3D Biological Model Prompt:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-medium text-slate-800"
              placeholder="Describe the 3D biological structure..."
            />
          </div>

          {/* Prompt Suggestions */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Suggested Class 12 Biology Specimens:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {BIOLOGY_3D_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(sug)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-950 border border-slate-200 text-slate-700 text-left transition-colors cursor-pointer"
                >
                  {sug.slice(0, 42)}...
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Progress Indicator */}
          {isGenerating && (
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/70 space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-950 flex items-center gap-1.5">
                  <RefreshCw size={13} className="text-purple-600 animate-spin" />
                  <span>{statusText}</span>
                </span>
                <span className="font-mono font-bold text-purple-800">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-purple-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-purple-700">
                Tripo 3D neural network is generating geometry, normal maps, and PBR textures.
              </p>
            </div>
          )}
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

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="text-xs font-bold px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white disabled:opacity-50 cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles size={14} className="text-purple-300" />
            <span>{isGenerating ? 'Synthesizing 3D Model...' : 'Generate 3D Model with Tripo AI'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
