import { Vessel } from '../types/vessel';
import { Modality, ModalityState, ModalityContribution, ModalityEvidenceItem } from '../types/modality';
import { PredictionResult, VesselPrediction, ExplainabilityFeature, VesselEvidence } from '../types/model';

// Function to generate deterministic, synchronized predictions based on selected vessel & active modalities
export function computeDemoPrediction(
  selectedVessel: Vessel,
  modalities: ModalityState,
  patientId: string = 'DEMO-00482'
): PredictionResult {
  const isEcgActive = modalities.ecg;
  const isClinicalActive = modalities.clinical;
  const isTextActive = modalities.text;

  // Base raw weights for each vessel under full 3-modality configuration
  const vesselConfigs: Record<
    Vessel,
    {
      fullProbability: number;
      clinicalWeight: number;
      ecgWeight: number;
      textWeight: number;
      fullName: string;
      territory: string;
    }
  > = {
    LAD: {
      fullProbability: 68,
      clinicalWeight: 24,
      ecgWeight: 18,
      textWeight: 26,
      fullName: 'Left Anterior Descending Artery',
      territory: 'Anterior ventricular wall, apex, anterior 2/3 interventricular septum',
    },
    LCX: {
      fullProbability: 42,
      clinicalWeight: 16,
      ecgWeight: 12,
      textWeight: 14,
      fullName: 'Left Circumflex Artery',
      territory: 'Posterolateral wall of left ventricle, anterolateral papillary muscle',
    },
    RCA: {
      fullProbability: 28,
      clinicalWeight: 11,
      ecgWeight: 8,
      textWeight: 9,
      fullName: 'Right Coronary Artery',
      territory: 'Right ventricle, posterior wall of left ventricle, inferior septum, AV node',
    },
  };

  const vesselPredictions: Record<Vessel, VesselPrediction> = {} as Record<Vessel, VesselPrediction>;

  (['LAD', 'LCX', 'RCA'] as Vessel[]).forEach((vessel) => {
    const config = vesselConfigs[vessel];

    let calcClinical: number | null = null;
    let calcEcg: number | null = null;
    let calcText: number | null = null;
    let calcProb = 0;

    // Build contributions based on active toggles
    if (isClinicalActive && isEcgActive && isTextActive) {
      calcClinical = config.clinicalWeight;
      calcEcg = config.ecgWeight;
      calcText = config.textWeight;
      calcProb = config.fullProbability;
    } else {
      // Recalculate using available evidence only without synthesizing absent modalities
      let activeSum = 0;
      let count = 0;
      if (isClinicalActive) {
        calcClinical = Math.round(config.clinicalWeight * 1.25);
        activeSum += calcClinical;
        count++;
      }
      if (isEcgActive) {
        calcEcg = Math.round(config.ecgWeight * 1.25);
        activeSum += calcEcg;
        count++;
      }
      if (isTextActive) {
        calcText = Math.round(config.textWeight * 1.25);
        activeSum += calcText;
        count++;
      }
      calcProb = count > 0 ? Math.min(100, Math.round(activeSum)) : 0;
    }

    // Explainability Features
    const features: ExplainabilityFeature[] = [];

    if (isClinicalActive) {
      if (vessel === 'LAD') {
        features.push({
          feature: 'Age Factor (28 yrs baseline)',
          category: 'clinical',
          impact: 42,
          direction: 'positive',
          description: 'Young adult demographic profile within synthetic training cohort.',
        });
        features.push({
          feature: 'Blood Pressure (118/76 mmHg)',
          category: 'clinical',
          impact: 38,
          direction: 'positive',
          description: 'Normotensive physiological baseline representation.',
        });
        features.push({
          feature: 'Risk Factors / Lipids (Synthetic vector)',
          category: 'clinical',
          impact: 28,
          direction: 'positive',
          description: 'Absence of secondary vascular markers.',
        });
      } else if (vessel === 'LCX') {
        features.push({
          feature: 'Blood Pressure / Hemodynamics',
          category: 'clinical',
          impact: 34,
          direction: 'positive',
          description: 'Circumflex lateral territory baseline.',
        });
        features.push({
          feature: 'Risk Factors profile',
          category: 'clinical',
          impact: 26,
          direction: 'positive',
          description: 'Non-elevated systemic profile.',
        });
      } else {
        features.push({
          feature: 'Clinical Resting Parameters',
          category: 'clinical',
          impact: 29,
          direction: 'positive',
          description: 'Right coronary hemodynamic representation.',
        });
        features.push({
          feature: 'Age and Metabolic baseline',
          category: 'clinical',
          impact: 22,
          direction: 'positive',
          description: 'Standard metabolic representation in demo data.',
        });
      }
    }

    if (isEcgActive) {
      if (vessel === 'LAD') {
        features.push({
          feature: 'Rhythm pattern (Normal Sinus)',
          category: 'ecg',
          impact: 55,
          direction: 'positive',
          description: 'Precordial lead V1-V4 morphology alignment.',
        });
        features.push({
          feature: 'Intervals (PR 160ms, QTc 412ms)',
          category: 'ecg',
          impact: 48,
          direction: 'positive',
          description: 'Conduction timing within normal demo parameters.',
        });
        features.push({
          feature: 'Waveform features (ST-T morphology)',
          category: 'ecg',
          impact: 39,
          direction: 'positive',
          description: 'Isoelectric anterior lead ST patterns.',
        });
      } else if (vessel === 'LCX') {
        features.push({
          feature: 'Lateral lead V5-V6 Waveform vectors',
          category: 'ecg',
          impact: 36,
          direction: 'positive',
          description: 'Lateral chamber repolarization features.',
        });
        features.push({
          feature: 'Rhythm pattern stability',
          category: 'ecg',
          impact: 28,
          direction: 'positive',
          description: 'Consistent cardiac rhythm.',
        });
      } else {
        features.push({
          feature: 'Inferior lead II, III, aVF Waveform vectors',
          category: 'ecg',
          impact: 31,
          direction: 'positive',
          description: 'Absence of inferior lead morphological deviation.',
        });
        features.push({
          feature: 'Intervals (AV conduction timing)',
          category: 'ecg',
          impact: 24,
          direction: 'positive',
          description: 'Normal nodal transit features.',
        });
      }
    }

    if (isTextActive) {
      if (vessel === 'LAD') {
        features.push({
          feature: 'Clinical narrative: "Non-anginal exertional awareness"',
          category: 'text',
          impact: 64,
          direction: 'positive',
          description: 'BioClinicalBERT token embeddings matching anterior wall territory.',
        });
        features.push({
          feature: 'Clinical narrative: "No prior revascularization"',
          category: 'text',
          impact: 32,
          direction: 'negative',
          description: 'Negative history token weight.',
        });
      } else if (vessel === 'LCX') {
        features.push({
          feature: 'Clinical narrative: Exertional description embeddings',
          category: 'text',
          impact: 41,
          direction: 'positive',
          description: 'General thoracic sensation tokens.',
        });
      } else {
        features.push({
          feature: 'Clinical narrative: Absence of radiating symptoms',
          category: 'text',
          impact: 35,
          direction: 'negative',
          description: 'Non-radiating symptom token extraction.',
        });
      }
    }

    vesselPredictions[vessel] = {
      vessel,
      probability: calcProb,
      label: config.fullName,
      modalityContributions: {
        clinical: calcClinical,
        ecg: calcEcg,
        text: calcText,
      },
      features,
      aiInsight: {
        title: 'AI Insight',
        description: `Model detected a demonstration evidence pattern involving the selected coronary vessel (${vessel}: ${config.fullName}).`,
        requiredAction: 'Clinical interpretation required.',
        badge: 'DEMO OUTPUT',
      },
    };
  });

  const activeVesselPred = vesselPredictions[selectedVessel];

  // Modality contribution array for charts
  const modalityContributions: ModalityContribution[] = [
    {
      modality: 'clinical',
      label: 'Clinical',
      percentage: activeVesselPred.modalityContributions.clinical,
      available: isClinicalActive,
      color: '#00E5FF',
    },
    {
      modality: 'ecg',
      label: 'ECG',
      percentage: activeVesselPred.modalityContributions.ecg,
      available: isEcgActive,
      color: '#8B5CF6',
    },
    {
      modality: 'text',
      label: 'Text',
      percentage: activeVesselPred.modalityContributions.text,
      available: isTextActive,
      color: '#EC4899',
    },
  ];

  const activeModalitiesCount =
    (isClinicalActive ? 1 : 0) + (isEcgActive ? 1 : 0) + (isTextActive ? 1 : 0);

  return {
    selectedVessel,
    probability: activeVesselPred.probability,
    modalityContributions,
    vesselPredictions,
    evidenceAvailability: {
      clinical: isClinicalActive,
      ecg: isEcgActive,
      text: isTextActive,
    },
    isDemoData: true,
    explanationFeatures: activeVesselPred.features,
    activeModalitiesCount,
    totalModalitiesCount: 3,
    fusionStrategy: isEcgActive
      ? 'Late Fusion (Cross-Attention Multimodal Concatenation)'
      : 'Masked Fusion (Dual-Modality Active, ECG Masked)',
    aiInsight: activeVesselPred.aiInsight,
  };
}

// Helper to get structured vessel evidence items
export function getDemoVesselEvidence(
  vessel: Vessel,
  modalities: ModalityState
): VesselEvidence {
  const configs: Record<Vessel, { fullName: string; territory: string }> = {
    LAD: {
      fullName: 'Left Anterior Descending Artery',
      territory: 'Anterior ventricular wall, apex, anterior 2/3 of interventricular septum',
    },
    LCX: {
      fullName: 'Left Circumflex Artery',
      territory: 'Posterolateral wall of left ventricle, anterolateral papillary muscle, left atrium',
    },
    RCA: {
      fullName: 'Right Coronary Artery',
      territory: 'Right ventricle, posterior 1/3 of interventricular septum, inferior wall, AV node',
    },
  };

  const evidenceItems: ModalityEvidenceItem[] = [
    {
      modality: 'clinical',
      name: 'Clinical Evidence',
      status: modalities.clinical ? 'AVAILABLE' : 'UNAVAILABLE',
      description: 'Structured demographics, hemodynamics (BP 118/76), and metabolic parameters.',
      summary: modalities.clinical ? 'Standardized tabular features embedded via MLP encoder' : 'Clinical tabular inputs omitted from fusion layer',
      featuresCount: modalities.clinical ? 6 : 0,
    },
    {
      modality: 'ecg',
      name: 'ECG Evidence',
      status: modalities.ecg ? 'AVAILABLE' : 'UNAVAILABLE',
      description: '12-lead precordial time-series waveform (HR 72 bpm, PR 160ms, QTc 412ms).',
      summary: modalities.ecg
        ? 'Lead V1-V6 1D-ResNet temporal embeddings available'
        : 'ECG evidence unavailable. Recalculated using available evidence.',
      featuresCount: modalities.ecg ? 3 : 0,
    },
    {
      modality: 'text',
      name: 'Text Evidence',
      status: modalities.text ? 'AVAILABLE' : 'UNAVAILABLE',
      description: 'Unstructured clinical intake narrative and exertional descriptors.',
      summary: modalities.text ? 'BioClinicalBERT clinical narrative tokens active' : 'Text narrative stream disabled',
      featuresCount: modalities.text ? 2 : 0,
    },
  ];

  return {
    vessel,
    fullName: configs[vessel].fullName,
    territory: configs[vessel].territory,
    status: 'Demo interpretation',
    evidenceItems,
  };
}
