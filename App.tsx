
import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import MainMenu from './components/MainMenu';
import { GameState } from './types';
import { LEVELS } from './levels/index';
import { CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [menuInitialView, setMenuInitialView] = useState<'MAIN' | 'SELECT'>('MAIN');

  const handleStartLevel = (id: number) => {
    setCurrentLevelId(id);
    setGameState('PLAYING');
  };

  const handleLevelComplete = () => {
    if (!completedLevels.includes(currentLevelId)) {
      setCompletedLevels(prev => [...prev, currentLevelId]);
    }
    
    const isLastLevel = currentLevelId === LEVELS[LEVELS.length - 1].id;
    
    if (isLastLevel) {
      setGameState('COMPLETED_GAME');
    } else {
      setGameState('WON_LEVEL');
    }
  };

  const handleBackToMenu = () => {
    setMenuInitialView('MAIN');
    setGameState('MENU');
  };

  const handleUnlockAllLevels = () => {
    // Add all level IDs to completed list
    const allIds = LEVELS.map(l => l.id);
    setCompletedLevels(allIds);
  };

  const currentLevelName = LEVELS.find(l => l.id === currentLevelId)?.name || "UNKNOWN_SECTOR";

  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-[10%] left-[5%] w-64 h-64 border border-[#ff00ff] rounded-full blur-3xl"></div>
         <div className="absolute bottom-[10%] right-[5%] w-96 h-96 border border-[#00f3ff] rounded-full blur-3xl"></div>
         <div className="grid-bg w-full h-full opacity-10"></div>
      </div>

      <div className="z-10 w-full h-full">
        {gameState === 'MENU' && (
          <MainMenu 
            onStartLevel={handleStartLevel} 
            completedLevels={completedLevels}
            initialView={menuInitialView}
            onUnlockAllLevels={handleUnlockAllLevels}
          />
        )}

        {gameState === 'PLAYING' && (
          <GameCanvas 
            levelId={currentLevelId} 
            onLevelComplete={handleLevelComplete}
            onBackToMenu={handleBackToMenu}
          />
        )}

        {gameState === 'WON_LEVEL' && (
           <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-300 z-20 bg-black/80 absolute inset-0 backdrop-blur-sm">
             <div className="relative border-4 border-[#39ff14] p-12 bg-black/90 shadow-[0_0_50px_rgba(57,255,20,0.3)] max-w-lg w-full mx-4">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black px-4 text-[#39ff14]">
                  <CheckCircle size={48} className="animate-bounce" />
                </div>
                
                <h2 className="text-[#39ff14] text-xl font-mono tracking-widest mb-2">MISSION STATUS: SUCCESS</h2>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-2 uppercase tracking-tighter">
                  SECTOR {String(currentLevelId).padStart(2, '0')}
                </h1>
                <p className="text-[#39ff14] font-bold text-2xl mb-8 font-mono">{currentLevelName}</p>
                
                <div className="w-full h-px bg-[#39ff14] mb-8 opacity-50"></div>

                <p className="text-gray-400 font-mono text-sm mb-8">
                  DATA SYNCHRONIZED...<br/>
                  PROGRESS SAVED...
                </p>
                
                <button 
                  onClick={() => {
                    setMenuInitialView('SELECT');
                    setGameState('MENU');
                  }}
                  className="w-full py-4 border-2 border-[#39ff14] text-[#39ff14] font-bold uppercase tracking-widest hover:bg-[#39ff14] hover:text-black transition-all hover:shadow-[0_0_20px_#39ff14]"
                >
                  Return to Terminal
                </button>
             </div>
           </div>
        )}

        {gameState === 'COMPLETED_GAME' && (
           <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-500 bg-black/90 absolute inset-0">
             <div className="p-8 border-4 border-[#fcee0a] shadow-[0_0_60px_rgba(252,238,10,0.4)] bg-black">
                <h1 className="text-6xl font-black text-[#fcee0a] neon-text mb-4">SYSTEM CONQUERED</h1>
                <p className="text-[#e0e0e0] text-xl max-w-md font-mono mb-8">
                  All sectors cleared.<br/>The system has been rebooted.
                </p>
                <button 
                  onClick={() => {
                    setMenuInitialView('SELECT');
                    setGameState('MENU');
                  }}
                  className="px-8 py-3 bg-[#00f3ff] text-black font-bold uppercase hover:bg-white transition-colors w-full"
                >
                  Return to Terminal
                </button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default App;
