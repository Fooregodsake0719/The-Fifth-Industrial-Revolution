
import React from 'react';
import { View } from '../types';

interface GalleryProps {
  onNavigate: (view: View) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onNavigate }) => {
  const items = [
    { title: "Planetary Gearset", desc: "A complex distribution system of power.", img: "https://picsum.photos/600/400?random=1" },
    { title: "Hydraulic Press", desc: "Absolute authority through fluid pressure.", img: "https://picsum.photos/600/400?random=2" },
    { title: "Mechanical Heart", desc: "Clockwork precision of life itself.", img: "https://picsum.photos/600/400?random=3" },
    { title: "Differential Axle", desc: "Negotiating direction between two sides.", img: "https://picsum.photos/600/400?random=4" },
    { title: "Steam Governor", desc: "Self-regulating hierarchy of speed.", img: "https://picsum.photos/600/400?random=5" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-8 flex flex-col">
      <header className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold text-amber-600 tracking-widest uppercase">
          Mechanical Reverie
        </h2>
        <button onClick={() => onNavigate(View.HOME)} className="btn-industrial text-xs">
          Home
        </button>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center space-x-8 pb-12 snap-x">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 w-80 md:w-96 snap-center group cursor-pointer"
          >
            <div className="relative border-4 border-zinc-800 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <img src={item.img} alt={item.title} className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4">
                <p className="text-[10px] text-amber-500 font-mono">SPEC_ID: 00{idx + 1}</p>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">{item.title}</h3>
              </div>
            </div>
            <p className="mt-4 text-zinc-500 text-sm italic leading-snug">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
      
      <div className="text-center text-zinc-700 text-[10px] uppercase tracking-[0.5em] animate-pulse">
        Scroll horizontally to witness the evolution
      </div>
    </div>
  );
};

export default Gallery;
