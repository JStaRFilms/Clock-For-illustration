import React, { useState, useEffect, useCallback } from 'react';
import { TimeState, AppMode, ClockStyle } from './types';
import { DEFAULT_TIME, SWISS_STYLE, DARK_STYLE } from './constants';
import { Clock } from './components/Clock';
import { Controls } from './components/Controls';
import { X } from 'lucide-react';

const App: React.FC = () => {
  const [time, setTime] = useState<TimeState>(DEFAULT_TIME);
  const [isRealTime, setIsRealTime] = useState(true);
  const [appMode, setAppMode] = useState<AppMode>(AppMode.EDITOR);
  const [isDarkStyle, setIsDarkStyle] = useState(false);

  const currentStyle: ClockStyle = isDarkStyle ? DARK_STYLE : SWISS_STYLE;

  // Real-time ticker
  useEffect(() => {
    let interval: number;

    if (isRealTime) {
      // Initial set to ensure sync
      const now = new Date();
      setTime({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });

      interval = window.setInterval(() => {
        const now = new Date();
        setTime({
          hours: now.getHours(),
          minutes: now.getMinutes(),
          seconds: now.getSeconds(),
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRealTime]);

  const handleReset = useCallback(() => {
    setIsRealTime(true);
  }, []);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative transition-colors duration-500 ${isDarkStyle ? 'bg-slate-950' : 'bg-slate-200'}`}>
      
      {/* Background Decoration - Only visible in Editor */}
      {appMode === AppMode.EDITOR && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute top-[40%] right-[0%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[100px]"></div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className={`flex flex-col lg:flex-row items-center gap-12 z-10 transition-all duration-500 ${appMode === AppMode.ZEN ? 'scale-110' : ''}`}>
        
        {/* Clock Section */}
        <div className="relative group">
           <Clock 
             time={time} 
             style={currentStyle} 
             size={appMode === AppMode.ZEN ? 600 : 400} 
           />
           
           {/* Style Toggle (Floating near clock) - Only in Editor */}
           {appMode === AppMode.EDITOR && (
             <button
               onClick={() => setIsDarkStyle(!isDarkStyle)}
               className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-slate-500 hover:text-slate-900 hover:bg-white/20 transition-all border border-white/10"
             >
               {isDarkStyle ? 'Switch to Light' : 'Switch to Dark'}
             </button>
           )}
        </div>

        {/* Controls Section - Hidden in Zen Mode */}
        {appMode === AppMode.EDITOR && (
          <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-500">
            <Controls
              time={time}
              onTimeChange={setTime}
              isRealTime={isRealTime}
              setIsRealTime={setIsRealTime}
              onToggleZenMode={() => setAppMode(AppMode.ZEN)}
              onReset={handleReset}
            />
          </div>
        )}
      </div>

      {/* Zen Mode Exit Button */}
      {appMode === AppMode.ZEN && (
        <button
          onClick={() => setAppMode(AppMode.EDITOR)}
          className="fixed top-6 right-6 p-3 bg-slate-800/50 hover:bg-slate-800 text-white rounded-full backdrop-blur-md transition-all group"
        >
          <X className="w-6 h-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
            Exit Zen Mode (Press Esc)
          </span>
        </button>
      )}
      
      {/* Keyboard Listener for Esc */}
      {useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape' && appMode === AppMode.ZEN) {
            setAppMode(AppMode.EDITOR);
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [appMode]) as any}

    </div>
  );
};

export default App;