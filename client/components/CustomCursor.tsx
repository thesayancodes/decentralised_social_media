"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (hidden) setHidden(false);
      
      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable = 
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") || 
        target.closest("a");
        
      setIsHovering(!!isClickable);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const updateCursor = () => {
      // Smooth lerp
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      
      setPosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updateCursor);
    };
    
    updateCursor();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hidden]);

  if (typeof window === "undefined") return null;

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden transition-opacity duration-300"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      <div 
        className={`absolute rounded-full mix-blend-difference transition-transform duration-200 ease-out flex items-center justify-center ${
          isClicking ? "scale-75" : isHovering ? "scale-[2.5]" : "scale-100"
        }`}
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: "white",
          left: 0,
          top: 0,
          transform: `translate3d(calc(${position.x}px - 50%), calc(${position.y}px - 50%), 0) ${
            isClicking ? "scale(0.75)" : isHovering ? "scale(2.5)" : "scale(1)"
          }`,
        }}
      />
      {/* Dot */}
      <div 
        className={`absolute rounded-full bg-white transition-opacity duration-200 ${
          isHovering ? "opacity-0" : "opacity-100"
        }`}
        style={{
          width: "4px",
          height: "4px",
          left: 0,
          top: 0,
          transform: `translate3d(calc(${position.x}px - 50%), calc(${position.y}px - 50%), 0)`,
        }}
      />
    </div>
  );
}
