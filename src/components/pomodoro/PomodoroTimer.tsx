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
  currentMode?: Mode;
  onFinish?: () => void;
  autoStart?: boolean;
}

export function PomodoroTimer({ isDark, initialTime, currentMode, onFinish, autoStart }: PomodoroTimerProps) {
  const [mode, setMode] = useState<Mode>('focus');

  const { timeLeft, isActive, toggle, reset, setTimeLeft, setIsActive } = useTimer(
    initialTime || MODE_TIMES.focus,
    onFinish // NOT: useTimer içinde onFinish useEffect ile çağrılmalı
  );

  // --- QUEUE VE MOD SENKRONİZASYONU ---
  useEffect(() => {
    // State güncellemelerini tek bir effect içinde topluyoruz
    if (currentMode) {
      setMode(currentMode);
    } else if (initialTime) {
      if (initialTime === MODE_TIMES.shortBreak) setMode('shortBreak');
      else if (initialTime === MODE_TIMES.longBreak) setMode('longBreak');
      else setMode('focus');
    }

    if (autoStart && initialTime) {
      setIsActive(true);
    }
  }, [initialTime, currentMode, autoStart, setIsActive]);

  // --- TAB BAŞLIĞI VE İKON GÜNCELLEME ---
  useEffect(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    const label = mode === 'focus' ? 'Focus' : 'Break';

    if (timeLeft === 0) {
      document.title = "Pomodoro Timer";
    } else {
      document.title = `(${timeStr}) ${label}`;
    }

    // İkon güncelleme - her renderda querySelector yapmamak için kontrol
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      const newIcon = mode === 'focus' ? '/focus-icon.png' : '/break-icon.png';
      if (link.getAttribute('href') !== newIcon) {
        link.href = newIcon;
      }
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

        {(['focus', 'shortBreak', 'longBreak'] as const).map((m) => (
          <Button
            key={m}
            variant={mode === m ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange(m)}
            className={`flex-1 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300
              ${mode === m ? 'shadow-lg bg-blue-600 text-white' : 'hover:bg-slate-500/10'}`}
          >
            {m === 'shortBreak' ? 'Short Break' : m === 'longBreak' ? 'Long Break' : 'Focus'}
          </Button>
        ))}
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