import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { Layers } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ContributionChart: React.FC = () => {
  const prediction = useAppStore((s) => s.prediction);
  const selectedVessel = useAppStore((s) => s.selectedVessel);

  if (!prediction) return null;

  const contributions = prediction.contributionsList || [];
  const fusedOutput = prediction.probability;
  const hasAnyActive = contributions.some((c) => c.available && c.percentage !== null);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="emerald" className="text-[9px]">AVAILABLE</Badge>;
      case 'synthetic_demo':
        return <Badge variant="violet" className="text-[9px]">SYNTHETIC DEMO</Badge>;
      case 'unavailable':
      default:
        return <Badge variant="amber" className="text-[9px]">UNAVAILABLE</Badge>;
    }
  };

  return (
    <div className="space-y-3 select-none">
      {/* Title */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Modality Evidence & Shares</span>
        </div>
        <span className="text-[10px] text-slate-400">
          Target: {selectedVessel}
        </span>
      </div>

      {/* Horizontal Bar Stack / Rows */}
      <div className="space-y-3">
        {contributions.map((item) => {
          const isAvailable = item.available && item.percentage !== null;

          return (
            <div key={item.modality} className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-bold flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: isAvailable ? item.color : '#64748B' }}
                  />
                  {item.label}
                </span>

                <div className="flex items-center gap-2">
                  {renderStatusBadge(item.status)}
                  <span
                    className={`font-mono text-xs ${
                      isAvailable ? 'text-white font-bold' : 'text-amber-400 font-medium italic'
                    }`}
                  >
                    {isAvailable
                      ? `${item.percentage}% share`
                      : 'Evidence unavailable'}
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5">
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
                  <div
                    className="h-full w-full bg-slate-800/60"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 5px, transparent 5px, transparent 10px)',
                    }}
                  />
                )}
              </div>

              {/* Descriptive explanation */}
              {item.explanation && (
                <p className="text-[10px] text-slate-400 font-mono leading-tight">
                  {item.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Fused Model Output Summary Row */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300 font-semibold">Fused rule-based output</span>
        <span className="text-cyan-300 font-extrabold text-sm">
          {hasAnyActive ? `${fusedOutput}/100 — Demo score` : 'No evidence'}
        </span>
      </div>

      <p className="text-[10px] text-slate-400 font-sans italic leading-tight">
        * Shares sum to 100% across active modalities. Rule-based demo scorer (not a trained model).
      </p>
    </div>
  );
};
