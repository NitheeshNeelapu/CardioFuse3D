import React, { useState, Component, ErrorInfo } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeartMesh } from './HeartMesh';
import { CameraControls } from './CameraControls';
import { HeartFallback } from './HeartFallback';
import { useAppStore } from '../../state/useAppStore';
import {
  RotateCw,
  Pause,
  Play,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
  Focus,
  AlertTriangle,
  Heart,
  Eye,
} from 'lucide-react';
import { Vessel } from '../../types/vessel';

// Robust Error Boundary to catch any WebGL or 3D rendering failures
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('WebGL / Three.js error trapped in HeartScene:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const HeartScene: React.FC = () => {
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);
  const autoRotate = useAppStore((s) => s.autoRotate);
  const setAutoRotate = useAppStore((s) => s.setAutoRotate);
  const triggerResetCamera = useAppStore((s) => s.triggerResetCamera);
  const prediction = useAppStore((s) => s.prediction);

  // Manual fallback toggle for Test 10 verification
  const [forceFallback, setForceFallback] = useState<boolean>(false);

  const vessels: { id: Vessel; name: string; score: number }[] = [
    { id: 'LAD', name: 'LAD', score: prediction?.vesselPredictions.LAD.probability ?? 68 },
    { id: 'LCX', name: 'LCX', score: prediction?.vesselPredictions.LCX.probability ?? 42 },
    { id: 'RCA', name: 'RCA', score: prediction?.vesselPredictions.RCA.probability ?? 28 },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none">
      {/* 3D Viewport Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5 z-10 px-2 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
              3D Cardiac Anatomy
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">
              Selectable Coronary Arteries (LAD • LCX • RCA)
            </p>
          </div>
        </div>

        {/* Active Target Indicator & Fallback toggle button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-cyan-500/30 text-[11px] font-mono">
            <span className="text-slate-400">Target:</span>
            <span className="text-cyan-300 font-extrabold">{selectedVessel}</span>
          </div>

          {/* Test 10 helper: Toggle 2D/3D representation */}
          <button
            onClick={() => setForceFallback(!forceFallback)}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-[10px] font-mono flex items-center gap-1"
            title="Toggle WebGL 3D / 2.5D Schematic Fallback"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">{forceFallback ? '3D VIEW' : '2.5D VIEW'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas / Viewport */}
      <div className="flex-1 w-full min-h-[380px] lg:min-h-[460px] relative rounded-xl my-2 overflow-hidden bg-radial-gradient">
        {/* Subtle radial background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,229,255,0.06)_0%,_transparent_70%)] pointer-events-none" />

        {forceFallback ? (
          <HeartFallback />
        ) : (
          <WebGLErrorBoundary fallback={<HeartFallback />}>
            <Canvas
              camera={{ position: [0, 0.3, 4.6], fov: 45 }}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            >
              {/* Futuristic Lighting Setup */}
              <ambientLight intensity={0.7} color="#0B1424" />
              <directionalLight position={[5, 8, 5]} intensity={1.8} color="#00E5FF" />
              <directionalLight position={[-6, 5, -4]} intensity={1.4} color="#8B5CF6" />
              <directionalLight position={[0, -5, -3]} intensity={0.6} color="#38BDF8" />
              <pointLight position={[0, 1, 3]} intensity={1.2} color="#FFFFFF" distance={8} />

              {/* 3D Heart Mesh & Interactive Vessels */}
              <HeartMesh />

              {/* Smooth Camera Controls & Lerp */}
              <CameraControls />
            </Canvas>
          </WebGLErrorBoundary>
        )}
      </div>

      {/* Center Controls Bar */}
      <div className="z-10 mt-auto space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-[#08111F]/90 border border-white/10 backdrop-blur-md">
          {/* Left: Camera Control Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={triggerResetCamera}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-all"
              title="Reset camera orientation"
            >
              <RefreshCcw className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">RESET</span>
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition-all ${
                autoRotate
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
              }`}
              title="Toggle continuous rotation"
            >
              {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="hidden sm:inline">{autoRotate ? 'PAUSE' : 'ROTATE'}</span>
            </button>

            <button
              onClick={useAppStore.getState().triggerZoomIn}
              className="px-2 py-1.5 rounded-lg text-[11px] font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1 transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3 text-cyan-400" />
            </button>

            <button
              onClick={useAppStore.getState().triggerZoomOut}
              className="px-2 py-1.5 rounded-lg text-[11px] font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1 transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3 text-cyan-400" />
            </button>
          </div>

          {/* Right: Direct Vessel Selection Buttons (LAD, LCX, RCA) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400 mr-1 hidden md:inline">
              <Focus className="w-3 h-3 inline mr-1 text-slate-500" />
              FOCUS VESSEL:
            </span>

            {vessels.map((v) => {
              const isSelected = selectedVessel === v.id;

              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVessel(v.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.6)] scale-105'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span>{v.name}</span>
                  <span
                    className={`text-[10px] font-normal ${
                      isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {v.score}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">CORONARY SUPPLY BEDS:</span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              LAD (Anterior)
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
              LCX (Lateral)
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
              RCA (Right / Inferior)
            </span>
          </div>

          <span className="text-cyan-400 hidden sm:inline">
            Click vessel or button to synchronize
          </span>
        </div>
      </div>
    </div>
  );
};
