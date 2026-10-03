import { Vessel } from './vessel';
import { Modality, ModalityContribution, ModalityEvidenceItem } from './modality';

export interface ExplainabilityFeature {
  feature: string;
  category: Modality;
  impact: number; // 0 - 100 relative contribution
  direction: 'positive' | 'negative';
  description?: string;
}

export interface VesselEvidence {
  vessel: Vessel;
  fullName: string;
  territory: string;
  status: string; // e.g. "Demo interpretation"
  evidenceItems: ModalityEvidenceItem[];
}

export interface VesselPrediction {
  vessel: Vessel;
  probability: number; // 0 - 100 (%)
  label: string;
  modalityContributions: {
    clinical: number | null;
    ecg: number | null;
    text: number | null;
  };
  features: ExplainabilityFeature[];
  aiInsight: {
    title: string;
    description: string;
    requiredAction: string;
    badge: string;
  };
}

export interface PredictionResult {
  selectedVessel: Vessel;
  probability: number;
  modalityContributions: ModalityContribution[];
  vesselPredictions: Record<Vessel, VesselPrediction>;
  evidenceAvailability: Record<Modality, boolean>;
  isDemoData: boolean;
  explanationFeatures: ExplainabilityFeature[];
  activeModalitiesCount: number;
  totalModalitiesCount: number;
  fusionStrategy: string;
  aiInsight: {
    title: string;
    description: string;
    requiredAction: string;
    badge: string;
  };
}
