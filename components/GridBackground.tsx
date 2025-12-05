
import React, { useEffect, useRef } from 'react';

interface GridBackgroundProps {
  accentColor: string;
  isDark: boolean;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ accentColor, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let offset = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const drawGrid = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Grid settings
      const gridSize = 40; // Base size of grid squares
      const horizonY = height * 0.5; // Horizon line height
      const speed = 0.5; // Scroll speed
      
      // Update offset for animation
      offset = (offset + speed) % gridSize;

      // Fixed vanishing point (no interaction)
      const vanishingPointX = width / 2;
      const vanishingPointY = horizonY;

      // Color settings
      ctx.strokeStyle = accentColor;
      
      // Opacity adjustment: Stronger on light backgrounds because 'mix-blend-overlay' washes out
      // On light mode we use 'normal' blend so we need higher opacity
      const baseOpacity = isDark ? 0.15 : 0.3; 
      
      ctx.lineWidth = 1;

      // DRAW VERTICAL LINES
      const numVerticalLines = 40; // Number of lines to left/right of center
      
      for (let i = -numVerticalLines; i <= numVerticalLines; i++) {
        // Calculate x position at the bottom of the screen
        // Center + spacing
        const xBottom = (width / 2) + (i * gridSize * 4);
        
        ctx.beginPath();
        // Create a gradient for the line (fade out near horizon)
        const grad = ctx.createLinearGradient(vanishingPointX, vanishingPointY, xBottom, height);
        grad.addColorStop(0, `rgba(0,0,0,0)`); // Invisible at horizon
        grad.addColorStop(0.2, `rgba(0,0,0,0)`);
        grad.addColorStop(1, hexToRgba(accentColor, baseOpacity)); // Visible at bottom
        
        ctx.strokeStyle = grad;
        ctx.moveTo(vanishingPointX, vanishingPointY);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // DRAW HORIZONTAL LINES
      const fov = 300; // Field of view factor
      const cameraHeight = 150; // Camera height above the plane

      for (let z = 0; z < 2000; z += gridSize) {
        // Effective Z includes the scrolling offset
        const effectiveZ = z - offset;
        if (effectiveZ <= 0) continue;

        // Project 3D Z coordinate to 2D Y coordinate
        const projectedY = vanishingPointY + (cameraHeight * fov) / effectiveZ;

        if (projectedY > height) continue; // Below screen
        if (projectedY < horizonY) continue; // Above horizon

        // Fade out as it gets closer to horizon (further away)
        const distanceAlpha = Math.min(1, Math.max(0, (projectedY - horizonY) / (height - horizonY)));
        
        ctx.beginPath();
        ctx.strokeStyle = hexToRgba(accentColor, baseOpacity * distanceAlpha);
        
        ctx.moveTo(0, projectedY);
        ctx.lineTo(width, projectedY);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [accentColor, isDark]);

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` : `rgba(128,128,128,${alpha})`;
  };

  return (
      <canvas 
        ref={canvasRef} 
        className={`absolute inset-0 w-full h-full pointer-events-none ${isDark ? 'mix-blend-overlay' : 'mix-blend-normal'}`} 
      />
  );
};

export default GridBackground;
