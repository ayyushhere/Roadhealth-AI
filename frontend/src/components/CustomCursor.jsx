import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Check if hovering over clickable elements
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Inner glowing dot */}
      <div 
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-blue-500 rounded-full pointer-events-none z-[9999] shadow-[0_0_10px_rgba(59,130,246,0.9)] transition-transform duration-75 ease-out"
        style={{ 
          transform: `translate(${position.x - 5}px, ${position.y - 5}px) scale(${isHovering ? 0 : 1})`
        }}
      />
      {/* Outer trailing ring */}
      <div 
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out flex items-center justify-center ${
          isHovering 
            ? 'w-14 h-14 bg-blue-500/20 border border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] backdrop-blur-[2px]' 
            : 'w-8 h-8 border border-blue-500/40 bg-transparent'
        }`}
        style={{ 
          transform: `translate(${position.x - (isHovering ? 28 : 16)}px, ${position.y - (isHovering ? 28 : 16)}px)`
        }}
      />
    </>
  );
}
