import React, { useState } from 'react';
import { useAppStore } from '../../state/useAppStore';
import {
  Activity,
  Database,
  Layers,
  Cpu,
  HelpCircle,
  Bug,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { DEMO_PATIENTS } from '../../data/demoPatient';

export const Header: React.FC = () => {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const setIsProvenanceOpen = useAppStore((s) => s.setIsProvenanceOpen);
  const modalities = useAppStore((s) => s.modalities);
  const setPatient = useAppStore((s) => s.setPatient);
  const selectedPatient = useAppStore((s) => s.selectedPatient);
  const simulateApiFailure = useAppStore((s) => s.simulateApiFailure);
  const setSimulateApiFailure = useAppStore((s) => s.setSimulateApiFailure);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  // Hide the TEST API ERROR button unless URL contains ?debug=1
  const isDebugMode = typeof window !== 'undefined' && window.location.search.includes('debug=1');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchError(null);
      return;
    }

    const matched = Object.values(DEMO_PATIENTS).find(
      (p) =>
        p.id.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query)
    );

    if (matched) {
      setPatient(matched.id);
      setSearchError(null);
      setSearchQuery('');
    } else {
      setSearchError('No patient found');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: null },
    { id: 'architecture', label: 'Architecture', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'evaluation', label: 'Evaluation', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About', icon: <HelpCircle className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#030712]/95 backdrop-blur-md px-4 lg:px-6 py-2.5 transition-all">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-3">
        {/* Left: CardioFuse 3D Branding & Navigation */}
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
                  CardioFuse 3D
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                  v0.2
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-wider text-cyan-400/90 mt-0.5">
                Multimodal Evidence → 3D Anatomical Risk Map
              </p>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-1 ml-4 bg-[#08111F]/80 p-1 rounded-xl border border-white/5 font-mono text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === item.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Patient Search Box */}
        <div className="flex-1 max-w-xs md:max-w-sm mx-2 relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (searchError) setSearchError(null);
              }}
              placeholder={`Search demo patient (e.g. 519, 482)...`}
              className="w-full bg-[#08111F]/90 border border-white/10 rounded-xl pl-9 pr-24 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-mono text-cyan-400">
              <span className="hidden sm:inline bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                {selectedPatient.id}
              </span>
            </div>
          </form>

          {/* Search Feedback */}
          {searchError && (
            <div className="absolute left-0 top-full mt-1 px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono z-50 animate-fadeIn">
              {searchError}
            </div>
          )}
        </div>

        {/* Right: Controls & Provenance */}
        <div className="flex items-center gap-2">
          {/* Debug API Error Simulation Toggle: only shown if ?debug=1 */}
          {isDebugMode && (
            <button
              onClick={() => setSimulateApiFailure(!simulateApiFailure)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-all flex items-center gap-1 ${
                simulateApiFailure
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
              title="Simulate API failure (?debug=1)"
            >
              <Bug className="w-3 h-3" />
              <span className="hidden xl:inline">
                {simulateApiFailure ? 'SIMULATING FAULT' : 'TEST API ERROR'}
              </span>
            </button>
          )}

          {/* Provenance Button */}
          <button
            onClick={() => setIsProvenanceOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Provenance</span>
          </button>

          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold tracking-wider text-[11px] hidden sm:inline">
              {modalities.ecg ? '● READY (DEMO)' : '[!] ECG MASKED'}
            </span>
          </div>

          {/* Mobile Hamburger Button (visible below lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white lg:hidden transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <nav className="lg:hidden mt-2 pt-2 border-t border-white/10 grid grid-cols-2 gap-1.5 font-mono text-xs animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === item.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'bg-white/5 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};
