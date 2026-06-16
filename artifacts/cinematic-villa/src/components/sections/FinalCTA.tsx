

import { MagneticButton } from "@/components/ui/MagneticButton";

type FinalCTAProps = {
  onBookConsultation: () => void;
};

export function FinalCTA({ onBookConsultation }: FinalCTAProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
      <div className="relative mx-auto max-w-6xl text-center">
        <p data-reveal className="mb-7 text-xs uppercase tracking-[0.55em] text-gold-300/90">
          Your shortlist is waiting
        </p>
        <h2 data-reveal className="text-balance text-[clamp(3rem,8.5vw,8.8rem)] font-semibold uppercase leading-[0.9]">
          Schedule Your Private Viewing
        </h2>
        <div data-reveal className="mt-10">
          <MagneticButton onClick={onBookConsultation}>Book Consultant</MagneticButton>
        </div>
      </div>
    </section>
  );
}
