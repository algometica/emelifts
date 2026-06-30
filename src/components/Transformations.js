export default function Transformations() {
  return (
    <section
      id="transformations"
      className="border-t border-black/[0.06] bg-white py-[4.5rem] md:py-28"
      aria-labelledby="transformations-heading"
    >
      <div className="container mx-auto max-w-[980px]">
        <div className="mb-12 text-center md:mb-14">
          <h2
            id="transformations-heading"
            className="text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]"
          >
            Real results.
          </h2>
          <p className="mt-3 text-[17px] text-[#6e6e73]">Women on the program.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-[18px] shadow-[0_8px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 [@media(hover:hover)]:hover:scale-[1.02]">
            <img
              src="/transformation-1.jpg"
              alt="Before and after transformation"
              className="w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-[18px] shadow-[0_8px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 [@media(hover:hover)]:hover:scale-[1.02]">
            <img
              src="/transformation-2.jpg"
              alt="Before and after transformation"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
