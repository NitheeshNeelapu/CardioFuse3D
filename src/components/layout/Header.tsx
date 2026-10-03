import React, { useState } from 'react';
import { useAppStore } from '../../state/useAppStore';
import {
  Activity,
  Search,
  ShieldAlert,
  Database,
  Layers,
  Cpu,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  Bug,
} from 'lucide-react';

export const Header: React.FC = () => {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const setIsProvenanceOpen = useAppStore((s) => s.setIsProvenanceOpen);
  const modalities = useAppStore((s) => s.modalities);
  const setPatient = useAppStore((s) => s.setPatient);
  const simulateApiFailure = useAppStore((s) => s.simulateApiFailure);
  const setSimulateApiFailure = useAppStore((s) => s.setSimulateApiFailure);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchQuery.toLowerCase().includes('519') || searchQuery.toLowerCase().includes('02')) {
        setPatient('DEMO-00519');
      } else {
        setPatient('DEMO-00482');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#030712]/90 backdrop-blur-md px-4 lg:px-6 py-2.5 transition-all">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer group flex items-center gap-3 select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold tracking-tight text-white text-base font-mono">
                  CardioAI
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                  v0.2
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-wider text-cyan-400/90 mt-0.5">
                Evidence-to-Anatomy Intelligence
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden lg:flex items-center gap-1 ml-4 bg-[#08111F]/80 p-1 rounded-xl border border-white/5 font-mono text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'architecture'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              Architecture
            </button>
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'evaluation'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3 h-3" />
              Evaluation
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'about'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3 h-3" />
              About
            </button>
          </nav>
        </div>

        {/* Center: Search Field */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, ID or scan…"
              className="w-full bg-[#08111F]/80 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono transition-colors"
            />
          </form>
        </div>

        {/* Right: Status, Provenance, Research Mode Profile */}
        <div className="flex items-center gap-2.5">
          {/* Test 8 API Error Simulation Toggle */}
          <button
            onClick={() => setSimulateApiFailure(!simulateApiFailure)}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-all flex items-center gap-1 ${
              simulateApiFailure
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Simulate API failure for Acceptance Test 8"
          >
            <Bug className="w-3 h-3" />
            <span className="hidden xl:inline">
              {simulateApiFailure ? 'SIMULATING FAULT' : 'TEST API ERROR'}
            </span>
          </button>

          {/* Provenance Button */}
          <button
            onClick={() => setIsProvenanceOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all flex items-center gap-1.5"
          >
            <Database className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline">Provenance</span>
          </button>

          {/* Status Indicator: [x] SYSTEM READY */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold tracking-wider text-[11px]">
              {modalities.ecg ? '[x] SYSTEM READY' : '[!] ECG MASKED'}
            </span>
          </div>

          {/* Profile / Avatar Area: "Research Mode" */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
            <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-mono font-bold">
              RM
            </div>
            <div className="text-left font-mono leading-none">
              <span className="text-xs font-semibold text-white block">
                Research Mode
              </span>
              <span className="text-[9px] text-slate-400">
                Non-Clinical
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
