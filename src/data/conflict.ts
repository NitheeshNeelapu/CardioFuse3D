import { Patient } from '../types/patient';
import { Vessel } from '../types/vessel';
import { Modality, ModalityState } from '../types/modality';
import { scoreVessel } from './scorer';

export interface ModalityTopVessel {
  modality: Modality;
  label: string;
  topVessel: Vessel;
  margin: number; // topScore - secondScore
  probs: Record<Vessel, number>;
}

export type ConflictStatus = 'insufficient' | 'agree' | 'conflict';

export interface ConflictResult {
  status: ConflictStatus;
  topVessel?: Vessel;
  message: string;
  perModality?: ModalityTopVessel[];
}

/**
 * Evaluates agreement vs discordance across active modalities.
 * For each active modality, evaluates vessel scores in isolation.
 */
export function detectConflict(
  patient: Patient,
  modalities: ModalityState
): ConflictResult {
  const activeModalities = (['clinical', 'ecg', 'symptoms'] as Modality[]).filter(
    (m) => Boolean(modalities[m])
  );

  if (activeModalities.length < 2) {
    return {
      status: 'insufficient',
      message: 'Need 2+ active modalities',
      perModality: [],
    };
  }

  const vessels: Vessel[] = ['LAD', 'LCX', 'RCA'];
  const perModality: ModalityTopVessel[] = [];

  for (const mod of activeModalities) {
    const singleModState: ModalityState = {
      clinical: mod === 'clinical',
      ecg: mod === 'ecg',
      symptoms: mod === 'symptoms',
    };

    const probs: Record<Vessel, number> = {
      LAD: scoreVessel(patient, 'LAD', singleModState).probability,
      LCX: scoreVessel(patient, 'LCX', singleModState).probability,
      RCA: scoreVessel(patient, 'RCA', singleModState).probability,
    };

    const sorted = [...vessels].sort((a, b) => probs[b] - probs[a]);
    const topVessel = sorted[0];
    const margin = probs[sorted[0]] - probs[sorted[1]];

    const label = mod === 'clinical' ? 'Clinical' : mod === 'ecg' ? 'ECG' : 'Text';

    perModality.push({
      modality: mod,
      label,
      topVessel,
      margin,
      probs,
    });
  }

  const distinctTop = Array.from(new Set(perModality.map((p) => p.topVessel)));

  if (distinctTop.length === 1) {
    return {
      status: 'agree',
      topVessel: distinctTop[0],
      message: `Modalities agree on ${distinctTop[0]}`,
      perModality,
    };
  }

  const conflictDetails = perModality
    .map((p) => `${p.label} favors ${p.topVessel}`)
    .join(', ');

  return {
    status: 'conflict',
    message: `Needs review: ${conflictDetails}`,
    perModality,
  };
}
