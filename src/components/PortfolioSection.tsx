import { useState, ComponentType, useRef } from "react";
import { ExternalLink, CheckCircle2, Layout, Server, Database, Code, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform } from "framer-motion";

import inventoryImg from "@/assets/images/inventory.jpeg";
import expenseImg from "@/assets/images/expense_flow.jpeg";
import scadaImg from "@/assets/images/burhar-scada.jpeg";
import orbitImg from "@/assets/images/orbit_water.jpeg";
import astrologyImg from "@/assets/images/astrology.jpeg";
import empMonitoringImg from "@/assets/images/emp-monitoring-system.jpeg";

interface Project {
  title: string;
  desc: string;
  image: string;
  tags: string[];
  gradient: string;
  overview: string;
  features: string[];
  technologies: { name: string; icon: ComponentType<{ size?: number; className?: string }> }[];
  containImage?: boolean;
}

const projects: Project[] = [
  {
    title: "Inventory Management System",
    desc: "A digital inventory and material management system designed to track stock levels, manage product records, and streamline warehouse operations.",
    image: inventoryImg,
    tags: ["Logistics", "Inventory", "Management"],
    gradient: "from-blue-500/50 to-indigo-500/50",
    overview: "This project provides a comprehensive solution for businesses to manage their stock levels across multiple warehouses. It focuses on accuracy, real-time updates, and ease of use for warehouse staff.",
    features: [
      "Real-time stock level monitoring",
      "Automated low-stock alerts",
      "Detailed material movement history",
      "Barcode scanning integration",
      "Comprehensive inventory reporting"
    ],
    technologies: [
      { name: "React", icon: Layout },
      { name: "Node.js", icon: Server },
      { name: "PostgreSQL", icon: Database },
      { name: "Tailwind CSS", icon: Code }
    ]
  },
  {
    title: "Expense Management App",
    desc: "A smart expense management platform that allows businesses to submit, approve and track expenses through a multi-level approval workflow.",
    image: expenseImg,
    tags: ["Fintech", "Workflow", "Automation"],
    gradient: "from-purple-500/50 to-pink-500/50",
    overview: "A streamlined application designed to handle corporate expenses. From initial submission by employees to final approval by accounting, every step is tracked and audited.",
    features: [
      "Multi-level approval workflows",
      "Digital receipt attachment and OCR",
      "Real-time budget tracking by department",
      "Exportable financial reports (PDF/Excel)",
      "Role-based access control"
    ],
    technologies: [
      { name: "TypeScript", icon: Code },
      { name: "Express", icon: Server },
      { name: "MongoDB", icon: Database },
      { name: "AWS S3", icon: Globe }
    ]
  },
  {
    title: "Burhar SCADA Monitoring System",
    desc: "Industrial SCADA monitoring system designed for managing multiple water treatment sites with real-time sensor monitoring and centralized control.",
    image: scadaImg,
    tags: ["Industrial", "IoT", "Real-time"],
    gradient: "from-cyan-500/50 to-emerald-500/50",
    overview: "This system monitors critical infrastructure across various geographical locations. It visualizes sensor data such as flow rates, pressure levels, and water quality in real-time.",
    features: [
      "Real-time sensor data visualization",
      "Remote site monitoring and control",
      "Historical data logging and analytics",
      "Instant alarm and notification system",
      "Geographical site mapping"
    ],
    technologies: [
      { name: "Python", icon: Code },
      { name: "MQTT", icon: Server },
      { name: "WebSocket", icon: Globe },
      { name: "D3.js", icon: Layout }
    ]
  },
  {
    title: "Orbit Engineering Solutions Website",
    desc: "A modern corporate website developed for Orbit Engineering Solutions to showcase services, solutions and water treatment technologies.",
    image: orbitImg,
    containImage: true,
    tags: ["Web Design", "Responsive", "Corporate"],
    gradient: "from-amber-400/50 to-orange-500/50",
    overview: "The digital front for Orbit Engineering Solutions, showcasing their expertise in water treatment and industrial engineering. Built with performance and SEO in mind.",
    features: [
      "Dynamic service showcase",
      "Interactive technology maps",
      "Responsive design for all devices",
      "Integrated contact and inquiry forms",
      "High-performance asset optimization"
    ],
    technologies: [
      { name: "Next.js", icon: Layout },
      { name: "Framer Motion", icon: Code },
      { name: "GSAP", icon: Code },
      { name: "Vercel", icon: Globe }
    ]
  },
  {
    title: "Employee Monitoring System",
    desc: "A tracking and productivity tool that helps organizations monitor employee activities, track time, and analyze performance.",
    image: empMonitoringImg,
    containImage: true,
    tags: ["HR", "Productivity", "Enterprise"],
    gradient: "from-blue-500/50 to-cyan-500/50",
    overview: "A robust enterprise solution designed to enhance productivity by monitoring work hours, application usage, and overall employee engagement.",
    features: [
      "Time tracking and attendance",
      "Real-time activity monitoring",
      "Detailed productivity analytics",
      "Screenshot capture capabilities",
      "Role-based access control and reporting"
    ],
    technologies: [
      { name: "React", icon: Layout },
      { name: "Node.js", icon: Server },
      { name: "PostgreSQL", icon: Database },
      { name: "Tailwind CSS", icon: Code }
    ]
  },
  {
    title: "Astrology App",
    desc: "A personalized astrology application providing daily horoscopes, natal charts, and deep astrological insights.",
    image: astrologyImg,
    containImage: true,
    tags: ["Mobile App", "Astrology", "Lifestyle"],
    gradient: "from-indigo-500/50 to-purple-500/50",
    overview: "An intuitive application designed to offer users detailed astrological profiles, daily predictions, and compatibility charts based on precise planetary alignments.",
    features: [
      "Personalized daily horoscopes",
      "Detailed birth chart calculations",
      "Zodiac compatibility matching",
      "Astrological transit updates",
      "Personalized readings and reports"
    ],
    technologies: [
      { name: "React Native", icon: Layout },
      { name: "Node.js", icon: Server },
      { name: "MongoDB", icon: Database }
    ]
  },
];

interface StackingCardProps {
  project: Project;
  index: number;
  total: number;
  onViewDetails: () => void;
}

const StackingProjectCard = ({ project, index, total, onViewDetails }: StackingCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, isLast ? 1 : 0.65]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, isLast ? 0 : 0.45]);

  // Dynamic sticky positioning offsets cards slightly to create stacked visual deck
  const stickyTop = 112 + index * 16; 

  return (
    <div
      ref={containerRef}
      className="relative w-full flex justify-center items-start mb-12 md:mb-0 md:h-[60vh] h-auto"
      style={{
        minHeight: "360px",
      }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          top: `${stickyTop}px`,
        }}
        className="md:sticky relative w-full rounded-[2.2rem] overflow-hidden border border-border/50 hover:border-primary/30 bg-card/25 backdrop-blur-xl transition-colors duration-500 shadow-2xl flex flex-col md:flex-row h-auto md:h-[420px]"
      >
        {/* Physical stacking shadow layer */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-background pointer-events-none z-20"
        />

        {/* Project Image Panel */}
        <div className="relative w-full md:w-1/2 h-64 md:h-full overflow-hidden bg-muted/20 shrink-0 flex items-center justify-center p-6">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className={`w-full h-full transition-transform duration-700 hover:scale-105 ${
              project.containImage ? "object-contain" : "object-cover object-top"
            }`}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-10`} />
          <div className="absolute inset-0 bg-background/10 mix-blend-overlay" />
        </div>

        {/* Project Description Panel */}
        <div className="p-8 md:p-10 flex flex-col justify-between flex-grow z-10">
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map((t) => (
                <Badge key={t} variant="outline" className="text-xs font-semibold border-primary/20 bg-primary/5 text-primary px-2.5 py-0.5">
                  {t}
                </Badge>
              ))}
            </div>
            <h3 className="font-heading font-extrabold text-foreground mb-4 text-2xl md:text-3xl leading-tight tracking-tight">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed line-clamp-3 md:line-clamp-4 font-medium">
              {project.desc}
            </p>
          </div>
          <div>
            <Button
              onClick={onViewDetails}
              variant="ghost"
              size="default"
              className="text-primary hover:text-accent p-0 h-auto group/btn flex items-center font-bold text-sm md:text-base"
            >
              View Project Details <ExternalLink size={18} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const PortfolioSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="portfolio" className="relative section-padding overflow-hidden bg-background">
      <div className="video-container opacity-5">
        <video autoPlay muted loop playsInline>
          <source src="https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-digital-tunnel-with-blue-neon-lights-23004-large.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container mx-auto relative z-10 px-4">
        <SectionHeader badge="Portfolio" title="Our Real Projects" description="Discover our successful implementations in industrial and enterprise domains." />
        
        {/* Stacking Deck container */}
        <div className="flex flex-col items-center max-w-5xl mx-auto mt-16 md:gap-0 gap-8">
          {projects.map((p, i) => (
            <StackingProjectCard
              key={p.title}
              project={p}
              index={i}
              total={projects.length}
              onViewDetails={() => setSelectedProject(p)}
            />
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none glass-card glow-blue">
          {selectedProject && (
            <div className="flex flex-col">
              {/* Modal Image Header */}
              <div className="relative h-64 md:h-[450px] w-full overflow-hidden bg-slate-900/40">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-contain p-4 md:p-8"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <DialogHeader className="p-0 text-left">
                    <div className="flex gap-2 mb-3">
                      {selectedProject.tags.map(tag => (
                        <Badge key={tag} className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <DialogTitle className="text-3xl md:text-4xl font-bold font-heading text-white drop-shadow-xl">
                      {selectedProject.title}
                    </DialogTitle>
                  </DialogHeader>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Overview & Features */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                      Project Overview
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      {selectedProject.overview}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                      Key Features
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProject.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column: Technologies */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-3">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, idx) => {
                        const Icon = tech.icon;
                        return (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card border-border/50 text-xs font-medium text-foreground">
                            <Icon size={14} className="text-accent" />
                            {tech.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full bg-gradient-button text-white hover:opacity-90 transition-opacity">
                      Contact for Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PortfolioSection;
