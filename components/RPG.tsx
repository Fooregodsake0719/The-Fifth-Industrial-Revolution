
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View } from '../types';
import { GoogleGenAI } from "@google/genai";

interface RPGProps {
  onNavigate: (view: View) => void;
}

const RPG: React.FC<RPGProps> = ({ onNavigate }) => {
  const [phase, setPhase] = useState<'menu' | 'loading' | 'active' | 'transitioning'>('menu');
  const [loadingStep, setLoadingStep] = useState<string>("Initializing Neural Link...");
  const [playerPos, setPlayerPos] = useState({ x: 300, y: 300 });
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [octopusSprite, setOctopusSprite] = useState<HTMLImageElement | null>(null);
  
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

  // Chroma Key: Remove white background from generated sprite
  const makeTransparent = (img: HTMLImageElement): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(img);
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        // Target white/near-white pixels
        if (r > 230 && g > 230 && b > 230) {
          data[i + 3] = 0; // Set Alpha to 0
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const newImg = new Image();
      newImg.onload = () => resolve(newImg);
      newImg.src = canvas.toDataURL();
    });
  };

  const generateAssets = async () => {
    setPhase('loading');
    setLoadingStep("Mapping Workshop Interior...");
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 1. Generate Bright School Workshop Background
      const bgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{
          parts: [{
            text: "Top-down 2D pixel art of a bright school engineering workshop. High-key lighting, bright overhead lamps. Floor: white matte tiles with light grey grout. TOP EDGE: A row of windows with bright daylight. TOP-LEFT: scattered silver aluminum profiles and metal corner brackets. RIGHT SIDE: Piles of white bubble wrap packaging. BOTTOM-LEFT: A metal cutting machine (chop saw) and a small orange angle grinder on the tiles. BOTTOM-RIGHT: A wooden door. Clean industrial 2D map."
          }]
        }],
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      setLoadingStep("Configuring Cartoon Lifeforms...");

      // 2. Generate Cute Cartoon Octopus
      const spriteResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{
          parts: [{
            text: "Cute cartoon 2D pixel art octopus, top-down view, vibrant pink, simple clean shapes, friendly big eyes. PURE WHITE background, no shadows, no gradient, centered game sprite."
          }]
        }],
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      const bgData = bgResponse.candidates?.[0]?.content.parts.find(p => p.inlineData)?.inlineData?.data;
      const spriteData = spriteResponse.candidates?.[0]?.content.parts.find(p => p.inlineData)?.inlineData?.data;

      if (bgData && spriteData) {
        const bgImg = new Image();
        const rawSprite = new Image();
        
        await new Promise<void>((resolve) => {
          bgImg.onload = () => resolve();
          bgImg.src = `data:image/png;base64,${bgData}`;
        });

        await new Promise<void>((resolve) => {
          rawSprite.onload = () => resolve();
          rawSprite.src = `data:image/png;base64,${spriteData}`;
        });

        const transparentOctopus = await makeTransparent(rawSprite);
        
        setBgImage(bgImg);
        setOctopusSprite(transparentOctopus);
      }
      
      setLoadingStep("Environment Synced.");
      setTimeout(() => setPhase('active'), 1000);

    } catch (error) {
      console.error("Asset generation failed:", error);
      setLoadingStep("Warning: Neural Link Unstable...");
      setTimeout(() => setPhase('active'), 1500);
    }
  };

  const draw2DSimulation = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, pX: number, pY: number) => {
    // 1. Base floor
    ctx.fillStyle = '#fdfdfd';
    ctx.fillRect(0, 0, width, height);

    if (bgImage) {
      ctx.drawImage(bgImage, 0, 0, width, height);
    } else {
      // Procedural fallback
      ctx.strokeStyle = '#eeeeee';
      for(let x=0; x<width; x+=64) ctx.strokeRect(x, 0, 1, height);
      for(let y=0; y<height; y+=64) ctx.strokeRect(0, y, width, 1);
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(DOOR_HITBOX.x, DOOR_HITBOX.y, DOOR_HITBOX.w, DOOR_HITBOX.h);
    }

    // 2. Character Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.ellipse(pX, pY + 20, 25, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Octopus Sprite
    if (octopusSprite) {
      const size = 96;
      const bounce = Math.sin(Date.now() / 180) * 5;
      ctx.drawImage(octopusSprite, pX - size/2, pY - size/2 + bounce, size, size);
    } else {
      ctx.font = '50px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐙', pX, pY);
    }

    // 4. Overbright Glow (From top windows)
    const gradient = ctx.createLinearGradient(0, 0, 0, 120);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 120);

    // 5. Aesthetic Grain (Lightened for bright room)
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
      data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

  }, [bgImage, octopusSprite]);

  const animate = useCallback(() => {
    if (phase !== 'active') return;

    setPlayerPos(prev => {
      let nx = prev.x;
      let ny = prev.y;
      
      if (keys.current.has('w')) ny -= PLAYER_SPEED;
      if (keys.current.has('s')) ny += PLAYER_SPEED;
      if (keys.current.has('a')) nx -= PLAYER_SPEED;
      if (keys.current.has('d')) nx += PLAYER_SPEED;

      // Door Check
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
      if (ctx) {
        draw2DSimulation(ctx, canvasRef.current.width, canvasRef.current.height, playerPos.x, playerPos.y);
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [phase, playerPos, draw2DSimulation]);

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
      
      {phase === 'menu' && (
        <div className="z-10 text-center space-y-8 max-w-lg w-full">
          <h2 className="text-4xl font-bold text-amber-600 mb-12 tracking-widest border-b-2 border-amber-900 pb-4">
            BIOLOGICAL CLASSIFICATION
          </h2>
          <div className="space-y-4 flex flex-col">
            <button onClick={generateAssets} className="btn-industrial">
              Start as a Marine Life
            </button>
            <button disabled className="btn-industrial opacity-50 cursor-not-allowed">
              Start as a Mammal (Locked)
            </button>
            <button onClick={() => onNavigate(View.HOME)} className="btn-industrial border-zinc-700">
              Return Home
            </button>
          </div>
          <p className="text-xs text-zinc-600 italic">
            "Enter the workshop. The lights are waiting."
          </p>
        </div>
      )}

      {phase === 'loading' && (
        <div className="z-10 w-full max-w-4xl bg-black border-4 border-zinc-900 p-8 aspect-video flex flex-col items-center justify-center shadow-[0_0_100px_rgba(0,0,0,1)]">
          <div className="w-full max-w-md">
            <div className="flex justify-between items-end mb-2">
              <p className="text-amber-600 font-mono text-xs uppercase tracking-tighter">{loadingStep}</p>
              <p className="text-zinc-600 font-mono text-[10px]">VER: 6.0.0-BRIGHT</p>
            </div>
            <div className="h-2 w-full bg-zinc-900 overflow-hidden border border-zinc-800">
              <div className="h-full bg-amber-600 animate-[loading_2s_ease-in-out_infinite]" style={{width: '45%'}}></div>
            </div>
          </div>
          <div className="mt-8 text-zinc-700 text-[9px] uppercase tracking-[0.4em] animate-pulse">
            Neural Overdrive: Illuminating Matrix...
          </div>
          <style>{`
            @keyframes loading {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(400%); }
            }
          `}</style>
        </div>
      )}

      {phase === 'active' && (
        <div className="z-10 w-full max-w-6xl h-full flex flex-col relative group">
          <div className="relative flex-1 border-4 border-zinc-800 bg-white overflow-hidden aspect-video shadow-[0_0_40px_rgba(255,255,255,0.1)]">
             <canvas 
                ref={canvasRef} 
                width={CANVAS_WIDTH} 
                height={CANVAS_HEIGHT} 
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
             />
             
             {/* HUD Interface */}
             <div className="absolute top-4 left-4 font-mono text-[10px] text-zinc-500 flex flex-col gap-1 pointer-events-none bg-white/40 p-2 backdrop-blur-sm border border-zinc-200">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full"></div>
                   <span className="font-bold">LIVE_FEED: SCHOOL_WORKSHOP_01</span>
                </div>
                <span>PLAYER: PIXEL_OCTO</span>
                <span>COORD: {Math.round(playerPos.x)}, {Math.round(playerPos.y)}</span>
             </div>

             <div className="absolute bottom-4 right-4 font-mono text-[9px] text-zinc-900 uppercase tracking-widest pointer-events-none bg-amber-500 px-3 py-1 font-bold shadow-lg border-2 border-amber-600">
                EXIT TO CORRIDOR
             </div>
          </div>
          
          <div className="flex justify-between items-center p-2">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">WASD TO MOVE // BRIGHTNESS MAX</span>
            <button 
              onClick={() => {
                setPhase('menu');
                setBgImage(null);
                setOctopusSprite(null);
              }} 
              className="btn-industrial text-[10px] py-1 px-4 border-zinc-300"
            >
              Terminate Link [ESC]
            </button>
          </div>
        </div>
      )}

      {phase === 'transitioning' && (
        <div className="z-20 fixed inset-0 bg-black flex flex-col items-center justify-center animate-in fade-in duration-1000">
           <div className="text-amber-600 font-mono text-center space-y-6">
              <h3 className="text-4xl font-bold tracking-[0.5em] animate-pulse">CORRIDOR ACCESS...</h3>
              <p className="text-xs text-zinc-600 uppercase">Updating Map: SCHOOL_WING_B_HALLWAY</p>
              <button 
                onClick={() => {
                   setPhase('active');
                   setPlayerPos({ x: 100, y: 360 });
                }} 
                className="mt-12 btn-industrial border-amber-600 text-amber-600"
              >
                Proceed to Hallway
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default RPG;
