

const quotes = [
  "The tour felt like stepping into the future of private real estate.",
  "Every property was staged, lit, and revealed like a work of cinema.",
  "They understood desire before we had language for it.",
  "The buying process felt impossibly calm and sharply curated."
];

export function Testimonials() {
  const cards = [...quotes, ...quotes];

  return (
    <section className="relative overflow-hidden px-5 py-32">
      <h2 data-reveal className="mx-auto mb-14 max-w-7xl text-[clamp(3rem,8vw,8rem)] font-semibold uppercase leading-[0.88]">
        Spoken quietly. Remembered loudly.
      </h2>
      <div className="marquee flex w-max gap-5">
        {cards.map((quote, index) => (
          <article
            key={`${quote}-${index}`}
            className="w-[78vw] max-w-md shrink-0 border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:rotate-1 hover:border-gold-300/40 md:w-[30vw]"
          >
            <p className="text-xl leading-8 text-white/78">"{quote}"</p>
            <p className="mt-8 text-xs uppercase tracking-[0.35em] text-gold-300">Private client</p>
          </article>
        ))}
      </div>
    </section>
  );
}
