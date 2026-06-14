import { useEffect, lazy, Suspense } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import NeuralCanvas from "@/components/NeuralCanvas";
import { AIChatbot } from "@/components/AIChatbot";


const AboutSection = lazy(() => import("@/components/AboutSection"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const ProductsSection = lazy(() => import("@/components/ProductsSection"));
const WhyChooseUs = lazy(() => import("@/components/WhyChooseUs"));
const OurProcess = lazy(() => import("@/components/OurProcess"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const revealElements = document.querySelectorAll(".reveal-on-scroll:not(.active)");
      revealElements.forEach((el) => observer.observe(el));
    };

    // Observe initially
    observeElements();

    // Re-observe periodically or when elements might be added by Suspense
    const interval = setInterval(observeElements, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Simple placeholder for lazy-loaded sections
  const Fallback = () => <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">Loading section...</div>;

  return (
    <div className="min-h-screen relative bg-background text-foreground overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      {/* Interactive Neural background */}
      <NeuralCanvas />

      <Navbar />
      <div id="home"><HeroSection /></div>
      
      <Suspense fallback={<Fallback />}>
        <div id="about" className="reveal-on-scroll"><AboutSection /></div>
        <div className="reveal-on-scroll"><ServicesSection /></div>
        <div className="reveal-on-scroll"><ProductsSection /></div>
        <div className="reveal-on-scroll"><WhyChooseUs /></div>
        <div className="reveal-on-scroll"><OurProcess /></div>
        <div className="reveal-on-scroll"><PortfolioSection /></div>
        <div className="reveal-on-scroll"><TestimonialsSection /></div>
        <div className="reveal-on-scroll"><FAQSection /></div>
        <div className="reveal-on-scroll"><ContactSection /></div>
      </Suspense>
      
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;

