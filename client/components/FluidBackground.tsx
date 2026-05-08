"use client";

import { useEffect, useState } from "react";

export function FluidBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [blobPos, setBlobPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setMousePos({ x: targetX, y: targetY });
    };

    window.addEventListener("mousemove", onMouseMove);

    const updateBlob = () => {
      // Very slow lerp for the background blob so it floats lazily behind the cursor
      currentX += (targetX - currentX) * 0.02;
      currentY += (targetY - currentY) * 0.02;
      
      setBlobPos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updateBlob);
    };

    updateBlob();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Interactive morphing blob */}
      <div 
        className="absolute bg-gradient-to-r from-[#7c6cf0] via-[#4fc3f7] to-[#7c6cf0] opacity-20 blur-[100px] animate-morph transition-transform duration-1000"
        style={{
          width: "600px",
          height: "600px",
          left: 0,
          top: 0,
          transform: `translate3d(calc(${blobPos.x}px - 50%), calc(${blobPos.y}px - 50%), 0)`,
        }}
      />
      
      {/* Ambient static orbs for depth */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#7c6cf0]/10 blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-[#4fc3f7]/5 blur-[120px] animate-float-delayed" />
    </div>
  );
}
