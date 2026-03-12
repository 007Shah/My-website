import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isClickable = target.closest('button, a, input, [role="button"]');
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div 
        className="custom-cursor"
        style={{ 
          left: position.x, 
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
          borderColor: isHovering ? 'var(--color-magenta)' : 'var(--color-cyan)',
          boxShadow: isHovering ? '0 0 15px var(--color-magenta)' : '0 0 10px var(--color-cyan)'
        }}
      />
      <div 
        className="custom-cursor-dot"
        style={{ 
          left: position.x, 
          top: position.y,
          background: isHovering ? 'var(--color-magenta)' : 'var(--color-cyan)'
        }}
      />
    </>
  );
};
