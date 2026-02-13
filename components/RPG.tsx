
import React, { useState } from 'react';
import { View } from '../types';

interface RPGProps {
  onNavigate: (view: View) => void;
}

const RPG: React.FC<RPGProps> = ({ onNavigate }) => {
  const [phase, setPhase] = useState<'menu' | 'playing'>('menu');

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col p-8 items-center justify-center relative overflow-hidden">
      {/* Gritty background texture simulation */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://picsum.photos/1000/1000?grayscale')] bg-cover mix-blend-overlay"></div>

      {phase === 'menu' ? (
        <div className="z-10 text-center space-y-8 max-w-lg w-full">
          <h2 className="text-4xl font-bold text-amber-600 mb-12 tracking-widest border-b-2 border-amber-900 pb-4">
            BIOLOGICAL CLASSIFICATION
          </h2>
          <div className="space-y-4 flex flex-col">
            <button onClick={() => setPhase('playing')} className="btn-industrial">
              Start as a Marine Life (Octopus)
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
      ) : (
        <div className="z-10 w-full max-w-4xl bg-black border-4 border-zinc-800 p-4 aspect-video flex flex-col relative">
          <div className="flex-1 border-2 border-zinc-900 flex items-center justify-center relative">
            {/* Simulation Viewport */}
            <div className="text-amber-500 font-mono text-center">
              <div className="text-6xl mb-4">🐙</div>
              <p className="animate-pulse">SIMULATION INITIALIZED...</p>
              <p className="text-xs mt-2 text-zinc-600">POV: CEPHALOPOD OPERATOR</p>
            </div>
            
            {/* Hud elements */}
            <div className="absolute top-4 left-4 text-[10px] text-red-900">
              HP: [||||||||||] 100%
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] text-green-900">
              DEPTH: 402m
            </div>
          </div>
          
          <div className="h-24 bg-zinc-900 mt-4 p-4 flex items-center justify-between">
            <div className="text-zinc-500 text-sm">
              You feel the pressure of the hierarchy above. Eight arms aren't enough to fix the design flaws.
            </div>
            <button onClick={() => setPhase('menu')} className="btn-industrial text-xs py-2 px-4">
              Abort
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RPG;
