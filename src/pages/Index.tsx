import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PriceTool from "@/components/PriceTool";
import HowItWorks from "@/components/HowItWorks";
import ForCompanies from "@/components/ForCompanies";
import SignupSection from "@/components/SignupSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <Navbar onScrollTo={scrollTo} />
      <Hero onScrollTo={scrollTo} />
      <PriceTool />
      <HowItWorks />
      <ForCompanies />
      <SignupSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
