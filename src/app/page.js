import Hero from '../components/Hero';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import ContactMe from '../components/ContactMe';
import AboutMe from '../components/AboutMe';
import MobileMenu from '../components/MobileMenu';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Logo />
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#pricing" className="text-gray-300 hover:text-pink-500 transition-colors font-medium">
                Programs
              </a>
              <a href="#about" className="text-gray-300 hover:text-pink-500 transition-colors font-medium">
                About
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-pink-500 transition-colors font-medium">
                Reviews
              </a>
              <a href="#contact" className="text-gray-300 hover:text-pink-500 transition-colors font-medium">
                Contact
              </a>
              <a 
                href="https://forms.gle/SFtKRzZcq1wu7v8K8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary text-sm px-6 py-2"
              >
                Get Started
              </a>
            </nav>
            
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <Hero />
        <Pricing />
        <AboutMe />
        <Testimonials />
        <CTA />
        <ContactMe />
      </main>
      
      <Footer />
    </div>
  );
}