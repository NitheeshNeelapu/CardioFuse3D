import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAppStore } from '../../state/useAppStore';
import { VesselMesh } from './VesselMesh';

export const HeartMesh: React.FC = () => {
  const autoRotate = useAppStore((s) => s.autoRotate);
  const heartGroupRef = useRef<THREE.Group>(null);
  const muscleGroupRef = useRef<THREE.Group>(null);

  // Aorta Arch curve
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

  // Pulmonary Trunk curve
  const pulmonaryCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 0.85, 0.45),
      new THREE.Vector3(0.0, 1.25, 0.35),
      new THREE.Vector3(-0.05, 1.45, 0.1),
      new THREE.Vector3(-0.15, 1.5, -0.15),
    ]);
  }, []);

  const aortaGeo = useMemo(() => new THREE.TubeGeometry(aortaCurve, 40, 0.19, 16, false), [aortaCurve]);
  const pulmonaryGeo = useMemo(() => new THREE.TubeGeometry(pulmonaryCurve, 32, 0.17, 16, false), [pulmonaryCurve]);

  // Brachiocephalic branch vessels
  const branch1Curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, 1.85, 0.0),
    new THREE.Vector3(-0.22, 2.25, 0.05),
  ]), []);
  const branch2Curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 1.93, -0.1),
    new THREE.Vector3(-0.42, 2.3, -0.1),
  ]), []);
  const branch3Curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.55, 1.85, -0.25),
    new THREE.Vector3(-0.62, 2.25, -0.3),
  ]), []);

  const branch1Geo = useMemo(() => new THREE.TubeGeometry(branch1Curve, 16, 0.05, 10, false), [branch1Curve]);
  const branch2Geo = useMemo(() => new THREE.TubeGeometry(branch2Curve, 16, 0.045, 10, false), [branch2Curve]);
  const branch3Geo = useMemo(() => new THREE.TubeGeometry(branch3Curve, 16, 0.045, 10, false), [branch3Curve]);

  // Translucent / Crystalline / Futuristic Glass Materials
  const crystallineCardiacMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0F1F38'), // Dark navy base
      emissive: new THREE.Color('#0A1526'),
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88,
      transmission: 0.45, // Glass / translucent look
      ior: 1.35,
      reflectivity: 0.5,
    });
  }, []);

  const crystallineAtriumMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#132746'),
      emissive: new THREE.Color('#0D1B33'),
      emissiveIntensity: 0.25,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.82,
      transmission: 0.4,
      ior: 1.3,
    });
  }, []);

  const aortaGlassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#881337'), // Rich rose/crimson
      emissive: new THREE.Color('#BE123C'),
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
      transmission: 0.3,
      ior: 1.35,
    });
  }, []);

  const pulmonaryGlassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1E3A8A'), // Deep blue
      emissive: new THREE.Color('#2563EB'),
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
      transmission: 0.3,
      ior: 1.35,
    });
  }, []);

  // Heartbeat pulse & gentle rotation
  useFrame((state, delta) => {
    if (heartGroupRef.current && autoRotate) {
      heartGroupRef.current.rotation.y += delta * 0.32;
    }

    if (muscleGroupRef.current) {
      // Lub-dub rhythmic pulse
      const t = state.clock.getElapsedTime() * 3.4;
      const beat1 = Math.sin(t);
      const beat2 = Math.sin(t + 0.35);
      const pulse = Math.max(0, beat1 * beat1 * beat1) * 0.03 + Math.max(0, beat2 * beat2 * beat2) * 0.018;

      muscleGroupRef.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
    }
  });

  return (
    <group ref={heartGroupRef} position={[0, -0.1, 0]}>
      {/* Cardiac muscle mass (crystalline translucent) */}
      <group ref={muscleGroupRef}>
        {/* Left Ventricle (Larger apex pointing down & anterior-left) */}
        <mesh position={[-0.15, -0.3, 0.05]} rotation={[0.1, 0.15, -0.25]} material={crystallineCardiacMaterial}>
          <coneGeometry args={[1.05, 1.85, 32]} />
        </mesh>

        {/* Right Ventricle (Anterior curvature) */}
        <mesh position={[0.42, -0.15, 0.25]} rotation={[0.0, -0.2, 0.18]} material={crystallineCardiacMaterial}>
          <sphereGeometry args={[0.82, 32, 24]} />
        </mesh>

        {/* Left Atrium */}
        <mesh position={[-0.48, 0.75, -0.25]} material={crystallineAtriumMaterial}>
          <sphereGeometry args={[0.55, 24, 20]} />
        </mesh>

        {/* Right Atrium */}
        <mesh position={[0.68, 0.65, 0.15]} material={crystallineAtriumMaterial}>
          <sphereGeometry args={[0.58, 24, 20]} />
        </mesh>

        {/* Interventricular sulcus groove with cyan fiber glow */}
        <mesh position={[0.05, -0.15, 0.75]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.06, 1.55, 0.06]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.3} />
        </mesh>

        {/* Superior Vena Cava */}
        <mesh position={[0.85, 1.25, 0.05]} material={pulmonaryGlassMaterial}>
          <cylinderGeometry args={[0.16, 0.16, 0.8, 20]} />
        </mesh>

        {/* Inferior Vena Cava */}
        <mesh position={[0.75, -0.9, -0.15]} material={pulmonaryGlassMaterial}>
          <cylinderGeometry args={[0.15, 0.15, 0.5, 20]} />
        </mesh>
      </group>

      {/* Great Vessels */}
      <group>
        <mesh geometry={aortaGeo} material={aortaGlassMaterial} />
        <mesh geometry={branch1Geo} material={aortaGlassMaterial} />
        <mesh geometry={branch2Geo} material={aortaGlassMaterial} />
        <mesh geometry={branch3Geo} material={aortaGlassMaterial} />

        <mesh geometry={pulmonaryGeo} material={pulmonaryGlassMaterial} />

        <mesh position={[-0.55, 1.45, -0.25]} rotation={[0, 0.4, 0.2]} material={pulmonaryGlassMaterial}>
          <cylinderGeometry args={[0.11, 0.11, 0.6, 16]} />
        </mesh>

        <mesh position={[0.45, 1.4, -0.3]} rotation={[0, -0.4, -0.2]} material={pulmonaryGlassMaterial}>
          <cylinderGeometry args={[0.11, 0.11, 0.6, 16]} />
        </mesh>
      </group>

      {/* Selectable Coronary Arteries (LAD, LCX, RCA) */}
      <VesselMesh />
    </group>
  );
};
