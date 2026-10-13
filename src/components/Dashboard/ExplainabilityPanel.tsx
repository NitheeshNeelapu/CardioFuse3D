import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Sparkles, BarChart2, AlertCircle } from 'lucide-react';
import { Modality } from '../../types/modality';

export const ExplainabilityPanel: React.FC = () => {
  const prediction = useAppStore((s) => s.prediction);
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const modalities = useAppStore((s) => s.modalities);

  if (!prediction) return null;

  const features = prediction.features || [];

  const getCategoryColor = (cat: Modality) => {
    switch (cat) {
      case 'clinical':
        return 'bg-cyan-400';
      case 'ecg':
        return 'bg-violet-400';
      case 'symptoms':
        return 'bg-pink-400';
      default:
        return 'bg-blue-400';
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* 1. Feature Importance Card */}
      <GlassCard borderVariant="subtle" padding="md">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Feature Contribution (Demo)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Target: {selectedVessel}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-2 font-sans">
          Feature bars display synthetic demonstration weights to preview interface explainability layout. Model explanations in mock mode reflect demonstration layout only, not trained model attributions or medical causality.
        </p>

        {/* Feature Bars Stack */}
        <div className="space-y-2.5">
          {features.length > 0 ? (
            features.map((feat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-200 truncate max-w-[210px]" title={feat.feature}>
                    {feat.feature}
                  </span>
                  <span className="text-white font-bold ml-2">
                    {feat.impact}/100 — Demo weight
                  </span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getCategoryColor(
                      feat.category
                    )}`}
                    style={{ width: `${Math.min(100, Math.max(0, feat.impact))}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-slate-500 text-xs font-mono">
              No features active in demonstration
            </div>
          )}
        </div>

        {/* Missing modality status if ECG is OFF */}
        {!modalities.ecg && (
          <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300 flex items-center justify-between">
            <span>ECG Features:</span>
            <span className="italic font-bold">Evidence unavailable</span>
          </div>
        )}

        {/* Provenance note */}
        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Method: Synthetic Attribution Preview</span>
          <span className="text-amber-400">Model Not Connected</span>
        </div>
      </GlassCard>

      {/* 2. AI Insight Card */}
      <GlassCard
        borderVariant="violet"
        glow={true}
        padding="md"
        className="bg-gradient-to-br from-[#08111F] via-[#0E1528] to-violet-950/30"
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Demonstration Insight
            </h4>
          </div>
          <Badge variant="demo-output" className="text-[9px]">
            SYNTHETIC DEMO INSIGHT — NOT CLINICAL
          </Badge>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-sans mb-3">
          "{prediction.aiInsight.description ||
            `Synthetic output generated for ${selectedVessel} territory demonstration. No trained predictive model is connected.`}"
        </p>

        <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center gap-2 text-violet-200 text-xs font-mono">
          <AlertCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
          <span className="font-bold">
            {prediction.aiInsight.requiredAction || 'Clinical interpretation requires qualified medical assessment.'}
          </span>
        </div>
      </GlassCard>
    </div>
  );
};
