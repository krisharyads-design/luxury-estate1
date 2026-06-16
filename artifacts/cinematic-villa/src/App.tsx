import { Suspense, lazy } from "react";
import { CinematicExperience } from "@/components/CinematicExperience";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";

const Scene = lazy(() => import("@/components/three/Scene"));

function App() {
  return (
    <>
      <SceneErrorBoundary>
        <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
          <Scene />
        </Suspense>
      </SceneErrorBoundary>
      <CinematicExperience />
    </>
  );
}

export default App;
