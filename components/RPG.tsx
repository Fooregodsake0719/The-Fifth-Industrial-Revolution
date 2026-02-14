import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View } from '../types';

interface RPGProps {
  onNavigate: (view: View) => void;
}

const RPG: React.FC<RPGProps> = ({ onNavigate }) => {
  const [phase, setPhase] = useState<'menu' | 'loading' | 'active'>('menu');
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef<Set<string>>(new Set());
  // Fix: Provide an initial value to useRef to satisfy TypeScript requirements
  const requestRef = useRef<number | undefined>(undefined);

  // Handle WASD input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startSimulation = () => {
    setPhase('loading');
    setTimeout(() => {
      setPhase('active');
    }, 2000);
  };

  const drawWorkshop = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, camX: number, camY: number) => {
    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2 - camX * 200;
    const centerY = height / 2 - camY * 100;

    // 1. Draw Floor (White Matte Tiles)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = -10; i < 10; i++) {
      for (let j = -10; j < 10; j++) {
        ctx.fillStyle = '#1c1c1c';
        ctx.fillRect(i * 100, j * 100, 98, 98);
      }
    }
    ctx.restore();

    // 2. Environment Items
    // Left Corner: Scattered aluminum profiles and corner pieces
    ctx.save();
    ctx.translate(centerX - 400, centerY - 200);
    ctx.fillStyle = '#2a2a2a';
    // Aluminum profiles (long rectangles)
    ctx.fillRect(10, 20, 150, 10);
    ctx.fillRect(40, 50, 120, 10);
    ctx.rotate(0.2);
    ctx.fillRect(0, 100, 180, 10);
    // Corner brackets
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(20, 30, 10, 10);
    ctx.fillRect(100, 80, 10, 10);
    ctx.restore();

    // Right Corner: Cutting machine and Angle Grinder
    ctx.save();
    ctx.translate(centerX + 300, centerY - 300);
    // Cutting Machine
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 100, 120);
    ctx.fillStyle = '#222';
    ctx.fillRect(10, 10, 80, 100);
    ctx.fillStyle = '#551111'; // A hint of warning color
    ctx.beginPath();
    ctx.arc(50, 60, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Angle Grinder
    ctx.translate(120, 40);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 40, 20);
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.arc(45, 10, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Bright Lights (Vignette inverse)
    const gradient = ctx.createRadialGradient(width/2, height/2, 100, width/2, height/2, width);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 4. Octopus Tentacles (Biological Interface)
    ctx.save();
    ctx.fillStyle = '#0a0a0a';
    ctx.strokeStyle = '#150505';
    ctx.lineWidth = 15;
    
    // Left Tentacle
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.bezierCurveTo(width * 0.1, height * 0.7, width * 0.2 + camX * 20, height * 0.8 + camY * 20, width * 0.3 + camX * 50, height * 0.9);
    ctx.stroke();

    // Right Tentacle
    ctx.beginPath();
    ctx.moveTo(width, height);
    ctx.bezierCurveTo(width * 0.9, height * 0.6, width * 0.8 - camX * 20, height * 0.7 - camY * 20, width * 0.7 - camX * 50, height * 0.85);
    ctx.stroke();
    ctx.restore();

    // 5. High Grain Noise Effect
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 45;
      data[i] += noise;
      data[i+1] += noise;
      data[i+2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

  }, []);

  const animate = useCallback(() => {
    if (phase !== 'active') return;

    setCamera(prev => {
      let nx = prev.x;
      let ny = prev.y;
      const speed = 0.05;
      if (keys.current.has('w')) ny -= speed;
      if (keys.current.has('s')) ny += speed;
      if (keys.current.has('a')) nx -= speed;
      if (keys.current.has('d')) nx += speed;

      // Clamp camera
      return {
        x: Math.max(-1.5, Math.min(1.5, nx)),
        y: Math.max(-1.5, Math.min(1.5, ny))
      };
    });

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawWorkshop(ctx, canvasRef.current.width, canvasRef.current.height, camera.x, camera.y);
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [phase, camera.x, camera.y, drawWorkshop]);

  useEffect(() => {
    if (phase === 'active') {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [phase, animate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col p-4 md:p-8 items-center justify-center relative overflow-hidden">
      {/* CRT Overlay is global, so it applies here too */}
      
      {phase === 'menu' && (
        <div className="z-10 text-center space-y-8 max-w-lg w-full">
          <h2 className="text-4xl font-bold text-amber-600 mb-12 tracking-widest border-b-2 border-amber-900 pb-4">
            BIOLOGICAL CLASSIFICATION
          </h2>
          <div className="space-y-4 flex flex-col">
            <button onClick={startSimulation} className="btn-industrial">
              Start as a Marine Life
            </button>
            <button disabled className="btn-industrial opacity-50 cursor-not-allowed">
              Start as Terrestrial Organism (Locked)
            </button>
            <button onClick={() => onNavigate(View.HOME)} className="btn-industrial border-zinc-700">
              Return Home
            </button>
          </div>
          <p className="text-xs text-zinc-600 italic">
            "An octopus has three hearts. One for survival, two for the machine."
          </p>
        </div>
      )}

      {phase === 'loading' && (
        <div className="z-10 w-full max-w-4xl bg-black border-4 border-zinc-800 p-4 aspect-video flex items-center justify-center">
          <div className="text-amber-500 font-mono text-center">
            <div className="text-6xl mb-4 animate-bounce">🐙</div>
            <p className="animate-pulse tracking-[0.5em] text-xl font-bold">SIMULATION INITIALIZED...</p>
            <p className="text-xs mt-4 text-zinc-600 uppercase">Syncing neural interfaces with workshop grid</p>
          </div>
        </div>
      )}

      {phase === 'active' && (
        <div className="z-10 w-full max-w-6xl h-full flex flex-col relative group">
          <div className="relative flex-1 border-4 border-zinc-800 bg-black overflow-hidden aspect-video">
             <canvas 
                ref={canvasRef} 
                width={1280} 
                height={720} 
                className="w-full h-full object-cover"
             />
             
             {/* Dynamic UI Overlays */}
             <div className="absolute top-4 left-4 font-mono text-[10px] text-amber-600/50 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-red-600 animate-pulse rounded-full"></div>
                   <span>NEURAL_LINK_STABLE: 98.4%</span>
                </div>
                <span>POSITION: W_BLOCK_04</span>
             </div>

             <div className="absolute bottom-4 left-4 font-mono text-[10px] text-zinc-600">
                MOVE: [W,A,S,D]
             </div>

             <div className="absolute top-4 right-4 text-zinc-700 text-[8px] font-mono text-right">
                SEC_LEVEL: ALPHA<br/>
                VIS_FILTER: GRAIN_V3
             </div>
          </div>
          
          <div className="flex justify-end p-2">
            <button 
              onClick={() => setPhase('menu')} 
              className="btn-industrial text-[10px] py-1 px-4 hover:border-red-600 hover:text-red-600"
            >
              Abort Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RPG;