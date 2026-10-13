import { Vessel, VESSEL_DEFINITIONS } from '../types/vessel';
import { ModalityState, ModalityContribution, ModalityEvidenceItem } from '../types/modality';
import { Patient, PatientInput } from '../types/patient';
import { PredictionResult, VesselPrediction, ExplainabilityFeature, VesselEvidence, ProvenanceData } from '../types/model';
import { scoreVessel } from './scorer';
import { DEMO_PATIENTS, demoPatient01 } from './demoPatient';

export function resolvePatient(input: Patient | string | PatientInput): Patient {
  if (typeof input === 'string') {
    return DEMO_PATIENTS[input] || DEMO_PATIENTS['DEMO-00482'] || demoPatient01;
  }
  if ('vitals' in input && 'clinicalNarrative' in input) {
    return input as Patient;
  }
  const pi = input as PatientInput;
  return {
    id: pi.patientId || 'DEMO-00482',
    name: pi.name || 'Demo Patient',
    age: pi.age || 28,
    sex: pi.sex || 'Male',
    weight: 70,
    height: 175,
    bmi: pi.bmi || 22.7,
    badge: 'SYNTHETIC DATA',
    isSynthetic: true,
    clinicalNarrative: pi.symptoms?.narrativeText || 'No clinical narrative.',
    vitals: {
      heartRate: pi.restingHeartRate || 72,
      bloodPressureSys: pi.systolicBP || 118,
      bloodPressureDia: pi.diastolicBP || 76,
      spo2: 98,
    },
    ecg: {
      heartRate: pi.restingHeartRate || 72,
      prInterval: 160,
      qrsDuration: 96,
      qtcInterval: 412,
      rhythm: pi.ecg?.pattern || 'Normal Sinus Rhythm',
      leadNotes: pi.ecg?.leadNotes || 'Normal ECG tracing.',
    },
    cardiacFunction: {
      ejectionFraction: 65,
      lvedv: 100,
      lvesv: 35,
      strokeVolume: 65,
      cardiacOutput: 4.8,
    },
    recentScans: [],
  };
}

export function computeDemoPrediction(
  selectedVessel: Vessel,
  modalities: ModalityState,
  patientOrInput: Patient | string | PatientInput = demoPatient01
): PredictionResult {
  const patient = resolvePatient(patientOrInput);

  const isClinicalActive = Boolean(modalities.clinical);
  const isEcgActive = Boolean(modalities.ecg);
  const isTextActive = Boolean(modalities.symptoms ?? (modalities as any).text);

  // Compute probabilities for all 3 vessels using transparent rule-based scorer
  const ladScorer = scoreVessel(patient, 'LAD', modalities);
  const lcxScorer = scoreVessel(patient, 'LCX', modalities);
  const rcaScorer = scoreVessel(patient, 'RCA', modalities);

  const probabilities: Record<Vessel, number> = {
    LAD: ladScorer.probability,
    LCX: lcxScorer.probability,
    RCA: rcaScorer.probability,
  };

  const scores: Record<Vessel, { score: number; display: string }> = {
    LAD: { score: ladScorer.probability, display: `${ladScorer.probability}/100 — Demo score` },
    LCX: { score: lcxScorer.probability, display: `${lcxScorer.probability}/100 — Demo score` },
    RCA: { score: rcaScorer.probability, display: `${rcaScorer.probability}/100 — Demo score` },
  };

  // Build dynamic explainability features using patient's real values
  const clinicalFeatures: ExplainabilityFeature[] = [];
  if (isClinicalActive) {
    clinicalFeatures.push({
      feature: `Age (${patient.age} yrs)`,
      category: 'clinical',
      impact: Math.min(85, Math.max(15, Math.round(patient.age * 0.75))),
      direction: patient.age > 45 ? 'positive' : 'negative',
      description: `Patient age ${patient.age} in rule-based scorer baseline`,
    });
    clinicalFeatures.push({
      feature: `Blood Pressure (${patient.vitals.bloodPressureSys}/${patient.vitals.bloodPressureDia} mmHg)`,
      category: 'clinical',
      impact: Math.min(80, Math.max(15, Math.round((patient.vitals.bloodPressureSys / 160) * 55))),
      direction: patient.vitals.bloodPressureSys > 125 ? 'positive' : 'negative',
      description: 'Hemodynamic pressure loading contribution',
    });
    clinicalFeatures.push({
      feature: `BMI (${patient.bmi} kg/m²)`,
      category: 'clinical',
      impact: Math.min(65, Math.max(10, Math.round((patient.bmi / 30) * 35))),
      direction: patient.bmi > 24 ? 'positive' : 'negative',
      description: 'Metabolic body mass index weighting',
    });
    clinicalFeatures.push({
      feature: `Resting Heart Rate (${patient.vitals.heartRate} bpm)`,
      category: 'clinical',
      impact: Math.min(60, Math.max(10, Math.round((patient.vitals.heartRate / 100) * 35))),
      direction: patient.vitals.heartRate > 75 ? 'positive' : 'negative',
      description: 'Resting pulse baseline',
    });
  }

  const ecgFeatures: ExplainabilityFeature[] = [];
  if (isEcgActive) {
    ecgFeatures.push({
      feature: `Rhythm: ${patient.ecg.rhythm}`,
      category: 'ecg',
      impact: 45,
      direction: patient.ecg.rhythm.toLowerCase().includes('normal') ? 'negative' : 'positive',
      description: 'Physiological cardiac rhythm interpretation',
    });
    ecgFeatures.push({
      feature: `Intervals (PR ${patient.ecg.prInterval}ms, QTc ${patient.ecg.qtcInterval}ms, QRS ${patient.ecg.qrsDuration}ms)`,
      category: 'ecg',
      impact: Math.min(75, Math.max(20, Math.round((patient.ecg.qtcInterval / 450) * 45))),
      direction: patient.ecg.qtcInterval > 420 ? 'positive' : 'negative',
      description: 'Conduction transit timing and repolarization interval',
    });
    if (patient.ecg.leadNotes) {
      ecgFeatures.push({
        feature: `Lead Findings: "${patient.ecg.leadNotes}"`,
        category: 'ecg',
        impact: patient.id === 'DEMO-00519' ? 70 : 30,
        direction: patient.id === 'DEMO-00519' ? 'positive' : 'negative',
        description: 'Vessel-territory specific lead wave morphology',
      });
    }
  }

  const textFeatures: ExplainabilityFeature[] = [];
  if (isTextActive && patient.clinicalNarrative) {
    const textLower = patient.clinicalNarrative.toLowerCase();
    if (textLower.includes('substernal')) {
      textFeatures.push({
        feature: 'Narrative keyword: "substernal"',
        category: 'symptoms',
        impact: 65,
        direction: 'positive',
        description: 'Substernal chest sensation indicator',
      });
    }
    if (textLower.includes('exertional')) {
      textFeatures.push({
        feature: 'Narrative keyword: "exertional"',
        category: 'symptoms',
        impact: 55,
        direction: 'positive',
        description: 'Exertional symptom trigger indicator',
      });
    }
    if (textLower.includes('fatigue')) {
      textFeatures.push({
        feature: 'Narrative keyword: "fatigue"',
        category: 'symptoms',
        impact: 40,
        direction: 'positive',
        description: 'Exertional fatigue descriptor',
      });
    }
    if (textLower.includes('no prior') || textLower.includes('no previous')) {
      textFeatures.push({
        feature: 'Narrative keyword: "no prior history"',
        category: 'symptoms',
        impact: 45,
        direction: 'negative',
        description: 'Protective absence of prior cardiac events',
      });
    }
  }

  const allFeatures: ExplainabilityFeature[] = [
    ...clinicalFeatures,
    ...ecgFeatures,
    ...textFeatures,
  ];

  const vesselPredictions: Record<Vessel, VesselPrediction> = {} as Record<Vessel, VesselPrediction>;
  const vessels: Vessel[] = ['LAD', 'LCX', 'RCA'];

  vessels.forEach((v) => {
    const vScorer = v === 'LAD' ? ladScorer : v === 'LCX' ? lcxScorer : rcaScorer;
    vesselPredictions[v] = {
      vessel: v,
      probability: vScorer.probability,
      demoScore: vScorer.probability,
      scoreDisplay: `${vScorer.probability}/100 — Demo score`,
      label: VESSEL_DEFINITIONS[v].fullName,
      isSynthetic: true,
      modalityContributions: {
        clinical: vScorer.shares.clinical,
        ecg: vScorer.shares.ecg,
        symptoms: vScorer.shares.text,
      },
      features: allFeatures,
      aiInsight: {
        title: 'Rule-Based Scorer Insight',
        description: `Rule-based demo score: ${vScorer.probability}/100 projected for ${v} (${VESSEL_DEFINITIONS[v].fullName}). Computed via transparent weighted scorer + occlusion attribution; trained multimodal model is planned.`,
        requiredAction: 'Clinical interpretation requires qualified medical assessment.',
      },
    };
  });

  const activePred = vesselPredictions[selectedVessel];
  const activeScorer = selectedVessel === 'LAD' ? ladScorer : selectedVessel === 'LCX' ? lcxScorer : rcaScorer;

  const contributionsList: ModalityContribution[] = [
    {
      modality: 'clinical',
      label: 'Clinical Data',
      percentage: activeScorer.shares.clinical,
      demoWeight: activeScorer.shares.clinical,
      available: isClinicalActive,
      status: isClinicalActive ? 'available' : 'unavailable',
      color: '#00E5FF',
      explanation: isClinicalActive
        ? `Patient metrics (Age ${patient.age}, BP ${patient.vitals.bloodPressureSys}/${patient.vitals.bloodPressureDia})`
        : 'Clinical evidence stream disabled',
    },
    {
      modality: 'ecg',
      label: 'ECG Signal',
      percentage: activeScorer.shares.ecg,
      demoWeight: activeScorer.shares.ecg,
      available: isEcgActive,
      status: isEcgActive ? 'synthetic_demo' : 'unavailable',
      color: '#8B5CF6',
      explanation: isEcgActive
        ? `Synthetic demo ECG (${patient.ecg.rhythm}, PR ${patient.ecg.prInterval}ms)`
        : 'Patient ECG: Not provided (waveform stream omitted)',
    },
    {
      modality: 'symptoms',
      label: 'Symptom Narrative',
      percentage: activeScorer.shares.text,
      demoWeight: activeScorer.shares.text,
      available: isTextActive,
      status: isTextActive ? 'available' : 'unavailable',
      color: '#EC4899',
      explanation: isTextActive
        ? `Narrative text keyword weights ("${patient.clinicalNarrative.slice(0, 45)}...")`
        : 'No symptom narrative provided',
    },
  ];

  const missingModalities: string[] = [];
  if (!isClinicalActive) missingModalities.push('Clinical data (toggled off)');
  if (!isEcgActive) missingModalities.push('12-Lead ECG (toggled off)');
  if (!isTextActive) missingModalities.push('Symptom Narrative (toggled off)');

  const activeCount = (isClinicalActive ? 1 : 0) + (isEcgActive ? 1 : 0) + (isTextActive ? 1 : 0);

  const provenance: ProvenanceData = {
    executionMode: 'Mock/Demo',
    predictionModel: 'Not connected',
    clinicalValidation: 'Not performed',
    inputSource: 'Synthetic demonstration',
    ecgSource: isEcgActive ? 'Synthetic visualization' : 'Not provided',
    missingModalities,
    missingOptionalFields: [],
    isNumericalOutputSynthetic: true,
    outputLimitations:
      'Rule-based demo scorer (not a trained model). Outputs are computed via transparent weighted scoring and occlusion attribution; trained multimodal model is planned.',
  };

  return {
    selectedVessel,
    probability: probabilities[selectedVessel],
    demoScore: probabilities[selectedVessel],
    scoreDisplay: `${probabilities[selectedVessel]}/100 — Demo score`,
    outputLabel: 'SYNTHETIC DEMONSTRATION OUTPUT — NOT CLINICALLY VALIDATED',
    probabilities,
    scores,
    modalityContributions: activePred.modalityContributions,
    contributionsList,
    evidenceAvailability: {
      clinical: isClinicalActive,
      ecg: isEcgActive,
      symptoms: isTextActive,
    },
    agreement: 'Not calculated — demo mode',
    agreementDescription:
      'Not calculated — demo mode. Defined multi-modality consensus requires a trained predictive model and verified clinical recordings.',
    features: allFeatures,
    isModelOutput: false,
    isSynthetic: true,
    modelConnected: false,
    executionMode: 'Mock/Demo',
    clinicalValidation: 'Not performed',
    activeModalitiesCount: activeCount,
    totalModalitiesCount: 3,
    fusionStrategy: 'Transparent Weighted Scorer + Occlusion Attribution (Trained Multimodal Model Planned)',
    aiInsight: activePred.aiInsight,
    vesselPredictions,
    provenance,
  };
}

export function getDemoVesselEvidence(
  selectedVessel: Vessel,
  modalities: ModalityState,
  patientOrInput: Patient | string | PatientInput = demoPatient01
): VesselEvidence {
  const patient = resolvePatient(patientOrInput);

  const isClinicalActive = Boolean(modalities.clinical);
  const isEcgActive = Boolean(modalities.ecg);
  const isSymptomsActive = Boolean(modalities.symptoms ?? (modalities as any).text);

  const info = VESSEL_DEFINITIONS[selectedVessel];

  const evidenceItems: ModalityEvidenceItem[] = [
    {
      modality: 'clinical',
      name: 'Clinical Evidence',
      status: isClinicalActive ? 'available' : 'unavailable',
      description: isClinicalActive
        ? `Patient vitals: Age ${patient.age}, BP ${patient.vitals.bloodPressureSys}/${patient.vitals.bloodPressureDia} mmHg, HR ${patient.vitals.heartRate} bpm, BMI ${patient.bmi} kg/m².`
        : 'Clinical evidence stream disabled.',
      summary: isClinicalActive ? 'Structured demographic and hemodynamic parameters' : 'Disabled by user toggle',
      featuresCount: isClinicalActive ? 4 : 0,
      isPatientData: true,
      sourceType: isClinicalActive ? 'user_provided' : 'not_provided',
    },
    {
      modality: 'ecg',
      name: 'ECG Signal',
      status: isEcgActive ? 'synthetic_demo' : 'unavailable',
      description: isEcgActive
        ? `Synthetic demo ECG (${patient.ecg.rhythm}, HR ${patient.ecg.heartRate} bpm, PR ${patient.ecg.prInterval}ms, QTc ${patient.ecg.qtcInterval}ms). Lead findings: "${patient.ecg.leadNotes}".`
        : 'Patient ECG: Not provided. Waveform encoder omitted.',
      summary: isEcgActive
        ? 'Synthetic visualization waveform pattern'
        : 'Patient ECG: Not provided',
      featuresCount: isEcgActive ? 2 : 0,
      isPatientData: false,
      sourceType: isEcgActive ? 'synthetic_visualization' : 'not_provided',
    },
    {
      modality: 'symptoms',
      name: 'Symptom Narrative',
      status: isSymptomsActive ? 'available' : 'unavailable',
      description: isSymptomsActive
        ? `Clinical narrative: "${patient.clinicalNarrative.slice(0, 100)}..."`
        : 'No clinical symptom narrative provided.',
      summary: isSymptomsActive ? 'Clinical intake narrative keywords' : 'No narrative provided',
      featuresCount: isSymptomsActive ? 2 : 0,
      isPatientData: isSymptomsActive,
      sourceType: isSymptomsActive ? 'user_provided' : 'not_provided',
    },
  ];

  return {
    vessel: selectedVessel,
    fullName: info.fullName,
    territory: info.territory,
    status: 'No vessel-specific clinical evidence available.',
    hasVesselSpecificEvidence: false,
    vesselDisclaimer:
      'Territory anatomical mapping demonstrates UI synchronization only. No angiographic stenosis, lesion, or blockage has been observed or inferred.',
    evidenceItems,
  };
}

// Backward compatibility aliases
export const calculatePredictionFromPatientInput = (
  input: PatientInput,
  vessel: Vessel,
  modalities: ModalityState
) => computeDemoPrediction(vessel, modalities, input);

export const getVesselEvidenceFromPatientInput = (
  input: PatientInput,
  vessel: Vessel,
  modalities: ModalityState
) => getDemoVesselEvidence(vessel, modalities, input);
