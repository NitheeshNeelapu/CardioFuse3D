import React from 'react';
import { GitCompare, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { detectConflict } from '../../data/conflict';
import { useAppStore } from '../../state/useAppStore';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';

export const ConflictCard: React.FC = () => {
  const getEffectivePatient = useAppStore((s) => s.getEffectivePatient);
  const modalities = useAppStore((s) => s.modalities);
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);
  const selectedVessel = useAppStore((s) => s.selectedVessel);

  const effectivePatient = getEffectivePatient();
  const conflict = detectConflict(effectivePatient, modalities);

  const isConflict = conflict.status === 'conflict';
  const isAgree = conflict.status === 'agree';

  return (
    <GlassCard
      borderVariant={isConflict ? 'amber' : 'subtle'}
      padding="md"
      className="space-y-3 font-mono"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isConflict
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : isAgree
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border border-white/10'
            }`}
          >
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
              Evidence Concordance Detector
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Cross-modality agreement vs discordance
            </span>
          </div>
        </div>

        <div>
          {isAgree ? (
            <Badge variant="emerald" className="text-[9px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>CONCORDANT</span>
            </Badge>
          ) : isConflict ? (
            <Badge variant="amber" className="text-[9px] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>DISCORDANCE DETECTED</span>
            </Badge>
          ) : (
            <Badge variant="slate" className="text-[9px] flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              <span>NEED AT LEAST 2 MODALITIES</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Primary Message */}
      <div
        className={`p-2.5 rounded-xl text-xs font-mono border ${
          isConflict
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            : isAgree
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            : 'bg-black/30 border-white/5 text-slate-300'
        }`}
      >
        <span className="font-bold">{conflict.message}</span>
      </div>

      {/* Per-Modality Independent Top Vessel Breakout */}
      {conflict.perModality && conflict.perModality.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {conflict.perModality.map((p) => {
            const isVesselActive = selectedVessel === p.topVessel;
            return (
              <button
                key={p.modality}
                type="button"
                onClick={() => setSelectedVessel(p.topVessel)}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-left transition-all border flex flex-col justify-center ${
                  isVesselActive
                    ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200'
                    : 'bg-black/40 border-white/5 hover:border-white/15 text-slate-300'
                }`}
                title={`Click to focus ${p.topVessel}`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-sans uppercase">{p.label}</span>
                  <span className="font-bold text-white font-mono">{p.topVessel}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono mt-0.5">
                  <span className="text-slate-500 text-[10px]">Lead margin</span>
                  <span className="font-bold text-cyan-300">
                    +{p.margin} pts ({p.probs[p.topVessel]}%)
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Footnote */}
      <div className="text-[9px] text-slate-500 font-sans pt-1 border-t border-white/5 italic">
        Evaluates isolated single-modality contributions against late fusion. Research prototype • not medical advice.
      </div>
    </GlassCard>
  );
};
