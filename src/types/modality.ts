export type Modality = 'clinical' | 'ecg' | 'text';

export interface ModalityState {
  clinical: boolean;
  ecg: boolean;
  text: boolean;
}

export type EvidenceAvailability = 'AVAILABLE' | 'UNAVAILABLE' | 'SYNTHETIC';

export interface ModalityContribution {
  modality: Modality;
  label: string;
  percentage: number | null; // null when unavailable
  available: boolean;
  color: string;
}

export interface ModalityEvidenceItem {
  modality: Modality;
  name: string;
  status: EvidenceAvailability;
  description: string;
  summary: string;
  featuresCount: number;
}
