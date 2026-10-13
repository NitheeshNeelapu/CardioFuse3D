import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Compass, Info, Database, Activity, FileText, AlertCircle } from 'lucide-react';
import { Modality } from '../../types/modality';

export const EvidencePanel: React.FC = () => {
  const evidence = useAppStore((s) => s.evidence);
  const selectedVessel = useAppStore((s) => s.selectedVessel);

  if (!evidence) return null;

  const getModalityIcon = (modality: Modality) => {
    switch (modality) {
      case 'clinical':
        return <Database className="w-3.5 h-3.5 text-cyan-400" />;
      case 'ecg':
        return <Activity className="w-3.5 h-3.5 text-violet-400" />;
      case 'symptoms':
        return <FileText className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
      case 'AVAILABLE':
        return <Badge variant="emerald" className="text-[9px]">AVAILABLE</Badge>;
      case 'synthetic_demo':
      case 'SYNTHETIC':
        return <Badge variant="violet" className="text-[9px]">SYNTHETIC DEMO</Badge>;
      case 'unavailable':
      case 'UNAVAILABLE':
      default:
        return <Badge variant="unavailable" className="text-[9px]">UNAVAILABLE</Badge>;
    }
  };

  return (
    <GlassCard borderVariant="subtle" padding="md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Vessel-Specific Evidence
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="cyan">{selectedVessel} TERRITORY</Badge>
          <Badge variant="amber">DEMO MODE</Badge>
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

      {/* Mandatory Non-fabrication notice: No vessel-specific clinical evidence available */}
      <div className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200">
        <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-300">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>No vessel-specific clinical evidence available.</span>
        </div>
        <p className="text-[11px] text-slate-300 font-sans mt-1 leading-relaxed">
          Territory anatomical mapping demonstrates UI synchronization only. No angiographic stenosis, lesion, or blockage has been observed or inferred.
        </p>
      </div>

      {/* Evidence Items List */}
      <div className="space-y-2.5">
        {evidence.evidenceItems.map((item) => {
          const isAvail = item.status === 'available' || item.status === 'AVAILABLE' || item.status === 'synthetic_demo' || item.status === 'SYNTHETIC';

          return (
            <div
              key={item.modality}
              className={`p-3 rounded-xl border transition-all ${
                isAvail
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

                {renderStatusBadge(item.status)}
              </div>

              <p className="text-[11px] text-slate-300 font-sans mb-1 leading-relaxed">
                {item.description}
              </p>

              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-white/5">
                <span className="truncate max-w-[210px]">{item.summary}</span>
                <span className="text-slate-400">
                  {item.sourceType === 'synthetic_visualization'
                    ? 'Visualization only'
                    : item.isPatientData
                    ? 'User data'
                    : 'Not provided'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
