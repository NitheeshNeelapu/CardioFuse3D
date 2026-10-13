import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { Activity, Database, FileText, Cpu, Heart, CheckCircle2, RefreshCw } from 'lucide-react';

export const PIPELINE_STAGES = [
  { id: 1, label: 'INGESTING CLINICAL', desc: 'Normalizing tabular demographics & vitals', icon: Database },
  { id: 2, label: 'PROCESSING ECG', desc: '1D-CNN temporal morphological vectors', icon: Activity },
  { id: 3, label: 'EMBEDDING NARRATIVE', desc: 'BioClinicalBERT text attention tokens', icon: FileText },
  { id: 4, label: 'FUSING MODALITIES', desc: 'Late-fusion cross-attention synthesis', icon: Cpu },
  { id: 5, label: 'MAPPING ANATOMY', desc: 'Coronary arterial projection (LAD • LCX • RCA)', icon: Heart },
];

export const PipelineProgressModal: React.FC = () => {
  const analysisStatus = useAppStore((s) => s.analysisStatus);
  const pipelineStep = useAppStore((s) => s.pipelineStep);

  if (analysisStatus !== 'analyzing') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-md rounded-2xl glass-panel-glow p-6 border border-cyan-500/30 text-white shadow-[0_0_50px_rgba(0,229,255,0.2)]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide font-mono uppercase text-white">
              Multimodal Late Fusion Pipeline
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Executing Evidence-to-Anatomy Engine
            </p>
          </div>
        </div>

        {/* 5 Stages List */}
        <div className="space-y-3 font-mono">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isCompleted = pipelineStep > idx;
            const isCurrent = pipelineStep === idx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                  isCurrent
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)] translate-x-1'
                    : isCompleted
                    ? 'bg-black/30 border-emerald-500/30 text-slate-300'
                    : 'bg-black/20 border-white/5 opacity-40 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isCurrent
                        ? 'bg-cyan-500 text-black font-bold animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-wide">
                      {stage.id}. {stage.label}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {stage.desc}
                    </div>
                  </div>
                </div>

                <div>
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-5 pt-3 border-t border-white/10">
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span>Overall Progress</span>
            <span className="text-cyan-300 font-bold">
              {Math.min(100, Math.round(((pipelineStep + 1) / PIPELINE_STAGES.length) * 100))}%
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,229,255,0.5)]"
              style={{ width: `${Math.min(100, ((pipelineStep + 1) / PIPELINE_STAGES.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
