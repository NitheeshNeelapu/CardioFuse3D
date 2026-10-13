import React from 'react';
import { ShieldCheck, Heart, Layers, Sparkles, AlertTriangle, Eye, Compass, Cpu } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';

export const About: React.FC = () => {
  return (
    <div className="max-w-[1920px] mx-auto px-4 lg:px-8 py-8 space-y-8 flex-1">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-2">
          <Heart className="w-3.5 h-3.5" />
          RESEARCH PROTOTYPE MISSION
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-mono">
          About CARDIOFUSE 3D
        </h1>
        <p className="text-base text-cyan-200/90 font-medium mt-2">
          A weighted multimodal scorer (clinical + ECG + text + ECG photo) with a tool-using LLM agent for explanation, translation and extraction. The LLM never computes risk.
        </p>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Problem */}
        <GlassCard borderVariant="subtle" padding="lg" className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white tracking-wide font-mono">The Problem</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Conventional cardiovascular AI models collapse heterogeneous clinical data sources (vitals, 12-lead ECGs, and patient narratives) into an ungrounded black-box percentage. Clinicians cannot trace where probabilities originate or which coronary vascular anatomy is implicated.
          </p>
        </GlassCard>

        {/* 2. Approach */}
        <GlassCard borderVariant="cyan" padding="lg" className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white tracking-wide font-mono">Our Approach</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            CARDIOFUSE 3D introduces an anatomical grounding framework that maps multimodal evidence directly onto an interactive 3D coronary mesh. Every model output is synchronized with its anatomical supply bed (LAD, LCX, RCA).
          </p>
        </GlassCard>

        {/* 3. Multimodal Scorer & Agent */}
        <GlassCard borderVariant="subtle" padding="lg" className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white tracking-wide font-mono">Weighted Scorer & Agent</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our pipeline combines tabular clinical measurements, physiological waveforms, symptom narratives, and paper ECG photo extraction into a transparent, deterministic rule-based scorer. A tool-using LLM agent provides clinical explainability and multilingual communication without ever altering numerical risk probabilities.
          </p>
        </GlassCard>

        {/* 4. Evidence-to-Anatomy */}
        <GlassCard borderVariant="subtle" padding="lg" className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white tracking-wide font-mono">Evidence-to-Anatomy</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Selecting any vessel in the 3D heart dynamically synchronizes all peripheral dashboard panels. Clinicians and researchers immediately inspect modality contributions, evidence status, and feature weights specific to that territory.
          </p>
        </GlassCard>

        {/* 5. Explainability */}
        <GlassCard borderVariant="subtle" padding="lg" className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white tracking-wide font-mono">Explainability</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Transparent feature attribution and narrative word-level occlusion expose the exact clinical markers, ECG intervals, and symptom phrases influencing scores. We rigorously distinguish correlation from clinical causality. Current demo uses a transparent rule-based scorer.
          </p>
        </GlassCard>

        {/* 6. Responsible AI */}
        <GlassCard borderVariant="subtle" padding="lg" className="space-y-3 border-emerald-500/30">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white tracking-wide font-mono">Responsible AI</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            As a research prototype, CARDIOFUSE 3D enforces strict safety boundaries: no medical diagnoses are asserted, missing modalities are made transparently visible, and unverified validation statistics are never fabricated.
          </p>
        </GlassCard>
      </div>

      {/* Safety Notice Card */}
      <div className="p-6 rounded-2xl bg-[#08111F] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white font-mono">RESEARCH PROTOTYPE DISCLOSURE</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Not a medical device. Model outputs are experimental and should not be used for diagnosis, clinical decision-making, or treatment recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
