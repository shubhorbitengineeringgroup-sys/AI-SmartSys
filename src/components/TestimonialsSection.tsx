import { Star, Quote } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { GlowOrb } from "./TechPattern";
import { useStaggerReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  { name: "Priya Sharma", role: "CEO, TechVentures", text: "AI SmartSyS transformed our operations with their automation solutions. Highly recommended!", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
  { name: "Rajesh Kumar", role: "CTO, DataFlow Inc.", text: "The AI chatbot they built increased our customer satisfaction by 60%. Exceptional work.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
  { name: "Anita Desai", role: "Founder, GreenLeaf", text: "Professional, innovative, and always ahead of the curve. A truly reliable AI partner.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" },
];

const TestimonialsSection = () => {
  const { ref, isVisible, getDelay } = useStaggerReveal(testimonials.length, 120);

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background Video */}
      <div className="video-container opacity-10">
        <video autoPlay muted loop playsInline>
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-modern-network-loop-24708-large.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />

      <GlowOrb className="w-[400px] h-[400px] top-0 -right-40" color="accent" />

      <div className="container mx-auto relative z-10" ref={ref}>
        <SectionHeader badge="Testimonials" title="What Our Clients Say" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`relative p-8 premium-card transition-all duration-500 overflow-hidden ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={getDelay(i)}
            >
              <Quote size={40} className="text-accent/10 absolute -top-2 -left-2" />
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 italic relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-accent text-[10px] font-bold uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
