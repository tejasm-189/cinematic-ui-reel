import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Grid, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LiquidGlass } from '@liquidglass/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/', name: 'Home', icon: Home },
  { path: '/about', name: 'About', icon: User },
  { path: '/projects', name: 'Projects', icon: Grid },
  { path: '/blog', name: 'Blog', icon: BookOpen },
];

export function Navbar() {
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [dispMap, setDispMap] = useState("");

  // Clear hovered path on any navigation to ensure active state is correct
  useEffect(() => {
    setHoveredPath(null);
  }, [location.pathname]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imgData = ctx.createImageData(1024, 256);
      const radius = 128;
      for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 1024; x++) {
          const dx = Math.max(radius - x, 0, x - (1024 - radius));
          const dy = y - 128;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let r = 127, g = 127;
          if (dist < radius) {
            const amount = Math.sin((dist / radius) * Math.PI * 0.5);
            r = 127 + (dx / (dist || 1)) * amount * 127;
            g = 127 + (dy / (dist || 1)) * amount * 127;
          }
          const idx = (y * 1024 + x) * 4;
          imgData.data[idx] = r; imgData.data[idx+1] = g; imgData.data[idx+2] = 0; imgData.data[idx+3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setDispMap(canvas.toDataURL());
    }
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <svg className="absolute w-0 h-0 opacity-0 pointer-events-none">
        <filter id="nav-chromatic-filter" colorInterpolationFilters="sRGB">
          <feImage href={dispMap} x="0" y="0" width="100%" height="100%" result="map" />
          {/* Simple magnification without spectrum splitting */}
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="map" 
            xChannelSelector="R" 
            yChannelSelector="G" 
            scale="40" 
          />
          {/* Blur removed for crystal clarity */}
        </filter>
      </svg>

      <div 
        onMouseLeave={() => setHoveredPath(null)}
        className="relative rounded-full border border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.05)] px-2 py-2 flex items-center gap-2 overflow-hidden bg-transparent"
        style={{ 
          backdropFilter: 'url(#nav-chromatic-filter) brightness(1.1) saturate(1.2)',
          WebkitBackdropFilter: 'url(#nav-chromatic-filter) brightness(1.1) saturate(1.2)',
        }}
      >
        {/* Actual Nav Items (On top of liquid background) */}
        <div className="relative flex items-center gap-1 z-10">
          {navItems.map((item, i) => {
            const active = isActive(item.path);
            const isHovered = hoveredPath === item.path;
            const isCurrent = hoveredPath ? isHovered : active;

            return (
              <div key={item.path} className="flex items-center">
                <Link
                  to={item.path}
                  data-interactive
                  onMouseEnter={() => setHoveredPath(item.path)}
                  className="relative group flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 z-10"
                >
                  {/* Active/Hover Bubble - The "Liquid" Magnifying Drop */}
                  {isCurrent && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 overflow-hidden"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 150, 
                        damping: 12, 
                        mass: 0.8,
                        bounce: 0.4
                      }}
                    >
                      <LiquidGlass
                        className="w-full h-full border-[0.5px] border-white/10 bg-black/40"
                        borderRadius={9999}
                        blur={1}
                        displacementScale={80}
                        elasticity={0.9}
                        shadowIntensity={0}
                        saturation={1.2}
                        brightness={0.3} // Extreme dark liquid inside a clear bar
                        contrast={1.5}
                      />
                    </motion.div>
                  )}

                  <item.icon className={cn(
                    "w-4 h-4 transition-all duration-500 ease-out origin-center",
                    isCurrent ? "text-white scale-110" : "text-white/60 group-hover:text-white"
                  )} />
                  <span className={cn(
                    "hidden md:inline text-xs font-bold tracking-widest uppercase transition-all duration-500 ease-out origin-left",
                    isCurrent ? "text-white scale-105" : "text-white/60 group-hover:text-white"
                  )}>
                    {item.name}
                  </span>
                </Link>

                {i < navItems.length - 1 && (
                  <div className="w-px h-4 bg-white/10 mx-1 z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
