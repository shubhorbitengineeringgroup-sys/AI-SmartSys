import { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext";
import Preloader from "./components/Preloader";
import { AnimatePresence } from "framer-motion";

const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Initial loading spinner for the app routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

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
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            <ScrollToTop />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
