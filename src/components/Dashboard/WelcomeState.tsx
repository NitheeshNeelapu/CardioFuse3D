import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { HeartScene } from '../Heart3D/HeartScene';
import { GlassCard } from '../common/GlassCard';
import { Activity, Play, PlusCircle, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export const WelcomeState: React.FC = () => {
  const openInputPanel = useAppStore((s) => s.openInputPanel);

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 lg:px-8 py-6 flex-1 flex flex-col justify-center items-center">
      {/* Hero Welcome Card */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left / Info Side (5 cols) */}
        <div className="lg:col-span-5 space-y-5 text-left order-2 lg:order-1">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-3">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>CARDIOVASCULAR AI RESEARCH PLATFORM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
              CARDIOFUSE 3D
            </h1>

            <p className="text-base sm:text-lg text-cyan-300/90 font-medium mt-1 leading-snug">
              Multimodal Cardiovascular Evidence → 3D Anatomical Risk Map
            </p>
          </div>

          {/* Core Ready for Analysis Block */}
          <div className="p-5 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
                Ready for Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Enter patient information and available evidence to begin. The late-fusion pipeline will project predictions directly onto the 3D coronary anatomy with unified explainability.
            </p>
          </div>

          {/* Primary Action Button */}
          <div>
            <button
              onClick={() => openInputPanel(false)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-mono font-extrabold text-sm tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-5 h-5 fill-current" />
              <span>CREATE NEW ANALYSIS</span>
            </button>
          </div>

          {/* Safety Notice */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>RESEARCH PROTOTYPE — NOT A MEDICAL DEVICE</span>
          </div>
        </div>

        {/* Right / Center Side: Futuristic 3D Heart Hero Viewport (7 cols) */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <GlassCard
            borderVariant="cyan"
            glow={true}
            padding="sm"
            className="flex flex-col min-h-[460px] sm:min-h-[540px] lg:min-h-[580px] p-3 sm:p-4"
          >
            <HeartScene />
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
