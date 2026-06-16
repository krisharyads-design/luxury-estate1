"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ConsultationModal } from "./ConsultationModal";
import { FinalCTA } from "./sections/FinalCTA";
import { Gallery } from "./sections/Gallery";
import { Hero } from "./sections/Hero";
import { Numbers } from "./sections/Numbers";
import { Properties } from "./sections/Properties";
import { Services } from "./sections/Services";
import { Story } from "./sections/Story";
import { Testimonials } from "./sections/Testimonials";
import { Words } from "./sections/Words";

gsap.registerPlugin(ScrollTrigger);

export function CinematicExperience() {
  const root = useRef<HTMLElement>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-reveal]",
        { y: 32, opacity: 0, filter: "blur(14px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.05,
          stagger: 0.09,
          ease: "power4.out",
          delay: 0.15
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 28, opacity: 0.88, filter: "blur(0px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power4.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-fade-panel]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 56, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      gsap.to(".atmosphere", {
        opacity: 0.72,
        backgroundPosition: "80% 55%",
        scrollTrigger: {
          trigger: "#experience",
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <main id="experience" ref={root} className="relative z-10 min-h-screen overflow-x-clip text-white">
      <CursorFollower />
      <div className="atmosphere pointer-events-none fixed inset-0 z-0 opacity-40" />
      <Hero onBookConsultation={() => setIsConsultationOpen(true)} />
      <Story />
      <Words />
      <Gallery />
      <Properties onBookConsultation={() => setIsConsultationOpen(true)} />
      <Services />
      <Numbers />
      <Testimonials />
      <FinalCTA onBookConsultation={() => setIsConsultationOpen(true)} />
      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
    </main>
  );
}

function CursorFollower() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const move = (event: MouseEvent) => {
      gsap.to(node, {
        x: event.clientX - 10,
        y: event.clientY - 10,
        duration: 0.5,
        ease: "power3.out"
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-50 hidden h-5 w-5 rounded-full border border-gold-300/70 mix-blend-difference md:block"
      animate={{ scale: [1, 1.18, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
