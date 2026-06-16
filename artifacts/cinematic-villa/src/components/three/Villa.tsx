import { Float, MeshReflectorMaterial, RoundedBox, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Group, Mesh } from "three";
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
      float scan = sin((vUv.y + uTime * .07) * 28.0) * .06;
      float edge = smoothstep(.0, .1, vUv.x) * smoothstep(1.0, .9, vUv.x);
      vec3 color = mix(uColorA, uColorB, vUv.y * .28 + uProgress * .18);
      gl_FragColor = vec4(color + scan, .52 * edge);
    }
  `
);

extend({ WindowMaterial });

function Window({ position, scale, rotation }: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
}) {
  const material = useMemo(() => new WindowMaterial(), []);
  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
    material.uniforms.uProgress.value = experienceState.progress;
  });
  return (
    <mesh position={position} scale={scale} rotation={rotation ?? [0, 0, 0]}>
      <boxGeometry args={[1, 1, 0.03]} />
      <primitive object={material} attach="material" transparent depthWrite={false} />
    </mesh>
  );
}

function PalmTree({ position }: { position: [number, number, number] }) {
  const angle = useMemo(() => Math.random() * 0.3 - 0.15, []);
  return (
    <group position={position} rotation={[angle, Math.random() * Math.PI * 2, angle * 0.5]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.042, 0.09, 4.0, 8]} />
        <meshStandardMaterial color="#2a1200" roughness={0.95} metalness={0} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          castShadow
          position={[
            Math.sin((i / 8) * Math.PI * 2) * 0.26,
            2.02,
            Math.cos((i / 8) * Math.PI * 2) * 0.26,
          ]}
          rotation={[
            -0.9 + Math.sin(i * 1.5) * 0.12,
            (i / 8) * Math.PI * 2,
            0,
          ]}
        >
          <coneGeometry args={[0.055, 1.75, 5]} />
          <meshStandardMaterial color="#122a09" roughness={0.88} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

function GroundLight({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.038, 8, 8]} />
      <meshStandardMaterial emissive="#ffe8c0" emissiveIntensity={4.5} color="#000000" />
    </mesh>
  );
}

export function Villa() {
  const group = useRef<Group>(null);
  const poolWater = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = experienceState.progress;
    group.current.rotation.y += delta * (0.055 + experienceState.velocity * 0.025);
    group.current.rotation.y =
      group.current.rotation.y * 0.988 +
      (Math.sin(p * Math.PI * 2) * 0.38 + p * 0.52) * 0.012;
    group.current.position.y = Math.sin(performance.now() * 0.00042) * 0.028;
    if (poolWater.current) poolWater.current.rotation.z += delta * 0.018;
  });

  return (
    <Float speed={0.55} rotationIntensity={0.055} floatIntensity={0.055}>
      <group ref={group} position={[0, -0.95, 0]}>

        {/* ── GROUND ── */}
        <mesh receiveShadow position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[44, 44]} />
          <MeshReflectorMaterial
            color="#020202"
            blur={[160, 48]}
            resolution={2048}
            mixBlur={0.38}
            mixStrength={6.5}
            roughness={0.42}
            metalness={0.82}
            mirror={0.56}
          />
        </mesh>

        {/* Site base slab */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[14, 0.19, 8]} />
          <meshStandardMaterial color="#0b0b0b" metalness={0.3} roughness={0.28} />
        </mesh>

        {/* ── MAIN BUILDING ── */}

        {/* Ground floor: long horizontal wing (cream/ivory) */}
        <RoundedBox castShadow receiveShadow args={[9.2, 1.68, 3.4]} radius={0.04} position={[0, 0.82, 0]}>
          <meshStandardMaterial color="#ede9e0" metalness={0.07} roughness={0.27} />
        </RoundedBox>

        {/* Upper studio wing (dark charcoal, set to one end) */}
        <RoundedBox castShadow receiveShadow args={[3.2, 1.38, 2.8]} radius={0.05} position={[2.4, 2.18, -0.3]}>
          <meshStandardMaterial color="#101010" metalness={0.55} roughness={0.13} />
        </RoundedBox>

        {/* Main roof slab (slightly overhanging) */}
        <mesh castShadow receiveShadow position={[0, 1.72, 0]}>
          <boxGeometry args={[9.7, 0.21, 3.82]} />
          <meshStandardMaterial color="#050505" metalness={0.78} roughness={0.11} />
        </mesh>

        {/* Upper wing roof slab */}
        <mesh castShadow receiveShadow position={[2.4, 2.9, -0.3]}>
          <boxGeometry args={[3.6, 0.21, 3.2]} />
          <meshStandardMaterial color="#050505" metalness={0.78} roughness={0.11} />
        </mesh>

        {/* ── FACADE DETAILS ── */}

        {/* Wood screen slats (decorative front-left facade) */}
        {Array.from({ length: 15 }, (_, i) => (
          <mesh key={`slat-${i}`} castShadow position={[-4.4 + i * 0.27, 0.82, 1.72]}>
            <boxGeometry args={[0.065, 1.62, 0.13]} />
            <meshStandardMaterial color="#5e3418" metalness={0.1} roughness={0.84} />
          </mesh>
        ))}

        {/* Long glazing strip — ground floor front */}
        <Window position={[-0.5, 0.88, 1.71]} scale={[6.0, 0.74, 1]} />

        {/* Upper wing front glazing */}
        <Window position={[2.4, 2.18, 0.62]} scale={[2.8, 0.94, 1]} />

        {/* Upper wing side glazing */}
        <Window position={[4.02, 2.18, -0.3]} scale={[2.4, 0.94, 1]} rotation={[0, Math.PI / 2, 0]} />

        {/* ── ENTRANCE CANOPY ── */}
        <mesh castShadow receiveShadow position={[-2.7, 1.86, 2.62]}>
          <boxGeometry args={[2.4, 0.16, 1.6]} />
          <meshStandardMaterial color="#070707" metalness={0.74} roughness={0.12} />
        </mesh>

        <mesh castShadow position={[-3.65, 0.92, 3.2]}>
          <cylinderGeometry args={[0.058, 0.058, 1.86, 12]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.65} roughness={0.16} />
        </mesh>

        <mesh castShadow position={[-1.75, 0.92, 3.2]}>
          <cylinderGeometry args={[0.058, 0.058, 1.86, 12]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.65} roughness={0.16} />
        </mesh>

        {/* ── GOLD ACCENTS ── */}

        {/* Horizontal gold LED strip above ground floor windows */}
        <mesh position={[-0.5, 0.12, 1.73]}>
          <boxGeometry args={[8.6, 0.055, 0.07]} />
          <meshStandardMaterial color="#f4d58d" emissive="#a87620" emissiveIntensity={2.0} />
        </mesh>

        {/* Gold vertical seam on upper wing corner */}
        <mesh position={[3.82, 2.18, -0.3]}>
          <boxGeometry args={[0.05, 1.4, 2.85]} />
          <meshStandardMaterial color="#f4d58d" emissive="#a87620" emissiveIntensity={1.3} />
        </mesh>

        {/* Gold header above canopy */}
        <mesh position={[-2.7, 1.96, 2.62]}>
          <boxGeometry args={[2.4, 0.04, 0.06]} />
          <meshStandardMaterial color="#f4d58d" emissive="#a87620" emissiveIntensity={1.8} />
        </mesh>

        {/* ── SWIMMING POOL ── */}

        {/* Pool surround (dark stone deck) */}
        <mesh receiveShadow position={[-5.2, -0.05, 0.2]}>
          <boxGeometry args={[3.6, 0.23, 6.4]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.26} roughness={0.22} />
        </mesh>

        {/* Pool shell edge/coping */}
        <mesh receiveShadow position={[-5.2, 0.07, 0.2]}>
          <boxGeometry args={[3.0, 0.06, 5.8]} />
          <meshStandardMaterial color="#1c1c1c" metalness={0.4} roughness={0.18} />
        </mesh>

        {/* Pool water surface */}
        <mesh ref={poolWater} receiveShadow position={[-5.2, 0.11, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.75, 5.5, 32, 32]} />
          <MeshReflectorMaterial
            color="#061826"
            blur={[90, 32]}
            resolution={1024}
            mixStrength={3.8}
            roughness={0.08}
            metalness={0.22}
            mirror={0.88}
          />
        </mesh>

        {/* Pool underwater lights */}
        {[-1.8, 0, 1.8].map((z, i) => (
          <mesh key={`pool-light-${i}`} position={[-5.2, 0.09, 0.2 + z]}>
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshStandardMaterial emissive="#0088cc" emissiveIntensity={5.5} color="#000000" />
          </mesh>
        ))}

        {/* ── LANDSCAPE ── */}

        {/* Palm trees */}
        <PalmTree position={[-6.6, 0, 2.5]} />
        <PalmTree position={[5.8, 0, 2.8]} />
        <PalmTree position={[-7.2, 0, -0.8]} />
        <PalmTree position={[6.2, 0, -2.4]} />

        {/* Ground uplights along front facade */}
        {[-3.8, -2.2, -0.6, 1.0, 2.6, 4.0].map((x, i) => (
          <GroundLight key={`ul-${i}`} position={[x, -0.15, 1.88]} />
        ))}

        {/* Pool-side uplights */}
        {[-2.4, 0.4, 2.8].map((z, i) => (
          <GroundLight key={`pool-ul-${i}`} position={[-3.6, -0.15, 0.2 + z - 1.2]} />
        ))}

        {/* Low perimeter wall (front) */}
        <mesh receiveShadow position={[0, -0.01, 4.55]}>
          <boxGeometry args={[15, 0.48, 0.22]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.22} roughness={0.36} />
        </mesh>

        {/* Hedge planters (flanking entrance) */}
        {[-3.8, 0.8].map((x, i) => (
          <group key={`planter-${i}`} position={[x, 0, 3.6]}>
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.28, 0.58]} />
              <meshStandardMaterial color="#0d0d0d" metalness={0.2} roughness={0.38} />
            </mesh>
            <mesh castShadow position={[0, 0.22, 0]}>
              <boxGeometry args={[1.0, 0.26, 0.5]} />
              <meshStandardMaterial color="#0f2009" roughness={0.92} metalness={0} />
            </mesh>
          </group>
        ))}

        {/* Garden steps (entrance approach) */}
        {[0.12, 0.24, 0.36].map((y, i) => (
          <mesh key={`step-${i}`} receiveShadow position={[-2.7, y - 0.07, 3.35 + i * 0.24]}>
            <boxGeometry args={[2.2, 0.13, 0.26]} />
            <meshStandardMaterial color="#111111" metalness={0.32} roughness={0.28} />
          </mesh>
        ))}

      </group>
    </Float>
  );
}
