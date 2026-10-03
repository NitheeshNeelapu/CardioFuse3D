import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../state/useAppStore';

export const CameraControls: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const resetCameraTrigger = useAppStore((s) => s.resetCameraTrigger);
  const zoomInTrigger = useAppStore((s) => s.zoomInTrigger);
  const zoomOutTrigger = useAppStore((s) => s.zoomOutTrigger);
  const focusVesselTrigger = useAppStore((s) => s.focusVesselTrigger);

  const defaultPosition = useMemoPosition(0, 0.3, 4.6);
  const defaultTarget = useMemoPosition(0, 0, 0);

  const targetCameraPos = useRef(new THREE.Vector3(0, 0.3, 4.6));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Reset Camera action
  useEffect(() => {
    targetCameraPos.current.set(0, 0.3, 4.6);
    targetLookAt.current.set(0, 0, 0);
  }, [resetCameraTrigger]);

  // Zoom In action
  useEffect(() => {
    if (zoomInTrigger > 0) {
      targetCameraPos.current.multiplyScalar(0.85);
    }
  }, [zoomInTrigger]);

  // Zoom Out action
  useEffect(() => {
    if (zoomOutTrigger > 0) {
      targetCameraPos.current.multiplyScalar(1.18);
    }
  }, [zoomOutTrigger]);

  // Smooth camera positioning based on selected vessel
  useEffect(() => {
    if (selectedVessel === 'LAD') {
      // Anterior focus on the interventricular groove
      targetCameraPos.current.set(0.1, 0.15, 3.6);
      targetLookAt.current.set(0.0, -0.2, 0.4);
    } else if (selectedVessel === 'LCX') {
      // Left lateral oblique focus
      targetCameraPos.current.set(-3.2, 0.5, 2.3);
      targetLookAt.current.set(-0.6, 0.2, 0.0);
    } else if (selectedVessel === 'RCA') {
      // Right lateral oblique focus
      targetCameraPos.current.set(3.0, 0.4, 2.5);
      targetLookAt.current.set(0.6, 0.1, 0.2);
    }
  }, [selectedVessel, focusVesselTrigger]);

  useFrame((_, delta) => {
    const step = Math.min(1, delta * 3.8);
    camera.position.lerp(targetCameraPos.current, step);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, step);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2.0}
      maxDistance={8.0}
      dampingFactor={0.08}
    />
  );
};

function useMemoPosition(x: number, y: number, z: number) {
  return React.useMemo(() => new THREE.Vector3(x, y, z), [x, y, z]);
}
