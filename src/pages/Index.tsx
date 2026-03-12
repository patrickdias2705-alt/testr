import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import BenefitsSection from "@/components/BenefitsSection";
import FleetSection from "@/components/FleetSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import InvestorsSection from "@/components/InvestorsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterContact from "@/components/FooterContact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header />
      <HeroSection />
      <AboutSection />
      <BenefitsSection />
      <FleetSection />
      <HowItWorksSection />
      <InvestorsSection />
      <TestimonialsSection />
      <FooterContact />
    </div>
  );
};

export default Index;
