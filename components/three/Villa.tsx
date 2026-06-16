"use client";

import { Float, MeshReflectorMaterial, RoundedBox, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Group, Mesh, ShaderMaterial } from "three";
import { experienceState } from "@/lib/animation-store";

const WindowMaterial = shaderMaterial(
  { uTime: 0, uProgress: 0, uColorA: new Color("#f5d795"), uColorB: new Color("#64d9ff") },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vUv;
    void main() {
      float scan = sin((vUv.y + uTime * .08) * 34.0) * .08;
      float edge = smoothstep(.0, .12, vUv.x) * smoothstep(1.0, .86, vUv.x);
      vec3 color = mix(uColorA, uColorB, vUv.y * .35 + uProgress * .24);
      gl_FragColor = vec4(color + scan, .54 * edge);
    }
  `
);

extend({ WindowMaterial });

function Window({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  const material = useMemo(() => new WindowMaterial(), []);
  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
    material.uniforms.uProgress.value = experienceState.progress;
  });

  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 0.035]} />
      <primitive object={material} attach="material" transparent depthWrite={false} />
    </mesh>
  );
}

function Slats() {
  const slats = useMemo(() => Array.from({ length: 16 }, (_, i) => i), []);
  return (
    <group position={[0.8, 1.42, -0.55]}>
      {slats.map((index) => (
        <mesh key={index} castShadow position={[-2.2 + index * 0.18, 0, 0]}>
          <boxGeometry args={[0.035, 0.92, 0.16]} />
          <meshStandardMaterial color="#c9a45c" metalness={0.55} roughness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

export function Villa() {
  const group = useRef<Group>(null);
  const water = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = experienceState.progress;
    group.current.rotation.y += delta * (0.08 + experienceState.velocity * 0.03);
    group.current.rotation.y = group.current.rotation.y * 0.985 + (Math.sin(p * Math.PI * 2) * 0.5 + p * 0.7) * 0.015;
    group.current.position.y = Math.sin(performance.now() * 0.00055) * 0.035;
    if (water.current) water.current.rotation.z += delta * 0.025;
  });

  return (
    <Float speed={0.75} rotationIntensity={0.08} floatIntensity={0.08}>
      <group ref={group} position={[0, -0.78, 0]}>
        <mesh receiveShadow position={[0, -0.08, 0]}>
          <boxGeometry args={[8.5, 0.18, 6.2]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.35} roughness={0.32} />
        </mesh>
        <mesh receiveShadow position={[0, -0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[34, 34]} />
          <MeshReflectorMaterial
            color="#050505"
            blur={[120, 32]}
            resolution={2048}
            mixBlur={0.45}
            mixStrength={4.2}
            roughness={0.48}
            metalness={0.72}
            mirror={0.42}
          />
        </mesh>
        <RoundedBox castShadow receiveShadow args={[4.2, 1.45, 2.4]} radius={0.06} position={[-0.6, 0.68, 0]}>
          <meshStandardMaterial color="#151515" metalness={0.44} roughness={0.18} />
        </RoundedBox>
        <RoundedBox castShadow receiveShadow args={[2.5, 1.1, 2.1]} radius={0.05} position={[1.35, 1.62, -0.45]}>
          <meshStandardMaterial color="#f2f0ea" metalness={0.18} roughness={0.26} />
        </RoundedBox>
        <RoundedBox castShadow receiveShadow args={[3.35, 0.28, 2.8]} radius={0.04} position={[0.25, 2.29, -0.3]}>
          <meshStandardMaterial color="#0a0a0a" metalness={0.68} roughness={0.14} />
        </RoundedBox>
        <RoundedBox castShadow receiveShadow args={[4.75, 0.22, 2.95]} radius={0.035} position={[-0.45, 1.43, 0.08]}>
          <meshStandardMaterial color="#080808" metalness={0.68} roughness={0.15} />
        </RoundedBox>
        <Window position={[-1.45, 0.72, 1.23]} scale={[1.45, 0.78, 1]} />
        <Window position={[0.22, 0.72, 1.23]} scale={[1.2, 0.78, 1]} />
        <Window position={[1.42, 1.62, 0.63]} scale={[1.2, 0.64, 1]} />
        <Window position={[2.61, 1.62, -0.45]} scale={[1, 0.64, 1]} />
        <Slats />
        <mesh castShadow receiveShadow position={[-2.4, 0.19, 2.1]}>
          <boxGeometry args={[2.3, 0.14, 1.3]} />
          <meshStandardMaterial color="#101010" metalness={0.2} roughness={0.24} />
        </mesh>
        <mesh ref={water} receiveShadow position={[-2.4, 0.28, 2.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.05, 1.08, 48, 48]} />
          <MeshReflectorMaterial
            color="#10202a"
            blur={[70, 24]}
            resolution={1024}
            mixStrength={2.7}
            roughness={0.12}
            metalness={0.15}
            mirror={0.7}
          />
        </mesh>
        <mesh position={[0.4, 0.37, 1.54]}>
          <boxGeometry args={[5.25, 0.055, 0.06]} />
          <meshStandardMaterial color="#f4d58d" emissive="#9b6d22" emissiveIntensity={1.4} />
        </mesh>
        <mesh position={[2.85, 1.97, -0.45]}>
          <boxGeometry args={[0.045, 0.78, 1.8]} />
          <meshStandardMaterial color="#f4d58d" emissive="#9b6d22" emissiveIntensity={1.1} />
        </mesh>
      </group>
    </Float>
  );
}
