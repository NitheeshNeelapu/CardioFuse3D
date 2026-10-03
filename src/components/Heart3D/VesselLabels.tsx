import React from 'react';
import { Html } from '@react-three/drei';
import { Vessel } from '../../types/vessel';
import { useAppStore } from '../../state/useAppStore';

interface VesselLabelsProps {
  vessel: Vessel;
  position: [number, number, number];
  isHovered: boolean;
  isSelected: boolean;
  probability: number;
}

export const VesselLabels: React.FC<VesselLabelsProps> = ({
  vessel,
  position,
  isHovered,
  isSelected,
  probability,
}) => {
  const fullNames: Record<Vessel, string> = {
    LAD: 'Left Anterior Descending Artery',
    LCX: 'Left Circumflex Artery',
    RCA: 'Right Coronary Artery',
  };

  return (
    <Html position={position} center distanceFactor={8} zIndexRange={[100, 0]}>
      <div className="pointer-events-none select-none transition-all duration-200">
        {/* Hover Tooltip as specified:
            “LAD
            Left Anterior Descending Artery
            Click to inspect” */}
        {isHovered && !isSelected && (
          <div className="mb-2 p-2 rounded-lg bg-black/90 border border-cyan-400 text-left shadow-2xl backdrop-blur-md min-w-[190px] animate-fadeIn">
            <div className="text-xs font-bold font-mono text-cyan-300">
              {vessel}
            </div>
            <div className="text-[10px] text-slate-200 leading-tight">
              {fullNames[vessel]}
            </div>
            <div className="text-[9px] font-mono text-cyan-400 mt-1 flex items-center gap-1 font-semibold">
              <span>Click to inspect</span>
            </div>
          </div>
        )}

        {/* Persistent Pill Badge */}
        <div
          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider border transition-all ${
            isSelected
              ? 'bg-cyan-500 text-black border-cyan-300 scale-110 shadow-[0_0_15px_rgba(0,229,255,0.8)]'
              : isHovered
              ? 'bg-white text-black border-white scale-105'
              : 'bg-black/85 text-cyan-300 border-cyan-500/40 opacity-90'
          }`}
        >
          {vessel} • {probability}%
        </div>
      </div>
    </Html>
  );
};
