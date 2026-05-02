import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

gsap.registerPlugin(useGSAP);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPrecisePointer, setIsPrecisePointer] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [dispMap, setDispMap] = useState("");

  useEffect(() => {
    const checkPointer = () => setIsPrecisePointer(window.matchMedia('(pointer: fine)').matches);
    checkPointer();
    window.addEventListener('resize', checkPointer);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imgData = ctx.createImageData(512, 512);
      for (let y = 0; y < 512; y++) {
        for (let x = 0; x < 512; x++) {
          const dx = (x - 256) / 256;
          const dy = (y - 256) / 256;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let r = 127, g = 127;
          if (dist < 1) {
            const amount = Math.sin(dist * Math.PI * 0.5);
            r = 127 + (dx / (dist || 1)) * amount * 127;
            g = 127 + (dy / (dist || 1)) * amount * 127;
          }
          const idx = (y * 512 + x) * 4;
          imgData.data[idx] = r; imgData.data[idx+1] = g; imgData.data[idx+2] = 0; imgData.data[idx+3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setDispMap(canvas.toDataURL());
    }

    const handleMouseMove = (e: MouseEvent) => {
      const interactives = document.querySelectorAll('button, a, [data-interactive], input, textarea');
      let isNear = false;
      const radius = 60; // Detection radius

      for (const el of interactives) {
        const rect = el.getBoundingClientRect();
        const closestX = Math.max(rect.left, Math.min(e.clientX, rect.right));
        const closestY = Math.max(rect.top, Math.min(e.clientY, rect.bottom));
        const dx = e.clientX - closestX;
        const dy = e.clientY - closestY;
        if (Math.sqrt(dx * dx + dy * dy) < radius) {
          isNear = true;
          break;
        }
      }
      setIsHovered(isNear);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', checkPointer);
    };
  }, []);

  useGSAP(() => {
    if (!isPrecisePointer) return;

    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
    let xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.1, ease: "power3" });
    let yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.1, ease: "power3" });

    const moveMouse = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const downMouse = () => gsap.to(cursorRef.current, { scale: 0.8, duration: 0.15 });
    const upMouse = () => gsap.to(cursorRef.current, { scale: 1, duration: 0.15 });

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mousedown", downMouse);
    window.addEventListener("mouseup", upMouse);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mousedown", downMouse);
      window.removeEventListener("mouseup", upMouse);
    };
  }, { scope: cursorRef, dependencies: [isPrecisePointer] });

  if (!isPrecisePointer) return null;

  return (
    <>
      <svg className="fixed pointer-events-none opacity-0 w-0 h-0">
        <filter id="cursor-mag-filter" colorInterpolationFilters="sRGB">
          <feImage href={dispMap} x="0" y="0" width="100%" height="100%" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" scale="60" />
        </filter>
      </svg>

      <div
        ref={cursorRef}
        className={cn(
          "fixed pointer-events-none z-[9999] flex items-center justify-center top-0 left-0 transition-all duration-300 ease-out",
          isHovered ? "w-[60px] h-[60px]" : "w-[120px] h-[120px]"
        )}
      >
        <div 
          className="w-full h-full rounded-full border border-white/20 backdrop-blur-[4px] bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden"
          style={{ 
            backdropFilter: 'url(#cursor-mag-filter) brightness(1.1) saturate(1.1)',
            WebkitBackdropFilter: 'url(#cursor-mag-filter) brightness(1.1) saturate(1.1)',
          }}
        >
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]" />
        </div>
      </div>
    </>
  );
}
