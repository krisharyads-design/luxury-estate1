"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, BakeShadows, Environment, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense, useState } from "react";
import { CameraRig } from "./CameraRig";
import { Lighting } from "./Lighting";
import { Particles } from "./Particles";
import { ScrollController } from "./ScrollController";
import { Villa } from "./Villa";

export default function Scene() {
  const [dpr, setDpr] = useState(1.9);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-black">
      <Canvas
        shadows
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        camera={{ position: [0, 2.2, 8.5], fov: 38, near: 0.1, far: 80 }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#020202", 7, 28]} />
        <Suspense fallback={null}>
          <Environment preset="city" background={false} blur={0.45} />
          <Lighting />
          <CameraRig />
          <ScrollController />
          <Villa />
          <Particles count={850} />
          <BakeShadows />
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.46} luminanceThreshold={0.34} luminanceSmoothing={0.62} mipmapBlur />
            <Vignette darkness={0.38} eskil={false} offset={0.24} />
          </EffectComposer>
          <PerformanceMonitor
            onDecline={() => setDpr(1)}
            onIncline={() => setDpr(Math.min(2.25, window.devicePixelRatio || 2))}
          />
          <AdaptiveDpr pixelated={false} />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0,rgba(0,0,0,0.2)_36%,rgba(0,0,0,0.82)_100%)]" />
    </div>
  );
}
