
import React, { useState, useEffect, useRef } from 'react';
import { View } from '../types';
import { speak, VoiceControl } from '../geminiService';
import Visualizer from './Visualizer';
import { MECHANICAL_FACTS } from '../facts';

interface HomeProps {
  onNavigate: (view: View) => void;
  hasInitialized: boolean;
  onInitialize: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, hasInitialized, onInitialize }) => {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [subtitle, setSubtitle] = useState<string>("");
  const voiceControlRef = useRef<VoiceControl | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * MECHANICAL_FACTS.length);
    return MECHANICAL_FACTS[randomIndex];
  };

  const playFact = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    try {
      const fact = getRandomFact();
      setSubtitle(fact);
      const control = await speak(fact, audioContextRef.current);
      voiceControlRef.current = control;
      setAnalyser(control.analyser);
    } catch (err) {
      console.error("Failed to play mechanical fact:", err);
    }
  };

  useEffect(() => {
    // If we've already initialized, play a fact immediately on mount
    if (hasInitialized) {
      playFact();
    }

    // Cleanup: Stop audio when leaving the home view
    return () => {
      if (voiceControlRef.current) {
        voiceControlRef.current.stop();
      }
    };
  }, [hasInitialized]);

  const handleStart = async () => {
    onInitialize(); // This will trigger the useEffect above via prop change
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black">
      {!hasInitialized ? (
        <button 
          onClick={handleStart}
          className="btn-industrial text-2xl font-bold animate-pulse"
        >
          Initialize System
        </button>
      ) : (
        <>
          <header className="mb-12 text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-zinc-100 mb-2 tracking-tighter filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              LEVIATHAN
            </h1>
            <div className="h-1 w-full bg-amber-600 mb-4"></div>
            <p className="text-amber-500 text-sm tracking-widest uppercase">Autonomous Mechanical Society v3.1.4</p>
          </header>

          <Visualizer analyser={analyser} />

          <div className="max-w-xl text-center mb-12 min-h-[4rem]">
            <p className="text-zinc-400 font-mono text-sm leading-relaxed uppercase tracking-tight">
              {subtitle}
            </p>
          </div>

          <nav className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button onClick={() => onNavigate(View.RPG)} className="btn-industrial">
              01. Enter Simulation (RPG)
            </button>
            <button onClick={() => onNavigate(View.HIERARCHY)} className="btn-industrial">
              02. Structure Analysis (Hierarchy)
            </button>
            <button onClick={() => onNavigate(View.GALLERY)} className="btn-industrial">
              03. Reverie Gallery
            </button>
            <button onClick={() => onNavigate(View.DIARY)} className="btn-industrial">
              04. Developer Records
            </button>
          </nav>
          
          <footer className="mt-16 text-[10px] text-zinc-700 uppercase tracking-widest">
            Warning: System output restricted to verified mechanical data.
          </footer>
        </>
      )}
    </div>
  );
};

export default Home;
