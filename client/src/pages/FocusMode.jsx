import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';

const FocusMode = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            if (minutes === 0) {
              clearInterval(intervalRef.current);
              setIsRunning(false);
              // Switch mode
              if (mode === 'focus') {
                setMode('break');
                setMinutes(5);
              } else {
                setMode('focus');
                setMinutes(25);
              }
              return 0;
            }
            setMinutes(m => m - 1);
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, minutes, mode]);

  const reset = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    if (mode === 'focus') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const setFocusMode = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setMode('focus');
    setMinutes(25);
    setSeconds(0);
  };

  const setBreakMode = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setMode('break');
    setMinutes(5);
    setSeconds(0);
  };

  const pad = (n) => n.toString().padStart(2, '0');

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Focus Mode</h1>
        <p className="text-gray-500 mt-1">Stay productive with timed focus sessions.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={setFocusMode}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              mode === 'focus' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Target size={18} /> Focus
          </button>
          <button
            onClick={setBreakMode}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              mode === 'break' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Coffee size={18} /> Break
          </button>
        </div>

        {/* Timer Display */}
        <div className={`text-8xl font-bold tracking-tight mb-10 ${mode === 'focus' ? 'text-orange-600' : 'text-emerald-600'}`}>
          {pad(minutes)}:{pad(seconds)}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold text-lg transition-colors ${
              mode === 'focus'
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {isRunning ? <Pause size={22} /> : <Play size={22} />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-lg transition-colors"
          >
            <RotateCcw size={20} /> Reset
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          {mode === 'focus' ? '25 min focus → 5 min break' : 'Take a short break, then get back to work!'}
        </p>
      </div>
    </div>
  );
};

export default FocusMode;
