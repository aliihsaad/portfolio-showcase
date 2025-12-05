
import React, { useState, useEffect, useRef } from 'react';
import { Aperture } from 'lucide-react';
import { PROJECTS } from './constants';
import ProjectCard from './components/ProjectCard';
import WheelNavigation from './components/WheelNavigation';
import GridBackground from './components/GridBackground';
import ScatterText from './components/ScatterText';

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0); // Force re-render of animations
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const currentProject = PROJECTS[currentIndex];
  const isDarkTheme = currentProject.textColor === 'text-white';

  // Custom cursor movement for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const changeProject = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setAnimationKey(prev => prev + 1); // Trigger new text reveal
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleNext = () => {
    changeProject((currentIndex + 1) % PROJECTS.length);
  };

  const handlePrev = () => {
    changeProject((currentIndex - 1 + PROJECTS.length) % PROJECTS.length);
  };

  // Touch Swipe Logic (Main Screen)
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  // Wheel navigation (Desktop Mouse Wheel)
  const lastScrollTime = useRef(0);
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < 1000) return; // Debounce scroll
      
      if (e.deltaY > 0) {
        handleNext();
        lastScrollTime.current = now;
      } else if (e.deltaY < 0) {
        handlePrev();
        lastScrollTime.current = now;
      }
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentIndex, isAnimating]);

  // Helper to determine the visual state of a card based on its index relative to current
  const getCardStyle = (index: number) => {
    const total = PROJECTS.length;
    
    // Calculate smallest difference considering wrap-around
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      // Current Card
      return {
        className: 'opacity-100 z-20 pointer-events-auto blur-0',
        style: {
          transform: 'translate3d(0, 0, 0) rotateX(0deg) scale(1)',
        }
      };
    } else if (diff < 0) {
      // Previous Cards
      return {
        className: 'opacity-0 z-0 pointer-events-none blur-sm',
        style: {
          transform: 'translate3d(0, -120%, -100px) rotateX(45deg) scale(0.8)',
        }
      };
    } else {
      // Next Cards
      return {
        className: 'opacity-0 z-0 pointer-events-none blur-sm',
        style: {
          transform: 'translate3d(0, 120%, -100px) rotateX(-45deg) scale(0.8)',
        }
      };
    }
  };

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 ease-in-out selection:bg-pink-500 selection:text-white`}
      style={{ backgroundColor: currentProject.bgColor }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Blob */}
        <div 
          className="absolute top-1/2 left-1/2 w-[120vmax] h-[120vmax] rounded-full blur-[100px] opacity-[0.15] animate-float-slow transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${currentProject.accentColor}, transparent 60%)`,
            mixBlendMode: isDarkTheme ? 'screen' : 'multiply'
          }}
        />
        
        {/* Interactive 3D Grid */}
        <GridBackground accentColor={currentProject.accentColor} isDark={isDarkTheme} />

        {/* Film Grain Texture */}
        <div className="absolute inset-0 bg-grain opacity-[0.03]" />
      </div>

      {/* Background Custom Cursor (Subtle) */}
      <div 
        className="custom-cursor fixed w-4 h-4 bg-white rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference z-0 hidden lg:block"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      
      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-40 p-4 md:p-8 lg:p-10 flex justify-between items-center ${currentProject.textColor} transition-colors duration-500`}>
        {/* Left Side: Showcase Gallery Title */}
        <div className="relative font-bold text-xl md:text-2xl lg:text-4xl tracking-tight uppercase select-none transition-all duration-700">
           <ScatterText
              className="bg-clip-text text-transparent font-['Syne']"
              style={{
                backgroundImage: `linear-gradient(135deg, ${currentProject.accentColor} 0%, ${isDarkTheme ? '#ffffff' : '#000000'} 100%)`,
                filter: `drop-shadow(0 0 15px ${currentProject.accentColor}80)`
              }}
           >
            Showcase Gallery
           </ScatterText>
        </div>

        {/* Center Logo Area - Rotates on Scroll */}
        <div 
           className="absolute right-4 lg:left-1/2 lg:right-auto lg:top-1/2 transform lg:-translate-x-1/2 lg:-translate-y-1/2 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
           style={{ transform: `translate(0, 0) rotate(${currentIndex * 180}deg)` }}
        >
           <Aperture className={`w-10 h-10 lg:w-14 lg:h-14 ${currentProject.textColor}`} />
        </div>
      </header>

      {/* 3D Wheel Navigation (Right Side - Visible on all devices now) */}
      <WheelNavigation 
        total={PROJECTS.length} 
        current={currentIndex} 
        onChange={changeProject}
        textColor={currentProject.textColor}
      />

      {/* Main Content Grid 
          Changed from md:flex-row to lg:flex-row. 
          This means Tablet (MD) will stay flex-col (vertical stack).
      */}
      <main className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-between px-4 md:px-10 lg:px-20 pt-20 pb-20 lg:pb-24">
        
        {/* Left Typography - Title */}
        <div className="w-full lg:w-[30%] h-auto flex flex-col justify-end items-center lg:items-end text-center lg:text-right order-1 mb-4 lg:mb-0 z-20 pointer-events-auto pr-0 lg:pr-4">
          {currentProject.titleLeft.map((text, idx) => (
             <div key={`${animationKey}-left-${idx}`} className="reveal-text-container">
                <h1 
                    className={`text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] ${currentProject.textColor} reveal-text break-words`}
                    style={{ animationDelay: `${500 + (idx * 150)}ms` }}
                >
                  <ScatterText>{text}</ScatterText>
                </h1>
             </div>
          ))}
        </div>

        {/* Center 3D Card Area */}
        <div className="w-full lg:w-[40%] h-[45vh] md:h-[50vh] lg:h-full relative flex justify-center items-center order-2 z-30 perspective-container my-2 md:my-6 lg:my-0">
            {PROJECTS.map((project, idx) => {
                const { className, style } = getCardStyle(idx);
                return (
                  <div 
                    key={project.id} 
                    className={`absolute flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${className}`}
                    style={style}
                  >
                    <ProjectCard project={project} isActive={idx === currentIndex} />
                  </div>
                );
            })}
        </div>

        {/* Right Typography - Description */}
        <div className="w-full lg:w-[30%] h-auto flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-3 z-20 pointer-events-auto pl-0 lg:pl-4">
          <div className="mb-4 lg:mb-6 px-4 md:px-0 max-w-md lg:max-w-none">
            {currentProject.description.map((line, idx) => (
               <div key={`${animationKey}-desc-${idx}`} className="reveal-text-container mb-0.5 lg:mb-1">
                  <p 
                      className={`text-sm md:text-lg lg:text-2xl font-medium leading-relaxed ${currentProject.textColor} reveal-text`}
                      style={{ animationDelay: `${750 + (idx * 80)}ms` }}
                  >
                    <ScatterText>{line}</ScatterText>
                  </p>
               </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Navigation / Pagination */}
      <footer className={`fixed bottom-0 left-0 w-full p-6 lg:p-10 flex flex-col lg:flex-row justify-between items-end z-40 ${currentProject.textColor} transition-colors duration-500`}>
         <div className="hidden lg:block text-xs max-w-[250px] opacity-60 leading-relaxed">
            © 2024 Portfolio Showcase.
         </div>

         {/* Center Section - Removed Mobile controls as per request */}
         <div className="absolute left-1/2 bottom-6 lg:bottom-10 transform -translate-x-1/2 w-full lg:w-auto flex flex-col items-center pointer-events-none">
             {/* Mobile/Tablet Controls Removed - using Wheel instead */}
         </div>
         
         {/* Footer Right Text */}
         <div className="hidden lg:block text-xs font-bold tracking-widest uppercase opacity-60">
            Scroll to explore
         </div>
      </footer>
    </div>
  );
};

export default App;
