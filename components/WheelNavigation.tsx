
import React, { useRef, useState, useEffect } from 'react';

interface WheelNavigationProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
  textColor: string;
}

const WheelNavigation: React.FC<WheelNavigationProps> = ({ total, current, onChange, textColor }) => {
  const RADIUS = 200; // Radius for horizontal spread
  const ANGLE_STEP = 20; // Degrees separation between items
  
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const lastScrollTime = useRef(0);

  // Touch handling state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    
    const currentX = e.touches[0].clientX;
    const diff = touchStartX - currentX;
    
    // Threshold to trigger slide change
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        onChange((current + 1) % total);
      } else {
        onChange((current - 1 + total) % total);
      }
      setTouchStartX(null); 
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  // Mouse Wheel Handler (Local)
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation(); // Stop propagation to prevent global scrolling if any
    
    const now = Date.now();
    if (now - lastScrollTime.current < 500) return; // Debounce

    // Simple threshold to prevent over-scrolling
    if (Math.abs(e.deltaY) > 5 || Math.abs(e.deltaX) > 5) {
        if (e.deltaY > 0 || e.deltaX > 0) {
            onChange((current + 1) % total);
        } else {
            onChange((current - 1 + total) % total);
        }
        lastScrollTime.current = now;
    }
  };

  // Tooltip Movement Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div 
        className="fixed bottom-[2vh] md:bottom-[4vh] left-1/2 transform -translate-x-1/2 w-[300px] md:w-[500px] h-[100px] z-50 flex items-center justify-center select-none origin-center touch-none cursor-none" 
        style={{ 
          perspective: '1000px', 
          transformStyle: 'preserve-3d',
          maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        
        {/* Center Selection Indicators (Vertical Lines for Horizontal Wheel) */}
        <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-12 border-x ${textColor.includes('white') ? 'border-white/50' : 'border-black/50'} z-0`}
        />
        <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-14 bg-gradient-to-b ${textColor.includes('white') ? 'from-transparent via-white/5 to-transparent' : 'from-transparent via-black/5 to-transparent'} z-0 blur-sm`}
        />

        {/* 3D Wheel Container */}
        <div className="relative w-full h-full preserve-3d flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {Array.from({ length: total }).map((_, i) => {
            // Calculate distance with wrap-around logic
            let diff = i - current;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            // Don't render items that are behind the wheel
            if (Math.abs(diff) > 5) return null;

            const angle = diff * ANGLE_STEP; // Rotate around Y axis
            
            return (
              <div
                key={i}
                onClick={() => onChange(i)}
                className={`absolute left-1/2 top-1/2 flex justify-center items-center cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${textColor}`}
                style={{
                  width: '60px',
                  height: '40px',
                  marginLeft: '-30px', // Center horizontally
                  marginTop: '-20px', // Center vertically
                  transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                  opacity: 1 - Math.pow(Math.abs(diff) / 5, 2), 
                  zIndex: 100 - Math.round(Math.abs(diff)),
                  backfaceVisibility: 'hidden',
                  filter: Math.abs(diff) === 0 ? 'none' : `blur(${Math.abs(diff) * 0.5}px)`, 
                }}
              >
                <span 
                  className={`text-xl font-bold font-mono tracking-[0.2em] transition-transform duration-700 ${Math.abs(diff) === 0 ? 'scale-125' : 'scale-90 opacity-60'}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mouse Follow Tooltip - SCROLL */}
      <div 
        className="fixed z-[60] pointer-events-none transition-opacity duration-200 hidden lg:block"
        style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translate(20px, 20px)',
            opacity: isHovered ? 1 : 0
        }}
      >
        <div className={`px-2 py-1 text-[10px] font-bold tracking-widest border uppercase backdrop-blur-md ${textColor.includes('white') ? 'bg-white/10 border-white/30 text-white' : 'bg-black/10 border-black/30 text-black'}`}>
            Scroll
        </div>
      </div>
    </>
  );
};

export default WheelNavigation;
