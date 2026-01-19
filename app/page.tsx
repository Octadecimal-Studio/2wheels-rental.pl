import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import WhyUs from '@/components/sections/WhyUs';
import Fleet from '@/components/sections/Fleet';
import HowItWorks from '@/components/sections/HowItWorks';
import Pricing from '@/components/sections/Pricing';
import Terms from '@/components/sections/Terms';
import Gallery from '@/components/sections/Gallery';
import Testimonials from '@/components/sections/Testimonials';
import Location from '@/components/sections/Location';
import ContactForm from '@/components/sections/ContactForm';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <WhyUs />
      <Fleet />
      <HowItWorks />
      <Pricing />
      <Terms />
      <Gallery />
      <Testimonials />
      <Location />
      <ContactForm />
      <Footer />
    </main>
  );
}
