import Image from 'next/image';

export default function AboutMe() {
  return (
    <section
      id="about"
      className="border-t border-black/[0.06] bg-[#f5f5f7] py-[4.5rem] md:py-28"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto max-w-[980px]">
        <h2
          id="about-heading"
          className="mb-12 text-center text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:mb-14 md:text-[40px]"
        >
          Your coach
        </h2>

        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="shrink-0">
            <Image
              src="/emelifts.png"
              alt="Em, strength coach for women"
              width={224}
              height={224}
              className="h-44 w-44 rounded-full border border-black/[0.08] object-cover md:h-56 md:w-56"
              sizes="(max-width: 1024px) 176px, 224px"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="max-w-xl flex-1 text-center lg:mx-0 lg:text-left">
            <p className="text-[17px] leading-relaxed text-[#6e6e73] md:text-[19px]">
              I work with women who want strength they can feel: heavy lifting, clear nutrition, and
              programming that respects a real calendar.
            </p>
            <a
              href="#pricing"
              className="mt-8 inline-flex min-h-[44px] items-center text-[17px] text-[#0066cc] hover:underline"
            >
              See the program
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
