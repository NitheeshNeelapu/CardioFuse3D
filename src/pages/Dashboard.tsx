import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { WelcomeState } from '../components/Dashboard/WelcomeState';
import { PatientCard } from '../components/Dashboard/PatientCard';
import { WhatIfPanel } from '../components/Dashboard/WhatIfPanel';
import { HeartScene } from '../components/Heart3D/HeartScene';
import { RiskPanel } from '../components/Dashboard/RiskPanel';
import { ModalityPanel } from '../components/Dashboard/ModalityPanel';
import { EvidencePanel } from '../components/Dashboard/EvidencePanel';
import { ExplainabilityPanel } from '../components/Dashboard/ExplainabilityPanel';
import { AgentPanel } from '../components/Dashboard/AgentPanel';
import { PatientSummaryPanel } from '../components/Dashboard/PatientSummaryPanel';

export const Dashboard: React.FC = () => {
  const analysisStatus = useAppStore((s) => s.analysisStatus);

  if (analysisStatus === 'idle') {
    return <WelcomeState />;
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 flex-1 flex flex-col animate-fadeIn overflow-x-hidden">
      {/* 3-Column Widescreen Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start flex-1 w-full">
        
        {/* ================= 1. HEART VIEWER (Center on Desktop / #1 on Mobile) ================= */}
        {/* Sticky only on xl and up; scrolls naturally on mobile */}
        <div className="xl:col-span-5 order-1 xl:order-2 xl:sticky xl:top-[72px] xl:z-auto w-full">
          <div className="flex flex-col p-2.5 sm:p-4 rounded-2xl border border-cyan-500/30 bg-[#08111F] text-slate-100 shadow-[0_0_25px_rgba(0,229,255,0.08)] w-full">
            <HeartScene />
          </div>
        </div>

        {/* ================= 2. RISK, MODALITIES, EVIDENCE, EXPLAINABILITY, AGENT, SUMMARY (Right on Desktop / #2 on Mobile) ================= */}
        <div className="xl:col-span-4 space-y-4 order-2 xl:order-3 w-full">
          {/* Risk Panel & Modality Contribution Preview */}
          <RiskPanel />

          {/* Functional Modality Toggles (Clinical, ECG, Text) */}
          <ModalityPanel />

          {/* Vessel-Specific Evidence Panel */}
          <EvidencePanel />

          {/* Explainability Panel & Distinctive AI Insight Card */}
          <ExplainabilityPanel />

          {/* Tool-Using Missing Evidence Agent */}
          <AgentPanel />

          {/* Multilingual Patient Explanation & Read Aloud */}
          <PatientSummaryPanel />
        </div>

        {/* ================= 3. PATIENT PROFILE, VITALS, WHAT-IF (Left on Desktop / #3 on Mobile) ================= */}
        <div className="xl:col-span-3 space-y-4 order-3 xl:order-1 w-full">
          <PatientCard />
          <WhatIfPanel />
        </div>

      </div>
    </div>
  );
};
