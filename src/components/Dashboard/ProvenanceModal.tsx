import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Database, ShieldAlert, Cpu, Layers, AlertCircle, FileText } from 'lucide-react';
import { useAppStore } from '../../state/useAppStore';

export const ProvenanceModal: React.FC = () => {
  const isProvenanceOpen = useAppStore((s) => s.isProvenanceOpen);
  const setIsProvenanceOpen = useAppStore((s) => s.setIsProvenanceOpen);

  return (
    <Modal
      isOpen={isProvenanceOpen}
      onClose={() => setIsProvenanceOpen(false)}
      title="Model & Data Provenance"
      subtitle="Architectural Specifications, Data Lineage & Clinical Safety Disclosures"
      icon={<Database className="w-4 h-4 text-cyan-400" />}
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs font-sans">
        {/* Urgent Research Prototype Notice */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>RESEARCH PROTOTYPE • NOT A MEDICAL DEVICE</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            CARDIOAI is an investigational research prototype designed exclusively to demonstrate evidence-to-anatomy multimodal machine learning architectures. Model-derived outputs are demonstration estimates and must NOT be used for clinical decisions, triage, diagnosis, or patient management.
          </p>
        </div>

        {/* 6 Core Provenance Dimensions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          {/* DATA */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">1. DATA SOURCE</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xs">Synthetic Demo Data</span>
              <Badge variant="synthetic">SYNTHETIC</Badge>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              All clinical vitals, waveforms, and patient narratives are synthetic demonstration benchmarks. No real patient health information (PHI) is present.
            </p>
          </div>

          {/* MODEL */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">2. MODEL ARCHITECTURE</span>
            <span className="text-white font-bold text-xs">Multimodal Late Fusion</span>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Cross-attention fusion aggregating tabular embeddings, 1D ResNet waveform vectors, and clinical NLP tokens.
            </p>
          </div>

          {/* MODALITIES */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">3. MODALITIES SUPPORTED</span>
            <div className="flex flex-wrap gap-1 text-[10px] text-cyan-300">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">Clinical Tabular</span>
              <span className="px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">12-Lead ECG</span>
              <span className="px-1.5 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">Clinical Narrative</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Supports dynamic masking: when a modality like ECG is disabled, model recalculates using available inputs rather than fabricating missing signals.
            </p>
          </div>

          {/* EVALUATION */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">4. EVALUATION STATUS</span>
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-bold text-xs">Evaluation Pending</span>
              <Badge variant="amber">PENDING</Badge>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              No ROC-AUC, sensitivity, specificity, or test-set accuracy metrics are claimed or fabricated. Evaluation is pending multi-center benchmark verification.
            </p>
          </div>

          {/* VALIDATION */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">5. CLINICAL VALIDATION</span>
            <span className="text-rose-300 font-bold text-xs">Clinical Validation Not Performed</span>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              This system has not undergone prospective clinical trials, randomized evaluation, or clearance by medical regulatory authorities.
            </p>
          </div>

          {/* SAFETY */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">6. SAFETY POLICY</span>
            <span className="text-emerald-300 font-bold text-xs">Non-Diagnostic Guarantee</span>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Strict phrasing protocol enforced: "Model-derived probability", "Evidence pattern detected", and "Clinical interpretation required."
            </p>
          </div>
        </div>

        {/* Target Anatomical Supply Beds */}
        <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 font-mono space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase">
            <span>Synchronized Anatomical Supply Beds</span>
            <span className="text-cyan-400">Coronary Projections</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-white/[0.02] border border-cyan-500/20">
              <span className="text-cyan-300 font-bold block">LAD</span>
              <span className="text-[10px] text-slate-400 block">Ant. Descending</span>
            </div>
            <div className="p-2 rounded bg-white/[0.02] border border-violet-500/20">
              <span className="text-violet-300 font-bold block">LCX</span>
              <span className="text-[10px] text-slate-400 block">Circumflex</span>
            </div>
            <div className="p-2 rounded bg-white/[0.02] border border-emerald-500/20">
              <span className="text-emerald-300 font-bold block">RCA</span>
              <span className="text-[10px] text-slate-400 block">Right Coronary</span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            Build: CARDIOAI-v0.2-RESEARCH
          </span>
          <button
            onClick={() => setIsProvenanceOpen(false)}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold transition-all"
          >
            ACKNOWLEDGE & CLOSE
          </button>
        </div>
      </div>
    </Modal>
  );
};
