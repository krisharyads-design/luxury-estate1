import { Float, MeshReflectorMaterial, RoundedBox, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Color, Group, InstancedMesh, Mesh } from "three";
import { experienceState } from "@/lib/animation-store";

// ─── Window shader — enhanced with room-light hotspots ───────────────────
const WindowMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uColorA: new Color("#f5d795"),
    uColorB: new Color("#64d9ff"),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vUv;

    float softCircle(vec2 uv, vec2 center, float r) {
      return 1.0 - smoothstep(r * 0.4, r, length(uv - center));
    }

    void main() {
      float edge = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
      float topBot = smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
      float mask = edge * topBot;

      // Base warm gradient
      vec3 color = mix(uColorA, uColorB, vUv.y * 0.24 + uProgress * 0.16);

      // Subtle scan shimmer
      float scan = sin((vUv.y + uTime * 0.06) * 22.0) * 0.04;
      color += scan;

      // Room-light hotspots (chandelier-style ceiling lights)
      float spot1 = softCircle(vUv, vec2(0.25, 0.85), 0.18) * 0.55;
      float spot2 = softCircle(vUv, vec2(0.75, 0.85), 0.18) * 0.55;
      float spot3 = softCircle(vUv, vec2(0.5,  0.82), 0.12) * 0.4;
      color += vec3(1.0, 0.92, 0.70) * (spot1 + spot2 + spot3);

      // Floor bounce (warm pooled light at bottom)
      float floorGlow = smoothstep(0.3, 0.0, vUv.y) * 0.3;
      color += vec3(1.0, 0.82, 0.5) * floorGlow;

      float alpha = (0.52 + (spot1 + spot2 + spot3) * 0.3) * mask;
      gl_FragColor = vec4(color, alpha);
    }
  `
);
extend({ WindowMaterial });

// ─── Window panel ────────────────────────────────────────────────────────
function Window({
  position,
  scale,
  rotation,
}: {
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

// ─── Floating ambient orbs (firefly / lantern effect) ────────────────────
const ORB_COUNT = 18;
const orbData = Array.from({ length: ORB_COUNT }, (_, i) => ({
  x: (Math.random() - 0.5) * 11,
  y: 0.2 + Math.random() * 2.6,
  z: (Math.random() - 0.5) * 5,
  phase: Math.random() * Math.PI * 2,
  speed: 0.28 + Math.random() * 0.38,
  radius: 0.22 + Math.random() * 0.55,
  color: Math.random() > 0.55
    ? new Color("#ffe8b0")   // warm gold
    : new Color("#aaddff"),  // cool teal/blue
}));

function FloatingOrbs() {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!ref.current) return;
    const t = performance.now() * 0.001;
    for (let i = 0; i < ORB_COUNT; i++) {
      const o = orbData[i];
      dummy.position.set(
        o.x + Math.sin(t * o.speed + o.phase) * o.radius,
        o.y + Math.sin(t * o.speed * 0.72 + o.phase + 1.1) * 0.18,
        o.z + Math.cos(t * o.speed * 0.85 + o.phase) * o.radius * 0.6
      );
      dummy.scale.setScalar(0.038 + Math.sin(t * 1.2 + o.phase) * 0.012);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, ORB_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        emissive="#ffd090"
        emissiveIntensity={6.5}
        color="#000000"
        transparent
        opacity={0.85}
      />
    </instancedMesh>
  );
}

// ─── Ground uplight ───────────────────────────────────────────────────────
function GroundLight({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.038, 8, 8]} />
      <meshStandardMaterial emissive="#ffe8c0" emissiveIntensity={5.0} color="#000000" />
    </mesh>
  );
}

// ─── Firepit / water-bowl feature ────────────────────────────────────────
function FireFeature({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<Mesh>(null);
  useFrame(() => {
    if (!flameRef.current) return;
    const t = performance.now() * 0.001;
    flameRef.current.scale.setScalar(0.8 + Math.sin(t * 4.8) * 0.18);
    (flameRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      5.5 + Math.sin(t * 7.2) * 1.5;
  });
  return (
    <group position={position}>
      {/* Stone bowl base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.18, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.45} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.22, 0.025, 8, 32]} />
        <meshStandardMaterial color="#f4d58d" emissive="#a87620" emissiveIntensity={1.5} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Flame glow */}
      <mesh ref={flameRef} position={[0, 0.24, 0]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial
          color="#ff6600"
          emissive="#ff4400"
          emissiveIntensity={5.5}
          transparent
          opacity={0.82}
        />
      </mesh>
      {/* Point light from flame */}
      <pointLight color="#ff8822" intensity={1.6} distance={3.5} decay={2} position={[0, 0.35, 0]} />
    </group>
  );
}

// ─── Villa ────────────────────────────────────────────────────────────────
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
            blur={[180, 55]}
            resolution={2048}
            mixBlur={0.38}
            mixStrength={8.0}
            roughness={0.38}
            metalness={0.88}
            mirror={0.62}
          />
        </mesh>

        {/* Floating orbs atmosphere */}
        <FloatingOrbs />

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

        {/* Upper studio wing (dark charcoal) */}
        <RoundedBox castShadow receiveShadow args={[3.2, 1.38, 2.8]} radius={0.05} position={[2.4, 2.18, -0.3]}>
          <meshStandardMaterial color="#101010" metalness={0.55} roughness={0.13} />
        </RoundedBox>

        {/* Main roof slab */}
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

        {/* Long glazing strip — ground floor front (enhanced) */}
        <Window position={[-0.5, 0.88, 1.71]} scale={[6.0, 0.74, 1]} />

        {/* Upper wing front glazing */}
        <Window position={[2.4, 2.18, 0.62]} scale={[2.8, 0.94, 1]} />

        {/* Upper wing side glazing */}
        <Window position={[4.02, 2.18, -0.3]} scale={[2.4, 0.94, 1]} rotation={[0, Math.PI / 2, 0]} />

        {/* ── GOLD VERTICAL FINS (wow accent) ── */}
        {[-4.3, -3.3, 3.3, 4.3].map((x, i) => (
          <mesh key={`fin-${i}`} castShadow position={[x, 0.9, 1.74]}>
            <boxGeometry args={[0.04, 1.68, 0.06]} />
            <meshStandardMaterial
              color="#f4d58d"
              emissive="#c8820a"
              emissiveIntensity={2.8}
              metalness={0.82}
              roughness={0.18}
            />
          </mesh>
        ))}

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

        {/* Horizontal gold LED strip — base of ground floor front */}
        <mesh position={[-0.5, 0.12, 1.73]}>
          <boxGeometry args={[8.6, 0.055, 0.07]} />
          <meshStandardMaterial color="#f4d58d" emissive="#c8820a" emissiveIntensity={2.4} />
        </mesh>

        {/* Gold LED strip — top of ground floor front (under roof overhang) */}
        <mesh position={[-0.5, 1.63, 1.73]}>
          <boxGeometry args={[8.6, 0.04, 0.05]} />
          <meshStandardMaterial color="#f4d58d" emissive="#c8820a" emissiveIntensity={2.0} />
        </mesh>

        {/* Gold vertical seam on upper wing corner */}
        <mesh position={[3.82, 2.18, -0.3]}>
          <boxGeometry args={[0.05, 1.4, 2.85]} />
          <meshStandardMaterial color="#f4d58d" emissive="#a87620" emissiveIntensity={1.5} />
        </mesh>

        {/* Gold header above canopy */}
        <mesh position={[-2.7, 1.96, 2.62]}>
          <boxGeometry args={[2.4, 0.04, 0.06]} />
          <meshStandardMaterial color="#f4d58d" emissive="#a87620" emissiveIntensity={2.0} />
        </mesh>

        {/* ── INTERIOR POINT LIGHTS (spill through windows) ── */}
        <pointLight position={[-0.5, 0.9, 1.2]} intensity={1.2} color="#ffd888" distance={4} decay={2} />
        <pointLight position={[2.4, 2.2, 0.0]} intensity={0.9} color="#ffe0a0" distance={3.5} decay={2} />

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
            mixStrength={4.5}
            roughness={0.06}
            metalness={0.28}
            mirror={0.92}
          />
        </mesh>

        {/* Pool underwater lights */}
        {[-1.8, 0, 1.8].map((z, i) => (
          <mesh key={`pool-light-${i}`} position={[-5.2, 0.09, 0.2 + z]}>
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshStandardMaterial emissive="#0099dd" emissiveIntensity={6.5} color="#000000" />
          </mesh>
        ))}

        {/* Pool point light (blue ambient spill) */}
        <pointLight position={[-5.2, 0.5, 0.2]} intensity={1.2} color="#0077bb" distance={5} decay={2} />

        {/* Pool edge gold coping glow strip */}
        <mesh position={[-3.64, 0.1, 0.2]}>
          <boxGeometry args={[0.04, 0.04, 5.8]} />
          <meshStandardMaterial color="#f4d58d" emissive="#c8820a" emissiveIntensity={1.6} />
        </mesh>

        {/* ── FIRE FEATURES ── */}
        <FireFeature position={[3.8, -0.01, 3.6]} />
        <FireFeature position={[-3.5, -0.01, 3.6]} />

        {/* ── GROUND UPLIGHTS ── */}
        {[-3.8, -2.2, -0.6, 1.0, 2.6, 4.0].map((x, i) => (
          <GroundLight key={`ul-${i}`} position={[x, -0.15, 1.88]} />
        ))}

        {/* Pool-side uplights */}
        {[-2.4, 0.4, 2.8].map((z, i) => (
          <GroundLight key={`pool-ul-${i}`} position={[-3.6, -0.15, 0.2 + z - 1.2]} />
        ))}

        {/* ── LOW PERIMETER WALL ── */}
        <mesh receiveShadow position={[0, -0.01, 4.55]}>
          <boxGeometry args={[15, 0.48, 0.22]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.22} roughness={0.36} />
        </mesh>

        {/* Perimeter wall top gold cap */}
        <mesh position={[0, 0.24, 4.55]}>
          <boxGeometry args={[15, 0.04, 0.26]} />
          <meshStandardMaterial color="#f4d58d" emissive="#a87620" emissiveIntensity={1.2} metalness={0.75} roughness={0.25} />
        </mesh>

        {/* ── ENTRANCE PLANTERS (architectural, no greenery) ── */}
        {[-3.8, 0.8].map((x, i) => (
          <group key={`planter-${i}`} position={[x, 0, 3.6]}>
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.36, 0.58]} />
              <meshStandardMaterial color="#0d0d0d" metalness={0.25} roughness={0.35} />
            </mesh>
            {/* Gold trim on planter top edge */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[1.12, 0.04, 0.60]} />
              <meshStandardMaterial color="#f4d58d" emissive="#a87620" emissiveIntensity={1.4} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Planter interior — dark stone */}
            <mesh position={[0, 0.28, 0]}>
              <boxGeometry args={[0.96, 0.12, 0.46]} />
              <meshStandardMaterial color="#0a0a0a" roughness={0.82} metalness={0} />
            </mesh>
          </group>
        ))}

        {/* ── GARDEN STEPS ── */}
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
