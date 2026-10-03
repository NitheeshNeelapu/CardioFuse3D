export interface PatientVitals {
  heartRate: number; // bpm
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number; // mmHg
  spo2: number; // %
}

export interface ECGMetrics {
  heartRate: number; // bpm
  prInterval: number; // ms
  qrsDuration: number; // ms
  qtcInterval: number; // ms
  rhythm: string;
  leadNotes: string;
}

export interface CardiacFunction {
  ejectionFraction: number; // %
  lvedv: number; // ml (Left Ventricular End-Diastolic Volume)
  lvesv: number; // ml (Left Ventricular End-Systolic Volume)
  strokeVolume: number; // ml
  cardiacOutput: number; // L/min
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
  sex: 'Male' | 'Female' | 'Other';
  weight: number; // kg
  height: number; // cm
  bmi: number;
  badge: string;
  isSynthetic: boolean;
  clinicalNarrative: string;
  vitals: PatientVitals;
  ecg: ECGMetrics;
  cardiacFunction: CardiacFunction;
  recentScans: ScanRecord[];
}
