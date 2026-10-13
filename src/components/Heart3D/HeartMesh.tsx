import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAppStore } from '../../state/useAppStore';
import { VesselMesh } from './VesselMesh';

export const HeartMesh: React.FC = () => {
  const autoRotate = useAppStore((s) => s.autoRotate);
  const hoveredVessel = useAppStore((s) => s.hoveredVessel);
  const heartGroupRef = useRef<THREE.Group>(null);
  const muscleGroupRef = useRef<THREE.Group>(null);

  // Curves for Great Vessels
  const aortaCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, 0.9, 0.15),
      new THREE.Vector3(-0.15, 1.45, 0.2),
      new THREE.Vector3(-0.25, 1.85, 0.05),
      new THREE.Vector3(-0.45, 1.95, -0.2),
      new THREE.Vector3(-0.7, 1.65, -0.45),
      new THREE.Vector3(-0.75, 1.1, -0.55),
      new THREE.Vector3(-0.75, 0.4, -0.6),
    ]);
  }, []);

  const pulmonaryCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 0.85, 0.45),
      new THREE.Vector3(0.0, 1.25, 0.35),
      new THREE.Vector3(-0.05, 1.45, 0.1),
      new THREE.Vector3(-0.15, 1.5, -0.15),
    ]);
  }, []);

  const branch1Curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.28, 1.85, 0.0),
        new THREE.Vector3(-0.22, 2.25, 0.05),
      ]),
    []
  );
  const branch2Curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.4, 1.93, -0.1),
        new THREE.Vector3(-0.42, 2.3, -0.1),
      ]),
    []
  );
  const branch3Curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.55, 1.85, -0.25),
        new THREE.Vector3(-0.62, 2.25, -0.3),
      ]),
    []
  );

  // Lower detail geometries (spheres 20x16, cone 24, tubes max 40/8-10 radial)
  const lvConeGeo = useMemo(() => new THREE.ConeGeometry(1.05, 1.85, 24), []);
  const rvSphereGeo = useMemo(() => new THREE.SphereGeometry(0.82, 20, 16), []);
  const laSphereGeo = useMemo(() => new THREE.SphereGeometry(0.55, 20, 16), []);
  const raSphereGeo = useMemo(() => new THREE.SphereGeometry(0.58, 20, 16), []);
  const sulcusGeo = useMemo(() => new THREE.BoxGeometry(0.06, 1.55, 0.06), []);
  const svcCylinderGeo = useMemo(() => new THREE.CylinderGeometry(0.16, 0.16, 0.8, 14), []);
  const ivcCylinderGeo = useMemo(() => new THREE.CylinderGeometry(0.15, 0.15, 0.5, 14), []);
  const paBranch1Geo = useMemo(() => new THREE.CylinderGeometry(0.11, 0.11, 0.6, 12), []);
  const paBranch2Geo = useMemo(() => new THREE.CylinderGeometry(0.11, 0.11, 0.6, 12), []);

  const aortaGeo = useMemo(() => new THREE.TubeGeometry(aortaCurve, 40, 0.19, 10, false), [aortaCurve]);
  const pulmonaryGeo = useMemo(() => new THREE.TubeGeometry(pulmonaryCurve, 32, 0.17, 10, false), [pulmonaryCurve]);
  const branch1Geo = useMemo(() => new THREE.TubeGeometry(branch1Curve, 16, 0.05, 8, false), [branch1Curve]);
  const branch2Geo = useMemo(() => new THREE.TubeGeometry(branch2Curve, 16, 0.045, 8, false), [branch2Curve]);
  const branch3Geo = useMemo(() => new THREE.TubeGeometry(branch3Curve, 16, 0.045, 8, false), [branch3Curve]);

  // MeshStandardMaterial without transmission/ior for WebGL stability and high framerate
  const crystallineCardiacMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0F1F38'),
      emissive: new THREE.Color('#0A1526'),
      emissiveIntensity: 0.3,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88,
    });
  }, []);

  const crystallineAtriumMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#132746'),
      emissive: new THREE.Color('#0D1B33'),
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
  }, []);

  const aortaGlassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#881337'),
      emissive: new THREE.Color('#BE123C'),
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.2,
      transparent: true,
      opacity: 0.88,
    });
  }, []);

  const pulmonaryGlassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1E3A8A'),
      emissive: new THREE.Color('#2563EB'),
      emissiveIntensity: 0.3,
      roughness: 0.25,
      metalness: 0.2,
      transparent: true,
      opacity: 0.88,
    });
  }, []);

  const sulcusMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00E5FF'),
      transparent: true,
      opacity: 0.3,
    });
  }, []);

  // Dispose geometries and materials on unmount
  useEffect(() => {
    return () => {
      lvConeGeo.dispose();
      rvSphereGeo.dispose();
      laSphereGeo.dispose();
      raSphereGeo.dispose();
      sulcusGeo.dispose();
      svcCylinderGeo.dispose();
      ivcCylinderGeo.dispose();
      paBranch1Geo.dispose();
      paBranch2Geo.dispose();
      aortaGeo.dispose();
      pulmonaryGeo.dispose();
      branch1Geo.dispose();
      branch2Geo.dispose();
      branch3Geo.dispose();

      crystallineCardiacMaterial.dispose();
      crystallineAtriumMaterial.dispose();
      aortaGlassMaterial.dispose();
      pulmonaryGlassMaterial.dispose();
      sulcusMaterial.dispose();
    };
  }, [
    lvConeGeo,
    rvSphereGeo,
    laSphereGeo,
    raSphereGeo,
    sulcusGeo,
    svcCylinderGeo,
    ivcCylinderGeo,
    paBranch1Geo,
    paBranch2Geo,
    aortaGeo,
    pulmonaryGeo,
    branch1Geo,
    branch2Geo,
    branch3Geo,
    crystallineCardiacMaterial,
    crystallineAtriumMaterial,
    aortaGlassMaterial,
    pulmonaryGlassMaterial,
    sulcusMaterial,
  ]);

  // Heartbeat pulse & gentle rotation (paused on hover or when autoRotate is false)
  useFrame((state, delta) => {
    const isPaused = Boolean(hoveredVessel);
    if (heartGroupRef.current && autoRotate && !isPaused) {
      heartGroupRef.current.rotation.y += delta * 0.32;
    }

    if (muscleGroupRef.current) {
      // Lub-dub rhythmic pulse
      const t = state.clock.getElapsedTime() * 3.4;
      const beat1 = Math.sin(t);
      const beat2 = Math.sin(t + 0.35);
      const pulse =
        Math.max(0, beat1 * beat1 * beat1) * 0.03 +
        Math.max(0, beat2 * beat2 * beat2) * 0.018;

      muscleGroupRef.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
    }
  });

  return (
    <group ref={heartGroupRef} position={[0, -0.1, 0]}>
      {/* Cardiac muscle mass */}
      <group ref={muscleGroupRef}>
        {/* Left Ventricle */}
        <mesh
          position={[-0.15, -0.3, 0.05]}
          rotation={[0.1, 0.15, -0.25]}
          geometry={lvConeGeo}
          material={crystallineCardiacMaterial}
        />

        {/* Right Ventricle */}
        <mesh
          position={[0.42, -0.15, 0.25]}
          rotation={[0.0, -0.2, 0.18]}
          geometry={rvSphereGeo}
          material={crystallineCardiacMaterial}
        />

        {/* Left Atrium */}
        <mesh
          position={[-0.48, 0.75, -0.25]}
          geometry={laSphereGeo}
          material={crystallineAtriumMaterial}
        />

        {/* Right Atrium */}
        <mesh
          position={[0.68, 0.65, 0.15]}
          geometry={raSphereGeo}
          material={crystallineAtriumMaterial}
        />

        {/* Interventricular sulcus groove with cyan fiber glow */}
        <mesh
          position={[0.05, -0.15, 0.75]}
          rotation={[0, 0, -0.15]}
          geometry={sulcusGeo}
          material={sulcusMaterial}
        />

        {/* Superior Vena Cava */}
        <mesh
          position={[0.85, 1.25, 0.05]}
          geometry={svcCylinderGeo}
          material={pulmonaryGlassMaterial}
        />

        {/* Inferior Vena Cava */}
        <mesh
          position={[0.75, -0.9, -0.15]}
          geometry={ivcCylinderGeo}
          material={pulmonaryGlassMaterial}
        />

        {/* Great Vessels */}
        <group>
          <mesh geometry={aortaGeo} material={aortaGlassMaterial} />
          <mesh geometry={branch1Geo} material={aortaGlassMaterial} />
          <mesh geometry={branch2Geo} material={aortaGlassMaterial} />
          <mesh geometry={branch3Geo} material={aortaGlassMaterial} />

          <mesh geometry={pulmonaryGeo} material={pulmonaryGlassMaterial} />

          <mesh
            position={[-0.55, 1.45, -0.25]}
            rotation={[0, 0.4, 0.2]}
            geometry={paBranch1Geo}
            material={pulmonaryGlassMaterial}
          />

          <mesh
            position={[0.45, 1.4, -0.3]}
            rotation={[0, -0.4, -0.2]}
            geometry={paBranch2Geo}
            material={pulmonaryGlassMaterial}
          />
        </group>

        {/* Coronary Arteries slightly offset outward (0.02) to prevent clipping into heart body */}
        <group scale={[1.02, 1.02, 1.02]} position={[0, 0, 0.015]}>
          <VesselMesh />
        </group>
      </group>
    </group>
  );
};
