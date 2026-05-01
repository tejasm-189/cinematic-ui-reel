import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/Observer';
import { MoveVertical, Navigation, Sun, Search, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

gsap.registerPlugin(useGSAP, Observer);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const slides = [
  {
    id: 1,
    title: "THE LONG QUIET",
    director: "AMARA OKAFOR",
    category: "OBSERVATIONAL",
    year: "2024",
    festival: "TIFF DOCS · PLATFORM 2024",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "ECHOES OF SAND",
    director: "JULIAN DORN",
    category: "EXPERIMENTAL",
    year: "2023",
    festival: "SUNDANCE · FRONTIERS",
    image: "https://images.unsplash.com/photo-1440407876336-62333a6f010f?q=80&w=2074&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "NIGHT VISIONS",
    director: "ELARA VANCE",
    category: "CINEMA VERITE",
    year: "2024",
    festival: "CANNES · UN CERTAIN REGARD",
    image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "VELVET SKY",
    director: "MARCO SILVA",
    category: "NARRATIVE",
    year: "2025",
    festival: "VENICE · COMPETITION",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "STEEL & GLASS",
    director: "CHEN WEI",
    category: "DOCUMENTARY",
    year: "2023",
    festival: "BERLINALE · PANORAMA",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "THE DRIFTER",
    director: "SARAH LUND",
    category: "ROAD MOVIE",
    year: "2024",
    festival: "TRIBECA · SPOTLIGHT",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "NEON WHISPERS",
    director: "DAVID KENT",
    category: "SCI-FI SHORT",
    year: "2025",
    festival: "SXSW · MIDNIGHTERS",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "WILD HEARTS",
    director: "ANNA ROSSI",
    category: "COMING OF AGE",
    year: "2024",
    festival: "LOCARNO · PIAZZA GRANDE",
    image: "https://images.unsplash.com/photo-1511108690759-009324a5033e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 9,
    title: "SHADOW PLAY",
    director: "KENJI SATO",
    category: "THRILLER",
    year: "2023",
    festival: "BFI LONDON · GALA",
    image: "https://images.unsplash.com/photo-1620580975618-80971b3e8e1a?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 10,
    title: "LAST TRAIN",
    director: "MIA ANDERSEN",
    category: "DRAMA",
    year: "2025",
    festival: "ROTTERDAM · TIGER",
    image: "https://images.unsplash.com/photo-1495344517868-8ebaf0a20445?q=80&w=1906&auto=format&fit=crop",
  }
];

function CustomCursor({ isHovered }: { isHovered: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
    let xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3" });
    let yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3" });

    const moveMouse = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const downMouse = () => gsap.to(cursorRef.current, { scale: 0.9, duration: 0.15 });
    const upMouse = () => gsap.to(cursorRef.current, { scale: 1, duration: 0.15 });

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mousedown", downMouse);
    window.addEventListener("mouseup", upMouse);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mousedown", downMouse);
      window.removeEventListener("mouseup", upMouse);
    };
  }, { scope: cursorRef, dependencies: [] });

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] flex items-center justify-center top-0 left-0"
    >
      <div
        className={cn(
          "rounded-full glass-cursor relative transition-all duration-300 ease-out flex items-center justify-center",
          isHovered ? "w-24 h-24" : "w-12 h-12"
        )}
      >
        {/* Subtle inner reflection */}
        <div className="absolute top-[15%] left-[20%] w-[30%] h-[30%] bg-white/20 rounded-full blur-[2px]" />
      </div>
    </div>
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelSnapTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalSlides = slides.length;
  
  // Track GSAP progress globally. 0 = slide 0, 1 = slide 1, etc.
  const progressObj = useRef({ value: 0 }); 
  const targetProgressRef = useRef(0); // For smooth scroll accumulation
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [data-interactive]')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };
    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  // We map over slides to create their DOM refs
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textOverlayRefs = useRef<(HTMLDivElement | null)[]>([]);

  const normalizeIndex = (value: number) => ((value % totalSlides) + totalSlides) % totalSlides;

  const getCircularDelta = (progress: number, slideIndex: number) => {
    let delta = progress - slideIndex;

    if (delta > totalSlides / 2) delta -= totalSlides;
    if (delta < -totalSlides / 2) delta += totalSlides;

    return delta;
  };

  const resolveTargetProgress = (targetIndex: number) => {
    const normalizedTarget = normalizeIndex(targetIndex);
    const currentProgress = progressObj.current!.value;
    let targetProgress = Math.round(currentProgress / totalSlides) * totalSlides + normalizedTarget;

    if (targetProgress - currentProgress > totalSlides / 2) targetProgress -= totalSlides;
    if (targetProgress - currentProgress < -totalSlides / 2) targetProgress += totalSlides;

    return targetProgress;
  };

  // Update layout based on progress
  const renderProgress = (p: number) => {
    setIndex(normalizeIndex(Math.round(p)));

    slideRefs.current!.forEach((slide: HTMLDivElement | null, i: number) => {
      if (!slide) return;
      const rel = getCircularDelta(p, i);
      
      // Use yPercent for responsive vertical positioning. 
      // -50 centers it vertically (because it aligns with top: 50%).
      // -rel * 105 creates a 5% gap between slides. 
      const yPercent = -rel * 105 - 50;
      
      // Calculate blur based on distance from center. Max blur at rel = 0.5 or -0.5
      // 0 when rel = 0, 0 when rel = 1, peak at 0.5.
      let blurMatch = 0;
      if (Math.abs(rel) < 1) {
         blurMatch = Math.sin(Math.abs(rel) * Math.PI) * 8; // up to 8px blur at half point
      }
      
      // Scale and opacity
      let scale = 1;
      let opacity = 1;
      if (Math.abs(rel) > 1) {
         opacity = 0; // hide far away
      }

      gsap.set(slide, { 
        yPercent,
        clearProps: 'top', // clear earlier experimental top value
        zIndex: totalSlides - i,
        autoAlpha: opacity > 0 ? 1 : 0
      });

      const img = imgRefs.current![i];
      if (img) {
         // Subtle parallax drift: image counters most (but not all) of the card's movement
         // Countering by +85% against the card's -105% gives it a gentle, slow float.
         // We also slightly scale the image so the translation doesn't expose the card's edges.
         gsap.set(img, { yPercent: rel * 85, scale: 1.2 });
      }

      const textOverlay = textOverlayRefs.current![i];
      if (textOverlay) {
         // Apply blur only to text overlay
         gsap.set(textOverlay, { filter: `blur(${blurMatch}px)` });
      }
    });
  };

  const gotoSlide = (targetIndex: number, duration = 0.8) => {
    if (animationRef.current) animationRef.current.kill();
    
    const safeTarget = resolveTargetProgress(targetIndex);
    setIndex(normalizeIndex(targetIndex));
    targetProgressRef.current = safeTarget; // Sync smooth scroll target
    
    animationRef.current = gsap.to(progressObj.current, {
      value: safeTarget,
      duration,
      ease: "power3.inOut",
      onUpdate: () => renderProgress(progressObj.current!.value)
    });
  };

  useGSAP(() => {
    // Initial render
    renderProgress(0);

    let startProgress = 0;

    const observer = Observer.create({
      target: containerRef.current,
      type: "wheel,touch,pointer",
      wheelSpeed: 1,
      dragMinimum: 3,
      onPress: () => {
        if (animationRef.current) animationRef.current.kill();
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        startProgress = progressObj.current!.value;
        targetProgressRef.current = progressObj.current!.value; // Sync target on interaction start
      },
      onRelease: (self) => {
        // Snap to nearest integer with velocity
        let v = self.velocityY * 0.003;
        let p = progressObj.current!.value;
        let target = Math.round(p + v); // Velocity added in same direction as delta
        
        // Acceleration logic: if we crossed 0.15 threshold in drag, push to next
        const diff = p - startProgress;
        if (Math.abs(diff) > 0.15 || Math.abs(v) > 0.2) {
           target = startProgress + Math.sign(diff || v);
        } else {
           target = Math.round(startProgress);
        }
        
        gotoSlide(target, 0.6);
      },
      onChange: (self) => {
        if (self.isDragging) {
           // Smooth drag accumulation
           targetProgressRef.current += (self.deltaY * 0.0015);

           gsap.to(progressObj.current, {
             value: targetProgressRef.current,
             duration: 0.4,
             ease: "power2.out",
             overwrite: "auto",
             onUpdate: () => renderProgress(progressObj.current!.value)
           });
        }
      },
      onWheel: (self) => {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        
        // Smooth wheel accumulation
        targetProgressRef.current += (self.deltaY * 0.0012);

        gsap.to(progressObj.current, {
           value: targetProgressRef.current,
           duration: 0.6, // This creates the buttery smooth inertia scroll
           ease: "power2.out",
           overwrite: "auto",
           onUpdate: () => renderProgress(progressObj.current!.value)
        });

        if (wheelSnapTimeout.current) clearTimeout(wheelSnapTimeout.current);
        wheelSnapTimeout.current = setTimeout(() => {
           let target = Math.round(targetProgressRef.current);
           gotoSlide(target, 0.5);
        }, 150);
      }
    });

    return () => {
      observer.kill();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (animationRef.current) animationRef.current.kill();
    };
  }, { scope: containerRef, dependencies: [] });

  return (
    <>
      <CustomCursor isHovered={isHovered} />

      <main 
        ref={containerRef}
        className="w-full h-[100dvh] relative bg-[#0d0d0d] touch-none overflow-hidden"
      >
        {/* Top Navbar */}
        <header className="absolute top-6 left-1/2 -translate-x-1/2 w-[85%] md:w-[65%] lg:w-[50%] max-w-2xl z-50 py-2.5 px-4 md:px-6 flex justify-between items-center glass-panel rounded-full text-white pointer-events-none transition-all duration-500">
           <div className="flex items-center gap-6 md:gap-8 pointer-events-auto">
             <div className="font-sans font-bold tracking-normal text-lg md:text-xl flex items-center gap-2">
                Motion
             </div>
             <nav className="hidden md:flex gap-6 font-sans font-medium text-xs md:text-sm text-white/80">
               <a className="hover:text-white cursor-pointer transition-colors" data-interactive>Gallery</a>
               <a className="hover:text-white cursor-pointer transition-colors" data-interactive>Pricing</a>
             </nav>
           </div>
           
           <div className="flex items-center gap-3 md:gap-4 pointer-events-auto">
             <button data-interactive className="hidden md:flex items-center justify-center px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-sans font-medium text-xs rounded-full transition-colors">
               Sign in
             </button>
             <button data-interactive className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
               <Sun className="w-3 h-3 md:w-4 md:h-4 text-white" />
             </button>
           </div>
        </header>

        {/* Slides */}
        {slides.map((slide, i) => (
          <div 
            key={slide.id} 
              ref={(el: HTMLDivElement | null) => (slideRefs.current![i] = el)}
            className="absolute left-3 right-3 md:left-8 md:right-8 lg:left-16 lg:right-16 top-[50dvh] h-[70vh] md:h-[75vh] lg:h-[78vh] rounded-[32px] md:rounded-[40px] overflow-hidden pointer-events-none z-10 will-change-transform border border-white/10 bg-[#111] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            <img 
              ref={(el: HTMLImageElement | null) => (imgRefs.current![i] = el)}
              src={slide.image} 
              alt={slide.title} 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

            {/* Content Overlay inside the card */}
            <div 
              ref={(el: HTMLDivElement | null) => (textOverlayRefs.current![i] = el)}
              className="absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-between"
            >
              {/* Top Section */}
              <div className="flex justify-between items-start pt-8">
                 <div className="flex flex-col gap-1 text-white/80 font-sans tracking-widest text-[10px] md:text-xs">
                   <span>{slide.year}</span>
                   <span>{slide.festival.split('·')[0]}<br/>· {slide.festival.split('·')[1]?.trim()}</span>
                   <div className="mt-4 flex items-center gap-1 opacity-70">
                      {/* Laurel Wreath Mock */}
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/></svg>
                      <span className="uppercase text-[9px]">Award-Winning Reel</span>
                   </div>
                 </div>

                 {/* Giant Circle "SCROLL" Button (visual only) */}
                 <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center hidden md:flex shrink-0">
                    <span className="font-sans text-[10px] tracking-[0.2em] text-white dropshadow-md">SCROLL</span>
                 </div>
              </div>

              {/* Bottom Section */}
              <div className="flex justify-between items-end pb-8">
                 <div className="flex flex-col max-w-2xl">
                   <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 text-white/70 font-medium">
                     {slide.category}
                   </p>
                   <h1 className="font-display uppercase text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight m-0 text-white mb-6 md:mb-8 font-medium">
                     {slide.title}
                   </h1>
                   <div className="flex flex-col gap-1 font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60">
                      <span>DIRECTOR <span className="text-white ml-2 font-medium">{slide.director}</span></span>
                      <span>CATEGORY <span className="text-white ml-2 font-medium">{slide.category}</span></span>
                   </div>
                 </div>

                 {/* Right Side Review Quotes */}
                 <div className="hidden lg:flex flex-col gap-8 items-end text-right">
                    <div className="flex flex-col items-end gap-2">
                       <div className="flex text-white gap-1 text-xs mb-1">★★★★★</div>
                       <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/50">PLATFORM PRIZE</span>
                       <span className="font-display italic text-lg text-white">"DEEPLY MOVING"</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="flex text-white gap-1 text-xs mb-1">★★★★★</div>
                       <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/50">BEST DIRECTOR</span>
                       <span className="font-display italic text-lg text-white">"QUIETLY DEVASTATING"</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="flex text-white/60 gap-1 text-xs mb-1">★★★★<span className="text-white/20">★</span></div>
                       <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/50">AUDIENCE AWARD</span>
                       <span className="font-display italic text-lg text-white">"A PORTRAIT OF SILENCE"</span>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        ))}
        
        {/* Pagination Right Edge */}
        <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-40 pointer-events-none rounded-full p-2 py-6 md:p-3 md:py-8 text-white/70 font-sans text-xs">
           <span className="opacity-70">
             {String(normalizeIndex(index) + 1).padStart(2, '0')}
           </span>
           <div className="flex flex-col gap-2 my-2">
              {slides.map((_, i) => (
                 <div 
                    key={i} 
                    className={cn(
                       "w-1 h-1 rounded-full bg-white transition-all duration-300",
                       index === i ? "opacity-100 scale-150" : "opacity-30"
                    )}
                 />
              ))}
           </div>
           <span className="opacity-70">
             {String(slides.length).padStart(2, '0')}
           </span>
        </div>
      </main>
    </>
  );
}

