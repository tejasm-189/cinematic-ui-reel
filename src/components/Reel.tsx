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
}

export function Reel({ slides }: ReelProps) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelSnapTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalSlides = slides.length;
  
  const progressObj = useRef({ value: 0 }); 
  const targetProgressRef = useRef(0);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    const normalizedTarget = normalizeIndex(targetIndex);
    const currentProgress = progressObj.current!.value;
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
    // Intro Animation: Preview 5 scrolls and settle on first
    const introTween = gsap.fromTo(progressObj.current, 
      { value: -5 }, 
      {
        value: 0,
        duration: 3.5,
        delay: 0,
        ease: "expo.inOut",
        onUpdate: () => renderProgress(progressObj.current!.value)
      }
    );

    const observer = Observer.create({
      target: containerRef.current,
      type: "wheel,touch,pointer",
      wheelSpeed: 1,
      dragMinimum: 3,
      onPress: () => {
        if (animationRef.current) animationRef.current.kill();
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        startProgress = progressObj.current!.value;
        targetProgressRef.current = progressObj.current!.value;
      },
      onRelease: (self) => {
        let v = self.velocityY * 0.003;
        let p = progressObj.current!.value;
        let target = Math.round(p - v); 
        const diff = p - startProgress;
        if (Math.abs(diff) > 0.15 || Math.abs(v) > 0.2) {
           target = startProgress + Math.sign(diff || -v);
        } else {
           target = Math.round(startProgress);
        }
        gotoSlide(target, 0.9);
      },
      onChange: (self) => {
        if (self.isDragging) {
            if (animationRef.current) animationRef.current.kill();
            targetProgressRef.current = (targetProgressRef.current || 0) - (self.deltaY * 0.0015);
            animationRef.current = gsap.to(progressObj.current, {
                value: targetProgressRef.current,
                duration: 1.2,
                ease: "power1.out",
                overwrite: true,
                onUpdate: () => renderProgress(progressObj.current!.value)
            });
            if (wheelSnapTimeout.current) clearTimeout(wheelSnapTimeout.current);
            wheelSnapTimeout.current = setTimeout(() => {
                let target = Math.round(targetProgressRef.current || 0);
                gotoSlide(target, 0.9);
            }, 1300);
        }
      },
      onWheel: (self) => {
         if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
         if (animationRef.current) animationRef.current.kill();
         targetProgressRef.current = (targetProgressRef.current || 0) + (self.deltaY * 0.0015);
         animationRef.current = gsap.to(progressObj.current, {
             value: targetProgressRef.current,
             duration: 1.0,
             ease: "power2.out",
             overwrite: true,
             onUpdate: () => renderProgress(progressObj.current!.value)
          });
          if (wheelSnapTimeout.current) clearTimeout(wheelSnapTimeout.current);
          wheelSnapTimeout.current = setTimeout(() => {
              let target = Math.round(targetProgressRef.current || 0);
              gotoSlide(target, 0.9);
           }, 1100);
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
          className="absolute left-3 right-3 md:left-8 md:right-8 lg:left-16 lg:right-16 top-[50dvh] h-[70vh] md:h-[75vh] lg:h-[78vh] rounded-[32px] md:rounded-[40px] overflow-hidden pointer-events-none z-10 will-change-transform border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
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
              {/* Profile Image Overlay (if exists) */}
              {slide.profileImage && (
                <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-20 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                  <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
                    <img 
                      src={slide.profileImage} 
                      alt={slide.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start pt-8">
               <div className="flex flex-col gap-1 text-white/70 font-sans tracking-[0.2em] text-[10px] md:text-xs uppercase">
                 <span>Project ID: {String(slide.id).padStart(4, '0')}</span>
                 <span>Category: {slide.category}</span>
                 <span>Focus: {slide.subtitle}</span>
                 <span>Stack: {slide.meta2}</span>
               </div>
               <div className="text-white/40 font-mono text-[8px] md:text-[10px] tracking-tighter text-right">
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

            <div className="flex justify-between items-end pb-8">
               <div className="flex flex-col max-w-3xl">
                 <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 text-white/70 font-medium">
                   {slide.category}
                 </p>
                 <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tight m-0 text-white mb-6 md:mb-8 font-medium">
                   {slide.title}
                 </h1>
                 {slide.description && (
                   <p className="text-white/80 font-sans text-sm md:text-base leading-relaxed mb-6 max-w-2xl bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                     {slide.description}
                   </p>
                 )}
                 <div className="flex flex-col gap-1 font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60">
                    <span>FOCUS <span className="text-white ml-2 font-medium">{slide.subtitle}</span></span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Pagination Right Edge */}
      <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-40 pointer-events-none rounded-full p-2 py-6 md:p-3 md:py-8 text-white/70 font-sans text-xs bg-black/20 backdrop-blur-xl border border-white/10">
         <span className="opacity-70">
           {String(normalizeIndex(index) + 1).padStart(2, '0')}
         </span>
         <div className="flex flex-col gap-2 my-2">
            {Array.from({ length: 7 }).map((_, i) => {
               const isActive = (index % 7) === i;

               return (
                  <div 
                     key={i} 
                     className={cn(
                        "w-1 h-1 rounded-full bg-white transition-all duration-300",
                        isActive ? "opacity-100 scale-150" : "opacity-30"
                     )}
                  />
               );
            })}
         </div>
         <span className="opacity-70">
           {String(slides.length).padStart(2, '0')}
         </span>
      </div>
    </main>
  );
}
