

import gsap from "gsap";
import { Building2, Crown, HandCoins, KeyRound, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";

const services = [
  ["Mortgage", HandCoins],
  ["Property Management", KeyRound],
  ["Commercial", Building2],
  ["Luxury Rentals", Crown],
  ["Investment", TrendingUp]
];

export function Services() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card) => {
        const move = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          gsap.to(card, {
            rotateX: y / -16,
            rotateY: x / 16,
            x: x * 0.04,
            y: y * 0.04,
            duration: 0.45,
            ease: "power3.out"
          });
        };
        const leave = () => gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, .45)" });
        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={section} className="relative px-5 py-32">
      <div className="mx-auto max-w-7xl">
        <h2 data-reveal className="mb-14 max-w-4xl text-[clamp(3rem,8vw,8rem)] font-semibold uppercase leading-[0.88]">
          Services with gravity.
        </h2>
        <div className="grid gap-4 md:grid-cols-5">
          {services.map(([label, Icon]) => (
            <article
              data-fade-panel
              key={label as string}
              className="service-card relative min-h-64 overflow-hidden border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl [transform-style:preserve-3d]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,213,141,.22),transparent_45%)] opacity-0 transition duration-500 hover:opacity-100" />
              <Icon className="relative mb-20 h-8 w-8 text-gold-300" />
              <h3 className="relative text-2xl font-semibold uppercase leading-tight">{label as string}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
