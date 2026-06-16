

import { RefObject, useEffect, useState } from "react";

export function useCounter(ref: RefObject<HTMLElement | null>, end: number, suffix = "") {
  const [value, setValue] = useState(`0${suffix}`);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 1600;

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          setValue(`${Math.round(end * eased).toLocaleString()}${suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, ref, suffix]);

  return value;
}
