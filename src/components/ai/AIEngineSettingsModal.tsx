import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Box,
  Image as ImageIcon,
  Save,
  RotateCcw,
} from 'lucide-react';

export interface AIEngineCredentials {
  cloudflareAccountId: string;
  cloudflareApiKey: string;
  aiHordeApiKey: string;
  tripoApiKey: string;
  defaultImageEngine: 'pollinations' | 'cloudflare' | 'aihorde' | 'auto';
  pollinationsModel: 'turbo' | 'flux';
}

export const CREDENTIALS_STORAGE_KEY = 'spk_engine_credentials_v1';

export const DEFAULT_CREDENTIALS: AIEngineCredentials = {
  cloudflareAccountId: '7db978ace55c32f7ae2987cd54fbb05d',
  cloudflareApiKey: 'cfut_dvim7fGlyEBUZCzmLDQ6lJMx06YZCrxhhdTN3XR0a2c0c16c',
  aiHordeApiKey: 'ai_5opwMeWigSAIlQlX28A',
  tripoApiKey: '',
  defaultImageEngine: 'auto',
  pollinationsModel: 'turbo',
};

export function loadStoredCredentials(): AIEngineCredentials {
  try {
    const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CREDENTIALS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load stored credentials:', e);
  }
  return DEFAULT_CREDENTIALS;
}

export function saveStoredCredentials(creds: AIEngineCredentials) {
  try {
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(creds));
  } catch (e) {
    console.warn('Failed to save credentials to localStorage:', e);
  }
}

interface AIEngineSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (creds: AIEngineCredentials) => void;
}

export const AIEngineSettingsModal: React.FC<AIEngineSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [creds, setCreds] = useState<AIEngineCredentials>(loadStoredCredentials);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [testingEngine, setTestingEngine] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ engine: string; success: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCreds(loadStoredCredentials());
      setSaveStatus(null);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredCredentials(creds);
    setSaveStatus('Credentials saved successfully in your local browser!');
    onSaved?.(creds);
    setTimeout(() => {
      setSaveStatus(null);
    }, 2500);
  };

  const handleResetDefaults = () => {
    setCreds(DEFAULT_CREDENTIALS);
    saveStoredCredentials(DEFAULT_CREDENTIALS);
    setSaveStatus('Restored system defaults.');
  };

  const testEngine = async (engine: 'pollinations' | 'cloudflare' | 'aihorde' | 'tripo') => {
    setTestingEngine(engine);
    setTestResult(null);

    try {
      if (engine === 'tripo') {
        const key = creds.tripoApiKey.trim();
        if (!key) {
          setTestResult({
            engine,
            success: false,
            msg: 'Please provide a Tripo API key to test connection.',
          });
          setTestingEngine(null);
          return;
        }

        // Test with a quick task test or status ping
        const res = await fetch('/api/ai/tripo/create-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'simple plant leaf',
            tripoApiKey: key,
          }),
        });
        const data = await res.json();
        if (res.ok && data.taskId) {
          setTestResult({
            engine,
            success: true,
            msg: `Connected to Tripo 3D successfully! Task ID: ${data.taskId}`,
          });
        } else {
          setTestResult({
            engine,
            success: false,
            msg: data.error || 'Failed to authenticate with Tripo 3D.',
          });
        }
      } else {
        // Image engine test
        const res = await fetch('/api/ai/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'simple green chloroplast',
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
        if (res.ok && data.success) {
          setTestResult({
            engine,
            success: true,
            msg: `Success from ${data.provider}! Image generated.`,
          });
        } else {
          setTestResult({
            engine,
            success: false,
            msg: data.error || `Engine returned error status: ${res.status}`,
          });
        }
      }
    } catch (err: any) {
      setTestResult({
        engine,
        success: false,
        msg: `Connection error: ${err.message}`,
      });
    } finally {
      setTestingEngine(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/60 rounded-xl border border-emerald-500/40">
              <Cpu className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>AI Engines & API Credentials</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200">
                  Dual Image & 3D
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80">
                Cloudflare · AI Horde · Free Pollinations · Tripo 3D
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700/50 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-slate-800">
          {saveStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{saveStatus}</span>
            </div>
          )}

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-start gap-2 animate-fade-in ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-amber-50 border-amber-300 text-amber-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold uppercase tracking-wider text-[10px] opacity-80">
                  {testResult.engine} Test Result:
                </span>
                <p>{testResult.msg}</p>
              </div>
            </div>
          )}

          {/* Section 1: Free Image Engine from Pollinations */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>Free Image from Pollinations.ai</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-200 text-emerald-900 rounded-md">
                    No API Key Required
                  </span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => testEngine('pollinations')}
                disabled={testingEngine === 'pollinations'}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                {testingEngine === 'pollinations' ? 'Testing...' : 'Test Free Generation'}
              </button>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Unlimited, high-speed biological textbook illustration generator powered by SDXL Turbo. Always ready out-of-the-box for slide visuals without entering any credentials.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <label className="text-xs font-bold text-slate-700">Model Style:</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCreds({ ...creds, pollinationsModel: 'turbo' })}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                    creds.pollinationsModel === 'turbo'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  SDXL Turbo (Instant)
                </button>
                <button
                  type="button"
                  onClick={() => setCreds({ ...creds, pollinationsModel: 'flux' })}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                    creds.pollinationsModel === 'flux'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  Flux (Ultra-Sharp)
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Cloudflare Workers AI */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h4 className="text-sm font-bold text-slate-900">
                  Cloudflare Workers AI (SDXL Lightning)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => testEngine('cloudflare')}
                disabled={testingEngine === 'cloudflare'}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                {testingEngine === 'cloudflare' ? 'Testing...' : 'Test Cloudflare'}
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Run serverless SDXL on Cloudflare edge GPUs. Pre-configured with server defaults or supply your own Cloudflare account credentials.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cloudflare Account ID
                </label>
                <input
                  type="text"
                  value={creds.cloudflareAccountId}
                  onChange={(e) => setCreds({ ...creds, cloudflareAccountId: e.target.value })}
                  placeholder="e.g. 7db978ace55c32f7ae2987cd54fbb05d"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cloudflare API Key / Token
                </label>
                <input
                  type="password"
                  value={creds.cloudflareApiKey}
                  onChange={(e) => setCreds({ ...creds, cloudflareApiKey: e.target.value })}
                  placeholder="cfut_..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: AI Horde */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h4 className="text-sm font-bold text-slate-900">
                  AI Horde (Crowdsourced GPU Network)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => testEngine('aihorde')}
                disabled={testingEngine === 'aihorde'}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                {testingEngine === 'aihorde' ? 'Testing...' : 'Test AI Horde'}
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Free crowdsourced distributed image generation cluster. Uses default API key or anonymous queue.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                AI Horde API Key (Optional)
              </label>
              <input
                type="text"
                value={creds.aiHordeApiKey}
                onChange={(e) => setCreds({ ...creds, aiHordeApiKey: e.target.value })}
                placeholder="ai_... or leave 0000000000 for anonymous"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Section 4: Tripo 3D API (Text-to-3D Assets) */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
                <h4 className="text-sm font-bold text-purple-950 flex items-center gap-1.5">
                  <Box size={15} />
                  <span>Tripo 3D Assets API</span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => testEngine('tripo')}
                disabled={testingEngine === 'tripo'}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                {testingEngine === 'tripo' ? 'Testing...' : 'Test Tripo 3D'}
              </button>
            </div>
            <p className="text-xs text-purple-900 leading-relaxed">
              Generate native high-definition 3D GLB biological models directly from text descriptions. Models are streamed directly into the 3D WebGL viewer!
            </p>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-purple-950">
                  Tripo API Key
                </label>
                <a
                  href="https://platform.tripo3d.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-purple-700 hover:text-purple-950 underline inline-flex items-center gap-1"
                >
                  <span>Get Tripo Key</span>
                  <ExternalLink size={10} />
                </a>
              </div>
              <input
                type="password"
                value={creds.tripoApiKey}
                onChange={(e) => setCreds({ ...creds, tripoApiKey: e.target.value })}
                placeholder="tsk_... or your Tripo 3D API key"
                className="w-full text-xs px-3 py-2 rounded-lg border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>
          </div>

          {/* Section 5: Default Generation Priority */}
          <div className="p-3 bg-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-800">Default Image Engine Preference:</span>
              <p className="text-slate-500 text-[11px]">Choose which service to try first on slide generation</p>
            </div>
            <select
              value={creds.defaultImageEngine}
              onChange={(e) => setCreds({ ...creds, defaultImageEngine: e.target.value as any })}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 cursor-pointer shadow-2xs"
            >
              <option value="auto">Auto (Pollinations Free & Cloudflare)</option>
              <option value="pollinations">Pollinations.ai (Free Instant)</option>
              <option value="cloudflare">Cloudflare Workers AI (SDXL Lightning)</option>
              <option value="aihorde">AI Horde (Community GPU)</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Save size={13} />
              <span>Save Credentials</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
