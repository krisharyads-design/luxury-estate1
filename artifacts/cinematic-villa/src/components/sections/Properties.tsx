

import { CalendarDays, MapPin, Phone, ShieldCheck } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const properties = [
  {
    name: "Aravalli Crest Villa",
    location: "Gurugram, Haryana",
    price: "₹12.8 Cr",
    agent: "Aarav Mehta",
    tag: "Private pool villa",
    imagePosition: "bg-left-top"
  },
  {
    name: "Juhu Sea Pearl",
    location: "Mumbai, Maharashtra",
    price: "₹22.4 Cr",
    agent: "Priya Nair",
    tag: "Sea-facing duplex",
    imagePosition: "bg-right-top"
  },
  {
    name: "Indiranagar Sky House",
    location: "Bengaluru, Karnataka",
    price: "₹8.6 Cr",
    agent: "Rohan Iyer",
    tag: "Penthouse residence",
    imagePosition: "bg-left-bottom"
  },
  {
    name: "Alipore Garden Estate",
    location: "Kolkata, West Bengal",
    price: "₹10.9 Cr",
    agent: "Ananya Sen",
    tag: "Heritage garden home",
    imagePosition: "bg-right-bottom"
  },
  {
    name: "ECR Azure Retreat",
    location: "Chennai, Tamil Nadu",
    price: "₹7.9 Cr",
    agent: "Vikram Rao",
    tag: "Coastal weekend estate",
    imagePosition: "bg-center"
  },
  {
    name: "Lutyens Court Residence",
    location: "New Delhi",
    price: "₹31 Cr",
    agent: "Kavya Malhotra",
    tag: "Ultra-prime apartment",
    imagePosition: "bg-right"
  }
];

type PropertiesProps = {
  onBookConsultation: () => void;
};

export function Properties({ onBookConsultation }: PropertiesProps) {
  return (
    <section className="relative px-5 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-7 md:grid-cols-[1fr_0.72fr] md:items-end">
          <div>
            <p data-reveal className="mb-5 text-xs uppercase tracking-[0.5em] text-gold-300">
              Indian luxury portfolio
            </p>
            <h2 data-reveal className="max-w-5xl text-[clamp(3rem,8vw,8rem)] font-semibold uppercase leading-[0.88]">
              Signature homes, ready to view.
            </h2>
          </div>
          <div data-reveal className="space-y-5 border-l border-white/10 pl-6 text-white/66">
            <p className="text-lg leading-8">
              A sharper shortlist of premium Indian properties with verified agents, transparent pricing, and private viewing support.
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs uppercase tracking-[0.22em] text-white/48">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold-300" /> Verified</span>
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gold-300" /> Tours</span>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-300" /> Agents</span>
            </div>
          </div>
        </div>

        <div id="properties" className="grid scroll-mt-8 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <article
              data-fade-panel
              key={property.name}
              className="property-card group overflow-hidden border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/35 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-gold-300/40"
            >
              <div className="relative aspect-[1.35] overflow-hidden">
                <div
                  className={`absolute inset-0 bg-[url('/images/luxury-gallery-sprite.png')] bg-[length:210%_210%] ${property.imagePosition} opacity-90 transition duration-700 group-hover:scale-110`}
                  aria-label={`${property.name} property image`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/74 backdrop-blur-md">
                  {property.tag}
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-sm text-gold-300">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </p>
                    <h3 className="text-2xl font-semibold uppercase leading-tight md:text-3xl">{property.name}</h3>
                  </div>
                  <p className="shrink-0 text-2xl font-semibold text-white">{property.price}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-white/42">Agent</p>
                  <p className="mt-1 text-lg font-medium text-white/88">{property.agent}</p>
                </div>
                <MagneticButton onClick={onBookConsultation} variant="ghost" className="h-11 min-w-36 px-4 text-xs">
                  Consult
                </MagneticButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
