import { ENROLL_URL, INTAKE_FORM_URL } from '../lib/links';

const ContactMe = () => {
  return (
    <section
      id="contact"
      className="border-t border-black/[0.06] bg-[#f5f5f7] py-[4.5rem] md:py-28"
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto max-w-[720px] px-4">
        <h2
          id="contact-heading"
          className="text-center text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]"
        >
          One last thing.
        </h2>
        <p className="mx-auto mt-4 max-w-[28rem] text-center text-[17px] leading-relaxed text-[#6e6e73] md:text-[19px]">
          If you&apos;re on the fence, that&apos;s normal. Send a note. I&apos;ll tell you straight if
          this is a fit, usually within a day.
        </p>
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <a
            href={INTAKE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-[17px]"
          >
            Message Em
          </a>
          <a
            href={ENROLL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-[17px]"
          >
            Enroll now
          </a>
        </div>
        <p className="mt-10 text-center text-[13px] leading-snug text-[#6e6e73]">
          Prefer scrolling?{' '}
          <a href="#pricing" className="text-[#0066cc] hover:underline">
            Back to program
          </a>
        </p>
      </div>
    </section>
  );
};

export default ContactMe;
