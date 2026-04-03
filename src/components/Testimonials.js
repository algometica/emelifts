function StarIcon() {
  return (
    <svg className="h-4 w-4 text-[#1d1d1f]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

const testimonials = [
  {
    name: 'Morgan T.',
    text: "I'm on 5 a.m. workouts before my kids get up. Having the week mapped out already means I'm not standing in my garage deciding what to do.",
    rating: 5,
  },
  {
    name: 'Jaspreet K.',
    text: 'Between work and family I was never going to live at the gym. Training at home with a real program (and someone who actually answers my messages) has been the first thing I have stuck with in years.',
    rating: 5,
  },
  {
    name: 'Nicole B.',
    text: 'I used to avoid anything heavier than dumbbells. The demo videos are short and I rewatched the same one probably twenty times until my setup felt right. That alone was worth it.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-t border-black/[0.06] bg-white py-[4.5rem] md:py-28"
      aria-labelledby="reviews-heading"
    >
      <div className="container mx-auto max-w-[980px]">
        <div className="mb-12 text-center md:mb-14">
          <h2
            id="reviews-heading"
            className="text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]"
          >
            Reviews
          </h2>
          <p className="mt-3 text-[17px] text-[#6e6e73]">Women on the monthly program.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-4">
          {testimonials.map((t, index) => (
            <figure
              key={index}
              className="rounded-[18px] border border-black/[0.08] bg-white p-6 text-center md:p-7"
            >
              <div className="mb-4 flex justify-center gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <blockquote className="mb-6 text-[15px] leading-relaxed text-[#6e6e73]">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="border-t border-black/[0.06] pt-4 text-[15px] font-medium text-[#1d1d1f]">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
