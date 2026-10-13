import { Patient } from '../types/patient';
import { Vessel } from '../types/vessel';
import { ModalityState } from '../types/modality';

/**
 * ============================================================================
 * RULE-BASED DEMO SCORER (NOT A TRAINED MODEL)
 * Transparent weighted scorer with modality-specific contributions and shares.
 * ============================================================================
 */

export const TEXT_KEYWORDS = [
  'substernal',
  'exertional',
  'fatigue',
  'radiating',
  'no prior',
  'no previous',
] as const;

export interface VesselWeights {
  bias: number;
  clinical: {
    age: number;
    sexMale: number;
    sexFemale: number;
    sbp: number;
    bmi: number;
  };
  ecg: {
    hr: number;
    pr: number;
    qrs: number;
    qtc: number;
    leadAbnormality: number;
  };
  text: {
    substernal: number;
    exertional: number;
    fatigue: number;
    radiating: number;
    noPrior: number;
  };
}

export const VESSEL_WEIGHTS: Record<Vessel, VesselWeights> = {
  LAD: {
    bias: -2.3,
    clinical: { age: 0.35, sexMale: 0.25, sexFemale: 0.1, sbp: 0.4, bmi: 0.25 },
    ecg: { hr: 0.15, pr: 0.1, qrs: 0.2, qtc: 0.15, leadAbnormality: 1.5 },
    text: { substernal: 0.6, exertional: 0.4, fatigue: 0.2, radiating: 0.4, noPrior: -0.6 },
  },
  LCX: {
    bias: -2.4,
    clinical: { age: 0.35, sexMale: 0.2, sexFemale: 0.15, sbp: 0.45, bmi: 0.3 },
    ecg: { hr: 0.15, pr: 0.12, qrs: 0.2, qtc: 0.18, leadAbnormality: 1.6 },
    text: { substernal: 0.7, exertional: 0.5, fatigue: 0.4, radiating: 0.5, noPrior: -0.6 },
  },
  RCA: {
    bias: -2.6,
    clinical: { age: 0.3, sexMale: 0.2, sexFemale: 0.1, sbp: 0.35, bmi: 0.2 },
    ecg: { hr: 0.12, pr: 0.15, qrs: 0.18, qtc: 0.15, leadAbnormality: 1.5 },
    text: { substernal: 0.3, exertional: 0.3, fatigue: 0.3, radiating: 0.4, noPrior: -0.6 },
  },
};

export interface ScorerResult {
  probability: number; // 0-100 integer
  rawLogit: number;
  contributions: {
    clinical: number | null;
    ecg: number | null;
    text: number | null;
    symptoms?: number | null;
  };
  shares: {
    clinical: number | null;
    ecg: number | null;
    text: number | null;
    symptoms?: number | null;
  };
}

/**
 * Computes transparent, deterministic vessel probability and contribution shares.
 */
export function scoreVessel(
  patient: Patient,
  vessel: Vessel,
  modalities: ModalityState
): ScorerResult {
  const isClinical = Boolean(modalities.clinical);
  const isEcg = Boolean(modalities.ecg);
  const isText = Boolean(modalities.symptoms ?? (modalities as any).text);

  const weights = VESSEL_WEIGHTS[vessel];

  // 1. Clinical Logit
  let clinicalLogit: number | null = null;
  if (isClinical) {
    const ageNorm = (patient.age - 30) / 25;
    const sexNorm = patient.sex === 'Male' ? weights.clinical.sexMale : weights.clinical.sexFemale;
    const sbpNorm = ((patient.vitals?.bloodPressureSys || 120) - 120) / 20;
    const bmiNorm = ((patient.bmi || 22) - 22) / 5;

    clinicalLogit =
      ageNorm * weights.clinical.age +
      sexNorm +
      sbpNorm * weights.clinical.sbp +
      bmiNorm * weights.clinical.bmi;
  }

  // 2. ECG Logit
  let ecgLogit: number | null = null;
  if (isEcg) {
    const hrNorm = ((patient.ecg?.heartRate || patient.vitals?.heartRate || 70) - 70) / 20;
    const prNorm = ((patient.ecg?.prInterval || 160) - 160) / 30;
    const qrsNorm = ((patient.ecg?.qrsDuration || 90) - 90) / 25;
    const qtcNorm = ((patient.ecg?.qtcInterval || 410) - 410) / 30;

    let leadBonus = 0;
    const notes = (patient.ecg?.leadNotes || '').toLowerCase();
    if (vessel === 'LAD' && (notes.includes('anterior') || notes.includes('v1') || notes.includes('v2') || notes.includes('v3') || notes.includes('v4'))) {
      leadBonus = weights.ecg.leadAbnormality;
    } else if (vessel === 'LCX' && (notes.includes('lateral') || notes.includes('v5') || notes.includes('v6') || notes.includes('avl'))) {
      leadBonus = weights.ecg.leadAbnormality;
    } else if (vessel === 'RCA' && (notes.includes('inferior') || notes.includes('ii') || notes.includes('iii') || notes.includes('avf'))) {
      leadBonus = weights.ecg.leadAbnormality;
    }

    ecgLogit =
      hrNorm * weights.ecg.hr +
      prNorm * weights.ecg.pr +
      qrsNorm * weights.ecg.qrs +
      qtcNorm * weights.ecg.qtc +
      leadBonus;
  }

  // 3. Text Logit
  let textLogit: number | null = null;
  if (isText) {
    const narrative = (patient.clinicalNarrative || '').toLowerCase();
    let textSum = 0;

    if (narrative.includes('substernal')) textSum += weights.text.substernal;
    if (narrative.includes('exertional')) textSum += weights.text.exertional;
    if (narrative.includes('fatigue')) textSum += weights.text.fatigue;
    if (narrative.includes('radiating')) textSum += weights.text.radiating;
    if (narrative.includes('no prior') || narrative.includes('no previous')) {
      textSum += weights.text.noPrior;
    }

    textLogit = textSum;
  }

  // Total active logits + bias
  let totalLogit = weights.bias;
  if (clinicalLogit !== null) totalLogit += clinicalLogit;
  if (ecgLogit !== null) totalLogit += ecgLogit;
  if (textLogit !== null) totalLogit += textLogit;

  // Sigmoid transfer to [0, 100]
  const sig = 1 / (1 + Math.exp(-totalLogit));
  const probability = Math.round(Math.min(100, Math.max(0, sig * 100)));

  // Compute normalized percentage shares that sum to EXACTLY 100 over active modalities
  const activeEntries: { key: 'clinical' | 'ecg' | 'text'; mag: number }[] = [];
  if (clinicalLogit !== null) {
    activeEntries.push({ key: 'clinical', mag: Math.max(0.1, Math.abs(clinicalLogit)) });
  }
  if (ecgLogit !== null) {
    activeEntries.push({ key: 'ecg', mag: Math.max(0.1, Math.abs(ecgLogit)) });
  }
  if (textLogit !== null) {
    activeEntries.push({ key: 'text', mag: Math.max(0.1, Math.abs(textLogit)) });
  }

  const rawShares: Record<'clinical' | 'ecg' | 'text', number | null> = {
    clinical: null,
    ecg: null,
    text: null,
  };

  if (activeEntries.length > 0) {
    const totalMag = activeEntries.reduce((sum, e) => sum + e.mag, 0);
    let runningSum = 0;
    let maxIdx = 0;
    let maxVal = -1;

    activeEntries.forEach((entry, idx) => {
      const share = Math.round((entry.mag / totalMag) * 100);
      rawShares[entry.key] = share;
      runningSum += share;
      if (share > maxVal) {
        maxVal = share;
        maxIdx = idx;
      }
    });

    // Enforce exact 100 sum
    const diff = 100 - runningSum;
    if (diff !== 0 && activeEntries[maxIdx]) {
      const highestKey = activeEntries[maxIdx].key;
      rawShares[highestKey] = (rawShares[highestKey] || 0) + diff;
    }
  }

  return {
    probability,
    rawLogit: totalLogit,
    contributions: {
      clinical: clinicalLogit !== null ? Number(clinicalLogit.toFixed(2)) : null,
      ecg: ecgLogit !== null ? Number(ecgLogit.toFixed(2)) : null,
      text: textLogit !== null ? Number(textLogit.toFixed(2)) : null,
      symptoms: textLogit !== null ? Number(textLogit.toFixed(2)) : null,
    },
    shares: {
      clinical: rawShares.clinical,
      ecg: rawShares.ecg,
      text: rawShares.text,
      symptoms: rawShares.text,
    },
  };
}

export interface TextTokenAttribution {
  text: string;
  isWord: boolean;
  delta: number;
  impact: 'positive' | 'negative' | 'neutral';
}

/**
 * Computes word-by-word occlusion text attribution against scoreVessel.
 */
export function computeTextOcclusionAttribution(
  patient: Patient,
  vessel: Vessel,
  modalities: ModalityState
): TextTokenAttribution[] {
  const narrative = patient.clinicalNarrative || '';
  if (!narrative.trim()) return [];

  // Match tokens (words and non-words)
  const regex = /([A-Za-z0-9_-]+|[^\sA-Za-z0-9_-]+|\s+)/g;
  const rawTokens = narrative.match(regex) || [narrative];

  const baseResult = scoreVessel(patient, vessel, modalities);
  const baseProb = baseResult.probability;

  const result: TextTokenAttribution[] = rawTokens.map((tok) => ({
    text: tok,
    isWord: /^[A-Za-z0-9_-]+$/.test(tok),
    delta: 0,
    impact: 'neutral',
  }));

  const wordIndices: number[] = [];
  rawTokens.forEach((tok, idx) => {
    if (/^[A-Za-z0-9_-]+$/.test(tok)) {
      wordIndices.push(idx);
    }
  });

  for (const idx of wordIndices) {
    const occludedText = rawTokens
      .filter((_, i) => i !== idx)
      .join('');

    const occludedPatient = {
      ...patient,
      clinicalNarrative: occludedText,
    };

    const occludedResult = scoreVessel(occludedPatient, vessel, modalities);
    const delta = baseProb - occludedResult.probability;

    result[idx].delta = delta;
    if (delta > 0) result[idx].impact = 'positive';
    else if (delta < 0) result[idx].impact = 'negative';
    else result[idx].impact = 'neutral';
  }

  return result;
}

