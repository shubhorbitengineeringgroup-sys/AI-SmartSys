import { useEffect, lazy, Suspense } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import NeuralCanvas from "@/components/NeuralCanvas";
import { AIChatbot } from "@/components/AIChatbot";
import SEO from "@/components/SEO";

const AboutSection = lazy(() => import("@/components/AboutSection"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const ProductsSection = lazy(() => import("@/components/ProductsSection"));
const WhyChooseUs = lazy(() => import("@/components/WhyChooseUs"));
const OurProcess = lazy(() => import("@/components/OurProcess"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

// Per-section SEO data for clean URL routes (e.g., /faq, /services)
const SECTION_SEO: Record<string, { title: string; description: string; keywords: string }> = {
  about: {
    title: "About AI SmartSyS",
    description: "Learn about AI SmartSyS — a technology-driven company building AI-powered solutions, automation systems, and smart digital platforms.",
    keywords: "about AI SmartSys, AI engineering team, automation company India, smart technology, machine learning solutions",
  },
  services: {
    title: "AI Development Services",
    description: "Explore AI SmartSyS services: AI development, chatbot building, web development, SCADA automation, and enterprise cloud solutions.",
    keywords: "AI development services, chatbot development, web development, SCADA automation, machine learning, enterprise AI",
  },
  products: {
    title: "Our AI Products",
    description: "Discover AI SmartSyS products — intelligent software solutions for business automation, smart dashboards, and AI-powered tools.",
    keywords: "AI products, smart software, business automation tools, AI-powered dashboard, intelligent solutions India",
  },
  process: {
    title: "Our Process — How We Work",
    description: "Learn how AI SmartSyS delivers projects — from discovery and planning to AI development, testing, and full deployment.",
    keywords: "AI development process, project workflow, software delivery, development lifecycle, AI project management",
  },
  portfolio: {
    title: "Portfolio — Our Work",
    description: "View AI SmartSyS portfolio of completed AI systems, automation tools, web applications, and SCADA deployments.",
    keywords: "AI portfolio, completed projects, case studies, automation examples, web development portfolio India",
  },
  faq: {
    title: "Frequently Asked Questions",
    description: "Get answers to common questions about AI SmartSyS services, pricing, project timelines, and technology stack.",
    keywords: "AI SmartSyS FAQ, questions, AI pricing, project timeline, services information, chatbot development FAQ",
  },
  contact: {
    title: "Contact Us",
    description: "Get in touch with AI SmartSyS to discuss your AI, automation, or web development project. Reach us via form, phone, or email.",
    keywords: "contact AI SmartSyS, project inquiry, AI consultation, business contact India, automation project quote",
  },
};

interface IndexProps {
  scrollTo?: string;
}

const Index = ({ scrollTo }: IndexProps) => {
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scroll-reveal animation observer
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

    observeElements();
    const timeout1 = setTimeout(observeElements, 1500);
    const timeout2 = setTimeout(observeElements, 4000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  // Scroll to a specific section when navigated via a clean URL (e.g., /faq, /services)
  useEffect(() => {
    if (!scrollTo) return;

    let attempts = 0;
    const maxAttempts = 80; // 8 seconds max (lazy-loaded sections take time)

    const intervalId = setInterval(() => {
      const element = document.getElementById(scrollTo);
      if (element) {
        clearInterval(intervalId);
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const offsetPosition = Math.max(0, (elementRect - bodyRect) - offset);

        // Small delay to let the page fully paint before scrolling
        setTimeout(() => {
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }, 250);
      } else {
        attempts++;
        if (attempts >= maxAttempts) clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [scrollTo]);

  const sectionSeo = scrollTo ? SECTION_SEO[scrollTo] : null;

  // Simple placeholder for lazy-loaded sections
  const Fallback = () => <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">Loading section...</div>;

  return (
    <div className="min-h-screen relative bg-background text-foreground overflow-x-hidden">
      <SEO
        title={sectionSeo?.title || "Smart AI Solutions for a Smarter Future"}
        description={sectionSeo?.description || "Empower your business with AI-SmartSys. Specialized in customized AI software development, enterprise automation, smart SCADA systems, chatbots, and advanced web technologies."}
        keywords={sectionSeo?.keywords || "AI development, smart automation, SCADA systems, chatbot development, web development company, machine learning software, India AI solutions"}
        ogUrl={scrollTo ? `https://aismartsys.in/${scrollTo}` : "https://aismartsys.in"}
      />
      {/* Scroll Progress Indicator */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      {/* Interactive Neural background */}
      <NeuralCanvas />

      <Navbar />
      <div id="home"><HeroSection /></div>

      <Suspense fallback={<Fallback />}>
        <div id="about" className="reveal-on-scroll"><AboutSection /></div>
        <div id="services" className="reveal-on-scroll"><ServicesSection /></div>
        <div id="products" className="reveal-on-scroll"><ProductsSection /></div>
        <div className="reveal-on-scroll"><WhyChooseUs /></div>
        <div id="process" className="reveal-on-scroll"><OurProcess /></div>
        <div id="portfolio" className="reveal-on-scroll"><PortfolioSection /></div>
        <div className="reveal-on-scroll"><TestimonialsSection /></div>
        <div id="faq" className="reveal-on-scroll"><FAQSection /></div>
        <div id="contact" className="reveal-on-scroll"><ContactSection /></div>
      </Suspense>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
