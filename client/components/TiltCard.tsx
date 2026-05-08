"use client";

import { useRef, useState, MouseEvent, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TiltCard({ children, className = "", onClick }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-5 to 5 degrees)
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    // Calculate glare effect
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
      transition: 'transform 0.1s ease-out, background 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      background: 'transparent',
      transition: 'transform 0.5s ease-out, background 0.5s ease-out'
    });
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        ...style
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: (style as any).background }} />
      <div className="relative z-10 w-full h-full" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </div>
  );
}
