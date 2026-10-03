import React from 'react';
import { Database, Activity, FileText, Cpu, ArrowDown, Heart, BarChart3, Layers } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const DataFlowDiagram: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto my-6 px-4 py-6 flex-1 space-y-6">
      <GlassCard borderVariant="subtle" padding="lg">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5" />
            MULTIMODAL LATE-FUSION PIPELINE
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            How CARDIOAI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            From multimodal patient evidence streams to vessel-specific 3D anatomical risk projections with synchronized explainability.
          </p>
        </div>

        {/* Architecture Visual Grid */}
        <div className="space-y-6">
          {/* Tier 1: Raw Modalities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Modality 1 */}
            <div className="p-4 rounded-xl bg-[#08111F] border border-cyan-500/30 text-center relative overflow-hidden group hover:border-cyan-400 transition-all">
              <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-2">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white font-mono uppercase">1. Structured Clinical</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Age, Blood Pressure (118/76 mmHg), BMI (22.7), Resting HR (72 bpm)
              </p>
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-cyan-400">
                Raw Patient Data
              </div>
            </div>

            {/* Modality 2 */}
            <div className="p-4 rounded-xl bg-[#08111F] border border-violet-500/30 text-center relative overflow-hidden group hover:border-violet-400 transition-all">
              <div className="w-10 h-10 mx-auto rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center mb-2">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white font-mono uppercase">2. Physiological ECG</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Continuous 12-lead precordial waveforms (HR 72, PR 160ms, QTc 412ms)
              </p>
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-violet-400">
                High-Frequency Waveform
              </div>
            </div>

            {/* Modality 3 */}
            <div className="p-4 rounded-xl bg-[#08111F] border border-pink-500/30 text-center relative overflow-hidden group hover:border-pink-400 transition-all">
              <div className="w-10 h-10 mx-auto rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white font-mono uppercase">3. Symptom Narrative</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Clinical intake narrative tokens, exertional descriptors
              </p>
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-pink-400">
                Clinical Text NLP
              </div>
            </div>
          </div>

          {/* Down Arrow */}
          <div className="flex justify-center text-cyan-400/60">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>

          {/* Tier 2: Domain Encoders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-[10px] font-mono text-cyan-300 block mb-1">CLINICAL ENCODER</span>
              <p className="text-xs text-white font-mono font-semibold">Multilayer Perceptron (MLP)</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Latent dim: 64</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-[10px] font-mono text-violet-300 block mb-1">PHYSIOLOGICAL ENCODER</span>
              <p className="text-xs text-white font-mono font-semibold">1D-CNN (ResNet-1D)</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Latent dim: 128</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-[10px] font-mono text-pink-300 block mb-1">TEXT ENCODER</span>
              <p className="text-xs text-white font-mono font-semibold">Clinical Transformer</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Latent dim: 768</span>
            </div>
          </div>

          {/* Down Arrow */}
          <div className="flex justify-center text-cyan-400/60">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>

          {/* Tier 3: Multimodal Late Fusion Core */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-[#08111F] to-violet-950/60 border border-cyan-400/40 text-center shadow-[0_0_25px_rgba(0,229,255,0.15)] relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-2 text-cyan-300">
              <Cpu className="w-6 h-6 animate-pulse" />
              <h3 className="text-base sm:text-lg font-extrabold tracking-wide uppercase font-mono">
                Late Fusion & Cross-Attention Engine
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Synthesizes domain representations with cross-modality attention weights. Dynamically masks absent inputs (such as disabled ECG) without performance collapse or synthetic fabrication.
            </p>
          </div>

          {/* Down Arrow */}
          <div className="flex justify-center text-cyan-400/60">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>

          {/* Tier 4: Anatomical Vessel Projections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-[#08111F] border border-cyan-400/50 text-center">
              <div className="text-xs font-bold text-cyan-300">LAD PROJECTION</div>
              <div className="text-xl font-bold text-white mt-1">68%</div>
              <p className="text-[10px] text-slate-400 mt-1">Anterior wall & apex projection</p>
            </div>

            <div className="p-4 rounded-xl bg-[#08111F] border border-violet-400/50 text-center">
              <div className="text-xs font-bold text-violet-300">LCX PROJECTION</div>
              <div className="text-xl font-bold text-white mt-1">42%</div>
              <p className="text-[10px] text-slate-400 mt-1">Lateral ventricular wall projection</p>
            </div>

            <div className="p-4 rounded-xl bg-[#08111F] border border-pink-400/50 text-center">
              <div className="text-xs font-bold text-pink-300">RCA PROJECTION</div>
              <div className="text-xl font-bold text-white mt-1">28%</div>
              <p className="text-[10px] text-slate-400 mt-1">Inferior & right ventricular projection</p>
            </div>
          </div>

          {/* Down Arrow */}
          <div className="flex justify-center text-cyan-400/60">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>

          {/* Tier 5: 3D Anatomical Map & Explainability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white font-mono uppercase">3D Anatomical Heart Map</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Real-time interactive Three.js coronary mesh synchronized with vessel probabilities.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-violet-300" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white font-mono uppercase">Explainability & Agreement</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Vessel-specific feature attributions and multi-modality consensus indicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
