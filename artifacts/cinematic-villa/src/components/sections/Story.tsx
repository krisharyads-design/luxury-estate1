

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function Story() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        ".story-mask",
        { clipPath: "inset(18% 22% round 28px)", scale: 0.9 },
        {
          clipPath: "inset(0% 0% round 0px)",
          scale: 1,
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "+=180%",
            scrub: true,
            pin: true
          }
        }
      );

      gsap.to(".story-kicker", {
        xPercent: -28,
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true }
      });

      gsap.to(".story-copy", {
        yPercent: -42,
        opacity: 0.2,
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true }
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={section} className="relative min-h-screen px-5 py-24">
      <div className="mx-auto grid min-h-[86vh] max-w-7xl items-center gap-10 md:grid-cols-[1fr_0.78fr]">
        <div className="story-mask relative min-h-[58vh] overflow-hidden border border-white/10 bg-black/30 shadow-2xl backdrop-blur-md">
          <div className="absolute inset-0 bg-[url('/images/luxury-gallery-sprite.png')] bg-cover bg-left-top opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/35 to-transparent" />
          <div className="story-kicker absolute bottom-8 left-8 whitespace-nowrap text-[clamp(4rem,12vw,12rem)] font-semibold uppercase leading-none text-white/10">
            Crafted Around Desire
          </div>
        </div>
        <div className="story-copy max-w-xl">
          <p data-reveal className="mb-5 text-xs uppercase tracking-[0.5em] text-gold-300">
            Property storytelling
          </p>
          <h2 data-reveal className="text-balance text-[clamp(2.6rem,6vw,6.5rem)] font-semibold uppercase leading-[0.9]">
            Every angle has a pulse.
          </h2>
          <p data-reveal className="mt-8 text-lg leading-8 text-white/64">
            Scroll pulls the camera through glass, stone, water, and light. The estate is not presented as a listing. It is revealed as a moving object of desire.
          </p>
        </div>
      </div>
    </section>
  );
}
