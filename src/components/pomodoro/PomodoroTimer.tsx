import { useState, useEffect } from "react";
import { useTimer } from "../../hooks/useTimer";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

type Mode = 'focus' | 'shortBreak' | 'longBreak';
const MODE_TIMES = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

interface PomodoroTimerProps {
  isDark: boolean;
  initialTime?: number;
  currentMode?: Mode; // App.tsx'den gelen gerçek mod
  onFinish?: () => void;
  autoStart?: boolean;
}

export function PomodoroTimer({ isDark, initialTime, currentMode, onFinish, autoStart }: PomodoroTimerProps) {
  const [mode, setMode] = useState<Mode>('focus');

  const { timeLeft, isActive, toggle, reset, setTimeLeft, setIsActive } = useTimer(
    initialTime || MODE_TIMES.focus,
    onFinish
  );

  // --- QUEUE VE MANUEL SENKRONİZASYONU ---
  useEffect(() => {
    if (currentMode) {
      // Eğer Queue üzerinden bir mod gelmişse (Focus/Break), onu set et
      setMode(currentMode);
    } else if (initialTime) {
      // Eğer Queue yoksa ama süre mola sürelerinden biriyse tahmin et (Yedek mekanizma)
      if (initialTime === MODE_TIMES.shortBreak) setMode('shortBreak');
      else if (initialTime === MODE_TIMES.longBreak) setMode('longBreak');
      else setMode('focus');
    }

    if (autoStart && initialTime) {
      setIsActive(true);
    }
  }, [initialTime, currentMode, autoStart, setIsActive]);

  // --- TAB BAŞLIĞI GÜNCELLEME ---
  useEffect(() => {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    const timeStr = `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    const label = mode === 'focus' ? 'Focus' : 'Break';

    if (timeLeft === 0) {
      // İstediğin gibi: Süre bittiğinde başlık sabitlenir
      document.title = "Pomodoro Timer";
    } else {
      // (00:02) Focus veya (05:00) Break
      document.title = `(${timeStr}) ${label}`;
    }

    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = mode === 'focus' ? '/focus-icon.png' : '/break-icon.png';
    }
  }, [timeLeft, mode]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    reset(MODE_TIMES[newMode]);
  };

  const handleManual = (type: 'h' | 'm' | 's', val: number) => {
    let newTotal = 0;
    const currentM = Math.floor((timeLeft % 3600) / 60);
    const currentS = timeLeft % 60;
    const currentH = Math.floor(timeLeft / 3600);

    if (type === 'h') newTotal = val * 3600 + currentM * 60 + currentS;
    else if (type === 'm') newTotal = currentH * 3600 + val * 60 + currentS;
    else if (type === 's') newTotal = currentH * 3600 + currentM * 60 + val;

    setTimeLeft(newTotal);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className={`flex gap-1 mb-8 p-1.5 rounded-2xl border transition-all duration-500 z-10 relative
        ${isDark ? 'bg-slate-900/40 border-white/10 backdrop-blur-xl' : 'bg-white/60 border-black/5 shadow-sm backdrop-blur-md'}`}>

        <Button
          variant={mode === 'focus' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleModeChange('focus')}
          className={`flex-1 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300
            ${mode === 'focus' ? 'shadow-lg bg-blue-600 text-white' : 'hover:bg-slate-500/10'}`}
        >
          Focus
        </Button>

        <Button
          variant={mode === 'shortBreak' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleModeChange('shortBreak')}
          className={`flex-1 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300
            ${mode === 'shortBreak' ? 'shadow-lg bg-blue-600 text-white' : 'hover:bg-slate-500/10'}`}
        >
          Short Break
        </Button>

        <Button
          variant={mode === 'longBreak' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleModeChange('longBreak')}
          className={`flex-1 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300
            ${mode === 'longBreak' ? 'shadow-lg bg-blue-600 text-white' : 'hover:bg-slate-500/10'}`}
        >
          Long Break
        </Button>
      </div>

      <Card
        displayTime={`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}
        isActive={isActive}
        onToggle={toggle}
        onReset={() => reset(initialTime || MODE_TIMES[mode])}
        onManualChange={handleManual}
        isDark={isDark}
      />
    </div>
  );
}