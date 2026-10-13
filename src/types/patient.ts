export type SexOption = 'Male' | 'Female' | 'Other' | 'Prefer not to specify';

export type ECGPattern =
  | 'Normal Sinus Rhythm'
  | 'Anterior ST-Elevation Pattern'
  | 'Lateral T-Wave Inversion Pattern'
  | 'Inferior ST-Depression Pattern';

export interface ECGEvidence {
  available: boolean;
  pattern?: ECGPattern;
  leadNotes?: string;
}

export interface SymptomEvidence {
  available: boolean;
  narrativeText: string;
}

export interface PatientInput {
  patientId: string;
  name?: string;
  age: number;
  sex: SexOption;
  systolicBP?: number;
  diastolicBP?: number;
  cholesterol?: number;
  restingHeartRate?: number;
  bmi?: number;
  ecg?: ECGEvidence;
  symptoms?: SymptomEvidence;
}

// For compatibility with any legacy display references
export interface PatientVitals {
  heartRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  spo2: number;
}

export interface ECGMetrics {
  heartRate: number;
  prInterval: number;
  qrsDuration: number;
  qtcInterval: number;
  rhythm: string;
  leadNotes: string;
}

export interface CardiacFunction {
  ejectionFraction: number;
  lvedv: number;
  lvesv: number;
  strokeVolume: number;
  cardiacOutput: number;
}

export interface ScanRecord {
  id: string;
  modalityName: string;
  status: 'Completed' | 'Pending' | 'Archived';
  date: string;
  type: string;
  notes: string;
  isSynthetic: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: SexOption;
  weight: number;
  height: number;
  bmi: number;
  badge: string;
  isSynthetic: boolean;
  clinicalNarrative: string;
  vitals: PatientVitals;
  ecg: ECGMetrics;
  cardiacFunction: CardiacFunction;
  recentScans: ScanRecord[];
}
