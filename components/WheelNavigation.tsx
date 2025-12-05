import React, { useRef, useState } from 'react';

interface WheelNavigationProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
  textColor: string;
}

const WheelNavigation: React.FC<WheelNavigationProps> = ({ total, current, onChange, textColor }) => {
  const RADIUS = 140; // Radius of the 3D wheel
  const ANGLE_STEP = 25; // Degrees separation between items
  
  // Touch handling state
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    
    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY;
    
    // Threshold to trigger slide change
    if (Math.abs(diff) > 30) {
      // If dragging up (diff > 0), move to next item. 
      // If dragging down (diff < 0), move to previous item.
      if (diff > 0) {
        onChange((current + 1) % total);
      } else {
        onChange((current - 1 + total) % total);
      }
      setTouchStartY(null); // Reset to require a lift or new motion (simple debounce)
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  return (
    <div 
      className="fixed right-0 md:right-4 top-1/2 transform -translate-y-1/2 h-[320px] w-[100px] md:w-[120px] z-50 flex flex-col items-center justify-center select-none scale-75 md:scale-100 origin-right touch-none" 
      style={{ 
        perspective: '1000px', 
        transformStyle: 'preserve-3d',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Center Selection Indicators */}
      <div 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 md:w-16 h-10 border-y ${textColor.includes('white') ? 'border-white/50' : 'border-black/50'} z-0`}
      />
      <div 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-12 bg-gradient-to-r ${textColor.includes('white') ? 'from-transparent via-white/5 to-transparent' : 'from-transparent via-black/5 to-transparent'} z-0 blur-sm`}
      />

      {/* 3D Wheel Container */}
      <div className="relative w-full h-full preserve-3d" style={{ transformStyle: 'preserve-3d' }}>
        {Array.from({ length: total }).map((_, i) => {
          // Calculate distance with wrap-around logic
          let diff = i - current;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          // Don't render items that are behind the wheel
          if (Math.abs(diff) > 4) return null;

          const angle = diff * -ANGLE_STEP;
          
          return (
            <div
              key={i}
              onClick={() => onChange(i)}
              className={`absolute top-1/2 left-0 w-full flex justify-center items-center cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${textColor}`}
              style={{
                height: '40px',
                marginTop: '-20px', // Center the item vertically
                transform: `rotateX(${angle}deg) translateZ(${RADIUS}px)`,
                opacity: 1 - Math.pow(Math.abs(diff) / 4.5, 2), // Smooth exponential fade
                zIndex: 100 - Math.round(Math.abs(diff)),
                backfaceVisibility: 'hidden',
                filter: Math.abs(diff) === 0 ? 'none' : `blur(${Math.abs(diff) * 0.5}px)`, // Depth blur
              }}
            >
              <span 
                className={`text-xl font-bold font-mono tracking-[0.2em] transition-transform duration-700 ${Math.abs(diff) === 0 ? 'scale-110' : 'scale-90 opacity-60'}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WheelNavigation;