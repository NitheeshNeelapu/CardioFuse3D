export type Modality = 'clinical' | 'ecg' | 'symptoms';

export interface ModalityState {
  clinical: boolean;
  ecg: boolean;
  symptoms: boolean;
}

export type EvidenceAvailability =
  | 'available'
  | 'unavailable'
  | 'synthetic_demo'
  | 'not_applicable'
  // Uppercase aliases for compatibility with earlier code
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'SYNTHETIC';

export interface ModalityContribution {
  modality: Modality;
  label: string;
  percentage: number | null; // null when unavailable
  demoWeight?: number | null; // explicit demonstration weight
  available: boolean;
  status: EvidenceAvailability;
  color: string;
  explanation?: string;
}

export interface ModalityEvidenceItem {
  modality: Modality;
  name: string;
  status: EvidenceAvailability;
  description: string;
  summary: string;
  featuresCount: number;
  isPatientData?: boolean;
  sourceType?: 'user_provided' | 'synthetic_visualization' | 'not_provided';
}
