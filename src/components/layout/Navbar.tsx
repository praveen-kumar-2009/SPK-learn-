import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Dna,
  Leaf,
  Trophy,
  BarChart2,
  Cpu,
} from 'lucide-react';
import { ProfSPKAvatar } from '../ai/ProfSPKAvatar';
import { AIEngineSettingsModal } from '../ai/AIEngineSettingsModal';

interface NavbarProps {
  onOpenAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAI }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Botany', path: '/subject/bio-botany', icon: Leaf },
    { label: 'Zoology', path: '/subject/bio-zoology', icon: Dna },
    { label: 'Quiz Challenge', path: '/quizzes', icon: Trophy },
    { label: 'Progress', path: '/progress', icon: BarChart2 },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f4f8f5]/95 backdrop-blur-md border-b border-emerald-950/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        {/* Brand Logo: SPK Learn (Serif Deep Green) */}
        <Link to="/" className="flex items-center gap-2 group select-none">
          <div className="flex flex-col">
            <span className="font-serif font-black text-2xl tracking-tight text-[#144738] leading-none group-hover:opacity-90">
              SPK <span className="text-[#1e5845]">Learn</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 tracking-wider leading-none mt-1">
              Samacheer Kalvi 12th Biology
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#1c4e3f] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {Icon && (
                  <Icon
                    size={14}
                    className={active ? 'text-emerald-200' : 'text-slate-400'}
                  />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Quick AI Guide Button & AI Engines */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 shadow-2xs text-xs font-semibold transition-all cursor-pointer group"
            title="Configure Cloudflare, AI Horde, Pollinations, and Tripo 3D API keys"
          >
            <Cpu size={14} className="text-emerald-700 group-hover:rotate-12 transition-transform" />
            <span className="group-hover:text-emerald-900">AI Engines</span>
          </button>

          <button
            onClick={onOpenAI}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 shadow-2xs text-xs font-semibold transition-all cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden bg-emerald-50 flex items-center justify-center">
              <ProfSPKAvatar size="sm" />
            </div>
            <span className="group-hover:text-emerald-900">Prof. SPK</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/70 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1.5 animate-fade-in shadow-lg">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2.5 ${
                  active
                    ? 'bg-[#1c4e3f] text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {Icon && <Icon size={16} className={active ? 'text-emerald-200' : 'text-slate-500'} />}
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setSettingsOpen(true);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2.5 text-slate-700 hover:bg-slate-100"
          >
            <Cpu size={16} className="text-emerald-600" />
            <span>AI Studio Engines & Keys</span>
          </button>
        </div>
      )}

      {/* AI Engine Settings Modal */}
      <AIEngineSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </header>
  );
};
