import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { Layers, HelpCircle } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';

export const ContributionChart: React.FC = () => {
  const prediction = useAppStore((s) => s.prediction);
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const modalities = useAppStore((s) => s.modalities);

  if (!prediction) return null;

  const contributions = prediction.modalityContributions;
  const fusedOutput = prediction.probability;

  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Modality Contribution</span>
        </div>
        <span className="text-[10px] text-slate-400">
          Target: {selectedVessel}
        </span>
      </div>

      {/* Horizontal Bar Stack / Rows */}
      <div className="space-y-2.5">
        {contributions.map((item) => {
          const isAvailable = item.available && item.percentage !== null;

          return (
            <div key={item.modality} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: isAvailable ? item.color : '#64748B' }}
                  />
                  {item.label}
                </span>

                <span
                  className={`font-mono text-xs ${
                    isAvailable ? 'text-white font-bold' : 'text-amber-400 font-medium italic'
                  }`}
                >
                  {isAvailable ? `${item.percentage}%` : 'Evidence unavailable'}
                </span>
              </div>

              {/* Bar track */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                {isAvailable ? (
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, item.percentage || 0))}%`,
                      backgroundColor: item.color,
                      boxShadow: `0 0 10px ${item.color}80`,
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-slate-800/60 pattern-diagonal-stripes" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fused Model Output Summary Row */}
      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300 font-semibold">Fused model output</span>
        <span className="text-cyan-300 font-extrabold text-sm">
          {fusedOutput}%
        </span>
      </div>

      <p className="text-[10px] text-slate-400 font-sans italic leading-tight">
        * Synthetic demonstration values. Normalized late-fusion contribution weights.
      </p>
    </div>
  );
};
