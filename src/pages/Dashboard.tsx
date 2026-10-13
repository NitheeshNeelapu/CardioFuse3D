import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { WelcomeState } from '../components/Dashboard/WelcomeState';
import { Hero } from '../components/Hero/Hero';
import { HeartScene } from '../components/Heart3D/HeartScene';
import { RiskPanel } from '../components/Dashboard/RiskPanel';
import { ConflictCard } from '../components/Dashboard/ConflictCard';
import { Bullseye } from '../components/Charts/Bullseye';
import { WhatIfPanel } from '../components/Dashboard/WhatIfPanel';
import { TerritorySummary } from '../components/Dashboard/TerritorySummary';
import { ModalityPanel } from '../components/Dashboard/ModalityPanel';
import { EvidencePanel } from '../components/Dashboard/EvidencePanel';
import { ExplainabilityPanel } from '../components/Dashboard/ExplainabilityPanel';
import { AgentPanel } from '../components/Dashboard/AgentPanel';
import { PatientSummaryPanel } from '../components/Dashboard/PatientSummaryPanel';
import { PatientCard } from '../components/Dashboard/PatientCard';
import { ECGChart } from '../components/Charts/ECGChart';

interface SectionHeadingProps {
  id: string;
  number: string;
  title: string;
  description: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ id, number, title, description }) => (
  <div id={id} className="scroll-mt-24 mb-6 sm:mb-8 space-y-2">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold text-slate-900 bg-gradient-to-r from-pink-200 via-sky-200 to-emerald-200 shadow-sm select-none">
          {number}
        </span>
        <h2
          className="text-white font-extrabold tracking-tight select-none leading-none"
          style={{ fontSize: 'clamp(34px, 6vw, 72px)', letterSpacing: '-0.03em' }}
        >
          {title}
        </h2>
      </div>

      <span className="text-[10px] sm:text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full select-none">
        Synthetic demo data
      </span>
    </div>

    <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-2xl">
      {description}
    </p>
  </div>
);

export const Dashboard: React.FC = () => {
  const analysisStatus = useAppStore((s) => s.analysisStatus);

  if (analysisStatus === 'idle') {
    return (
      <div className="w-full flex flex-col flex-1">
        <Hero />
        <div id="dashboard" className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <WelcomeState />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col flex-1">
      {/* Editorial Hero Component */}
      <Hero />

      {/* Main Dashboard Container */}
      <div
        id="dashboard"
        className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 flex-1 flex flex-col overflow-x-hidden pb-12"
      >
        {/* =========================================================================
            SECTION 01: ANATOMY
            Row 1: HeartScene card (xl: col-span-8) + Right stack (RiskPanel + ConflictCard)
            Row 2: Masonry grid with TerritorySummary and Bullseye
           ========================================================================= */}
        <section className="w-full border-t border-white/10 py-12 md:py-16">
          <SectionHeading
            id="anatomy"
            number="01"
            title="Anatomy"
            description="Interactive 3D coronary arborization, late-fusion risk probability, and cross-modality agreement telemetry."
          />

          {/* Row 1: 3D Heart & Risk Telemetry Stack */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start w-full">
            {/* HeartScene card: xl:col-span-8, fixed viewer height */}
            <div className="xl:col-span-8 w-full">
              <div className="flex flex-col p-2.5 sm:p-4 rounded-2xl border border-cyan-500/30 bg-[#08111F] text-slate-100 shadow-[0_0_25px_rgba(0,229,255,0.08)] w-full">
                <HeartScene />
              </div>
            </div>

            {/* Stack on the right: xl:col-span-4 with RiskPanel + ConflictCard */}
            <div className="xl:col-span-4 space-y-4 w-full">
              <RiskPanel />
              <ConflictCard />
            </div>
          </div>

          {/* Row 2: Masonry grid with TerritorySummary and Bullseye */}
          <div className="columns-1 md:columns-2 gap-4 mt-4 w-full">
            <div className="break-inside-avoid mb-4">
              <TerritorySummary />
            </div>
            <div className="break-inside-avoid mb-4">
              <Bullseye />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 02: EVIDENCE
            Masonry grid: PatientCard, 12-lead ECG, ModalityPanel, EvidencePanel
           ========================================================================= */}
        <section className="w-full border-t border-white/10 py-12 md:py-16">
          <SectionHeading
            id="evidence"
            number="02"
            title="Evidence"
            description="Patient intake parameters, continuous 12-lead waveform inspection, and active multimodal input channels."
          />

          <div className="columns-1 md:columns-2 xl:columns-3 gap-4 w-full">
            <div className="break-inside-avoid mb-4">
              <PatientCard />
            </div>
            <div className="break-inside-avoid mb-4">
              <ECGChart />
            </div>
            <div className="break-inside-avoid mb-4">
              <ModalityPanel />
            </div>
            <div className="break-inside-avoid mb-4">
              <EvidencePanel />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 03: EXPLAIN
            Masonry grid: ExplainabilityPanel, AgentPanel, PatientSummaryPanel, WhatIfPanel
           ========================================================================= */}
        <section className="w-full border-t border-white/10 py-12 md:py-16">
          <SectionHeading
            id="explain"
            number="03"
            title="Explain"
            description="Attribution transparency, autonomous missing-evidence reasoning, multilingual translation, and what-if simulation."
          />

          <div className="columns-1 md:columns-2 xl:columns-3 gap-4 w-full">
            <div className="break-inside-avoid mb-4">
              <ExplainabilityPanel />
            </div>
            <div className="break-inside-avoid mb-4">
              <AgentPanel />
            </div>
            <div className="break-inside-avoid mb-4">
              <PatientSummaryPanel />
            </div>
            <div className="break-inside-avoid mb-4">
              <WhatIfPanel />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
