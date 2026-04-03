import Hero from '../components/Hero';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import ContactMe from '../components/ContactMe';
import AboutMe from '../components/AboutMe';
import MobileMenu from '../components/MobileMenu';
import Testimonials from '../components/Testimonials';
import { ENROLL_URL, INTAKE_FORM_URL } from '../lib/links';
import { NAV } from '../lib/nav';

export default function Home() {
  return (
    <div className="min-h-[100dvh] min-h-screen bg-white text-[#1d1d1f]">
      <a
        href="#main"
        className="pointer-events-none fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-[100] -translate-y-24 rounded-full bg-[#1d1d1f] px-4 py-3 text-[15px] text-white opacity-0 transition focus:pointer-events-auto focus:translate-y-0 focus:opacity-100"
      >
        Skip to content
      </a>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.08] bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto max-w-[1024px]">
          <div className="flex items-center justify-between py-3 md:py-3.5">
            <Logo />
            <nav
              className="hidden items-center gap-8 text-[12px] leading-none text-[#6e6e73] md:flex"
              aria-label="Primary"
            >
              {NAV.map(({ href, label, emphasize }) => (
                <a
                  key={href}
                  href={href}
                  className={`py-3 -my-1 hover:text-[#1d1d1f] ${emphasize ? 'font-semibold' : ''}`}
                >
                  {label}
                </a>
              ))}
              <a
                href={ENROLL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-[12px] px-5"
              >
                Enroll
              </a>
            </nav>
            <MobileMenu enrollUrl={ENROLL_URL} formUrl={INTAKE_FORM_URL} />
          </div>
        </div>
      </header>

      <main id="main">
        <Hero />
        <Pricing />
        <AboutMe />
        <Testimonials />
        <ContactMe />
      </main>

      <Footer />
    </div>
  );
}
