import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Bath, Bed, CalendarDays, ChevronRight, Home, MapPin, Phone, Ruler } from "lucide-react";
import { ConsultationModal } from "./ConsultationModal";
import { getPropertyById } from "@/data/properties";

type Props = {
  id: string;
};

const ROOM_LABELS = ["Living Room", "Master Suite", "Kitchen", "Garden", "Pool View", "Entrance"];

export function PropertyDetail({ id }: Props) {
  const [, navigate] = useLocation();
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const property = getPropertyById(id);

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="mb-4 text-xl text-white/60">Property not found</p>
          <button onClick={() => navigate("/")} className="text-gold-300 underline">
            Return home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Fixed top bar */}
        <header className="fixed left-0 right-0 top-0 z-50 flex items-center gap-4 px-6 py-5 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-white/70 transition hover:text-gold-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span className="ml-auto text-xs uppercase tracking-[0.4em] text-white/30">
            Estate Portfolio
          </span>
        </header>

        {/* HERO */}
        <div className="relative h-[80vh] min-h-[520px] overflow-hidden">
          <div
            className={`absolute inset-0 bg-[url('/images/luxury-gallery-sprite.png')] bg-[length:220%_220%] ${property.imagePosition} transition-all duration-700`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
            <div className="mx-auto max-w-6xl">
              <p className="mb-3 flex items-center gap-2 text-sm text-gold-300">
                <MapPin className="h-4 w-4" />
                {property.location}
              </p>
              <h1 className="mb-4 text-[clamp(2.4rem,6vw,5.5rem)] font-semibold uppercase leading-[0.88]">
                {property.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6">
                <span className="text-3xl font-semibold text-white">{property.price}</span>
                <span className="rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-white/70">
                  {property.tag}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">

          {/* Quick specs */}
          <div className="mb-14 grid grid-cols-2 gap-4 border-y border-white/8 py-8 md:grid-cols-4">
            {[
              { icon: Bed, label: "Bedrooms", value: `${property.bedrooms}` },
              { icon: Bath, label: "Bathrooms", value: `${property.bathrooms}` },
              { icon: Ruler, label: "Built-up area", value: property.area },
              { icon: CalendarDays, label: "Year built", value: property.yearBuilt },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/38">
                  <Icon className="h-3.5 w-3.5 text-gold-300" />
                  {label}
                </div>
                <p className="text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-14 lg:grid-cols-[1fr_380px]">
            <div>
              {/* Description */}
              <p className="mb-10 text-lg leading-8 text-white/72">{property.description}</p>

              {/* Gallery */}
              <div className="mb-10">
                <p className="mb-5 text-xs uppercase tracking-[0.42em] text-gold-300">Gallery</p>

                {/* Main image */}
                <div className="relative mb-3 aspect-[1.62] overflow-hidden border border-white/8">
                  <div
                    className={`absolute inset-0 bg-[url('/images/luxury-gallery-sprite.png')] bg-[length:220%_220%] ${property.galleryPositions[activeImage]} transition-all duration-500`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.26em] text-white/70">
                    {ROOM_LABELS[activeImage]}
                  </div>
                </div>

                {/* Thumbnail strip */}
                <div className="grid grid-cols-6 gap-2">
                  {property.galleryPositions.map((pos, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative aspect-square overflow-hidden border transition-all duration-200 ${
                        activeImage === i
                          ? "border-gold-300"
                          : "border-white/8 opacity-55 hover:opacity-100"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-[url('/images/luxury-gallery-sprite.png')] bg-[length:220%_220%] ${pos}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <p className="mb-5 text-xs uppercase tracking-[0.42em] text-gold-300">
                  Property Highlights
                </p>
                <ul className="grid gap-3 md:grid-cols-2">
                  {property.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-sm leading-6 text-white/72">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent card */}
              <div className="border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <p className="mb-4 text-xs uppercase tracking-[0.38em] text-white/38">
                  Your dedicated agent
                </p>
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-300/30 bg-gold-300/8 text-xl font-semibold text-gold-300">
                    {property.agent.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{property.agent}</p>
                    <p className="text-sm text-white/50">{property.location}</p>
                  </div>
                </div>
                <a
                  href={`tel:${property.agentPhone}`}
                  className="flex items-center gap-2 text-sm text-gold-300 transition hover:text-gold-400"
                >
                  <Phone className="h-4 w-4" />
                  {property.agentPhone}
                </a>
              </div>

              {/* Property info */}
              <div className="border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <p className="mb-4 text-xs uppercase tracking-[0.38em] text-white/38">Details</p>
                <dl className="space-y-3">
                  {[
                    { label: "Plot / Lot size", value: property.lotSize },
                    { label: "Bedrooms", value: property.bedrooms },
                    { label: "Bathrooms", value: property.bathrooms },
                    { label: "Built-up area", value: property.area },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-baseline justify-between gap-4 border-b border-white/6 pb-3 last:border-0 last:pb-0">
                      <dt className="text-xs text-white/42">{label}</dt>
                      <dd className="text-sm font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Home icon tag */}
              <div className="flex items-center gap-3 text-xs text-white/34">
                <Home className="h-4 w-4 text-gold-300/60" />
                <span className="uppercase tracking-[0.3em]">{property.tag}</span>
              </div>
            </div>
          </div>

          {/* CTA at bottom */}
          <div className="mt-20 border-t border-white/8 pt-14 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.48em] text-white/38">Ready to view?</p>
            <h2 className="mb-8 text-[clamp(2rem,5vw,4rem)] font-semibold uppercase leading-tight">
              Schedule a Private Viewing
            </h2>
            <button
              onClick={() => setIsConsultOpen(true)}
              className="inline-flex h-14 items-center gap-3 border border-gold-300/60 bg-gold-300/8 px-10 text-sm uppercase tracking-[0.38em] text-gold-300 transition duration-300 hover:bg-gold-300 hover:text-black"
            >
              Book Consultation
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>

      <ConsultationModal isOpen={isConsultOpen} onClose={() => setIsConsultOpen(false)} />
    </>
  );
}
