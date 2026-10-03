import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Compass, CheckCircle2, XCircle, Info, Database, Activity, FileText } from 'lucide-react';
import { Modality } from '../../types/modality';

export const EvidencePanel: React.FC = () => {
  const evidence = useAppStore((s) => s.evidence);
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const isEcgActive = useAppStore((s) => s.modalities.ecg);

  if (!evidence) return null;

  const getModalityIcon = (modality: Modality) => {
    switch (modality) {
      case 'clinical':
        return <Database className="w-3.5 h-3.5 text-cyan-400" />;
      case 'ecg':
        return <Activity className="w-3.5 h-3.5 text-violet-400" />;
      case 'text':
        return <FileText className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <GlassCard borderVariant="subtle" padding="md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Evidence Panel
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="cyan">{selectedVessel} TARGET</Badge>
          <Badge variant="synthetic">SYNTHETIC</Badge>
        </div>
      </div>

      {/* Target Anatomy Header */}
      <div className="mb-3 p-2.5 rounded-xl bg-black/40 border border-white/5">
        <span className="text-[10px] text-slate-400 uppercase font-mono block">
          Target Anatomical Territory
        </span>
        <h4 className="text-xs font-bold text-white mt-0.5">
          {evidence.fullName}
        </h4>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
          {evidence.territory}
        </p>
      </div>

      {/* Evidence Items List */}
      <div className="space-y-2.5">
        {evidence.evidenceItems.map((item) => {
          const isAvailable = item.status === 'AVAILABLE';

          return (
            <div
              key={item.modality}
              className={`p-3 rounded-xl border transition-all ${
                isAvailable
                  ? 'bg-black/30 border-white/10'
                  : 'bg-rose-950/20 border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {getModalityIcon(item.modality)}
                  <span className="text-xs font-bold font-mono text-white">
                    {item.name}
                  </span>
                </div>

                <Badge variant={isAvailable ? 'available' : 'unavailable'}>
                  {item.status}
                </Badge>
              </div>

              <p className="text-[11px] text-slate-300 font-sans mb-1">
                {item.description}
              </p>

              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-white/5">
                <span className="truncate max-w-[210px]">{item.summary}</span>
                <span className="text-slate-500">
                  {isAvailable ? `${item.featuresCount} features` : '0 features'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
