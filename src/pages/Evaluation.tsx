import React from 'react';
import { Cpu, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';

export const Evaluation: React.FC = () => {
  const metricPlaceholders = [
    { label: 'ACCURACY', val: 'Evaluation pending', desc: 'Holdout test cohort' },
    { label: 'PRECISION', val: 'Evaluation pending', desc: 'Positive predictive value' },
    { label: 'RECALL / SENSITIVITY', val: 'Evaluation pending', desc: 'True positive rate' },
    { label: 'F1 SCORE', val: 'Evaluation pending', desc: 'Harmonic mean' },
    { label: 'ROC-AUC', val: 'Evaluation pending', desc: 'Area under ROC curve' },
    { label: 'PR-AUC', val: 'Evaluation pending', desc: 'Precision-recall AUC' },
  ];

  // Benchmark reference coordinates for stylized ROC framework demonstration
  const rocPoints = [
    { x: 0, y: 0 },
    { x: 5, y: 35 },
    { x: 10, y: 58 },
    { x: 20, y: 76 },
    { x: 35, y: 88 },
    { x: 50, y: 93 },
    { x: 75, y: 97 },
    { x: 100, y: 100 },
  ];

  const svgRocPath = rocPoints.reduce((acc, pt, idx) => {
    const canvasX = 30 + (pt.x / 100) * 250;
    const canvasY = 180 - (pt.y / 100) * 160;
    return idx === 0 ? `M ${canvasX} ${canvasY}` : `${acc} L ${canvasX} ${canvasY}`;
  }, '');

  return (
    <div className="max-w-[1920px] mx-auto px-4 lg:px-8 py-8 space-y-8 flex-1">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-2">
            <Cpu className="w-3.5 h-3.5" />
            BENCHMARK VALIDATION FRAMEWORK
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-mono">
            Model Evaluation & Statistical Metrics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Standardized validation scaffolding for multimodal cardiovascular risk models.
          </p>
        </div>

        {/* Ethical Non-Fabrication Notice */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs max-w-md">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>ETHICAL AI DISCLOSURE</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            Evaluation pending — connect validated model results. In accordance with clinical safety protocol, no false accuracy or AUC metrics are fabricated.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metricPlaceholders.map((m, idx) => (
          <GlassCard key={idx} borderVariant="subtle" padding="sm" className="text-center">
            <span className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">
              {m.label}
            </span>
            <span className="text-xs font-bold font-mono text-amber-300/90 block">
              {m.val}
            </span>
            <span className="text-[9px] text-slate-500 font-mono mt-1 block">
              {m.desc}
            </span>
          </GlassCard>
        ))}
      </div>

      {/* Validation Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: ROC Curve Framework */}
        <GlassCard borderVariant="subtle" padding="md" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-white font-mono uppercase">
                ROC Curve Template
              </h3>
              <Badge variant="amber">FRAMEWORK DEMO</Badge>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 font-sans">
              True Positive Rate vs. False Positive Rate across classification thresholds.
            </p>

            <div className="relative w-full h-[200px] bg-black/50 rounded-xl border border-white/5 p-2 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 300 200">
                <line x1="30" y1="20" x2="30" y2="180" stroke="#334155" strokeWidth="1" />
                <line x1="30" y1="180" x2="280" y2="180" stroke="#334155" strokeWidth="1" />
                <line x1="30" y1="180" x2="280" y2="20" stroke="#475569" strokeDasharray="4 4" strokeWidth="1" />
                <path d={svgRocPath} fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" />
                <text x="15" y="100" fill="#94a3b8" fontSize="8" transform="rotate(-90 15,100)">TPR</text>
                <text x="150" y="195" fill="#94a3b8" fontSize="8">FPR</text>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Validation cohort: None</span>
            <span className="text-amber-400">Evaluation pending</span>
          </div>
        </GlassCard>

        {/* Card 2: Confusion Matrix */}
        <GlassCard borderVariant="subtle" padding="md" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-white font-mono uppercase">
                Confusion Matrix Template
              </h3>
              <Badge variant="amber">PENDING TEST SET</Badge>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 font-sans">
              Binary classification contingency table mapped against angiographic reference standard.
            </p>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <span className="text-[10px] text-slate-400 block mb-1">TRUE POSITIVE</span>
                <span className="text-sm font-bold text-cyan-300">Pending</span>
              </div>
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30">
                <span className="text-[10px] text-slate-400 block mb-1">FALSE POSITIVE</span>
                <span className="text-sm font-bold text-red-300">Pending</span>
              </div>
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30">
                <span className="text-[10px] text-slate-400 block mb-1">FALSE NEGATIVE</span>
                <span className="text-sm font-bold text-red-300">Pending</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 block mb-1">TRUE NEGATIVE</span>
                <span className="text-sm font-bold text-emerald-300">Pending</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Threshold: 0.50</span>
            <span className="text-amber-400">Evaluation pending</span>
          </div>
        </GlassCard>

        {/* Card 3: Clinical-Only vs Multimodal Ablation */}
        <GlassCard borderVariant="subtle" padding="md" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-white font-mono uppercase">
                Ablation Comparison Template
              </h3>
              <Badge variant="cyan">ABLATION STUDY</Badge>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 font-sans">
              Comparative analysis demonstrating the statistical incremental yield of multimodal fusion.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Clinical Tabular Alone:</span>
                  <span className="text-amber-300">Evaluation pending</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-slate-600 h-full w-[50%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/20">
                <div className="flex justify-between mb-1">
                  <span className="text-cyan-300">Multimodal Fusion (3 modalities):</span>
                  <span className="text-amber-300">Evaluation pending</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[65%]" />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                Target Benchmark: Multi-center cohort validation framework ready for data ingestion.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Ablation Status: Scaffolded</span>
            <span className="text-amber-400">Evaluation pending</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
