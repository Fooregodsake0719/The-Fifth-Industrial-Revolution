
import React, { useState } from 'react';
import { View } from '../types';

interface HierarchyProps {
  onNavigate: (view: View) => void;
}

const Hierarchy: React.FC<HierarchyProps> = ({ onNavigate }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const groups = [
    {
      id: 'mgmt',
      name: 'Management (Administration)',
      sub: [
        { name: 'Finance', desc: 'Recording funds, purchase approvals, and business planning.' },
        { name: 'Equipment', desc: 'Cleaning workshops, organizing parts, and procurement liaison.' },
        { name: 'Schedule', desc: 'Time planning, task allocation, and progress updates.' }
      ]
    },
    {
      id: 'tech',
      name: 'Technical (Engineering)',
      sub: [
        { name: 'Design', desc: 'CAD modeling, sub-system integration (Intake, Shooter, Lift).' },
        { name: 'Assembly', desc: 'Physical construction following the CAD precisely.' },
        { name: 'Programming', desc: 'Coding, wiring, and operating during competition.' }
      ]
    },
    {
      id: 'promo',
      name: 'Promotion (Branding)',
      sub: [
        { name: 'Marketing', desc: 'Logos, team wear, and event documentation.' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-8 flex flex-col">
      <header className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold text-amber-600 tracking-widest uppercase">
          Structural Object Mapping
        </h2>
        <button onClick={() => onNavigate(View.HOME)} className="btn-industrial text-xs">
          Home
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {groups.map(group => (
          <div 
            key={group.id} 
            className={`border-2 p-6 transition-all cursor-pointer ${selectedGroup === group.id ? 'border-amber-500 bg-zinc-900' : 'border-zinc-800 bg-black hover:border-zinc-500'}`}
            onClick={() => setSelectedGroup(group.id)}
          >
            <h3 className="text-xl font-bold mb-6 text-zinc-100 uppercase border-b border-zinc-800 pb-2">{group.name}</h3>
            <div className="space-y-6">
              {group.sub.map(sub => (
                <div key={sub.name} className="group">
                  <h4 className="text-amber-500 text-sm font-bold uppercase mb-1">{sub.name}</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">{sub.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-amber-950/20 border border-amber-900 text-amber-500 text-sm italic">
        "Note: The hierarchy is an immutable object. Any attempt to modify inherited permissions from the Technical class will be rejected by the Management handler."
      </div>
    </div>
  );
};

export default Hierarchy;
