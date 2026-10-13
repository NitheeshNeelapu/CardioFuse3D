import { Vessel } from './vessel';
import { Modality, ModalityContribution, ModalityEvidenceItem } from './modality';

export interface ExplainabilityFeature {
  feature: string;
  category: Modality;
  impact: number; // impact percentage or relative weight
  direction: 'positive' | 'negative';
  description?: string;
}

export interface VesselEvidence {
  vessel: Vessel;
  fullName: string;
  territory: string;
  status: string; // e.g. "No vessel-specific clinical evidence available."
  hasVesselSpecificEvidence: boolean;
  evidenceItems: ModalityEvidenceItem[];
  vesselDisclaimer?: string;
}

export interface VesselPrediction {
  vessel: Vessel;
  probability: number; // backward compatibility for numeric normalization (0-100)
  demoScore: number; // synthetic demonstration score e.g. 31
  scoreDisplay: string; // "31/100 — Synthetic demo score"
  label: string;
  isSynthetic: boolean;
  modalityContributions: {
    clinical: number | null;
    ecg: number | null;
    symptoms: number | null;
  };
  features: ExplainabilityFeature[];
  aiInsight: {
    title: string;
    description: string;
    requiredAction: string;
  };
}

export interface ProvenanceData {
  executionMode: 'Mock/Demo';
  predictionModel: 'Not connected';
  clinicalValidation: 'Not performed';
  inputSource: 'User-entered' | 'Synthetic demonstration';
  ecgSource: 'Patient recording' | 'Synthetic visualization' | 'Not provided';
  missingModalities: string[];
  missingOptionalFields: string[];
  isNumericalOutputSynthetic: boolean;
  outputLimitations: string;
}

export interface PredictionResult {
  selectedVessel: Vessel;
  probability: number; // demonstration score for the selected vessel (0-100)
  demoScore: number;
  scoreDisplay: string; // e.g. "31/100 — Synthetic demo score"
  outputLabel: string; // "SYNTHETIC DEMONSTRATION OUTPUT — NOT CLINICALLY VALIDATED"
  probabilities: {
    LAD: number;
    LCX: number;
    RCA: number;
  };
  scores: {
    LAD: { score: number; display: string };
    LCX: { score: number; display: string };
    RCA: { score: number; display: string };
  };
  modalityContributions: {
    clinical: number | null;
    ecg: number | null;
    symptoms: number | null;
  };
  contributionsList: ModalityContribution[];
  evidenceAvailability: {
    clinical: boolean;
    ecg: boolean;
    symptoms: boolean;
  };
  agreement: string | null; // "Not calculated — demo mode"
  agreementDescription: string;
  features: ExplainabilityFeature[];
  isModelOutput: boolean;
  isSynthetic: boolean;
  modelConnected: boolean;
  executionMode: 'Mock/Demo';
  clinicalValidation: 'Not performed';
  activeModalitiesCount: number;
  totalModalitiesCount: number;
  fusionStrategy: string;
  aiInsight: {
    title: string;
    description: string;
    requiredAction: string;
  };
  vesselPredictions: Record<Vessel, VesselPrediction>;
  provenance: ProvenanceData;
}
