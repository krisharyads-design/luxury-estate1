

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DirectionalLight, PointLight } from "three";
import { experienceState } from "@/lib/animation-store";

export function Lighting() {
  const key = useRef<DirectionalLight>(null);
  const gold = useRef<PointLight>(null);
  const pool = useRef<PointLight>(null);

  useFrame(() => {
    const p = experienceState.progress;
    if (key.current) {
      key.current.intensity = 2.9 - p * 1.05;
      key.current.position.x = 4 - p * 8;
      key.current.position.z = 5 - p * 2;
    }
    if (gold.current) {
      gold.current.intensity = 15 + p * 25;
      gold.current.position.x = Math.sin(p * Math.PI * 2) * 4;
    }
    if (pool.current) {
      pool.current.intensity = 7 + Math.sin(p * Math.PI * 4) * 2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.42} />
      <directionalLight
        ref={key}
        castShadow
        intensity={2.7}
        position={[4, 7, 5]}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <pointLight ref={gold} color="#f4d58d" intensity={14} distance={16} position={[2, 2, 3]} />
      <pointLight ref={pool} color="#86e8ff" intensity={6} distance={8} position={[-2.3, 0.35, 2.8]} />
    </>
  );
}
