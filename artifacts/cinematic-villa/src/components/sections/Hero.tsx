

import { MagneticButton } from "@/components/ui/MagneticButton";

type HeroProps = {
  onBookConsultation: () => void;
};

export function Hero({ onBookConsultation }: HeroProps) {
  const title = "INDIA'S FINEST ADDRESSES";

  return (
    <section className="relative flex min-h-screen items-center justify-center px-5">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <p data-hero-reveal className="mb-6 text-xs uppercase tracking-[0.58em] text-gold-300/80">
          Private estates across India
        </p>
        <h1 className="hero-title max-w-6xl overflow-hidden text-balance text-[clamp(3rem,9vw,8rem)] font-semibold uppercase leading-[0.86]">
          {title.split(" ").map((word, index) => (
            <span key={word} data-hero-reveal className="inline-block px-2">
              {word}
              {index < title.split(" ").length - 1 ? " " : ""}
            </span>
          ))}
        </h1>
        <p data-hero-reveal className="mt-7 max-w-xl text-lg text-white/72 md:text-2xl">
          Cinematic property discovery for villas, penthouses, coastal retreats, and legacy homes.
        </p>
        <div data-hero-reveal className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <MagneticButton href="#properties">View Properties</MagneticButton>
          <MagneticButton onClick={onBookConsultation} variant="ghost">Book Consultant</MagneticButton>
        </div>
      </div>
      <div className="absolute bottom-7 left-1/2 h-20 w-px -translate-x-1/2 overflow-hidden bg-white/10">
        <span className="block h-10 w-px animate-scrollLine bg-gold-300" />
      </div>
    </section>
  );
}
