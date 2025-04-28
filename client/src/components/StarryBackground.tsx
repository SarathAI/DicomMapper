import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const StarryBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Clear previous stars
    container.innerHTML = '';
    
    // Create stars based on container size
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Create 100 stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Random position
      star.style.left = `${Math.random() * containerWidth}px`;
      star.style.top = `${Math.random() * containerHeight}px`;
      
      // Random size
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random opacity
      star.style.opacity = String(Math.random() * 0.7 + 0.3);
      
      container.appendChild(star);
    }
    
    // Handle resize
    const handleResize = () => {
      // Re-create stars on window resize
      container.innerHTML = '';
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        star.style.left = `${Math.random() * newWidth}px`;
        star.style.top = `${Math.random() * newHeight}px`;
        
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.opacity = String(Math.random() * 0.7 + 0.3);
        
        container.appendChild(star);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      id="stars-container" 
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
};

export default StarryBackground;
