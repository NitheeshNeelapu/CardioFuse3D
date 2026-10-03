import React from 'react';
import { PatientCard } from '../components/Dashboard/PatientCard';
import { HeartScene } from '../components/Heart3D/HeartScene';
import { RiskPanel } from '../components/Dashboard/RiskPanel';
import { ModalityPanel } from '../components/Dashboard/ModalityPanel';
import { EvidencePanel } from '../components/Dashboard/EvidencePanel';
import { ExplainabilityPanel } from '../components/Dashboard/ExplainabilityPanel';
import { GlassCard } from '../components/common/GlassCard';

export const Dashboard: React.FC = () => {
  return (
    <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-4 flex-1 flex flex-col">
      {/* 3-Column Widescreen Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start flex-1">
        
        {/* ================= LEFT COLUMN (3 cols on xl / 25% width) ================= */}
        {/* Patient Profile, Vitals, ECG Analysis Waveform, Cardiac Function, Recent Scans */}
        <div className="xl:col-span-3 space-y-4 order-2 xl:order-1">
          <PatientCard />
        </div>

        {/* ================= CENTER COLUMN (5 cols on xl / Primary Visual Focus) ================= */}
        {/* Large 3D Heart Visualization & Controls */}
        <div className="xl:col-span-5 order-1 xl:order-2 sticky top-[72px] z-10 xl:z-auto">
          <GlassCard
            borderVariant="cyan"
            glow={true}
            padding="sm"
            className="flex flex-col min-h-[560px] lg:min-h-[660px] xl:min-h-[720px] p-3 sm:p-4"
          >
            <HeartScene />
          </GlassCard>
        </div>

        {/* ================= RIGHT COLUMN (4 cols on xl / 33% width) ================= */}
        {/* Risk Panel, Modality Controls, Vessel-Specific Evidence, Explainability & AI Insight */}
        <div className="xl:col-span-4 space-y-4 order-3">
          {/* Risk Panel & Modality Contribution Preview */}
          <RiskPanel />

          {/* Functional Modality Toggles (Clinical, ECG, Text) */}
          <ModalityPanel />

          {/* Vessel-Specific Evidence Panel */}
          <EvidencePanel />

          {/* Explainability Panel & Distinctive AI Insight Card */}
          <ExplainabilityPanel />
        </div>

      </div>
    </div>
  );
};
