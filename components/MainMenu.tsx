
import React, { useState, useEffect } from 'react';
import { Play, Trophy, Cpu, Maximize, Minimize } from 'lucide-react';
import { LEVELS } from '../levels/index';

interface MainMenuProps {
  onStartLevel: (id: number) => void;
  completedLevels: number[];
  initialView?: 'MAIN' | 'SELECT';
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartLevel, completedLevels, initialView = 'MAIN' }) => {
  const [view, setView] = useState<'MAIN' | 'SELECT'>(initialView);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  if (view === 'MAIN') {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-12 z-10 relative">
        <button 
          onClick={toggleFullscreen}
          className="absolute top-8 right-8 text-[#00f3ff] hover:text-white transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize size={32} /> : <Maximize size={32} />}
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] via-[#ff00ff] to-[#00f3ff] animate-pulse neon-text tracking-tighter">
            CYBER<br/>GLITCH
          </h1>
          <p className="text-[#e0e0e0] text-xl tracking-[0.5em] uppercase border-t border-b border-[#00f3ff] py-2">
            Level Zero Protocol
          </p>
        </div>

        <div className="flex flex-col gap-4 w-64">
          <button 
            onClick={() => setView('SELECT')}
            className="group relative px-8 py-4 bg-transparent border-2 border-[#00f3ff] text-[#00f3ff] font-bold text-xl uppercase tracking-widest overflow-hidden hover:text-black transition-colors duration-300"
          >
            <span className="absolute inset-0 w-0 bg-[#00f3ff] transition-all duration-[250ms] ease-out group-hover:w-full"></span>
            <span className="relative flex items-center justify-center gap-2">
              <Play size={20} /> Start Game
            </span>
          </button>
          
          <div className="text-center text-xs text-gray-600 mt-8 font-mono">
            V.1.0.4 // UNSTABLE_BUILD
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 z-10 relative">
       <button 
          onClick={() => setView('MAIN')} 
          className="absolute top-8 left-8 text-[#00f3ff] hover:text-white uppercase tracking-widest"
        >
          &lt; Back
      </button>

      <button 
          onClick={toggleFullscreen}
          className="absolute top-8 right-8 text-[#00f3ff] hover:text-white transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize size={32} /> : <Maximize size={32} />}
      </button>

      <h2 className="text-4xl text-[#00f3ff] font-bold mb-12 tracking-widest border-b-2 border-[#ff00ff] pb-2">
        SELECT SECTOR
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {LEVELS.map((level) => {
          const isLocked = level.id > 1 && !completedLevels.includes(level.id - 1);
          
          return (
            <button
              key={level.id}
              onClick={() => !isLocked && onStartLevel(level.id)}
              disabled={isLocked}
              className={`
                relative w-48 h-64 border-2 flex flex-col items-center justify-center gap-4 transition-all duration-300
                ${isLocked 
                  ? 'border-gray-800 text-gray-800 cursor-not-allowed bg-black' 
                  : 'border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff]/10 hover:shadow-[0_0_30px_#00f3ff] hover:-translate-y-2'
                }
              `}
            >
              {isLocked ? (
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black mb-2">LOCKED</span>
                  <div className="w-8 h-1 bg-gray-800"></div>
                </div>
              ) : (
                <>
                  <div className="text-6xl font-black opacity-50">{String(level.id).padStart(2, '0')}</div>
                  <div className="text-sm tracking-widest uppercase px-2 text-center">{level.name}</div>
                  {completedLevels.includes(level.id) && (
                    <div className="absolute top-2 right-2 text-[#fcee0a]">
                      <Trophy size={16} />
                    </div>
                  )}
                  <div className="mt-4">
                     <Cpu size={32} />
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MainMenu;
