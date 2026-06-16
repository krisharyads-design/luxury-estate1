import { Float, MeshReflectorMaterial, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Group } from "three";
import { experienceState } from "@/lib/animation-store";

// ─── Materials (defined once, shared across meshes) ────────────────────────

const matTravertine = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#cec5b5"),
  roughness: 0.88,
  metalness: 0.01,
});

const matDarkConcrete = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#1a1a1a"),
  roughness: 0.82,
  metalness: 0.08,
});

const matBlackMetal = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#0c0c0c"),
  roughness: 0.18,
  metalness: 0.88,
});

const matMullion = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#555555"),
  roughness: 0.22,
  metalness: 0.82,
});

const matGold = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#f4d58d"),
  emissive: new THREE.Color("#9b6810"),
  emissiveIntensity: 2.0,
  roughness: 0.28,
  metalness: 0.78,
});

const matPoolDeck = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#141412"),
  roughness: 0.78,
  metalness: 0.06,
});

const matPoolShell = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#090e14"),
  roughness: 0.88,
  metalness: 0.04,
});

// ─── Window interior shader ────────────────────────────────────────────────

const WindowMaterial = shaderMaterial(
  { uTime: 0 },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      // Clean warm-white interior ambiance — no scan lines
      float vig = smoothstep(0.0, 0.055, vUv.x) * smoothstep(1.0, 0.945, vUv.x)
                * smoothstep(0.0, 0.04,  vUv.y) * smoothstep(1.0, 0.96,  vUv.y);
      float floorBounce = smoothstep(0.25, 0.0, vUv.y) * 0.22;
      float ceilWash    = smoothstep(0.72, 1.0, vUv.y) * 0.10;
      float base = 0.38 + floorBounce + ceilWash;
      // Very subtle breathing variation
      float breathe = 1.0 + sin(uTime * 0.18) * 0.025;
      vec3 warmWhite = vec3(1.0, 0.89, 0.68) * breathe;
      gl_FragColor = vec4(warmWhite * base, base * vig);
    }
  `
);
extend({ WindowMaterial });

// ─── GlazingBay: a full-height glass curtain wall section ─────────────────

function GlazingBay({
  width,
  height,
  panels,
  position,
  rotY = 0,
}: {
  width: number;
  height: number;
  panels: number;
  position: [number, number, number];
  rotY?: number;
}) {
  const winMat = useMemo(() => new WindowMaterial(), []);
  useFrame((_, delta) => {
    winMat.uniforms.uTime.value += delta;
  });

  const panelW = width / panels;

  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Interior warm glow (sits at Z=0, facing camera) */}
      <mesh>
        <planeGeometry args={[width - 0.05, height - 0.04]} />
        <primitive object={winMat} attach="material" transparent depthWrite={false} />
      </mesh>

      {/* Glass overlay — thin, slightly blue-tinted */}
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[width - 0.02, height - 0.02]} />
        <meshPhysicalMaterial
          color="#b8d0e0"
          metalness={0.0}
          roughness={0.03}
          transparent
          opacity={0.18}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Vertical mullions */}
      {Array.from({ length: panels - 1 }, (_, i) => (
        <mesh key={i} position={[-width / 2 + (i + 1) * panelW, 0, 0.018]} material={matMullion}>
          <boxGeometry args={[0.032, height + 0.04, 0.055]} />
        </mesh>
      ))}

      {/* Top rail */}
      <mesh position={[0, height / 2 - 0.016, 0.018]} material={matMullion}>
        <boxGeometry args={[width + 0.06, 0.04, 0.06]} />
      </mesh>

      {/* Bottom rail */}
      <mesh position={[0, -height / 2 + 0.016, 0.018]} material={matMullion}>
        <boxGeometry args={[width + 0.06, 0.04, 0.06]} />
      </mesh>

      {/* Outer frame (reveals depth) */}
      <mesh position={[0, 0, -0.04]} material={matMullion}>
        <boxGeometry args={[width + 0.14, height + 0.08, 0.06]} />
      </mesh>
    </group>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export function Villa() {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = experienceState.progress;
    const targetRot = Math.sin(p * Math.PI * 1.6) * 0.3 + p * 0.42;
    group.current.rotation.y +=
      (targetRot - group.current.rotation.y) * Math.min(delta * 1.1, 1);
    group.current.position.y = Math.sin(performance.now() * 0.00036) * 0.016;
  });

  return (
    <Float speed={0.38} rotationIntensity={0.032} floatIntensity={0.032}>
      <group ref={group} position={[0, -1.15, 0]}>

        {/* ── GROUND ── */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[70, 70]} />
          <MeshReflectorMaterial
            color="#040404"
            blur={[220, 70]}
            resolution={1024}
            mixBlur={0.52}
            mixStrength={11}
            roughness={0.22}
            metalness={0.96}
            mirror={0.68}
          />
        </mesh>

        {/* Site podium */}
        <mesh receiveShadow position={[0, 0.065, 0]} material={matPoolDeck}>
          <boxGeometry args={[22, 0.13, 11]} />
        </mesh>

        {/* Raised house plinth */}
        <mesh receiveShadow position={[0, 0.14, -0.4]} material={matPoolDeck}>
          <boxGeometry args={[12.4, 0.1, 7.6]} />
        </mesh>

        {/* ── GROUND FLOOR ── */}

        {/* Left solid travertine column */}
        <mesh castShadow receiveShadow position={[-4.5, 1.09, -0.4]} material={matTravertine}>
          <boxGeometry args={[2.6, 2.0, 4.2]} />
        </mesh>

        {/* Right solid travertine column */}
        <mesh castShadow receiveShadow position={[4.5, 1.09, -0.4]} material={matTravertine}>
          <boxGeometry args={[2.6, 2.0, 4.2]} />
        </mesh>

        {/* Centre infill (back of glass bay) */}
        <mesh castShadow receiveShadow position={[0, 1.09, -0.4]} material={matTravertine}>
          <boxGeometry args={[5.6, 2.0, 4.2]} />
        </mesh>

        {/* Ground floor front glazing — full-width centre bay */}
        <GlazingBay
          width={5.4} height={1.86}
          panels={5}
          position={[0, 1.09, 1.71]}
        />

        {/* Ground floor left-wing narrow windows */}
        <GlazingBay
          width={1.6} height={1.1}
          panels={2}
          position={[-4.5, 1.09, 1.71]}
        />

        {/* Ground floor right-wing narrow windows */}
        <GlazingBay
          width={1.6} height={1.1}
          panels={2}
          position={[4.5, 1.09, 1.71]}
        />

        {/* Ground floor roof slab — wide overhang */}
        <mesh castShadow receiveShadow position={[0, 2.12, -0.4]} material={matBlackMetal}>
          <boxGeometry args={[12.8, 0.22, 4.7]} />
        </mesh>

        {/* Gold fascia strip (underside front of roof) */}
        <mesh position={[0, 2.0, 2.07]} material={matGold}>
          <boxGeometry args={[12.8, 0.055, 0.055]} />
        </mesh>

        {/* ── UPPER FLOOR (cantilevered, offset left) ── */}

        {/* Upper body — dark concrete, slightly narrower depth for setback */}
        <mesh castShadow receiveShadow position={[-1.6, 3.02, -0.55]} material={matDarkConcrete}>
          <boxGeometry args={[7.6, 1.7, 3.9]} />
        </mesh>

        {/* Upper front glazing */}
        <GlazingBay
          width={7.2} height={1.56}
          panels={7}
          position={[-1.6, 3.02, 1.41]}
        />

        {/* Upper right side glazing (visible on camera swing) */}
        <GlazingBay
          width={3.0} height={1.56}
          panels={3}
          position={[2.42, 3.02, -0.55]}
          rotY={Math.PI / 2}
        />

        {/* Upper left side glazing */}
        <GlazingBay
          width={2.4} height={1.56}
          panels={2}
          position={[-5.42, 3.02, -0.55]}
          rotY={Math.PI / 2}
        />

        {/* Upper floor roof slab */}
        <mesh castShadow receiveShadow position={[-1.6, 3.9, -0.55]} material={matBlackMetal}>
          <boxGeometry args={[8.2, 0.2, 4.4]} />
        </mesh>

        {/* Gold fascia strip (upper level) */}
        <mesh position={[-1.6, 3.79, 1.66]} material={matGold}>
          <boxGeometry args={[8.2, 0.05, 0.05]} />
        </mesh>

        {/* ── CANTILEVERED OVERHANG (drama detail) ── */}
        {/* Thin soffit plate connecting right end of upper floor to right column below */}
        <mesh castShadow position={[4.02, 2.14, -0.55]} material={matBlackMetal}>
          <boxGeometry args={[3.0, 0.12, 3.9]} />
        </mesh>

        {/* Vertical support fin (ultra-thin, structural aesthetic) */}
        <mesh castShadow position={[3.8, 1.09, -0.4]} material={matBlackMetal}>
          <boxGeometry args={[0.07, 2.0, 4.2]} />
        </mesh>
        <mesh castShadow position={[-0.5, 1.09, -0.4]} material={matBlackMetal}>
          <boxGeometry args={[0.07, 2.0, 4.2]} />
        </mesh>

        {/* ── ENTRANCE STEPS ── */}
        {[0, 0.085, 0.17].map((yOff, i) => (
          <mesh key={i} receiveShadow position={[0, 0.085 + yOff, 2.05 + i * 0.3]} material={matBlackMetal}>
            <boxGeometry args={[11.0, 0.088, 0.32]} />
          </mesh>
        ))}

        {/* ── INFINITY POOL ── */}

        {/* Pool deck (extends to right of house) */}
        <mesh receiveShadow position={[7.6, 0.065, 0.2]} material={matPoolDeck}>
          <boxGeometry args={[6.2, 0.13, 8.5]} />
        </mesh>

        {/* Pool shell */}
        <mesh receiveShadow position={[7.6, -0.055, 0.2]} material={matPoolShell}>
          <boxGeometry args={[5.2, 0.28, 7.2]} />
        </mesh>

        {/* Pool coping — thin polished stone lip */}
        <mesh receiveShadow position={[7.6, 0.2, 0.2]}>
          <boxGeometry args={[5.4, 0.08, 7.4]} />
          <meshStandardMaterial color="#1e1c18" roughness={0.76} metalness={0.06} />
        </mesh>

        {/* Pool water surface */}
        <mesh receiveShadow position={[7.6, 0.18, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.0, 7.0, 32, 32]} />
          <MeshReflectorMaterial
            color="#020c18"
            blur={[140, 50]}
            resolution={512}
            mixBlur={0.4}
            mixStrength={6}
            roughness={0.05}
            metalness={0.35}
            mirror={0.94}
          />
        </mesh>

        {/* Pool underwater glow lights */}
        {[-2.4, 0, 2.4].map((z, i) => (
          <mesh key={i} position={[10.05, 0.14, 0.2 + z]}>
            <sphereGeometry args={[0.048, 8, 8]} />
            <meshStandardMaterial emissive="#005588" emissiveIntensity={7} color="#000000" />
          </mesh>
        ))}

        {/* Infinity edge (overflow trough) — far right end of pool */}
        <mesh position={[10.12, 0.13, 0.2]}>
          <boxGeometry args={[0.055, 0.1, 7.0]} />
          <meshStandardMaterial color="#020c18" roughness={0.08} metalness={0.2} transparent opacity={0.6} />
        </mesh>

        {/* ── DECORATIVE LIGHTING ── */}

        {/* Facade LED strips — ground level, running along front base */}
        <mesh position={[0, 0.2, 1.78]}>
          <boxGeometry args={[11.6, 0.028, 0.028]} />
          <meshStandardMaterial emissive="#ffe0a0" emissiveIntensity={2.2} color="#000000" />
        </mesh>

        {/* Under-roof LED — ground floor overhang soffit */}
        <mesh position={[0, 1.98, 1.42]}>
          <boxGeometry args={[11.6, 0.02, 0.02]} />
          <meshStandardMaterial emissive="#fffae0" emissiveIntensity={1.5} color="#000000" />
        </mesh>

        {/* Under-roof LED — upper floor overhang soffit */}
        <mesh position={[-1.6, 3.77, 1.62]}>
          <boxGeometry args={[8.0, 0.02, 0.02]} />
          <meshStandardMaterial emissive="#fffae0" emissiveIntensity={1.5} color="#000000" />
        </mesh>

        {/* Pool edge glow */}
        <mesh position={[10.1, 0.2, 0.2]}>
          <boxGeometry args={[0.02, 0.02, 7.0]} />
          <meshStandardMaterial emissive="#0077bb" emissiveIntensity={2.0} color="#000000" />
        </mesh>

        {/* ── SCENE LIGHTING ── */}
        {/* Warm interior spill through ground floor glazing */}
        <pointLight position={[0, 1.1, 1.0]} intensity={1.8} color="#ffd890" distance={5} decay={2} />
        {/* Warm interior spill through upper floor glazing */}
        <pointLight position={[-1.6, 3.0, 1.0]} intensity={1.4} color="#ffd890" distance={5} decay={2} />
        {/* Pool underwater blue */}
        <pointLight position={[7.6, 0.6, 0.2]} intensity={1.0} color="#005588" distance={7} decay={2} />
        {/* Cool ambient fill from above */}
        <pointLight position={[0, 6, 0]} intensity={0.3} color="#c8d8f0" distance={14} decay={2} />

      </group>
    </Float>
  );
}
