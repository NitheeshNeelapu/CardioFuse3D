import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { AlertTriangle, Database, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  const setIsProvenanceOpen = useAppStore((s) => s.setIsProvenanceOpen);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  return (
    <footer className="w-full border-t border-white/10 bg-[#030712] text-slate-400 py-3 px-3 sm:px-4 lg:px-6 text-xs static md:sticky md:bottom-0 z-30">
      <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Research Label */}
        <div className="flex items-center gap-2 font-mono text-[11px] flex-wrap justify-center sm:justify-start">
          <span className="font-bold text-white tracking-wide">CardioFuse 3D</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-white/10">
            PROTOTYPE v0.2
          </span>
          <span className="text-slate-500 hidden md:inline">• Evidence-to-Anatomy Engine (Demo)</span>
        </div>

        {/* Center: Persistent Mandatory Safety Message - cleanly wraps, no cut off */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] sm:text-[11px] font-mono font-bold tracking-wide text-center whitespace-normal max-w-full">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
          <span className="whitespace-normal leading-relaxed text-center">
            RESEARCH PROTOTYPE • NOT FOR CLINICAL DECISION MAKING • SYNTHETIC DEMONSTRATION DATA
          </span>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={() => setIsProvenanceOpen(true)}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-[11px]"
          >
            <Database className="w-3 h-3 text-cyan-400" />
            <span>Provenance</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluation')}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-[11px]"
          >
            <Cpu className="w-3 h-3 text-violet-400" />
            <span>Evaluation</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
