
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View } from '../types';

interface RPGProps {
  onNavigate: (view: View) => void;
}

const RPG: React.FC<RPGProps> = ({ onNavigate }) => {
  const [phase, setPhase] = useState<'menu' | 'loading' | 'active' | 'transitioning'>('menu');
  const [loadingStep, setLoadingStep] = useState<string>("Initializing Neural Link...");
  const [playerPos, setPlayerPos] = useState({ x: 300, y: 300 });
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [octopusSprite, setOctopusSprite] = useState<HTMLImageElement | null>(null);
  const [bearSprite, setBearSprite] = useState<HTMLImageElement | null>(null);
  const [boarSprite, setBoarSprite] = useState<HTMLImageElement | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef<Set<string>>(new Set());
  const requestRef = useRef<number | undefined>(undefined);

  // Constants
  const CANVAS_WIDTH = 1280;
  const CANVAS_HEIGHT = 720;
  const PLAYER_SPEED = 6;
  const DOOR_HITBOX = { x: 1100, y: 550, w: 150, h: 150 };

  // Handle Input
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

  // Utility to load an image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`Failed to load image at ${src}`);
        resolve(img);
      };
      img.src = src;
    });
  };

  const startSimulation = async () => {
    setPhase('loading');
    try {
      setLoadingStep("Accessing Local Archive...");
      // 提示：你可以将这里的 URL 换成你自己画的图，例如 './assets/workshop.png'
      const bg = await loadImage('https://placehold.co/1280x720/18181b/f59e0b?text=Workshop+Layout+Alpha');
      const octo = await loadImage('https://placehold.co/100x100/ff99cc/ffffff?text=Octo');
      const bear = await loadImage('https://placehold.co/100x100/996633/ffffff?text=Bear');
      const boar = await loadImage('https://placehold.co/100x100/666666/ffffff?text=Boar');

      setBgImage(bg);
      setOctopusSprite(octo);
      setBearSprite(bear);
      setBoarSprite(boar);

      setLoadingStep("Neural Link Stable.");
      setTimeout(() => setPhase('active'), 1000);
    } catch (error) {
      setPhase('active');
    }
  };

  const draw2DSimulation = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, pX: number, pY: number) => {
    // Clear background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // Draw background asset
    if (bgImage && bgImage.complete && bgImage.naturalWidth !== 0) {
      ctx.drawImage(bgImage, 0, 0, width, height);
    } else {
      ctx.strokeStyle = '#27272a';
      for(let x=0; x<width; x+=64) ctx.strokeRect(x, 0, 1, height);
      for(let y=0; y<height; y+=64) ctx.strokeRect(0, y, width, 1);
    }

    // NPCs (Bear & Boar)
    const npcSize = 100;
    const idleBounce = Math.sin(Date.now() / 250) * 3;
    if (bearSprite) ctx.drawImage(bearSprite, width/2 - 140, height/2 - 50 + idleBounce, npcSize, npcSize);
    if (boarSprite) ctx.drawImage(boarSprite, width/2 + 40, height/2 - 20 - idleBounce, npcSize, npcSize);

    // Player Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(pX, pY + 20, 25, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Player (Octopus)
    if (octopusSprite) {
      const size = 96;
      const bounce = Math.sin(Date.now() / 180) * 5;
      ctx.drawImage(octopusSprite, pX - size/2, pY - size/2 + bounce, size, size);
    }

    // Gritty filter: CRT lines (soft)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let i = 0; i < height; i += 4) {
      ctx.fillRect(0, i, width, 1);
    }

  }, [bgImage, octopusSprite, bearSprite, boarSprite]);

  const animate = useCallback(() => {
    if (phase !== 'active') return;

    setPlayerPos(prev => {
      let nx = prev.x;
      let ny = prev.y;
      if (keys.current.has('w')) ny -= PLAYER_SPEED;
      if (keys.current.has('s')) ny += PLAYER_SPEED;
      if (keys.current.has('a')) nx -= PLAYER_SPEED;
      if (keys.current.has('d')) nx += PLAYER_SPEED;

      // Check door collision
      if (nx > DOOR_HITBOX.x && nx < DOOR_HITBOX.x + DOOR_HITBOX.w &&
          ny > DOOR_HITBOX.y && ny < DOOR_HITBOX.y + DOOR_HITBOX.h) {
          setPhase('transitioning');
          return prev;
      }

      return {
        x: Math.max(40, Math.min(CANVAS_WIDTH - 40, nx)),
        y: Math.max(40, Math.min(CANVAS_HEIGHT - 40, ny))
      };
    });

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) draw2DSimulation(ctx, canvasRef.current.width, canvasRef.current.height, playerPos.x, playerPos.y);
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [phase, playerPos, draw2DSimulation]);

  useEffect(() => {
    if (phase === 'active') requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [phase, animate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col p-4 md:p-8 items-center justify-center relative overflow-hidden">
      
      {phase === 'menu' && (
        <div className="z-10 text-center space-y-8 max-w-lg w-full">
          <h2 className="text-4xl font-bold text-amber-600 mb-12 tracking-widest border-b-2 border-amber-900 pb-4 uppercase">
            Biological Classification
          </h2>
          <div className="space-y-4 flex flex-col">
            <button onClick={startSimulation} className="btn-industrial">
              Start as a marine life
            </button>
            <button disabled className="btn-industrial opacity-50 cursor-not-allowed">
              Start as a mammal (Locked)
            </button>
            <button onClick={() => onNavigate(View.HOME)} className="btn-industrial border-zinc-700">
              Return Home
            </button>
          </div>
          <p className="text-xs text-zinc-600 italic">
            "Stable asset mode initialized. Pure mechanical environment."
          </p>
        </div>
      )}

      {phase === 'loading' && (
        <div className="z-10 w-full max-w-4xl bg-black border-4 border-zinc-900 p-8 aspect-video flex flex-col items-center justify-center">
          <p className="text-amber-600 font-mono text-xs mb-4 animate-pulse">{loadingStep}</p>
          <div className="h-1 w-64 bg-zinc-900 overflow-hidden">
            <div className="h-full bg-amber-600 animate-[loading_1.5s_infinite]"></div>
          </div>
          <style>{`@keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
        </div>
      )}

      {phase === 'active' && (
        <div className="z-10 w-full max-w-6xl flex flex-col relative">
          <div className="relative border-4 border-zinc-800 bg-black aspect-video shadow-2xl">
             <canvas 
                ref={canvasRef} 
                width={CANVAS_WIDTH} 
                height={CANVAS_HEIGHT} 
                className="w-full h-full object-cover" 
                style={{ imageRendering: 'pixelated' }}
             />

             <div className="absolute top-4 right-4 pointer-events-none text-zinc-600 font-mono text-[9px] uppercase bg-black/40 px-2">
                Status: Local_Asset_Archive
             </div>

             <div className="absolute top-4 left-4 font-mono text-[10px] text-zinc-500 flex flex-col gap-1 pointer-events-none bg-black/40 p-2 backdrop-blur-sm border border-zinc-800">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full"></div>
                   <span className="font-bold">LIVE_FEED: SCHOOL_WORKSHOP</span>
                </div>
                <span>COORD: {Math.round(playerPos.x)}, {Math.round(playerPos.y)}</span>
             </div>
          </div>
          
          <div className="flex justify-between items-center p-4">
            <span className="text-[10px] text-zinc-500 font-mono">WASD TO MOVE // ESC TO TERMINATE</span>
            <button onClick={() => setPhase('menu')} className="text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase underline underline-offset-4">
              Terminate Simulation
            </button>
          </div>
        </div>
      )}

      {phase === 'transitioning' && (
        <div className="z-20 fixed inset-0 bg-black flex flex-col items-center justify-center">
           <h3 className="text-amber-600 font-mono text-4xl font-bold tracking-[0.5em] animate-pulse">CORRIDOR_ACCESS</h3>
           <p className="text-zinc-600 text-xs mt-4">LEAVING WORKSHOP...</p>
           <button onClick={() => { setPhase('active'); setPlayerPos({ x: 100, y: 360 }); }} className="mt-12 btn-industrial border-amber-600 text-amber-600">
              Proceed
           </button>
        </div>
      )}
    </div>
  );
};

export default RPG;
