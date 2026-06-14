import { useState, useEffect } from "react";
import { Menu, X, Layout, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import aiLogo from "@/assets/ai-smartsys-logo.png";
import aiLogoDark from "@/assets/ai-smartsys-logo-dark.png";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Products", href: "/#products" },
  { label: "Process", href: "/#process" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const logoSrc = theme === "dark" ? aiLogoDark : aiLogo;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);

        const sections = navLinks
          .map((l) => l.href.includes("#") ? l.href.split("#")[1] : null)
          .filter(Boolean);

        let current = "home";
        for (const id of sections) {
          if (!id) continue;
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 140) {
            current = id;
          }
        }
        setActiveSection(`#${current}`);
        ticking = false;
      });
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect to handle scrolling to hash targets when pathname/hash changes
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.substring(1);
      let attempts = 0;
      const maxAttempts = 60; // 60 * 100ms = 6 seconds max polling

      const intervalId = setInterval(() => {
        const element = document.getElementById(targetId);
        if (element) {
          clearInterval(intervalId);
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
          setActiveSection(location.hash);
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(intervalId);
          }
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [location.pathname, location.hash]);

  const handleNavClick = (href: string) => {
    const hashIndex = href.indexOf("#");
    const isHash = hashIndex !== -1;
    if (isHash) {
      const targetId = href.substring(hashIndex + 1);
      const isHomepage = location.pathname === "/" || location.pathname === "/index.html" || document.getElementById("home") !== null;

      // Close menu immediately on tap
      setIsOpen(false);

      if (isHomepage) {
        const element = document.getElementById(targetId);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = Math.max(0, elementPosition - offset);

          // Defer scroll to let touch event end and menu collapse begin
          // This prevents mobile browsers from aborting the smooth scroll
          setTimeout(() => {
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }, 150);
          
          window.history.pushState(null, "", href);
          setActiveSection("#" + targetId);
        }
      } else {
        if (location.pathname === "/about" && targetId === "about") {
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }, 150);
        } else {
          navigate(href);
        }
      }
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const checkActive = (href: string) => {
    const hash = href.includes("#") ? "#" + href.split("#")[1] : href;
    if (location.pathname === "/about" && hash === "#about") return true;
    if (location.pathname === "/" || location.pathname === "/index.html") {
      if (activeSection === hash) return true;
    }
    return false;
  };

  return (
    <div 
      className={`fixed left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ${
        scrolled ? "top-3 sm:top-5" : "top-0 sm:top-2"
      }`}
    >
      <motion.div
        layout
        className={`w-full flex flex-col justify-center transition-all duration-500 border bg-card/65 backdrop-blur-2xl ${
          scrolled 
            ? "max-w-6xl rounded-2xl sm:rounded-full px-5 py-2.5 border-primary/30 shadow-[0_12px_40px_-12px_rgba(6,182,212,0.25)]" 
            : "max-w-7xl rounded-3xl sm:rounded-[2.5rem] px-6 py-4 border-border/50 shadow-2xl"
        }`}
      >
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between w-full">
          
          {/* Brand Logo Only */}
          <Link to="/" className="flex items-center group shrink-0">
            <img 
              src={logoSrc} 
              alt="AI SmartSyS Logo" 
              className={`transition-all duration-500 ease-in-out object-contain group-hover:scale-105 shrink-0 ${
                scrolled ? "h-10 sm:h-12" : "h-14 sm:h-16"
              }`}
            />
          </Link>

          {/* Desktop Navigation links - Shared Layout Transition */}
          <div 
            className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-muted/40 backdrop-blur-sm border border-border/50 relative"
            onMouseLeave={() => setHoveredHref(null)}
          >
            {navLinks.map((link) => {
              const isActive = checkActive(link.href);
              const isHovered = hoveredHref === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  className={`relative px-2.5 xl:px-4 py-2 text-xs xl:text-sm font-bold uppercase tracking-wider transition-colors duration-300 select-none z-10 ${
                    isActive 
                      ? "text-primary-foreground font-black" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Active Indicator: Slides from tab to tab */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-gradient-nav-pill rounded-full shadow-lg shadow-primary/20 z-[-2]"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}

                  {/* Hover Indicator: Tactical magnetic background capsule */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="navbar-hover-pill"
                      className="absolute inset-0 bg-muted/65 rounded-full z-[-1] border border-border/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="rounded-full hover:bg-muted/50 text-foreground transition-all duration-300"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            {isAuthenticated ? (
              <>
                <Button 
                  size="sm" 
                  onClick={() => navigate("/dashboard")} 
                  className="rounded-full px-4 xl:px-6 bg-muted/50 text-foreground hover:bg-muted border border-border/40 transition-all duration-300"
                >
                  <Layout size={16} className="mr-2" /> Dashboard
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={logout} 
                  className="rounded-full hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut size={18} />
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                onClick={handleAuthAction} 
                className="rounded-full px-4 xl:px-6 bg-gradient-nav-pill text-secondary-foreground shadow-md shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex justify-end items-center gap-2 lg:hidden">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="rounded-full hover:bg-muted/50 text-foreground transition-all duration-300"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <button 
              className="text-foreground p-2 rounded-lg hover:bg-muted/50 transition-colors" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu - Expands inside the dynamic island */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="w-full overflow-hidden"
            >
              <motion.div 
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } }
                }}
                className="pt-6 pb-2 flex flex-col gap-2 w-full border-t border-border/40 mt-4"
              >
                {navLinks.map((link) => {
                  const isActive = checkActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      variants={{
                        open: { y: 0, opacity: 1, scale: 1 },
                        closed: { y: -10, opacity: 0, scale: 0.95 }
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                      onClick={() => handleNavClick(link.href)}
                      role="button"
                      tabIndex={0}
                      className={`relative px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                        isActive
                          ? "bg-gradient-nav-pill text-primary-foreground border-transparent shadow-md shadow-primary/10"
                          : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="w-1 h-1 rounded-full bg-primary-foreground animate-ping" />}
                    </motion.div>
                  );
                })}
                
                <motion.div 
                  variants={{
                    open: { y: 0, opacity: 1 },
                    closed: { y: -10, opacity: 0 }
                  }}
                  className="pt-4 border-t border-border/30 mt-3 flex flex-col gap-2 w-full"
                >
                  {isAuthenticated ? (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => { setIsOpen(false); navigate("/dashboard"); }} 
                        className="w-full rounded-xl bg-muted/50 py-4 text-xs font-bold uppercase tracking-widest border border-border/40 hover:bg-muted"
                      >
                        Dashboard
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => { setIsOpen(false); logout(); }} 
                        variant="ghost" 
                        className="w-full rounded-xl text-red-400 py-4 text-xs font-bold uppercase tracking-widest hover:bg-red-500/5"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => { setIsOpen(false); handleAuthAction(); }} 
                      className="w-full rounded-xl bg-gradient-nav-pill text-secondary-foreground py-4 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/10"
                    >
                      Get Started
                    </Button>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => navigate("/dashboard")}
      />
    </div>
  );
};

export default Navbar;
