import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Vessel } from '../../types/vessel';
import { useAppStore } from '../../state/useAppStore';
import { VesselLabels } from './VesselLabels';

export const VesselMesh: React.FC = () => {
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);
  const hoveredVessel = useAppStore((s) => s.hoveredVessel);
  const setHoveredVessel = useAppStore((s) => s.setHoveredVessel);
  const prediction = useAppStore((s) => s.prediction);

  // 1. LAD Curve (Left Anterior Descending)
  const ladCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 0.9, 0.46),
      new THREE.Vector3(-0.25, 0.6, 0.77),
      new THREE.Vector3(-0.15, 0.25, 0.94),
      new THREE.Vector3(-0.05, -0.1, 0.98),
      new THREE.Vector3(0.08, -0.5, 0.87),
      new THREE.Vector3(0.18, -0.9, 0.67),
      new THREE.Vector3(0.25, -1.25, 0.36),
      new THREE.Vector3(0.3, -1.45, 0.11),
    ]);
  }, []);

  const ladDiagCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, 0.25, 0.94),
      new THREE.Vector3(-0.45, 0.05, 0.87),
      new THREE.Vector3(-0.7, -0.2, 0.67),
      new THREE.Vector3(-0.85, -0.5, 0.42),
    ]);
  }, []);

  // 2. LCX Curve (Left Circumflex)
  const lcxCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 0.9, 0.46),
      new THREE.Vector3(-0.65, 0.8, 0.42),
      new THREE.Vector3(-0.95, 0.6, 0.17),
      new THREE.Vector3(-1.12, 0.3, -0.19),
      new THREE.Vector3(-1.02, 0.0, -0.56),
      new THREE.Vector3(-0.76, -0.3, -0.76),
      new THREE.Vector3(-0.46, -0.6, -0.81),
    ]);
  }, []);

  const lcxMarginalCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.95, 0.6, 0.17),
      new THREE.Vector3(-1.07, 0.2, 0.22),
      new THREE.Vector3(-1.02, -0.25, 0.22),
      new THREE.Vector3(-0.87, -0.7, 0.12),
    ]);
  }, []);

  // 3. RCA Curve (Right Coronary)
  const rcaCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.35, 0.85, 0.42),
      new THREE.Vector3(0.65, 0.7, 0.47),
      new THREE.Vector3(0.96, 0.45, 0.37),
      new THREE.Vector3(1.12, 0.1, 0.12),
      new THREE.Vector3(1.07, -0.3, -0.14),
      new THREE.Vector3(0.86, -0.7, -0.34),
      new THREE.Vector3(0.56, -1.0, -0.44),
      new THREE.Vector3(0.21, -1.25, -0.29),
    ]);
  }, []);

  const rcaMarginalCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.12, 0.1, 0.12),
      new THREE.Vector3(0.92, -0.15, 0.37),
      new THREE.Vector3(0.66, -0.45, 0.57),
      new THREE.Vector3(0.46, -0.75, 0.62),
    ]);
  }, []);

  // Optimized geometries: max 44 tubular segments, 8-10 radial segments
  const ladGeo = useMemo(() => new THREE.TubeGeometry(ladCurve, 44, 0.065, 10, false), [ladCurve]);
  const ladHitGeo = useMemo(() => new THREE.TubeGeometry(ladCurve, 24, 0.16, 8, false), [ladCurve]);
  const ladDiagGeo = useMemo(() => new THREE.TubeGeometry(ladDiagCurve, 20, 0.04, 8, false), [ladDiagCurve]);

  const lcxGeo = useMemo(() => new THREE.TubeGeometry(lcxCurve, 44, 0.06, 10, false), [lcxCurve]);
  const lcxHitGeo = useMemo(() => new THREE.TubeGeometry(lcxCurve, 24, 0.16, 8, false), [lcxCurve]);
  const lcxMarginalGeo = useMemo(() => new THREE.TubeGeometry(lcxMarginalCurve, 20, 0.04, 8, false), [lcxMarginalCurve]);

  const rcaGeo = useMemo(() => new THREE.TubeGeometry(rcaCurve, 44, 0.062, 10, false), [rcaCurve]);
  const rcaHitGeo = useMemo(() => new THREE.TubeGeometry(rcaCurve, 24, 0.16, 8, false), [rcaCurve]);
  const rcaMarginalGeo = useMemo(() => new THREE.TubeGeometry(rcaMarginalCurve, 20, 0.04, 8, false), [rcaMarginalCurve]);

  const hitMat = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }), []);

  // Dispose geometries and materials on unmount
  useEffect(() => {
    return () => {
      ladGeo.dispose();
      ladHitGeo.dispose();
      ladDiagGeo.dispose();
      lcxGeo.dispose();
      lcxHitGeo.dispose();
      lcxMarginalGeo.dispose();
      rcaGeo.dispose();
      rcaHitGeo.dispose();
      rcaMarginalGeo.dispose();
      hitMat.dispose();
    };
  }, [
    ladGeo,
    ladHitGeo,
    ladDiagGeo,
    lcxGeo,
    lcxHitGeo,
    lcxMarginalGeo,
    rcaGeo,
    rcaHitGeo,
    rcaMarginalGeo,
    hitMat,
  ]);

  // Color helper based on selection & hover
  const getVesselVisuals = (id: Vessel) => {
    const isSelected = selectedVessel === id;
    const isHovered = hoveredVessel === id;

    const baseColor = isSelected ? '#00E5FF' : isHovered ? '#38BDF8' : '#F43F5E';
    const emissiveColor = isSelected ? '#00E5FF' : isHovered ? '#00B4D8' : '#BE123C';
    const emissiveIntensity = isSelected ? 2.0 : isHovered ? 1.4 : 0.6;
    const metalness = isSelected ? 0.8 : 0.5;
    const roughness = isSelected ? 0.1 : 0.35;

    return { baseColor, emissiveColor, emissiveIntensity, metalness, roughness };
  };

  const ladVisuals = getVesselVisuals('LAD');
  const lcxVisuals = getVesselVisuals('LCX');
  const rcaVisuals = getVesselVisuals('RCA');

  const ladScore = prediction ? prediction.vesselPredictions.LAD.probability : null;
  const lcxScore = prediction ? prediction.vesselPredictions.LCX.probability : null;
  const rcaScore = prediction ? prediction.vesselPredictions.RCA.probability : null;

  return (
    <group>
      {/* ---------------- LAD GROUP ---------------- */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          setSelectedVessel('LAD');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredVessel('LAD');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredVessel(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Invisible expanded hit area mesh */}
        <mesh geometry={ladHitGeo} material={hitMat} />
        <mesh geometry={ladGeo}>
          <meshStandardMaterial
            color={ladVisuals.baseColor}
            emissive={ladVisuals.emissiveColor}
            emissiveIntensity={ladVisuals.emissiveIntensity}
            roughness={ladVisuals.roughness}
            metalness={ladVisuals.metalness}
          />
        </mesh>
        <mesh geometry={ladDiagGeo}>
          <meshStandardMaterial
            color={ladVisuals.baseColor}
            emissive={ladVisuals.emissiveColor}
            emissiveIntensity={ladVisuals.emissiveIntensity * 0.8}
            roughness={ladVisuals.roughness}
            metalness={ladVisuals.metalness}
          />
        </mesh>

        <VesselLabels
          vessel="LAD"
          position={[0.0, 0.1, 1.12]}
          isHovered={hoveredVessel === 'LAD'}
          isSelected={selectedVessel === 'LAD'}
          probability={ladScore}
          onSelect={() => setSelectedVessel('LAD')}
        />
      </group>

      {/* ---------------- LCX GROUP ---------------- */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          setSelectedVessel('LCX');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredVessel('LCX');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredVessel(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Invisible expanded hit area mesh */}
        <mesh geometry={lcxHitGeo} material={hitMat} />
        <mesh geometry={lcxGeo}>
          <meshStandardMaterial
            color={lcxVisuals.baseColor}
            emissive={lcxVisuals.emissiveColor}
            emissiveIntensity={lcxVisuals.emissiveIntensity}
            roughness={lcxVisuals.roughness}
            metalness={lcxVisuals.metalness}
          />
        </mesh>
        <mesh geometry={lcxMarginalGeo}>
          <meshStandardMaterial
            color={lcxVisuals.baseColor}
            emissive={lcxVisuals.emissiveColor}
            emissiveIntensity={lcxVisuals.emissiveIntensity * 0.8}
            roughness={lcxVisuals.roughness}
            metalness={lcxVisuals.metalness}
          />
        </mesh>

        <VesselLabels
          vessel="LCX"
          position={[-1.18, 0.45, 0.18]}
          isHovered={hoveredVessel === 'LCX'}
          isSelected={selectedVessel === 'LCX'}
          probability={lcxScore}
          onSelect={() => setSelectedVessel('LCX')}
        />
      </group>

      {/* ---------------- RCA GROUP ---------------- */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          setSelectedVessel('RCA');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredVessel('RCA');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredVessel(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Invisible expanded hit area mesh */}
        <mesh geometry={rcaHitGeo} material={hitMat} />
        <mesh geometry={rcaGeo}>
          <meshStandardMaterial
            color={rcaVisuals.baseColor}
            emissive={rcaVisuals.emissiveColor}
            emissiveIntensity={rcaVisuals.emissiveIntensity}
            roughness={rcaVisuals.roughness}
            metalness={rcaVisuals.metalness}
          />
        </mesh>
        <mesh geometry={rcaMarginalGeo}>
          <meshStandardMaterial
            color={rcaVisuals.baseColor}
            emissive={rcaVisuals.emissiveColor}
            emissiveIntensity={rcaVisuals.emissiveIntensity * 0.8}
            roughness={rcaVisuals.roughness}
            metalness={rcaVisuals.metalness}
          />
        </mesh>

        <VesselLabels
          vessel="RCA"
          position={[1.18, 0.35, 0.38]}
          isHovered={hoveredVessel === 'RCA'}
          isSelected={selectedVessel === 'RCA'}
          probability={rcaScore}
          onSelect={() => setSelectedVessel('RCA')}
        />
      </group>
    </group>
  );
};
