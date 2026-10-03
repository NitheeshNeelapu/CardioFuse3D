export type Vessel = 'LAD' | 'LCX' | 'RCA';

export interface VesselInfo {
  id: Vessel;
  name: string;
  fullName: string;
  territory: string;
  status: string; // e.g. "Demo interpretation"
}

export const VESSEL_DEFINITIONS: Record<Vessel, VesselInfo> = {
  LAD: {
    id: 'LAD',
    name: 'LAD',
    fullName: 'Left Anterior Descending Artery',
    territory: 'Anterior ventricular wall, apex, anterior two-thirds of interventricular septum',
    status: 'Demo interpretation',
  },
  LCX: {
    id: 'LCX',
    name: 'LCX',
    fullName: 'Left Circumflex Artery',
    territory: 'Posterolateral wall of left ventricle, anterolateral papillary muscle, left atrium',
    status: 'Demo interpretation',
  },
  RCA: {
    id: 'RCA',
    name: 'RCA',
    fullName: 'Right Coronary Artery',
    territory: 'Right ventricle, posterior 1/3 of interventricular septum, inferior wall, sinoatrial & AV nodes',
    status: 'Demo interpretation',
  },
};
