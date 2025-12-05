
import React, { useState } from 'react';

interface ScatterTextProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
}

const ScatterText: React.FC<ScatterTextProps> = ({ children, className = '', style = {} }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Deterministic pseudo-random number generator to ensure consistent scatter per character
  const getPseudoRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  };

  return (
    <span
      className={`inline-block cursor-default select-none ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children.split('').map((char, index) => {
        const seed = index + children.length; // Unique seed per char position
        const r1 = getPseudoRandom(seed);
        const r2 = getPseudoRandom(seed + 1);
        const r3 = getPseudoRandom(seed + 2);

        // Aggressive random values
        const x = isHovered ? (r1 - 0.5) * 40 : 0; // -20px to 20px
        const y = isHovered ? (r2 - 0.5) * 40 : 0; // -20px to 20px
        const r = isHovered ? (r3 - 0.5) * 60 : 0; // -30deg to 30deg
        const s = isHovered ? 1.1 + (r1 * 0.2) : 1; // 1.1 to 1.3 scale

        return (
          <span
            key={index}
            className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.2,1.5,0.5,1)] will-change-transform whitespace-pre"
            style={{ 
                transform: `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default ScatterText;
