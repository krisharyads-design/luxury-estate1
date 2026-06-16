

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function Words() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".kinetic-word").forEach((word, index) => {
        gsap.fromTo(
          word,
          { scaleX: 0.42, scaleY: 1.8, opacity: 0.12, filter: "blur(18px)" },
          {
            scaleX: 1.08,
            scaleY: 1,
            opacity: 1,
            filter: "blur(0px)",
            xPercent: index % 2 ? -12 : 12,
            scrollTrigger: {
              trigger: section.current,
              start: `${index * 18}% center`,
              end: `${index * 18 + 54}% center`,
              scrub: true
            }
          }
        );
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={section} className="relative flex min-h-[170vh] flex-col justify-center overflow-hidden px-5 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(214,170,79,0.18),transparent_34%)]" />
      {["BUY", "SELL", "RENT"].map((word) => (
        <div
          key={word}
          className="kinetic-word will-change-transform text-center text-[clamp(5rem,23vw,24rem)] font-black uppercase leading-[0.82] tracking-normal text-white"
        >
          {word}
        </div>
      ))}
    </section>
  );
}
