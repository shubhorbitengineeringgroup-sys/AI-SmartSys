
import aiLogo from "@/assets/ai-smartsys-logo.png";
import aiLogoDark from "@/assets/ai-smartsys-logo-dark.png";
import { useTheme } from "@/context/ThemeContext";

const quickLinks = [
  { name: "Home",         href: "/" },
  { name: "About",        href: "/about" },
  { name: "Capabilities", href: "/capabilities" },
  { name: "Products",     href: "/products" },
  { name: "Process",      href: "/process" },
  { name: "Portfolio",    href: "/portfolio" },
  { name: "FAQ",          href: "/faq" },
  { name: "Contact",      href: "/contact" },
];
const serviceLinks = [
  { name: "AI Development", path: "/capabilities#ai-development" },
  { name: "Web Development", path: "/capabilities#web-development" },
  { name: "Automation", path: "/capabilities#automation" },
  { name: "Chatbot Development", path: "/capabilities#chatbot-development" },
  { name: "Data Analytics", path: "/capabilities#data-analytics" },
  { name: "Mobile Apps", path: "/capabilities#mobile-apps" }
];

const Footer = () => {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? aiLogoDark : aiLogo;

  return (
    <footer className="relative border-t border-border pt-20 pb-8 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5" />

      {/* Decorative blur orb */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex flex-col items-start gap-4 mb-8">
              <img 
                src={logoSrc} 
                alt="AI SmartSyS" 
                className="h-20 sm:h-24 object-contain transition-transform duration-700 hover:scale-105" 
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Empowering businesses with intelligent AI solutions for a smarter, more connected future. We bridge the gap between human intelligence and machine efficiency.
            </p>

        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading font-semibold mb-6 text-sm uppercase tracking-widest text-foreground">Explore</h4>
          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="text-muted-foreground hover:text-accent text-sm transition-all duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-px bg-accent mr-0 group-hover:mr-2 transition-all duration-300" />
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-heading font-semibold mb-6 text-sm uppercase tracking-widest text-foreground">Capabilities</h4>
          <ul className="space-y-4">
            {serviceLinks.map((link) => (
              <li key={link.path}>
                <a href={link.path} className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-heading font-semibold mb-6 text-sm uppercase tracking-widest text-foreground">Contact</h4>
          <div className="space-y-4">
            <a href="tel:+917024128029" className="flex items-center gap-3 text-muted-foreground hover:text-accent text-sm transition-colors">
              <span className="text-accent">+91</span> 70241 28029
            </a>
            <a href="mailto:vijaytiwari@orbitengineerings.com" className="text-muted-foreground hover:text-accent text-sm break-all transition-colors block">
              vijaytiwari@orbitengineerings.com
            </a>
            <div className="pt-4">
              <div className="p-4 rounded-xl glass border border-border">
                <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs text-foreground font-medium">Global Operations Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} AI SmartSyS. Engineered for Excellence.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-muted-foreground hover:text-foreground text-[10px] uppercase tracking-widest">Privacy Policy</a>
          <a href="#" className="text-muted-foreground hover:text-foreground text-[10px] uppercase tracking-widest">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
