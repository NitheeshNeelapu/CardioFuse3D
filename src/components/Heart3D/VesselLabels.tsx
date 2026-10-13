import React from 'react';
import { Html } from '@react-three/drei';
import { Vessel } from '../../types/vessel';

interface VesselLabelsProps {
  vessel: Vessel;
  position: [number, number, number];
  isHovered: boolean;
  isSelected: boolean;
  probability: number | null;
  onSelect: () => void;
}

export const VesselLabels: React.FC<VesselLabelsProps> = ({
  vessel,
  position,
  isHovered,
  isSelected,
  probability,
  onSelect,
}) => {
  const dotColor =
    vessel === 'LAD'
      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.9)]'
      : vessel === 'LCX'
      ? 'bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.9)]'
      : 'bg-pink-400 shadow-[0_0_8px_rgba(244,63,94,0.9)]';

  return (
    <Html position={position} center zIndexRange={[10, 0]} occlude={false}>
      <div
        className="select-none transition-all duration-150 cursor-pointer pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {isSelected ? (
          // Full pill ONLY for selected vessel (fixed on-screen size ~11px, small padding)
          <div className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wider bg-cyan-500 text-slate-950 border border-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.7)] flex items-center gap-1 whitespace-nowrap animate-fadeIn">
            <span>{vessel}</span>
            <span>•</span>
            <span>{probability !== null ? `${probability}%` : '--'}</span>
          </div>
        ) : isHovered ? (
          // Name on hover/tap only
          <div className="px-1.5 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wide bg-slate-900/95 text-white border border-white/40 shadow-lg flex items-center gap-1 whitespace-nowrap animate-fadeIn">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span>{vessel}</span>
          </div>
        ) : (
          // Small colored dot for unselected vessels
          <div
            className={`w-2.5 h-2.5 rounded-full border border-white/40 transition-transform hover:scale-125 ${dotColor}`}
            title={`Select ${vessel}`}
          />
        )}
      </div>
    </Html>
  );
};
