interface AnimatedIconProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedIcon = ({ children, className = "" }: AnimatedIconProps) => (
  <div className={`w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-all duration-500 group-hover:bg-gradient-button group-hover:text-secondary-foreground group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-secondary/20 group-hover:rotate-3 ${className}`}>
    {children}
  </div>
);

export default AnimatedIcon;
