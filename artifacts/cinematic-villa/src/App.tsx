import { Suspense, lazy } from "react";
import { Route, Router, Switch } from "wouter";
import { CinematicExperience } from "@/components/CinematicExperience";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";
import { PropertyDetail } from "@/components/PropertyDetail";

const Scene = lazy(() => import("@/components/three/Scene"));

function HomePage() {
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
