

import { CalendarCheck, CheckCircle2, Mail, Phone, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

type ConsultationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setSent(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-5 py-8">
      <button aria-label="Close consultation form" className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-white/12 bg-[#080807] shadow-2xl shadow-black/70 md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative min-h-72 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/luxury-gallery-sprite.png')] bg-cover bg-right-top opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="mb-3 text-xs uppercase tracking-[0.45em] text-gold-300">Private advisory</p>
            <h2 className="text-4xl font-semibold uppercase leading-[0.92] md:text-5xl">
              Book a property consultant
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/62">
              Speak with an Indian luxury property specialist for pricing, tours, and shortlist planning.
            </p>
          </div>
        </div>

        <div className="relative p-6 md:p-8">
          <button
            aria-label="Close consultation form"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/70 transition hover:border-gold-300/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {sent ? (
            <div className="flex min-h-[420px] flex-col items-start justify-center">
              <CheckCircle2 className="mb-6 h-12 w-12 text-gold-300" />
              <h3 className="text-4xl font-semibold uppercase leading-none">Request received.</h3>
              <p className="mt-5 max-w-md text-lg leading-8 text-white/66">
                A senior consultant will call you with a curated property shortlist and viewing slots.
              </p>
              <div className="mt-8">
                <MagneticButton onClick={onClose}>Done</MagneticButton>
              </div>
            </div>
          ) : (
            <form
              className="space-y-5 pt-10 md:pt-6"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-white/48">Name</span>
                  <span className="flex items-center gap-3 border border-white/12 bg-white/[0.04] px-4 py-3">
                    <User className="h-4 w-4 text-gold-300" />
                    <input required className="w-full bg-transparent text-white outline-none placeholder:text-white/28" placeholder="Your name" />
                  </span>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-white/48">Phone</span>
                  <span className="flex items-center gap-3 border border-white/12 bg-white/[0.04] px-4 py-3">
                    <Phone className="h-4 w-4 text-gold-300" />
                    <input required className="w-full bg-transparent text-white outline-none placeholder:text-white/28" placeholder="+91 98765 43210" />
                  </span>
                </label>
              </div>
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.28em] text-white/48">Email</span>
                <span className="flex items-center gap-3 border border-white/12 bg-white/[0.04] px-4 py-3">
                  <Mail className="h-4 w-4 text-gold-300" />
                  <input type="email" className="w-full bg-transparent text-white outline-none placeholder:text-white/28" placeholder="you@example.com" />
                </span>
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-white/48">City</span>
                  <select className="w-full border border-white/12 bg-[#11100e] px-4 py-3 text-white outline-none">
                    <option>Mumbai</option>
                    <option>Delhi NCR</option>
                    <option>Bengaluru</option>
                    <option>Chennai</option>
                    <option>Kolkata</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-white/48">Budget</span>
                  <select className="w-full border border-white/12 bg-[#11100e] px-4 py-3 text-white outline-none">
                    <option>₹5 Cr - ₹10 Cr</option>
                    <option>₹10 Cr - ₹20 Cr</option>
                    <option>₹20 Cr - ₹50 Cr</option>
                    <option>₹50 Cr+</option>
                  </select>
                </label>
              </div>
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.28em] text-white/48">Preferred viewing</span>
                <span className="flex items-center gap-3 border border-white/12 bg-white/[0.04] px-4 py-3">
                  <CalendarCheck className="h-4 w-4 text-gold-300" />
                  <input type="date" className="w-full bg-transparent text-white outline-none" />
                </span>
              </label>
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.28em] text-white/48">What are you looking for?</span>
                <textarea className="min-h-28 w-full resize-none border border-white/12 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/28" placeholder="Sea-facing home, villa, penthouse, investment property..." />
              </label>
              <MagneticButton type="submit">Request Call</MagneticButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
