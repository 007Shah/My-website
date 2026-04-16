import React, { useEffect, useRef } from 'react';
import { animate as anime } from 'animejs';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (dotRef.current && outlineRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        outlineRef.current.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
      }
    };

    window.addEventListener('mousemove', moveCursor);

    // Magnetic effect for buttons
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('.magnetic')) {
        anime(outlineRef.current, {
          scale: 1.5,
          duration: 300,
          easing: 'easeOutExpo'
        });
      }
    };

    const handleMouseLeave = () => {
      anime(outlineRef.current, {
        scale: 1,
        duration: 300,
        easing: 'easeOutExpo'
      });
    };

    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={outlineRef} className="cursor-outline" />
    </>
  );
};

export default CustomCursor;
