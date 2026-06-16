

import { useRef } from "react";
import { useCounter } from "@/hooks/useCounter";

function Counter({ end, suffix, label }: { end: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const value = useCounter(ref, end, suffix);

  return (
    <div ref={ref} data-fade-panel className="border-t border-white/14 py-8">
      <div className="text-[clamp(3rem,8vw,8rem)] font-semibold leading-none text-gold-300">{value}</div>
      <p className="mt-4 text-sm uppercase tracking-[0.35em] text-white/55">{label}</p>
    </div>
  );
}

export function Numbers() {
  return (
    <section className="relative px-5 py-32">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <Counter end={420} suffix="+" label="Indian luxury listings" />
        <Counter end={1200} suffix="+" label="Private viewings arranged" />
        <Counter end={18} suffix="Cr+" label="Average prime portfolio" />
      </div>
    </section>
  );
}
