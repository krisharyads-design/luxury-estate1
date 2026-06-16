"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const properties = [
  ["01", "Aravalli Crest", "Gurugram", "bg-left-top"],
  ["02", "Juhu Sea Pearl", "Mumbai", "bg-right-top"],
  ["03", "Skyline House", "Bengaluru", "bg-left-bottom"],
  ["04", "Lutyens Court", "New Delhi", "bg-right-bottom"]
];

export function Gallery() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".gallery-card");

      gsap.to(track.current, {
        x: () => `-${Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth)}px`,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${track.current?.scrollWidth ?? 1200}`,
          scrub: 0.85,
          pin: true,
          invalidateOnRefresh: true
        }
      });

      cards.forEach((card) => {
        const image = card.querySelector(".gallery-image");
        gsap.to(image, {
          scale: 1.18,
          xPercent: -6,
          scrollTrigger: {
            trigger: card,
            start: "left right",
            end: "right left",
            scrub: true,
            horizontal: true
          }
        });

        const move = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const rx = (event.clientY - rect.top - rect.height / 2) / -18;
          const ry = (event.clientX - rect.left - rect.width / 2) / 18;
          gsap.to(card, { rotateX: rx, rotateY: ry, z: 42, duration: 0.45, ease: "power3.out" });
        };
        const leave = () => gsap.to(card, { rotateX: 0, rotateY: 0, z: 0, duration: 0.65, ease: "power3.out" });
        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={section} className="relative min-h-screen overflow-hidden px-5 py-24">
      <div className="mb-12 flex min-h-[18vh] items-end justify-between gap-6 md:pl-6">
        <h2 data-reveal className="max-w-5xl text-[clamp(2.7rem,6.8vw,6.8rem)] font-semibold uppercase leading-[0.94]">
          Indian estates in motion.
        </h2>
        <p data-reveal className="hidden max-w-xs text-sm uppercase tracking-[0.32em] text-white/45 md:block">
          Scroll-driven previews
        </p>
      </div>
      <div ref={track} className="flex w-max gap-6 will-change-transform">
        {properties.map(([number, name, place, position]) => (
          <article
            key={name}
            className="gallery-card group relative h-[62vh] w-[78vw] max-w-[720px] shrink-0 overflow-hidden border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl [transform-style:preserve-3d] md:w-[54vw]"
          >
            <div
              className={`gallery-image absolute inset-0 bg-[url('/images/luxury-gallery-sprite.png')] bg-[length:200%_200%] ${position} opacity-85 transition duration-700 group-hover:scale-110`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-7">
              <div>
                <p className="mb-3 text-sm text-gold-300">{number}</p>
                <h3 className="text-3xl font-semibold uppercase md:text-5xl">{name}</h3>
              </div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/62">{place}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
