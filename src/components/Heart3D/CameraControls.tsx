import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../state/useAppStore';

export const CameraControls: React.FC = () => {
  const { camera, size } = useThree();
  const controlsRef = useRef<any>(null);
  const selectedVessel = useAppStore((s) => s.selectedVessel);
  const resetCameraTrigger = useAppStore((s) => s.resetCameraTrigger);
  const zoomInTrigger = useAppStore((s) => s.zoomInTrigger);
  const zoomOutTrigger = useAppStore((s) => s.zoomOutTrigger);
  const focusVesselTrigger = useAppStore((s) => s.focusVesselTrigger);

  // Compute default distance so the whole heart including aorta arch fits with ~10% margin.
  // On portrait phones (aspect < 1), move camera back, clamped between 5.2 and 7.0.
  const aspect = size.width / Math.max(1, size.height);
  const defaultZ = aspect < 1 ? Math.min(7.0, Math.max(5.2, 5.2 / aspect)) : 5.2;

  const targetCameraPos = useRef(new THREE.Vector3(0, 0.4, defaultZ));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.4, 0));
  const animating = useRef(true);

  // Recompute camera distance on viewport resize
  useEffect(() => {
    if (!selectedVessel || selectedVessel === 'LAD') {
      targetCameraPos.current.set(0.1, 0.4, defaultZ);
      targetLookAt.current.set(0.0, 0.4, 0.0);
      animating.current = true;
    }
  }, [defaultZ]);

  // Reset Camera action
  useEffect(() => {
    targetCameraPos.current.set(0, 0.4, defaultZ);
    targetLookAt.current.set(0, 0.4, 0);
    animating.current = true;
  }, [resetCameraTrigger, defaultZ]);

  // Zoom In action
  useEffect(() => {
    if (zoomInTrigger > 0) {
      targetCameraPos.current = camera.position.clone().multiplyScalar(0.85);
      animating.current = true;
    }
  }, [zoomInTrigger, camera]);

  // Zoom Out action
  useEffect(() => {
    if (zoomOutTrigger > 0) {
      targetCameraPos.current = camera.position.clone().multiplyScalar(1.18);
      animating.current = true;
    }
  }, [zoomOutTrigger, camera]);

  // Smooth camera positioning based on selected vessel — keeps the whole heart visible
  useEffect(() => {
    if (selectedVessel === 'LAD') {
      // Anterior focus
      targetCameraPos.current.set(0.15, 0.4, defaultZ);
      targetLookAt.current.set(0.0, 0.38, 0.0);
    } else if (selectedVessel === 'LCX') {
      // Lateral view: rotate angle around heart but keep whole organ in frame
      targetCameraPos.current.set(-defaultZ * 0.65, 0.5, defaultZ * 0.75);
      targetLookAt.current.set(-0.25, 0.38, 0.0);
    } else if (selectedVessel === 'RCA') {
      // Right view: rotate angle around heart but keep whole organ in frame
      targetCameraPos.current.set(defaultZ * 0.65, 0.45, defaultZ * 0.75);
      targetLookAt.current.set(0.25, 0.38, 0.0);
    }
    animating.current = true;
  }, [selectedVessel, focusVesselTrigger, defaultZ]);

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
      minDistance={2.5}
      maxDistance={9.0}
      dampingFactor={0.08}
    />
  );
};
