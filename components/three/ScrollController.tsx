"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { experienceState } from "@/lib/animation-store";

gsap.registerPlugin(ScrollTrigger);

export function ScrollController() {
  useEffect(() => {
    let trigger: ScrollTrigger | undefined;
    let rafId = 0;
    const lenis = new Lenis({
      duration: 1.28,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.15,
      smoothWheel: true
    });

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    lenis.on("scroll", ({ velocity }: { velocity: number }) => {
      experienceState.velocity = Math.min(Math.abs(velocity) / 40, 1);
      ScrollTrigger.update();
    });

    const onPointer = (event: PointerEvent) => {
      experienceState.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      experienceState.targetY = -(event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer);

    const createTrigger = () => {
      const experience = document.querySelector("#experience");
      if (!experience) {
        window.requestAnimationFrame(createTrigger);
        return;
      }

      trigger = ScrollTrigger.create({
        trigger: experience,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          experienceState.progress = self.progress;
          experienceState.phase = Math.floor(self.progress * 7);
        }
      });
    };
    createTrigger();

    return () => {
      if (trigger) trigger.kill();
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointer);
      lenis.destroy();
    };
  }, []);

  return null;
}
