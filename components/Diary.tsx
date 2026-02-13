
import React from 'react';
import { View } from '../types';

interface DiaryProps {
  onNavigate: (view: View) => void;
}

const Diary: React.FC<DiaryProps> = ({ onNavigate }) => {
  const logs = [
    { date: "2024-10-12", title: "THE FIRST BOLT", content: "Today we realized the octopus simulation is too efficient. We had to add bureaucratic delay to mimic reality. The arms kept trying to bypass the management group." },
    { date: "2024-11-05", title: "STRUCTURAL FAILURE", content: "The design group submitted a CAD that cannot be built. The assembly group is crying. Management is asking for a SWOT analysis instead of tools. Everything is as it should be." },
    { date: "2024-12-01", title: "LEVIATHAN AWAKENS", content: "The hierarchy is now a closed loop. No signal enters, no truth leaves. We have achieved engineering perfection through total administrative isolation." }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-8 flex flex-col">
      <header className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold text-amber-600 tracking-widest uppercase">
          Developer Records
        </h2>
        <button onClick={() => onNavigate(View.HOME)} className="btn-industrial text-xs">
          Home
        </button>
      </header>

      <div className="max-w-3xl mx-auto w-full space-y-12">
        {logs.map((log, idx) => (
          <article key={idx} className="border-l-2 border-amber-900 pl-8 relative">
            <div className="absolute w-4 h-4 bg-amber-600 left-[-9px] top-0 rounded-full border-4 border-zinc-950"></div>
            <span className="text-amber-700 font-mono text-xs">{log.date}</span>
            <h3 className="text-xl font-bold text-zinc-200 mt-2 mb-4 tracking-tight">{log.title}</h3>
            <p className="text-zinc-500 leading-relaxed font-mono text-sm whitespace-pre-wrap">
              {log.content}
            </p>
          </article>
        ))}
      </div>
      
      <div className="mt-auto pt-12 text-center text-[10px] text-zinc-800 uppercase tracking-widest">
        End of Transmission // Error 404: Conscience Not Found
      </div>
    </div>
  );
};

export default Diary;
