import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ProvenanceModal } from '../Dashboard/ProvenanceModal';
import { useAppStore } from '../../state/useAppStore';
import { AlertCircle, AlertTriangle, RefreshCw, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoading = useAppStore((s) => s.isLoading);
  const loadingMessage = useAppStore((s) => s.loadingMessage);
  const error = useAppStore((s) => s.error);
  const retryAnalysis = useAppStore((s) => s.retryAnalysis);
  const setError = useAppStore((s) => s.setError);

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Persistent Top Safety Banner */}
      <div className="w-full bg-amber-500/10 border-b border-amber-500/25 px-4 py-1.5 text-center text-[11px] font-mono font-bold text-amber-300 flex items-center justify-center gap-2 select-none z-50">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>
          RESEARCH PROTOTYPE • Model-derived outputs are not medical diagnoses • Synthetic demonstration data
        </span>
      </div>

      {/* Main Header */}
      <Header />

      {/* Global Async Loading Overlay or Subtle Top Bar */}
      {isLoading && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-black/90 border border-cyan-400 text-cyan-300 shadow-2xl flex items-center gap-2.5 font-mono text-xs animate-fadeIn backdrop-blur-md">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
          <span>{loadingMessage || 'Analyzing evidence…'}</span>
        </div>
      )}

      {/* Global Error Banner with Retry Option (Acceptance Test 8) */}
      {error && (
        <div className="w-full bg-red-950/80 border-b border-red-500/40 px-4 py-3 text-red-200 flex items-center justify-between text-xs font-mono z-40 animate-fadeIn backdrop-blur-md">
          <div className="flex items-center gap-2 max-w-2xl">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-red-300">SYSTEM NOTIFICATION:</span>{' '}
              <span>{error}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => retryAnalysis()}
              className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/40 font-bold transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>RETRY</span>
            </button>
            <button
              onClick={() => setError(null)}
              className="p-1 text-red-400 hover:text-white"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1 w-full flex flex-col">{children}</main>

      {/* Model & Data Provenance Modal */}
      <ProvenanceModal />

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
};
