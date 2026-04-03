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
    text: "5 a.m. is not my personality, but doing it before the kids wake up is the only window I get. I like that I'm not standing in the garage at 5:10 still picking what to do. My husband definitely thinks I'm crazy.",
    rating: 5,
  },
  {
    name: 'Jaspreet K.',
    text: "I'm not going to pretend I was going to drive to a gym four times a week. My mom helps with the kids and I didn't want workouts to turn into another thing I had to squeeze in. Spare room, headphones on, and I can message when something feels off. That's been the difference for me.",
    rating: 5,
  },
  {
    name: 'Nicole B.',
    text: 'I was weirdly scared of the barbell. The clips are short so I just replay the same squat setup until it feels boring, which I guess means I finally learned it. Still not perfect, but I add weight now instead of avoiding that corner of the room.',
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
