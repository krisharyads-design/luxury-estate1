

import { RefObject, useEffect } from "react";
import gsap from "gsap";

export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, strength = 0.28) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const move = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * strength;
      const y = (event.clientY - rect.top - rect.height / 2) * strength;
      gsap.to(element, { x, y, duration: 0.55, ease: "power3.out" });
    };

    const leave = () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
    };

    element.addEventListener("mousemove", move);
    element.addEventListener("mouseleave", leave);

    return () => {
      element.removeEventListener("mousemove", move);
      element.removeEventListener("mouseleave", leave);
    };
  }, [ref, strength]);
}
