
import React, { useRef, useState, useEffect } from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isActive }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Slideshow State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      // We consider touch devices or small screens 'mobile' for the sake of interaction
      // But we will use specific widths in CSS for sizing
      setIsMobile(window.matchMedia('(max-width: 1023px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project.id]);

  // Slideshow Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // Auto-play on mobile/tablet OR when hovered on desktop
    const shouldPlay = isActive && (isMobile || isHovered);

    if (shouldPlay) {
        interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % project.images.length);
        }, 1200); // Change image every 1.2 seconds
    }

    return () => clearInterval(interval);
  }, [isActive, isMobile, isHovered, project.images]);

  // Mouse movement logic (Desktop only)
  useEffect(() => {
    if (isMobile) return; 

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isActive || !isHovered) return;

      const rect = cardRef.current.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;

      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;

      setGlare({ x: glareX, y: glareY, opacity: 1 });

      const rotateX = (mouseY / (rect.height / 2)) * -25; 
      const rotateY = (mouseX / (rect.width / 2)) * 25;   

      setRotation({ x: rotateX, y: rotateY });
    };

    if (isHovered) {
        window.addEventListener('mousemove', handleMouseMove);
    } else {
        setRotation({ x: 0, y: 0 });
        setGlare(prev => ({ ...prev, opacity: 0 }));
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isActive, isHovered, isMobile]);

  // Mobile Auto-Animation (Subtle breathing effect)
  useEffect(() => {
    if (!isMobile || !isActive) return;

    let frameId: number;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const x = Math.sin(elapsed / 2000) * 5; 
      const y = Math.cos(elapsed / 1500) * 5; 
      
      setRotation({ x, y });
      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [isMobile, isActive]);

  // Determine transform style
  const getTransform = () => {
    if (isMobile) {
       return `
          perspective(800px)
          scale(1) 
          rotateX(${rotation.x}deg) 
          rotateY(${rotation.y}deg)
       `;
    }
    
    // Desktop hover effect
    return `
      perspective(600px)
      scale(${isHovered && isActive ? 1.5 : 1}) 
      rotateX(${isHovered && isActive ? rotation.x : 0}deg) 
      rotateY(${isHovered && isActive ? rotation.y : 0}deg)
    `;
  };

  return (
    <>
      <div 
        /* 
           Dimensions logic:
           - Default (Mobile): w-[85vw] h-[45vh]
           - Tablet (md): w-[380px] h-[520px] (Slightly larger vertical card)
           - Desktop (lg): w-[450px] h-[650px]
        */
        className="w-[85vw] h-[45vh] md:w-[380px] md:h-[520px] lg:w-[450px] lg:h-[650px] preserve-3d perspective-1000"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <div
          ref={cardRef}
          className="card-3d w-full h-full relative rounded-2xl will-change-transform"
          style={{
            transform: getTransform(),
            transition: isMobile 
                ? 'transform 0.1s linear'
                : (isHovered 
                    ? 'transform 0.1s ease-out, box-shadow 0.3s ease' 
                    : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease'),
            
            boxShadow: isActive 
              ? `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px -10px ${project.accentColor}${isHovered || isMobile ? '80' : '40'}`
              : '0 10px 30px -10px rgba(0,0,0,0.3)',
            cursor: isMobile ? 'default' : 'none'
          }}
        >
          {/* Main Card Slab */}
          <div 
              className="absolute inset-0 flex flex-col rounded-2xl overflow-hidden bg-[#050505] border border-white/10"
          >
              {/* Inner Content Window */}
              <div className="relative w-full h-full group preserve-3d">
                  
                  {/* Dynamic Image Layer */}
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                        key={currentImageIndex} // Key forces a re-render/transition potential
                        src={project.images[currentImageIndex]} 
                        alt={project.subtitle} 
                        className="w-full h-full object-cover animate-in fade-in duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Glass Sheen */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-black/20 mix-blend-overlay z-10" />

                  {/* Dynamic Mouse Glare (Desktop Only) */}
                  {!isMobile && (
                    <div 
                        className="absolute inset-0 pointer-events-none mix-blend-soft-light z-20 transition-opacity duration-300"
                        style={{
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%)`,
                        opacity: isHovered && isActive ? 0.4 : 0
                        }}
                    />
                  )}
                  
                  {/* Top Info */}
                  <div 
                    className="absolute top-0 left-0 w-full p-6 md:p-8 flex justify-between items-start z-30 text-white mix-blend-difference"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                         {String(project.id).padStart(2, '0')}
                      </span>
                  </div>

                  {/* Bottom Text Area */}
                  <div 
                    className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 z-30"
                    style={{ transform: 'translateZ(30px)' }}
                  >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-0.5 bg-white/80"></div>
                        <p className="text-white/90 text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase drop-shadow-md">
                            Digital Experience
                        </p>
                      </div>
                  </div>

                  {/* Cursor Follower - Tooltip (Desktop Only) */}
                  {!isMobile && (
                    <div 
                        className="absolute z-50 pointer-events-none will-change-transform"
                        style={{
                            left: `${glare.x}%`,
                            top: `${glare.y}%`,
                            opacity: isHovered && isActive ? 1 : 0,
                            transform: 'translate(10px, 10px)',
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <div className="bg-black text-white text-[10px] font-bold tracking-widest px-3 py-1.5 shadow-2xl border border-white/20 whitespace-nowrap uppercase">
                            View
                        </div>
                    </div>
                  )}
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectCard;
