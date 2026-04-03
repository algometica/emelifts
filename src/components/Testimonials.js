function StarIcon() {
  return (
    <svg className="h-4 w-4 text-[#1d1d1f]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

const testimonials = [
  {
    name: 'Sarah M.',
    text: '5 AM workouts, zero guesswork, and check-ins that kept me honest.',
    rating: 5,
  },
  {
    name: 'Susie H.',
    text: 'Home training with guidance I could actually stick to.',
    rating: 5,
  },
  {
    name: 'Jennifer K.',
    text: 'Finally confident with the bar. Rewatched demos until it clicked.',
    rating: 5,
  },
];

const Testimonials = () => {
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
};

export default Testimonials;
