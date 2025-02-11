import Hero from '../components/Hero';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import Logo from '../components/Logo';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <header className="py-4">
        <Logo />
      </header>
      <Hero />
      <main className="my-8">
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}