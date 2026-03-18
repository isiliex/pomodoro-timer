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

// --- EMOJI FAVICON OLUŞTURUCU ---
const setEmojiFavicon = (emoji: string) => {
  const link = (document.querySelector("link[rel*='icon']") as HTMLLinkElement) || document.createElement('link');
  link.type = 'image/svg+xml';
  link.rel = 'shortcut icon';
  // SVG içine emojiyi gömüyoruz, böylece dış dosyaya gerek kalmıyor
  link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`;
  if (!document.querySelector("link[rel*='icon']")) {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
};

export function PomodoroTimer({ isDark, initialTime, currentMode, onFinish, autoStart }: PomodoroTimerProps) {
  const [mode, setMode] = useState<Mode>(currentMode || 'focus');

  const { timeLeft, isActive, toggle, reset, setTimeLeft, setIsActive } = useTimer(
    initialTime || MODE_TIMES.focus,
    onFinish
  );

  useEffect(() => {
    if (currentMode) setMode(currentMode);
    if (autoStart && initialTime) setIsActive(true);
  }, [initialTime, currentMode, autoStart, setIsActive]);

  // --- TAB BAŞLIĞI VE FAVICON GÜNCELLEME ---
  useEffect(() => {
    // 1. ŞART: Sayaç duruyorsa veya süre bittiyse (0)
    if (!isActive || timeLeft <= 0) {
      document.title = "Pomodoro Timer";
      setEmojiFavicon('⏱️'); // Durunca kronometre emojisi
      return;
    }

    // 2. ŞART: Sadece sayaç aktifken ve saniye akarken
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    const timeStr = `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    const label = mode === 'focus' ? 'Focus' : 'Break';

    document.title = `(${timeStr}) ${label}`;

    // MODA GÖRE EMOJI ATAMASI
    if (mode === 'focus') {
      setEmojiFavicon('🌪️'); // Odaklanırken Hortum
    } else {
      setEmojiFavicon('☕'); // Molada Kahve
    }

    return () => {
      document.title = "Pomodoro Timer";
    };
  }, [timeLeft, mode, isActive]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    reset(MODE_TIMES[newMode]);
  };

  const handleManual = (type: 'h' | 'm' | 's', val: number) => {
    let newTotal = 0;
    const cM = Math.floor((timeLeft % 3600) / 60);
    const cS = timeLeft % 60;
    const cH = Math.floor(timeLeft / 3600);

    if (type === 'h') newTotal = val * 3600 + cM * 60 + cS;
    else if (type === 'm') newTotal = cH * 3600 + val * 60 + cS;
    else if (type === 's') newTotal = cH * 3600 + cM * 60 + val;

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