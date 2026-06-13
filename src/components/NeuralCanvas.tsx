import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const NeuralCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    const connectionDistance = 120;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient color configuration based on theme
      const isDark = document.documentElement.classList.contains("dark");
      const nodeColor = isDark ? "rgba(6, 182, 212, 0.4)" : "rgba(59, 130, 246, 0.3)";
      const lineColor = isDark ? "rgba(139, 92, 246, " : "rgba(99, 102, 241, ";

      // Draw and update particles
      particles.forEach((p, idx) => {
        // Apply scroll delta shifting to make particles float relative to scroll
        const currentY = (p.y - scrollRef.current * 0.15) % canvas.height;
        const adjustedY = currentY < 0 ? currentY + canvas.height : currentY;

        // Mouse attraction
        const dx = p.x - mouseRef.current.x;
        const dy = adjustedY - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouseRef.current.active && dist < 180) {
          const force = (180 - dist) / 180;
          p.vx -= (dx / dist) * force * 0.02;
          p.vy -= (dy / dist) * force * 0.02;
        }

        // Limit speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 1.0;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, adjustedY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Draw connections
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const p2Y = (p2.y - scrollRef.current * 0.15) % canvas.height;
          const adjustedY2 = p2Y < 0 ? p2Y + canvas.height : p2Y;

          const dx2 = p.x - p2.x;
          const dy2 = adjustedY - adjustedY2;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < connectionDistance) {
            const alpha = (1 - dist2 / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, adjustedY);
            ctx.lineTo(p2.x, adjustedY2);
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouseRef.current.active) {
          const mdx = p.x - mouseRef.current.x;
          const mdy = adjustedY - mouseRef.current.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < 150) {
            const alpha = (1 - mdist / 150) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, adjustedY);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] opacity-70"
    />
  );
};

export default NeuralCanvas;
