"use client";

import dynamic from "next/dynamic";
import { CinematicExperience } from "@/components/CinematicExperience";

const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />
});

export default function Home() {
  return (
    <>
      <Scene />
      <CinematicExperience />
    </>
  );
}
