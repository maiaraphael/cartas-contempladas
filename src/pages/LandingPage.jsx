import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import Inventory from '../components/Inventory';
import HowItWorks from '../components/HowItWorks';
import TrustSection from '../components/TrustSection';
import Testimonials from '../components/Testimonials';
import CtaSection from '../components/CtaSection';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <Inventory />
      <HowItWorks />
      <TrustSection />
      <Testimonials />
      <CtaSection />
    </>
  );
}
