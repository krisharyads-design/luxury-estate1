import { Suspense, lazy, useEffect } from "react";
import { Route, Router, Switch } from "wouter";
import { CinematicExperience } from "@/components/CinematicExperience";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";
import { PropertyDetail } from "@/components/PropertyDetail";

const Scene = lazy(() => import("@/components/three/Scene"));

function HomePage() {
  useEffect(() => {
    const saved = sessionStorage.getItem("homeScrollY");
    if (saved) {
      const y = parseInt(saved, 10);
      sessionStorage.removeItem("homeScrollY");
      // Defer until layout is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, behavior: "instant" });
        });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

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

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/property/:id">
          {(params) => <PropertyDetail id={params.id} />}
        </Route>
        <Route>
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
