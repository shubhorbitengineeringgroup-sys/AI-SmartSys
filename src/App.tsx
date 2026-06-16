import { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext";
import Preloader from "./components/Preloader";
import { AnimatePresence, motion } from "framer-motion";

const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Admin = lazy(() => import("./pages/Admin"));
const Capabilities = lazy(() => import("./pages/Capabilities"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Spinner shown while a lazy-loaded page chunk is downloading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

// Smooth fade+slide animation applied to every page on mount/unmount
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.25, ease: [0.55, 0, 1, 0.45] as const } },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ willChange: "opacity, transform" }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            {/* Dedicated standalone pages */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/capabilities" element={<Capabilities />} />

            {/*
              Section routes — renders the homepage Index and auto-scrolls
              to the target section. Enables clean SEO-friendly URLs like:
              aismartsys.in/faq, aismartsys.in/services, etc.
              GitHub Pages 404.html redirect trick makes these work on direct access.
            */}
            <Route path="/services"  element={<Index scrollTo="services" />} />
            <Route path="/products"  element={<Index scrollTo="products" />} />
            <Route path="/process"   element={<Index scrollTo="process" />} />
            <Route path="/portfolio" element={<Index scrollTo="portfolio" />} />
            <Route path="/faq"       element={<Index scrollTo="faq" />} />
            <Route path="/contact"   element={<Index scrollTo="contact" />} />

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Sonner />

            {/* Startup Preloader Animation */}
            <AnimatePresence mode="wait">
              {showLoader && (
                <Preloader onComplete={() => setShowLoader(false)} />
              )}
            </AnimatePresence>

            <BrowserRouter basename={import.meta.env.BASE_URL}>
              {/* Scroll to top on every hard navigate */}
              <ScrollToTop />
              <AnimatedRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
