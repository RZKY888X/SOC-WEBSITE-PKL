import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FreeTrial from "./components/FreeTrial";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Features />
      <Pricing />
      <FreeTrial />
    </main>
  );
}
