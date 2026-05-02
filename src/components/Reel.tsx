import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/Observer';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

gsap.registerPlugin(useGSAP, Observer);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ReelSlide {
  id: string | number;
  title: string;
  subtitle: string;
  category: string;
  meta1: string;
  meta2: string;
  image: string;
  profileImage?: string; // New field for overlay photos
  description?: string;
}

interface ReelProps {
  slides: ReelSlide[];
  showIntro?: boolean;
}

export function Reel({ slides, showIntro = false }: ReelProps) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelSnapTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalSlides = slides.length;
  
  const progressObj = useRef({ value: 0 }); 
  const targetProgressRef = useRef(0);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startProgressRef = useRef(0);

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textOverlayRefs = useRef<(HTMLDivElement | null)[]>([]);

  const normalizeIndex = (value: number) => ((value % totalSlides) + totalSlides) % totalSlides;

  const getCircularDelta = (progress: number, slideIndex: number) => {
    let delta = (progress - slideIndex) % totalSlides;
    if (delta > totalSlides / 2) delta -= totalSlides;
    if (delta < -totalSlides / 2) delta += totalSlides;
    return delta;
  };

  const resolveTargetProgress = (targetIndex: number) => {
    const currentProgress = progressObj.current!.value;
    // For large jumps (like high-velocity flicks), we don't want the "shortest path" logic
    // to kick in and reverse our direction. We only use shortest-path for small snaps.
    if (Math.abs(targetIndex - currentProgress) > 2) {
      return targetIndex;
    }
    
    const normalizedTarget = normalizeIndex(targetIndex);
    let targetProgress = Math.round(currentProgress / totalSlides) * totalSlides + normalizedTarget;
    if (targetProgress - currentProgress > totalSlides / 2) targetProgress -= totalSlides;
    if (targetProgress - currentProgress < -totalSlides / 2) targetProgress += totalSlides;
    return targetProgress;
  };

  const renderProgress = (p: number) => {
    setIndex(normalizeIndex(Math.round(p)));
    slideRefs.current!.forEach((slide: HTMLDivElement | null, i: number) => {
      if (!slide) return;
      const rel = getCircularDelta(p, i);
      const yPercent = -rel * 105 - 50;
      let opacity = 1;
      if (Math.abs(rel) > 2) opacity = 0; 
      gsap.set(slide, { 
        yPercent,
        clearProps: 'top',
        zIndex: totalSlides - i,
        autoAlpha: opacity > 0 ? 1 : 0
      });
      const img = imgRefs.current![i];
      if (img) gsap.set(img, { yPercent: rel * 85, scale: 1 });
      const textOverlay = textOverlayRefs.current![i];
      if (textOverlay) {
         const blurAmount = Math.abs(rel) * 18; 
         gsap.set(textOverlay, { 
           filter: `blur(${blurAmount}px)`,
           opacity: 1 - Math.min(Math.abs(rel) * 2.5, 1)
         });
      }
    });
  };

  const gotoSlide = (targetIndex: number, duration = 0.8) => {
    if (animationRef.current) animationRef.current.kill();
    const safeTarget = resolveTargetProgress(targetIndex);
    setIndex(normalizeIndex(targetIndex));
    targetProgressRef.current = safeTarget;
    animationRef.current = gsap.to(progressObj.current, {
      value: safeTarget,
      duration: 1.0,
      ease: "circOut",
      onUpdate: () => renderProgress(progressObj.current!.value)
    });
  };

  useGSAP(() => {
    renderProgress(0);
    
    // Intro Animation: Only if showIntro is true
    if (showIntro) {
      gsap.fromTo(progressObj.current, 
        { value: -5 }, 
        {
          value: 0,
          duration: 3.5,
          delay: 0,
          ease: "expo.inOut",
          onUpdate: () => renderProgress(progressObj.current!.value)
        }
      );
    }

    const observer = Observer.create({
      target: containerRef.current,
      type: "wheel,touch,pointer",
      wheelSpeed: 1,
      dragMinimum: 3,
      onPress: () => {
        if (animationRef.current) animationRef.current.kill();
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        startProgressRef.current = progressObj.current!.value;
        targetProgressRef.current = progressObj.current!.value;
      },
      onRelease: (self) => {
        let v = self.velocityY * 0.003; // Standard glide multiplier
        let p = progressObj.current!.value;
        let target = Math.round(p - v); 
        
        // If it was a very small movement, snap back to the start position
        const diff = p - startProgressRef.current;
        if (Math.abs(diff) < 0.05 && Math.abs(v) < 0.1) {
           target = Math.round(startProgressRef.current);
        }
        
        gotoSlide(target, 0.8);
      },
      onChange: (self) => {
        if (self.isDragging) {
            if (animationRef.current) animationRef.current.kill();
            const multiplier = 1 / (window.innerHeight || 800);
            const delta = self.deltaY * multiplier; 
            targetProgressRef.current = (targetProgressRef.current || progressObj.current!.value) - delta;
            
            animationRef.current = gsap.to(progressObj.current, {
                value: targetProgressRef.current,
                duration: 0.4,
                ease: "power2.out",
                overwrite: true,
                onUpdate: () => renderProgress(progressObj.current!.value)
            });
            
            if (wheelSnapTimeout.current) clearTimeout(wheelSnapTimeout.current);
            wheelSnapTimeout.current = setTimeout(() => {
                let target = Math.round(targetProgressRef.current || 0);
                gotoSlide(target, 0.8);
            }, 800);
        }
      },
      onWheel: (self) => {
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
          if (animationRef.current) animationRef.current.kill();
          const multiplier = 1 / (window.innerHeight || 800);
          targetProgressRef.current = (targetProgressRef.current || 0) + (self.deltaY * multiplier);
          animationRef.current = gsap.to(progressObj.current, {
              value: targetProgressRef.current,
              duration: 0.6,
              ease: "power2.out",
              overwrite: true,
              onUpdate: () => renderProgress(progressObj.current!.value)
           });
           if (wheelSnapTimeout.current) clearTimeout(wheelSnapTimeout.current);
           wheelSnapTimeout.current = setTimeout(() => {
               let target = Math.round(targetProgressRef.current || 0);
               gotoSlide(target, 0.8);
            }, 800);
       }
    });

    return () => {
      observer.kill();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (animationRef.current) animationRef.current.kill();
    };
  }, { scope: containerRef, dependencies: [slides] }); // Re-init if slides change

  return (
    <main 
      ref={containerRef}
      className="w-full h-[100dvh] relative bg-[#0d0d0d] touch-none overflow-hidden"
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div 
          key={slide.id} 
          ref={(el: HTMLDivElement | null) => (slideRefs.current![i] = el)}
          className="absolute left-3 right-3 md:left-8 md:right-8 lg:left-16 lg:right-16 top-[50dvh] h-[82vh] md:h-[75vh] lg:h-[78vh] rounded-[32px] md:rounded-[40px] overflow-hidden pointer-events-none z-10 will-change-transform border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        >
          <img 
            ref={(el: HTMLImageElement | null) => (imgRefs.current![i] = el)}
            src={slide.image} 
            alt={slide.title} 
            className="absolute inset-0 w-full h-full object-cover" 
          />

            <div 
              ref={(el: HTMLDivElement | null) => (textOverlayRefs.current![i] = el)}
              className="absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-between"
            >

              <div className="flex justify-end items-start pt-12 md:pt-0">
               <div className="hidden lg:flex flex-col gap-1 text-white/70 font-sans tracking-[0.2em] text-[10px] md:text-xs uppercase max-w-[40%] mr-auto">
                 <span>Project ID: {String(slide.id).padStart(4, '0')}</span>
                 <span>Category: {slide.category}</span>
                 <span>Focus: {slide.subtitle}</span>
                 <span>Stack: {slide.meta2}</span>
               </div>
               <div className="text-white/40 font-mono text-[8px] md:text-[10px] tracking-tighter text-right pt-4 md:pt-0">
                  {[
                    "DECRYPTING_META_DATA...",
                    "BYPASSING_FIREWALL...",
                    "ESTABLISHING_VPN...",
                    "ANALYSING_PACKETS...",
                    "INJECTING_PAYLOAD...",
                    "OVERRIDING_SECURITY...",
                    "ESCALATING_PRIVILEGES...",
                    "CLEANING_TRACES...",
                    "ENCRYPTING_TUNNEL...",
                    "BRUTE_FORCING_HASH...",
                    "INTERCEPTING_COMMS...",
                    "MAPPING_NETWORK...",
                    "EXFILTRATING_DATA...",
                    "DECOMPILING_BINARY...",
                    "PATCHING_KERNEL...",
                    "ISOLATING_THREAD...",
                    "MONITORING_UPLINK...",
                    "SYNCING_DATABASE...",
                    "RECOVERY_MODE_ACTIVE",
                    "SIGNAL_STRENGTH_MAX",
                    "UPLINK_ESTABLISHED",
                    "DOWNLINK_STABLE",
                    "NODES_VERIFIED",
                    "ENCRYPTION_SET",
                    "ACCESS_GRANTED"
                  ][i % 25]}<br/>
                  STATUS: {i % 5 === 0 ? "SECURE" : i % 3 === 0 ? "ACTIVE" : "PENDING"}
               </div>
             </div>

             {/* Content Header (Top HUD) - Restored and Brightened */}
             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full px-8 flex justify-between items-start z-20 pointer-events-none opacity-90 text-glow">
                <div className="flex flex-col gap-1 text-[7px] md:text-[9px] font-mono text-white tracking-[0.3em] uppercase">
                  <span>SYSTEM_READY // ARCHIVE_{new Date().getFullYear()}</span>
                </div>
                <div className="hidden md:flex flex-col gap-1 text-[7px] md:text-[9px] font-mono text-white tracking-[0.3em] uppercase text-right">
                  <span>SIGNAL_STABLE</span>
                </div>
             </div>

             {/* Subtle bottom vignette for overall text grounding - NOT a card */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none z-0" />

             <div className="flex flex-col items-center lg:items-start justify-end pb-8 md:pb-12 text-center lg:text-left z-10 relative h-full">
                <div className="flex flex-col items-center lg:items-start max-w-[90%] lg:max-w-4xl">
                  
                  {/* Profile Image - Independent absolute position for maximum stability */}
                  {slide.profileImage && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-10 md:top-12 lg:top-1/2 lg:-translate-y-1/2 lg:right-16 lg:left-auto lg:translate-x-0 z-20 group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-[16px] md:rounded-[32px] blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                      <div 
                        className="relative rounded-[16px] md:rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-sm transition-transform duration-500 group-hover:scale-105"
                        style={{ 
                          width: 'clamp(90px, 18vw, 250px)',
                          height: 'clamp(120px, 24vw, 320px)'
                        }}
                      >
                        <img 
                          src={slide.profileImage} 
                          alt={slide.title} 
                          className="w-full h-full object-cover opacity-70 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-90"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex md:hidden flex-wrap justify-center lg:justify-start gap-x-4 gap-y-1 text-white/80 font-sans tracking-[0.2em] text-[8px] uppercase mb-4 text-glow">
                     <span>ID: {String(slide.id).padStart(4, '0')}</span>
                     <span>{slide.meta2}</span>
                  </div>
                  <p className="font-sans text-[clamp(0.6rem,1.5vw,0.8rem)] uppercase tracking-[0.3em] mb-2 md:mb-4 text-white/90 font-medium text-glow">
                    {slide.category}
                  </p>
                  <h1 
                    className="font-display leading-[1.1] tracking-tight m-0 text-white mb-4 md:mb-10 font-normal pt-2 text-glow"
                    style={{ fontSize: 'clamp(2.8rem, 8vw, 9rem)' }}
                  >
                    {slide.title}
                  </h1>
                  {slide.description && (
                    <p 
                      className="text-white font-sans leading-relaxed mb-6 md:mb-10 max-w-2xl font-light text-glow"
                      style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1.1rem)' }}
                    >
                      {slide.description}
                    </p>
                  )}
                  <div className="flex flex-col gap-1 font-sans text-[clamp(0.6rem,1.5vw,0.8rem)] uppercase tracking-[0.2em] text-white/80 text-glow">
                     <span>FOCUS <span className="text-white ml-2 font-medium">{slide.subtitle}</span></span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      ))}
      
      {/* Pagination Right Edge - Optimized for mobile */}
      <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 md:gap-4 z-40 pointer-events-none rounded-full p-1.5 py-4 md:p-3 md:py-8 text-white/70 font-sans text-[8px] md:text-xs bg-black/10 md:bg-black/20 backdrop-blur-md md:backdrop-blur-xl border border-white/5 md:border-white/10">
         <span className="opacity-40 md:opacity-70">
           {String(normalizeIndex(index) + 1).padStart(2, '0')}
         </span>
         <div className="flex flex-col gap-1.5 md:gap-2 my-1 md:my-2">
            {Array.from({ length: 7 }).map((_, i) => {
               const isActive = (index % 7) === i;

               return (
                  <div 
                     key={i} 
                     className={cn(
                        "w-0.5 h-1 md:w-1 md:h-1 rounded-full bg-white transition-all duration-300",
                        isActive ? "opacity-100 scale-125 h-2 md:h-1 md:scale-150" : "opacity-20 md:opacity-30"
                     )}
                  />
               );
            })}
         </div>
         <span className="opacity-40 md:opacity-70">
           {String(slides.length).padStart(2, '0')}
         </span>
      </div>
    </main>
  );
}
