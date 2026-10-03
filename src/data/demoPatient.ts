import { Patient } from '../types/patient';

export const demoPatient01: Patient = {
  id: 'DEMO-00482',
  name: 'Demo Patient 01',
  age: 28,
  sex: 'Male',
  weight: 72,
  height: 178,
  bmi: 22.7,
  badge: 'SYNTHETIC DATA',
  isSynthetic: true,
  clinicalNarrative:
    'Synthetic demonstration profile for multimodal AI testing. Patient presents with non-anginal exertional awareness. No previous myocardial infarction or prior revascularization recorded in synthetic research dataset.',
  vitals: {
    heartRate: 72,
    bloodPressureSys: 118,
    bloodPressureDia: 76,
    spo2: 98,
  },
  ecg: {
    heartRate: 72,
    prInterval: 160,
    qrsDuration: 96,
    qtcInterval: 412,
    rhythm: 'Normal Sinus Rhythm',
    leadNotes: 'Isoelectric ST segments; normal physiological axis in synthetic demo tracing.',
  },
  cardiacFunction: {
    ejectionFraction: 68,
    lvedv: 98,
    lvesv: 31,
    strokeVolume: 67,
    cardiacOutput: 4.8,
  },
  recentScans: [
    {
      id: 'SCAN-MRI-01',
      modalityName: 'Cardiac MRI',
      type: 'Demo Scan',
      status: 'Completed',
      date: '2026-09-18',
      notes: 'Synthetic MRI protocol: Normal myocardial perfusion, no late gadolinium enhancement in demo cohort.',
      isSynthetic: true,
    },
    {
      id: 'SCAN-CTA-02',
      modalityName: 'CT Angiography',
      type: 'Demo Scan',
      status: 'Completed',
      date: '2026-08-04',
      notes: 'Synthetic CTA reconstruction: Calcium score evaluation benchmark test pattern.',
      isSynthetic: true,
    },
    {
      id: 'SCAN-ECHO-03',
      modalityName: 'Echocardiogram',
      type: 'Demo Scan',
      status: 'Completed',
      date: '2026-06-12',
      notes: 'Synthetic Transthoracic Echo: Preserved LV systolic function (LVEF 68%).',
      isSynthetic: true,
    },
  ],
};

export const demoPatient02: Patient = {
  id: 'DEMO-00519',
  name: 'Demo Patient 02',
  age: 54,
  sex: 'Female',
  weight: 68,
  height: 165,
  bmi: 25.0,
  badge: 'SYNTHETIC DATA',
  isSynthetic: true,
  clinicalNarrative:
    'Synthetic test case: Mild exertional fatigue and substernal sensation during high-load treadmill test. Synthesized for multi-vessel cross-attention validation.',
  vitals: {
    heartRate: 78,
    bloodPressureSys: 132,
    bloodPressureDia: 84,
    spo2: 97,
  },
  ecg: {
    heartRate: 78,
    prInterval: 168,
    qrsDuration: 102,
    qtcInterval: 426,
    rhythm: 'Sinus Rhythm',
    leadNotes: 'Minor non-specific T-wave flattening in lateral leads.',
  },
  cardiacFunction: {
    ejectionFraction: 62,
    lvedv: 104,
    lvesv: 39,
    strokeVolume: 65,
    cardiacOutput: 5.1,
  },
  recentScans: [
    {
      id: 'SCAN-CTA-09',
      modalityName: 'CT Angiography',
      type: 'Demo Scan',
      status: 'Completed',
      date: '2026-09-22',
      notes: 'Synthetic evaluation dataset scan entry.',
      isSynthetic: true,
    },
  ],
};

export const DEMO_PATIENTS: Record<string, Patient> = {
  'DEMO-00482': demoPatient01,
  'DEMO-00519': demoPatient02,
};
