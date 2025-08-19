// page.tsx
import HeroSection from "./HeroSection";
import Features from "./Features";
import Pricing from "./Pricing";
import FreeTrial from "./FreeTrial";
import LandingNavbar from "./LandingNavbar";

export default function Home() {
  return (
    <div className='overflow-x-hidden w-full'>
      <LandingNavbar />
      <HeroSection />
      <Features />
      <Pricing />
      <FreeTrial />
    </div>
  );
}
