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

  const targetCameraPos = useRef(new THREE.Vector3(0, 0.3, 4.6));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const animating = useRef(true);

  // Reset Camera action
  useEffect(() => {
    targetCameraPos.current.set(0, 0.3, 4.6);
    targetLookAt.current.set(0, 0, 0);
  }, [resetCameraTrigger]);

  // Zoom In action
  useEffect(() => {
    if (zoomInTrigger > 0) {
      targetCameraPos.current = camera.position.clone().multiplyScalar(0.85);
    }
  }, [zoomInTrigger, camera]);

  // Zoom Out action
  useEffect(() => {
    if (zoomOutTrigger > 0) {
      targetCameraPos.current = camera.position.clone().multiplyScalar(1.18);
    }
  }, [zoomOutTrigger, camera]);

  // Smooth camera positioning based on selected vessel
  useEffect(() => {
    if (selectedVessel === 'LAD') {
      targetCameraPos.current.set(0.1, 0.15, 3.6);
      targetLookAt.current.set(0.0, -0.2, 0.4);
    } else if (selectedVessel === 'LCX') {
      targetCameraPos.current.set(-3.2, 0.5, 2.3);
      targetLookAt.current.set(-0.6, 0.2, 0.0);
    } else if (selectedVessel === 'RCA') {
      targetCameraPos.current.set(3.0, 0.4, 2.5);
      targetLookAt.current.set(0.6, 0.1, 0.2);
    }
  }, [selectedVessel, focusVesselTrigger]);

  // Trigger animation when selection, reset, or zoom changes
  useEffect(() => {
    animating.current = true;
  }, [selectedVessel, resetCameraTrigger, zoomInTrigger, zoomOutTrigger, focusVesselTrigger]);

  useFrame((_, delta) => {
    if (!animating.current) return;
    const step = Math.min(1, delta * 3.8);
    camera.position.lerp(targetCameraPos.current, step);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, step);
      controlsRef.current.update();
    }
    if (camera.position.distanceTo(targetCameraPos.current) < 0.01) {
      animating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      onStart={() => {
        animating.current = false;
      }}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2.0}
      maxDistance={8.0}
      dampingFactor={0.08}
    />
  );
};
