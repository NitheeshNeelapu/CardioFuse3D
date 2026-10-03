import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { ECGChart } from '../Charts/ECGChart';
import { User, Activity, Heart, HeartPulse, FileText, Image } from 'lucide-react';

export const PatientCard: React.FC = () => {
  const patient = useAppStore((s) => s.selectedPatient);

  return (
    <div className="space-y-4">
      {/* 1. Patient Demographics & Profile */}
      <GlassCard borderVariant="subtle" padding="md">
        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  {patient.name}
                </h2>
                <Badge variant="synthetic">SYNTHETIC DATA</Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Patient ID: {patient.id}
              </p>
            </div>
          </div>
        </div>

        {/* Demographics details */}
        <div className="grid grid-cols-4 gap-2 text-xs font-mono mb-3">
          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Age</span>
            <span className="text-white font-bold">{patient.age}</span>
          </div>
          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Sex</span>
            <span className="text-white font-bold">{patient.sex}</span>
          </div>
          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Weight</span>
            <span className="text-white font-bold">{patient.weight} kg</span>
          </div>
          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Height</span>
            <span className="text-white font-bold">{patient.height} cm</span>
          </div>
        </div>

        {/* Synthetic Clinical Narrative */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 uppercase font-bold mb-1">
            <FileText className="w-3 h-3" />
            <span>Clinical Narrative (Synthetic/Demo)</span>
          </div>
          <p className="text-[11px] text-slate-300 italic leading-relaxed">
            "{patient.clinicalNarrative}"
          </p>
        </div>
      </GlassCard>

      {/* 2. Vitals Card */}
      <GlassCard borderVariant="subtle" padding="md">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5 mb-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Vitals
            </h3>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
            SYNTHETIC DEMONSTRATION VALUES
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono text-center">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Heart Rate</span>
            <span className="text-base font-extrabold text-white">
              {patient.vitals.heartRate}
            </span>
            <span className="text-[9px] text-slate-500 block">bpm</span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
            <span className="text-base font-extrabold text-white">
              {patient.vitals.bloodPressureSys}/{patient.vitals.bloodPressureDia}
            </span>
            <span className="text-[9px] text-slate-500 block">mmHg</span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-slate-400 block">SpO₂</span>
            <span className="text-base font-extrabold text-white">
              {patient.vitals.spo2}%
            </span>
            <span className="text-[9px] text-slate-500 block">Room air</span>
          </div>
        </div>
      </GlassCard>

      {/* 3. ECG Analysis Card (Includes clean ECG waveform & metrics) */}
      <GlassCard borderVariant="subtle" padding="md">
        <ECGChart />
      </GlassCard>

      {/* 4. Cardiac Function Card */}
      <GlassCard borderVariant="subtle" padding="md">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5 mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Cardiac Function
            </h3>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
            SYNTHETIC DEMO VALUES
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 font-mono text-center">
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-400 block">EF</span>
            <span className="text-sm font-bold text-cyan-300">
              {patient.cardiacFunction.ejectionFraction}%
            </span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-400 block">LV EDV</span>
            <span className="text-sm font-bold text-white">
              {patient.cardiacFunction.lvedv} ml
            </span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-400 block">LV ESV</span>
            <span className="text-sm font-bold text-white">
              {patient.cardiacFunction.lvesv} ml
            </span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-400 block">Stroke Vol</span>
            <span className="text-sm font-bold text-white">
              {patient.cardiacFunction.strokeVolume} ml
            </span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-400 block">Cardiac Out</span>
            <span className="text-sm font-bold text-white">
              {patient.cardiacFunction.cardiacOutput} L/min
            </span>
          </div>
        </div>
      </GlassCard>

      {/* 5. Recent Scans Panel */}
      <GlassCard borderVariant="subtle" padding="md">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5 mb-2.5">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Recent Scans
            </h3>
          </div>
          <Badge variant="synthetic">SYNTHETIC DEMO</Badge>
        </div>

        <div className="space-y-2">
          {patient.recentScans.map((scan) => (
            <div
              key={scan.id}
              className="p-2 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs font-mono"
            >
              <div>
                <span className="text-white font-semibold block">{scan.modalityName}</span>
                <span className="text-[10px] text-slate-400">{scan.type}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-bold">
                  {scan.status}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">{scan.date}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
