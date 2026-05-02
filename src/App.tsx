import { useState, useEffect } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Projects } from './pages/Projects';
import { Blog } from './pages/Blog';

const ROUTE_ORDER = ['/', '/about', '/projects', '/blog'];

function PageSlider({ isFirstVisit }: { isFirstVisit: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentIndex = ROUTE_ORDER.indexOf(location.pathname);
  
  const x = useMotionValue(0);

  useEffect(() => {
    // Smoothly animate to the new page when the route changes (e.g. from Navbar)
    animate(x, -currentIndex * window.innerWidth, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8
    });
  }, [currentIndex, x]);

  // Trackpad two-finger real-time horizontal scroll
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout;
    let isWheeling = false;

    const handleWheel = (e: WheelEvent) => {
      // Check if the scroll is primarily horizontal
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        isWheeling = true;
        clearTimeout(wheelTimeout);

        // Directly update the x MotionValue based on deltaX
        // Subtracting because deltaX is positive when scrolling right (content should move left)
        const currentX = x.get();
        x.set(currentX - e.deltaX);

        wheelTimeout = setTimeout(() => {
          isWheeling = false;
          // Snap logic on wheel end
          const currentX = x.get();
          const targetIndex = Math.round(-currentX / window.innerWidth);
          const safeIndex = Math.max(0, Math.min(ROUTE_ORDER.length - 1, targetIndex));
          
          if (safeIndex !== currentIndex) {
            navigate(ROUTE_ORDER[safeIndex]);
          } else {
            // Snap back to current
            animate(x, -currentIndex * window.innerWidth, {
              type: "spring",
              stiffness: 300,
              damping: 30
            });
          }
        }, 150);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimeout);
    };
  }, [currentIndex, navigate, x]);

  const onDragEnd = (e: any, info: any) => {
    const threshold = window.innerWidth / 4;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -threshold || velocity < -500) {
      if (currentIndex < ROUTE_ORDER.length - 1) {
        navigate(ROUTE_ORDER[currentIndex + 1]);
      }
    } else if (offset > threshold || velocity > 500) {
      if (currentIndex > 0) {
        navigate(ROUTE_ORDER[currentIndex - 1]);
      }
    }
    
    // Animate back to the (potentially new) currentIndex position
    animate(x, -currentIndex * window.innerWidth, {
      type: "spring",
      stiffness: 300,
      damping: 30
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0d0d0d]">
      <motion.div
        drag="x"
        dragConstraints={{ 
          left: -(ROUTE_ORDER.length - 1) * window.innerWidth, 
          right: 0 
        }}
        dragElastic={0.1}
        onDragEnd={onDragEnd}
        style={{ x }}
        className="flex w-fit h-full cursor-grab active:cursor-grabbing touch-none"
      >
        <div className="w-screen h-full flex-shrink-0">
          <Home showIntro={isFirstVisit} />
        </div>
        <div className="w-screen h-full flex-shrink-0">
          <About showIntro={isFirstVisit} />
        </div>
        <div className="w-screen h-full flex-shrink-0">
          <Projects showIntro={isFirstVisit} />
        </div>
        <div className="w-screen h-full flex-shrink-0">
          <Blog showIntro={isFirstVisit} />
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstVisit(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <div className="bg-[#0d0d0d] min-h-screen text-white font-sans selection:bg-white/30 overflow-hidden">
        <CustomCursor />
        <Navbar />
        <PageSlider isFirstVisit={isFirstVisit} />
      </div>
    </BrowserRouter>
  );
}

