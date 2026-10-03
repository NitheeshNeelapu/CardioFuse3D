import React, { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Vessel } from '../../types/vessel';
import { useAppStore } from '../../state/useAppStore';
import { VesselLabels } from './VesselLabels';

export const VesselMesh: React.FC = () => {
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);
  const prediction = useAppStore((s) => s.prediction);
  const [hoveredVessel, setHoveredVessel] = useState<Vessel | null>(null);

  // 1. LAD Curve (Left Anterior Descending)
  const ladCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 0.9, 0.45),
      new THREE.Vector3(-0.25, 0.6, 0.75),
      new THREE.Vector3(-0.15, 0.25, 0.92),
      new THREE.Vector3(-0.05, -0.1, 0.96),
      new THREE.Vector3(0.08, -0.5, 0.85),
      new THREE.Vector3(0.18, -0.9, 0.65),
      new THREE.Vector3(0.25, -1.25, 0.35),
      new THREE.Vector3(0.3, -1.45, 0.1),
    ]);
  }, []);

  const ladDiagCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, 0.25, 0.92),
      new THREE.Vector3(-0.45, 0.05, 0.85),
      new THREE.Vector3(-0.7, -0.2, 0.65),
      new THREE.Vector3(-0.85, -0.5, 0.4),
    ]);
  }, []);

  // 2. LCX Curve (Left Circumflex)
  const lcxCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 0.9, 0.45),
      new THREE.Vector3(-0.65, 0.8, 0.4),
      new THREE.Vector3(-0.95, 0.6, 0.15),
      new THREE.Vector3(-1.1, 0.3, -0.2),
      new THREE.Vector3(-1.0, 0.0, -0.55),
      new THREE.Vector3(-0.75, -0.3, -0.75),
      new THREE.Vector3(-0.45, -0.6, -0.8),
    ]);
  }, []);

  const lcxMarginalCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.95, 0.6, 0.15),
      new THREE.Vector3(-1.05, 0.2, 0.2),
      new THREE.Vector3(-1.0, -0.25, 0.2),
      new THREE.Vector3(-0.85, -0.7, 0.1),
    ]);
  }, []);

  // 3. RCA Curve (Right Coronary)
  const rcaCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.35, 0.85, 0.4),
      new THREE.Vector3(0.65, 0.7, 0.45),
      new THREE.Vector3(0.95, 0.45, 0.35),
      new THREE.Vector3(1.1, 0.1, 0.1),
      new THREE.Vector3(1.05, -0.3, -0.15),
      new THREE.Vector3(0.85, -0.7, -0.35),
      new THREE.Vector3(0.55, -1.0, -0.45),
      new THREE.Vector3(0.2, -1.25, -0.3),
    ]);
  }, []);

  const rcaMarginalCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.1, 0.1, 0.1),
      new THREE.Vector3(0.9, -0.15, 0.35),
      new THREE.Vector3(0.65, -0.45, 0.55),
      new THREE.Vector3(0.45, -0.75, 0.6),
    ]);
  }, []);

  // Geometries: Display & Hit-test area (wider radius for easy clicking)
  const ladGeo = useMemo(() => new THREE.TubeGeometry(ladCurve, 64, 0.065, 14, false), [ladCurve]);
  const ladHitGeo = useMemo(() => new THREE.TubeGeometry(ladCurve, 32, 0.16, 8, false), [ladCurve]);
  const ladDiagGeo = useMemo(() => new THREE.TubeGeometry(ladDiagCurve, 32, 0.04, 10, false), [ladDiagCurve]);

  const lcxGeo = useMemo(() => new THREE.TubeGeometry(lcxCurve, 64, 0.06, 14, false), [lcxCurve]);
  const lcxHitGeo = useMemo(() => new THREE.TubeGeometry(lcxCurve, 32, 0.16, 8, false), [lcxCurve]);
  const lcxMarginalGeo = useMemo(() => new THREE.TubeGeometry(lcxMarginalCurve, 32, 0.04, 10, false), [lcxMarginalCurve]);

  const rcaGeo = useMemo(() => new THREE.TubeGeometry(rcaCurve, 64, 0.062, 14, false), [rcaCurve]);
  const rcaHitGeo = useMemo(() => new THREE.TubeGeometry(rcaCurve, 32, 0.16, 8, false), [rcaCurve]);
  const rcaMarginalGeo = useMemo(() => new THREE.TubeGeometry(rcaMarginalCurve, 32, 0.04, 10, false), [rcaMarginalCurve]);

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

  const ladScore = prediction?.vesselPredictions.LAD.probability ?? 68;
  const lcxScore = prediction?.vesselPredictions.LCX.probability ?? 42;
  const rcaScore = prediction?.vesselPredictions.RCA.probability ?? 28;

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
        <mesh geometry={ladHitGeo} visible={false}>
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
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
          position={[0.0, 0.1, 1.1]}
          isHovered={hoveredVessel === 'LAD'}
          isSelected={selectedVessel === 'LAD'}
          probability={ladScore}
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
        <mesh geometry={lcxHitGeo} visible={false}>
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
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
          position={[-1.15, 0.45, 0.15]}
          isHovered={hoveredVessel === 'LCX'}
          isSelected={selectedVessel === 'LCX'}
          probability={lcxScore}
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
        <mesh geometry={rcaHitGeo} visible={false}>
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
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
          position={[1.15, 0.35, 0.35]}
          isHovered={hoveredVessel === 'RCA'}
          isSelected={selectedVessel === 'RCA'}
          probability={rcaScore}
        />
      </group>
    </group>
  );
};
