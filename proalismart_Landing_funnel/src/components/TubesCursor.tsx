import { useEffect, useRef } from 'react';

export default function TubesCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<any>(null);

  // Generate random colors for tubes and lights
  const randomColors = (count: number) => {
    return new Array(count)
      .fill(0)
      .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
  };

  useEffect(() => {
    let active = true;

    // Use dynamic import via Function executor to prevent build-time Vite/TS compilation issues
    const loadModule = new Function("url", "return import(url)");
    
    const initTimer = setTimeout(() => {
      loadModule('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js')
        .then((module: any) => {
          if (!active) return;
          
          const TubesCursorFn = module.default;
          
          if (canvasRef.current) {
            try {
              // Initialize TubesCursor animation with our cyber theme colors
              const app = TubesCursorFn(canvasRef.current, {
                tubes: {
                  colors: ["#0066cc", "#2997ff", "#f56300"], // Action Blue, Sky Link Blue, Apple Orange
                  minRadius: 0.0008, // Very thin, size of mouse pointer (default: 0.005)
                  maxRadius: 0.006,  // Very thin, size of mouse pointer (default: 0.05)
                  minTubularSegments: 150, // Increase segment count to stretch trail length (default: 32)
                  maxTubularSegments: 350, // Increase segment count to stretch trail length (default: 128)
                  lerp: 0.7,        // Smooth follow speed to let trail stretch naturally (default: 0.5)
                  lights: {
                    intensity: 70,   // Low intensity to make the glow very tight around the pointer (default: 200)
                    colors: ["#0066cc", "#2997ff", "#f56300", "#30d158"] // Apple Action Blue, Sky Link Blue, Orange, Green
                  }
                }
              });
              
              appRef.current = app;
            } catch (error) {
              console.error("Error initializing TubesCursor:", error);
            }
          }
        })
        .catch((err: any) => console.error("Failed to load TubesCursor module from CDN:", err));
    }, 100);

    // Global click listener to randomize colors, ignoring interactive targets
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') || 
        target.closest('a') || 
        target.closest('input') || 
        target.closest('textarea') || 
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('nav')
      ) {
        return;
      }
      
      if (appRef.current && appRef.current.tubes) {
        const newTubeColors = randomColors(3);
        const newLightColors = randomColors(4);
        
        try {
          appRef.current.tubes.setColors(newTubeColors);
          appRef.current.tubes.setLightsColors(newLightColors);
        } catch (err) {
          console.warn("Could not update TubesCursor colors dynamically:", err);
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);

    // Resize handler to ensure canvas bounds are always synchronized
    const handleResize = () => {
      if (appRef.current && typeof appRef.current.resize === 'function') {
        appRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      active = false;
      clearTimeout(initTimer);
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('resize', handleResize);
      
      if (appRef.current && typeof appRef.current.dispose === 'function') {
        try {
          appRef.current.dispose();
        } catch (e) {
          console.warn("Error disposing TubesCursor instance:", e);
        }
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none" 
      style={{ 
        zIndex: 0,
        mixBlendMode: 'screen',
        opacity: 0.85
      }} 
    />
  );
}
