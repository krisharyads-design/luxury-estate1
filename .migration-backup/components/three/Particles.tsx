"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Points as ThreePoints } from "three";
import { experienceState } from "@/lib/animation-store";

export function Particles({ count = 700 }: { count?: number }) {
  const ref = useRef<ThreePoints>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      data[i * 3] = (Math.random() - 0.5) * 18;
      data[i * 3 + 1] = Math.random() * 8 - 1;
      data[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return data;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * (0.018 + experienceState.velocity * 0.04);
    ref.current.position.y = Math.sin(performance.now() * 0.00035) * 0.14;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#f4d58d" size={0.025} sizeAttenuation depthWrite={false} opacity={0.55} />
    </Points>
  );
}
