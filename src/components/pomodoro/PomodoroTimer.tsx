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
  initialTime?: number; // Saniye cinsinden
  onFinish?: () => void;
  autoStart?: boolean;
}

export function PomodoroTimer({ isDark, initialTime, onFinish, autoStart }: PomodoroTimerProps) {
  const [mode, setMode] = useState<Mode>('focus');

  // Düzeltme: Sabit 25 yerine dışarıdan gelen initialTime kullanılıyor
  const { timeLeft, isActive, toggle, reset, setTimeLeft, setIsActive } = useTimer(
    initialTime || MODE_TIMES.focus,
    onFinish
  );

  // Yeni program oluşturulduğunda veya seans değiştiğinde otomatik başlatma
  useEffect(() => {
    if (autoStart && initialTime) {
      setIsActive(true);
    }
  }, [initialTime, autoStart, setIsActive]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    reset(MODE_TIMES[newMode]);
  };

  const currentH = Math.floor(timeLeft / 3600);
  const currentM = Math.floor((timeLeft % 3600) / 60);
  const currentS = timeLeft % 60;

  const handleManual = (type: 'h' | 'm' | 's', val: number) => {
    let newTotal = 0;
    if (type === 'h') newTotal = val * 3600 + currentM * 60 + currentS;
    else if (type === 'm') newTotal = currentH * 3600 + val * 60 + currentS;
    else if (type === 's') newTotal = currentH * 3600 + currentM * 60 + val;
    setTimeLeft(newTotal);
  };

  const formatDisplay = () => {
    const hoursStr = currentH > 0 ? `${currentH.toString().padStart(2, '0')}:` : '';
    const minsStr = currentM.toString().padStart(2, '0');
    const secsStr = currentS.toString().padStart(2, '0');
    return `${hoursStr}${minsStr}:${secsStr}`;
  };

  useEffect(() => {
    const timeString = formatDisplay();

    if (isActive) {
      // Örn: "(24:59) Focus"
      document.title = `(${timeString}) ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
    } else {
      // Sayaç durduğunda sabit başlık
      document.title = "Pomodoro Focus";
    }

    // Bileşen kapandığında veya sayfa değiştiğinde başlığı temizle
    return () => {
      document.title = "Pomodoro App";
    };
  }, [timeLeft, isActive, mode]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className={`flex gap-1 mb-8 p-1.5 rounded-2xl border transition-all duration-500 z-10 relative
        ${isDark
          ? 'bg-slate-900/40 border-white/10 backdrop-blur-xl'
          : 'bg-white/60 border-black/5 shadow-sm backdrop-blur-md'}`}>

        <Button
          variant={mode === 'focus' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleModeChange('focus')}
          className={`flex-1 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300
            ${mode === 'focus'
              ? 'shadow-lg bg-blue-600 hover:bg-blue-500 text-white'
              : 'hover:bg-slate-500/10'}`}
        >
          Focus
        </Button>

        <Button
          variant={mode === 'shortBreak' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleModeChange('shortBreak')}
          className={`flex-1 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300
            ${mode === 'shortBreak'
              ? 'shadow-lg bg-blue-600 hover:bg-blue-500 text-white'
              : 'hover:bg-slate-500/10'}`}
        >
          Short Break
        </Button>

        <Button
          variant={mode === 'longBreak' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleModeChange('longBreak')}
          className={`flex-1 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300
            ${mode === 'longBreak'
              ? 'shadow-lg bg-blue-600 hover:bg-blue-500 text-white'
              : 'hover:bg-slate-500/10'}`}
        >
          Long Break
        </Button>
      </div>

      <Card
        displayTime={formatDisplay()}
        isActive={isActive}
        onToggle={toggle}
        onReset={() => reset(initialTime || MODE_TIMES[mode])}
        onManualChange={handleManual}
        isDark={isDark}
      />
    </div>
  );
}