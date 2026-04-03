import { ENROLL_URL, INTAKE_FORM_URL } from '../lib/links';

const Hero = () => {
  return (
    <section
      className="relative flex min-h-[100dvh] min-h-screen flex-col items-center justify-center bg-[#f5f5f7] px-6 pb-20 pt-[calc(5rem+env(safe-area-inset-top))] sm:px-10 md:px-14"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto w-full max-w-[692px] text-center">
        <p className="mb-2 text-[17px] font-medium text-[#1d1d1f] md:text-[19px]">Lift with EME</p>

        <h1
          id="hero-heading"
          className="font-hero text-[clamp(3rem,11vw,5rem)] font-black leading-[1.02] tracking-[-0.04em] text-[#1d1d1f]"
        >
          <span className="block">Hello,</span>
          <span className="block">Stronger.</span>
        </h1>

        <a
          href={ENROLL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-10 px-10 text-[17px] md:mt-12"
        >
          Enroll
        </a>

        <p className="mt-5 max-w-[21rem] mx-auto text-[12px] leading-relaxed text-[#6e6e73] md:text-[13px]">
          Coach-written training at home. 800+ women coached.{' '}
          <a
            href={INTAKE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#0066cc] hover:underline"
          >
            Contact
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default Hero;
