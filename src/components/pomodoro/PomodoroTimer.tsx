import { useState } from "react";
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
}

export function PomodoroTimer({ isDark }: PomodoroTimerProps) {
  const [mode, setMode] = useState<Mode>('focus');
  const { timeLeft, isActive, toggle, reset, setTimeLeft } = useTimer(25);

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

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 mb-8 bg-muted/80 p-1.5 rounded-xl z-10 relative shadow-sm">
        <Button
          variant={mode === 'focus' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleModeChange('focus')}
          className="rounded-lg font-semibold"
        >
          Focus
        </Button>
        <Button
          variant={mode === 'shortBreak' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleModeChange('shortBreak')}
          className="rounded-lg font-semibold"
        >
          Short Break
        </Button>
        <Button
          variant={mode === 'longBreak' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleModeChange('longBreak')}
          className="rounded-lg font-semibold"
        >
          Long Break
        </Button>
      </div>

      <Card
        displayTime={formatDisplay()}
        isActive={isActive}
        onToggle={toggle}
        onReset={() => reset(MODE_TIMES[mode])}
        onManualChange={handleManual}
        isDark={isDark}
      />



    </div>
  );
}
