import { Activity, Database, FileText, Cpu, Heart, LucideIcon } from 'lucide-react';

export interface PipelineStage {
  id: number;
  label: string;
  desc: string;
  icon: LucideIcon;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 1, label: 'INGESTING CLINICAL', desc: 'Normalizing tabular demographics & vitals', icon: Database },
  { id: 2, label: 'PROCESSING ECG', desc: '1D-CNN temporal morphological vectors', icon: Activity },
  { id: 3, label: 'EMBEDDING NARRATIVE', desc: 'BioClinicalBERT text attention tokens', icon: FileText },
  { id: 4, label: 'FUSING MODALITIES', desc: 'Late-fusion cross-attention synthesis', icon: Cpu },
  { id: 5, label: 'MAPPING ANATOMY', desc: 'Coronary arterial projection (LAD • LCX • RCA)', icon: Heart },
];
