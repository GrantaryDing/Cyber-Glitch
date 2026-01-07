
import React, { useState, useEffect, useRef } from 'react';
import { Play, Trophy, Cpu, Maximize, Minimize, Terminal, X } from 'lucide-react';
import { LEVELS } from '../levels/index';

interface MainMenuProps {
  onStartLevel: (id: number) => void;
  completedLevels: number[];
  initialView?: 'MAIN' | 'SELECT';
  onUnlockAllLevels: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartLevel, completedLevels, initialView = 'MAIN', onUnlockAllLevels }) => {
  const [view, setView] = useState<'MAIN' | 'SELECT'>(initialView);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Dev Terminal State
  const [showDevTerminal, setShowDevTerminal] = useState(false);
  const [devCode, setDevCode] = useState('');
  const [terminalStatus, setTerminalStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Focus input when terminal opens
  useEffect(() => {
    if (showDevTerminal && inputRef.current) {
        inputRef.current.focus();
    }
  }, [showDevTerminal]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleDevAccess = () => {
    setShowDevTerminal(true);
    setTerminalStatus('IDLE');
    setDevCode('');
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (devCode.trim() === '090911') {
        setTerminalStatus('SUCCESS');
        onUnlockAllLevels();
        setTimeout(() => {
            setShowDevTerminal(false);
        }, 1500);
    } else {
        setTerminalStatus('ERROR');
        setDevCode('');
        setTimeout(() => setTerminalStatus('IDLE'), 2000);
    }
  };

  // Render Dev Terminal Modal
  const renderDevTerminal = () => {
    if (!showDevTerminal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md border-2 border-[#00f3ff] bg-black p-6 shadow-[0_0_50px_rgba(0,243,255,0.2)] font-mono relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
               onClick={() => setShowDevTerminal(false)}
               className="absolute top-2 right-2 text-[#00f3ff] hover:text-white transition-colors"
            >
               <X size={20} />
            </button>
    
            <div className="flex items-center gap-2 mb-6 text-[#00f3ff] border-b border-[#00f3ff] pb-2">
                <Terminal size={20} />
                <h3 className="text-xl font-bold tracking-widest">SYSTEM OVERRIDE</h3>
            </div>
    
            <form onSubmit={handleTerminalSubmit}>
                <div className="mb-4 h-16 flex flex-col justify-center">
                    {terminalStatus === 'IDLE' && <p className="text-gray-400 text-sm">ENTER SECURITY CREDENTIALS:</p>}
                    {terminalStatus === 'ERROR' && <p className="text-[#ff003c] font-bold animate-pulse">ERROR: ACCESS DENIED</p>}
                    {terminalStatus === 'SUCCESS' && <p className="text-[#39ff14] font-bold animate-pulse">SUCCESS: PRIVILEGES ESCALATED</p>}
                </div>
                
                <div className="flex items-center gap-2 bg-[#0a0a0a] p-3 border border-[#333] focus-within:border-[#00f3ff] transition-colors">
                    <span className="text-[#00f3ff] font-bold">{'>'}</span>
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={devCode}
                        onChange={(e) => setDevCode(e.target.value)}
                        className="bg-transparent border-none outline-none text-[#00f3ff] w-full font-mono uppercase tracking-wider placeholder-gray-800"
                        autoFocus
                        maxLength={10}
                        placeholder="______"
                        disabled={terminalStatus === 'SUCCESS'}
                    />
                    <span className="w-2 h-4 bg-[#00f3ff] animate-pulse"></span>
                </div>

                <div className="mt-4 text-[10px] text-gray-600 flex justify-between">
                    <span>SECURE CONNECTION</span>
                    <span>V.2.0.4</span>
                </div>
            </form>
        </div>
      </div>
    );
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
       {renderDevTerminal()}

       <button 
          onClick={() => setView('MAIN')} 
          className="absolute top-8 left-8 text-[#00f3ff] hover:text-white uppercase tracking-widest"
        >
          &lt; Back
      </button>

      {/* Developer Button Positioned Next to Fullscreen */}
      <button 
          onClick={handleDevAccess}
          className="absolute top-9 right-24 text-[#00f3ff] hover:text-white opacity-50 hover:opacity-100 transition-all text-xs font-mono border border-[#00f3ff] px-3 py-1 flex items-center gap-2 hover:bg-[#00f3ff]/10"
          title="Developer Override"
      >
          <Terminal size={12} />
          <span>DEV_ACCESS</span>
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
