

import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { experienceState } from "@/lib/animation-store";

const lookAt = new Vector3(0, 0.6, 0);
const target = new Vector3();

const path = [
  new Vector3(0, 2.15, 8.4),
  new Vector3(5.2, 2.7, 6.1),
  new Vector3(-4.8, 3.2, 4.4),
  new Vector3(0, 1.45, 5.2),
  new Vector3(3.8, 2.1, 7),
  new Vector3(0, 1.72, 3.7)
];

function samplePath(progress: number) {
  const scaled = MathUtils.clamp(progress, 0, 1) * (path.length - 1);
  const index = Math.floor(scaled);
  const next = Math.min(index + 1, path.length - 1);
  const local = scaled - index;
  return target.copy(path[index]).lerp(path[next], MathUtils.smoothstep(local, 0, 1));
}

export function CameraRig() {
  const { camera } = useThree();
  const perspectiveCamera = camera as PerspectiveCamera;

  useFrame((_, delta) => {
    const p = experienceState.progress;
    const sampled = samplePath(p);
    const parallaxX = experienceState.targetX * 0.72;
    const parallaxY = experienceState.targetY * 0.34;
    const pulse = Math.sin(p * Math.PI * 8) * 0.05;

    perspectiveCamera.position.lerp(
      sampled.set(sampled.x + parallaxX, sampled.y + parallaxY + pulse, sampled.z),
      1 - Math.pow(0.0008, delta)
    );

    lookAt.set(
      Math.sin(p * Math.PI * 2.2) * 0.7,
      0.65 + p * 0.22 + experienceState.targetY * 0.08,
      Math.cos(p * Math.PI * 1.4) * 0.35
    );
    perspectiveCamera.lookAt(lookAt);
    perspectiveCamera.fov = MathUtils.lerp(perspectiveCamera.fov, 38 - p * 9 + experienceState.velocity * 2, 0.04);
    perspectiveCamera.updateProjectionMatrix();
  });

  return null;
}
