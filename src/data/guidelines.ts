export interface GuidelineSnippet {
  id: string;
  title: string;
  category: 'primary' | 'biomarker' | 'functional' | 'imaging' | 'safety';
  snippet: string;
}

export const CLINICAL_GUIDELINES: Record<string, GuidelineSnippet> = {
  resting_ecg: {
    id: 'resting_ecg',
    title: 'Resting 12-Lead Electrocardiogram (ECG)',
    category: 'primary',
    snippet:
      'A resting 12-lead ECG assesses electrical conduction, rhythm integrity, and anatomical repolarization deviations (ST/T vectors) that can reflect regional territorial ischemia.',
  },
  troponin: {
    id: 'troponin',
    title: 'High-Sensitivity Cardiac Troponin Biomarkers',
    category: 'biomarker',
    snippet:
      'High-sensitivity cardiac troponin testing quantifies acute myocardial injury and is critical in emergency and acute chest-pain pathways when acute coronary syndrome is clinically suspected.',
  },
  echocardiography: {
    id: 'echocardiography',
    title: 'Transthoracic Echocardiography (TTE)',
    category: 'imaging',
    snippet:
      'Transthoracic echocardiography assesses left ventricular ejection fraction, stroke volumes, and regional myocardial wall motion abnormalities corresponding to vascular distributions.',
  },
  stress_testing: {
    id: 'stress_testing',
    title: 'Functional Cardiac Stress Testing',
    category: 'functional',
    snippet:
      'Functional stress testing (exercise treadmill or pharmacological stress imaging) identifies reversible hemodynamic ischemia under increased myocardial oxygen demand.',
  },
  ccta: {
    id: 'ccta',
    title: 'Coronary Computed Tomography Angiography (CCTA)',
    category: 'imaging',
    snippet:
      'Coronary CT angiography provides high-resolution non-invasive visualization of coronary lumen patency, stenosis grade, and atherosclerotic plaque morphology.',
  },
  clinician_review: {
    id: 'clinician_review',
    title: 'Mandatory Clinical Physician Oversight',
    category: 'safety',
    snippet:
      'All computational predictions and evidence linkages require direct evaluation, history taking, and medical decision-making by a licensed physician; research models must never guide patient care.',
  },
};

export function lookupGuideline(topic: string): GuidelineSnippet {
  return (
    CLINICAL_GUIDELINES[topic] || {
      id: topic,
      title: 'Clinical Practice Consideration',
      category: 'primary',
      snippet: CLINICAL_GUIDELINES.clinician_review.snippet,
    }
  );
}
