
import React, { useState } from 'react';
import { View } from './types';
import Home from './components/Home';
import RPG from './components/RPG';
import Hierarchy from './components/Hierarchy';
import Gallery from './components/Gallery';
import Diary from './components/Diary';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [hasInitialized, setHasInitialized] = useState(false);

  const navigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return (
          <Home 
            onNavigate={navigate} 
            hasInitialized={hasInitialized} 
            onInitialize={() => setHasInitialized(true)} 
          />
        );
      case View.RPG:
        return <RPG onNavigate={navigate} />;
      case View.HIERARCHY:
        return <Hierarchy onNavigate={navigate} />;
      case View.GALLERY:
        return <Gallery onNavigate={navigate} />;
      case View.DIARY:
        return <Diary onNavigate={navigate} />;
      default:
        return (
          <Home 
            onNavigate={navigate} 
            hasInitialized={hasInitialized} 
            onInitialize={() => setHasInitialized(true)} 
          />
        );
    }
  };

  return (
    <div className="relative z-10 min-h-screen text-zinc-300 selection:bg-amber-500 selection:text-black">
      {renderView()}
    </div>
  );
};

export default App;
