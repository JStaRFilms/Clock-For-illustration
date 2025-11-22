import React, { useState } from 'react';
import { TimeState } from '../types';
import { Clock, Sparkles, Download, Eye, Play, Pause, RotateCcw, Loader2 } from 'lucide-react';
import { parseTimeFromNaturalLanguage } from '../services/geminiService';

interface ControlsProps {
  time: TimeState;
  onTimeChange: (time: TimeState) => void;
  isRealTime: boolean;
  setIsRealTime: (isRealTime: boolean) => void;
  onToggleZenMode: () => void;
  onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  time,
  onTimeChange,
  isRealTime,
  setIsRealTime,
  onToggleZenMode,
  onReset
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSliderChange = (key: keyof TimeState, value: number) => {
    onTimeChange({ ...time, [key]: value });
    if (isRealTime) setIsRealTime(false);
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsRealTime(false);
    setIsAiLoading(true);
    try {
      const newTime = await parseTimeFromNaturalLanguage(aiPrompt);
      if (newTime) {
        onTimeChange(newTime);
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  // Format for digital display
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-slate-700 flex flex-col gap-6 w-full max-w-md">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          Control Panel
        </h2>
        <div className="flex gap-2">
           <button 
            onClick={onReset}
            className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Reset to Now"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
           <button 
            onClick={() => setIsRealTime(!isRealTime)}
            className={`p-2 rounded-full transition-colors ${isRealTime ? 'bg-green-500/20 text-green-400' : 'hover:bg-slate-700 text-slate-400'}`}
            title={isRealTime ? "Pause Time" : "Resume Real Time"}
          >
            {isRealTime ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Digital Display */}
      <div className="text-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <span className="text-4xl font-mono font-medium tracking-wider text-sky-300">
          {pad(time.hours)}:{pad(time.minutes)}<span className="text-sky-300/50">:{pad(time.seconds)}</span>
        </span>
      </div>

      {/* Manual Sliders */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
            <span>Hour</span>
            <span>{pad(time.hours)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="23"
            value={time.hours}
            onChange={(e) => handleSliderChange('hours', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
            <span>Minute</span>
            <span>{pad(time.minutes)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="59"
            value={time.minutes}
            onChange={(e) => handleSliderChange('minutes', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
            <span>Second</span>
            <span>{pad(time.seconds)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="59"
            value={time.seconds}
            onChange={(e) => handleSliderChange('seconds', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>
      </div>

      {/* AI Input */}
      <div className="pt-4 border-t border-slate-700">
        <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
          AI Time Setter
        </label>
        <form onSubmit={handleAiSubmit} className="relative">
          <input 
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder='e.g. "10 minutes to midnight"'
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-white placeholder-slate-500"
          />
          <button 
            type="submit"
            disabled={isAiLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <button
          onClick={onToggleZenMode}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          Zen Mode
        </button>
        <div className="relative group">
           <button
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all text-sm font-medium"
            onClick={onToggleZenMode} // Re-using zen mode toggle as the "screenshot prep" action
          >
            <Download className="w-4 h-4" />
            Screenshot
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-black text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Enter Zen Mode to capture
          </div>
        </div>
      </div>

    </div>
  );
};