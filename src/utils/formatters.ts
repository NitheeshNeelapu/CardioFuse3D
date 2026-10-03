import { Modality } from '../types/modality';

export function formatPercentage(val: number | null | undefined, fallback: string = 'Evidence unavailable'): string {
  if (val === null || val === undefined) {
    return fallback;
  }
  return `${Math.round(val)}%`;
}

export function formatModalityLabel(modality: Modality): string {
  switch (modality) {
    case 'clinical':
      return 'Clinical Tabular';
    case 'ecg':
      return '12-Lead ECG';
    case 'text':
      return 'Symptom Narrative';
    default:
      return modality;
  }
}

export function getModalityColor(modality: Modality): string {
  switch (modality) {
    case 'clinical':
      return '#00E5FF'; // cyan
    case 'ecg':
      return '#8B5CF6'; // violet
    case 'text':
      return '#EC4899'; // magenta / pink
    default:
      return '#38BDF8';
  }
}
