export * from './vessel';
export * from './modality';
export * from './patient';
export * from './model';

// Aliases for compatibility
export type VesselId = import('./vessel').Vessel;
export type PatientProfile = import('./patient').Patient;
export type ActiveTab = 'dashboard' | 'architecture' | 'evaluation' | 'about';
