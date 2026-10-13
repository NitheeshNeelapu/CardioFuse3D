import React, { useState, useRef, useEffect, Component, ErrorInfo } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeartMesh } from './HeartMesh';
import { CameraControls } from './CameraControls';
import { HeartFallback } from './HeartFallback';
import { useAppStore } from '../../state/useAppStore';
import {
  Pause,
  Play,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
  Focus,
  AlertTriangle,
  Heart,
} from 'lucide-react';
import { Vessel } from '../../types/vessel';

// Error Boundary to catch any WebGL or 3D rendering failures
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
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);

  // WebGL context lost & recovery state
  const [webglContextLost, setWebglContextLost] = useState<boolean>(false);
  const [canvasKey, setCanvasKey] = useState<number>(0);
  const userSwitchingRef = useRef<boolean>(false);
  const domElementRef = useRef<HTMLCanvasElement | null>(null);
  const listenerRef = useRef<((event: Event) => void) | null>(null);

  useEffect(() => {
    return () => {
      if (domElementRef.current && listenerRef.current) {
        domElementRef.current.removeEventListener('webglcontextlost', listenerRef.current);
      }
    };
  }, [canvasKey, viewMode]);

  const handleRetry3D = () => {
    userSwitchingRef.current = false;
    setWebglContextLost(false);
    setCanvasKey((prev) => prev + 1);
    setViewMode('3d');
  };

  const vessels: { id: Vessel; name: string; score: number | null }[] = [
    { id: 'LAD', name: 'LAD', score: prediction ? prediction.vesselPredictions.LAD.probability : null },
    { id: 'LCX', name: 'LCX', score: prediction ? prediction.vesselPredictions.LCX.probability : null },
    { id: 'RCA', name: 'RCA', score: prediction ? prediction.vesselPredictions.RCA.probability : null },
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
              Cardiac Anatomy Viewer
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">
              Selectable Coronary Arteries (LAD • LCX • RCA)
            </p>
          </div>
        </div>

        {/* View Switch: Segmented control "3D | 2.5D" & Target Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/60 border border-cyan-500/30 text-[11px] font-mono">
            <span className="text-slate-400">Target:</span>
            <span className="text-cyan-300 font-extrabold">{selectedVessel}</span>
          </div>

          {/* Segmented Control 3D | 2.5D */}
          <div className="flex items-center rounded-lg bg-black/70 p-0.5 border border-white/10 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => {
                userSwitchingRef.current = false;
                setWebglContextLost(false);
                setCanvasKey((prev) => prev + 1);
                setViewMode('3d');
              }}
              className={`px-2.5 py-1 rounded-md transition-all font-bold ${
                viewMode === '3d'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D
            </button>
            <button
              type="button"
              onClick={() => {
                userSwitchingRef.current = true;
                if (domElementRef.current && listenerRef.current) {
                  domElementRef.current.removeEventListener('webglcontextlost', listenerRef.current);
                }
                setWebglContextLost(false);
                setViewMode('schematic');
              }}
              className={`px-2.5 py-1 rounded-md transition-all font-bold ${
                viewMode === 'schematic'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2.5D
            </button>
          </div>
        </div>
      </div>

      {/* WebGL Context Lost Warning Banner */}
      {webglContextLost && (
        <div className="mx-2 mt-2 p-2 rounded-xl bg-amber-950/90 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-center justify-between gap-2 shadow-lg z-20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>3D unavailable on this device — showing 2.5D schematic</span>
          </div>
          <button
            type="button"
            onClick={handleRetry3D}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 border border-amber-400/40 text-[10px] font-bold tracking-wider hover:text-white flex items-center gap-1 transition-all"
          >
            <RefreshCcw className="w-3 h-3 text-amber-300" />
            <span>RETRY 3D</span>
          </button>
        </div>
      )}

      {/* Main Viewport Container with explicit height */}
      <div className="w-full h-[360px] sm:h-[440px] xl:h-[560px] relative rounded-xl my-2 overflow-hidden bg-[#030712]">
        {/* Subtle radial background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,229,255,0.06)_0%,_transparent_70%)] pointer-events-none" />

        {/* Absolutely positioned wrapper */}
        <div className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
          {/* Only ONE Canvas mounted at a time. When viewMode is 'schematic', Canvas is completely unmounted */}
          {viewMode === 'schematic' ? (
            <HeartFallback />
          ) : (
            <WebGLErrorBoundary fallback={<HeartFallback />}>
              <Canvas
                key={`canvas-${canvasKey}`}
                dpr={[1, 1.5]}
                camera={{ position: [0, 0.4, 5.2], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                style={{ width: '100%', height: '100%' }}
                onCreated={({ gl }) => {
                  const dom = gl.domElement;
                  domElementRef.current = dom;
                  const handleContextLost = (event: Event) => {
                    if (userSwitchingRef.current || viewMode !== '3d') {
                      return;
                    }
                    event.preventDefault();
                    setWebglContextLost(true);
                    setViewMode('schematic');
                  };
                  listenerRef.current = handleContextLost;
                  dom.addEventListener('webglcontextlost', handleContextLost, false);
                }}
              >
                {/* Lighting Setup */}
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
      </div>

      {/* Center Controls Bar (Solid background, no backdrop-blur) */}
      <div className="z-10 mt-auto space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-[#08111F]/95 border border-white/10">
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
                    {v.score !== null ? `${v.score}%` : '--'}
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
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block shadow-[0_0_6px_rgba(0,229,255,0.7)]" />
              LAD (Anterior)
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-violet-400 inline-block shadow-[0_0_6px_rgba(139,92,246,0.7)]" />
              LCX (Lateral)
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-pink-400 inline-block shadow-[0_0_6px_rgba(244,63,94,0.7)]" />
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
