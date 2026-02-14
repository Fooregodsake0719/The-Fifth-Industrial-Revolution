
import React, { useState, useEffect, useRef } from 'react';
import { View } from '../types';
import { MECHANICAL_FACTS } from '../facts';

interface HomeProps {
  onNavigate: (view: View) => void;
  hasInitialized: boolean;
  onInitialize: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, hasInitialized, onInitialize }) => {
  const [subtitle, setSubtitle] = useState<string>("");
  const isMountedRef = useRef<boolean>(false);

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * MECHANICAL_FACTS.length);
    return MECHANICAL_FACTS[randomIndex];
  };

  const updateFact = () => {
    if (!isMountedRef.current) return;
    setSubtitle(getRandomFact());
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    if (hasInitialized) {
      updateFact();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [hasInitialized]);

  const handleStart = () => {
    onInitialize();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black">
      {!hasInitialized ? (
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-black text-zinc-500 mb-8 tracking-[0.3em] uppercase opacity-50">
            SYSTEM_OFFLINE
          </h1>
          <button 
            onClick={handleStart}
            className="btn-industrial text-2xl font-bold animate-pulse"
          >
            Initialize System
          </button>
        </div>
      ) : (
        <>
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-zinc-100 mb-2 tracking-[0.2em] uppercase filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              The Fifth Industrial Revolution
            </h1>
            <div className="h-1 w-full bg-amber-600 mb-4 opacity-70"></div>
            <p className="text-amber-500 text-xs tracking-[0.4em] uppercase font-bold opacity-80">
              Autonomous Mechanical Society // Protocol Active
            </p>
          </header>

          <div className="max-w-xl text-center mb-16 py-12 border-y border-zinc-800/50 w-full flex items-center justify-center min-h-[10rem]">
            <p className="text-zinc-400 font-mono text-sm md:text-base leading-relaxed uppercase tracking-tighter border-l-4 border-amber-900 pl-6 text-left max-w-lg">
              {subtitle}
            </p>
          </div>

          <nav className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button onClick={() => onNavigate(View.RPG)} className="btn-industrial font-bold">
              [ 01 ] Enter Simulation
            </button>
            <button onClick={() => onNavigate(View.HIERARCHY)} className="btn-industrial font-bold">
              [ 02 ] Structural Analysis
            </button>
            <button onClick={() => onNavigate(View.GALLERY)} className="btn-industrial font-bold">
              [ 03 ] Reverie Gallery
            </button>
            <button onClick={() => onNavigate(View.DIARY)} className="btn-industrial font-bold">
              [ 04 ] Developer Records
            </button>
          </nav>
          
          <footer className="mt-16 text-[9px] text-zinc-700 uppercase tracking-[0.5em] font-mono">
            Direct Data Stream Active // Pure Textual Interface // ME / EE / CS Focus
          </footer>
        </>
      )}
    </div>
  );
};

export default Home;
