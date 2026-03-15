interface TimerDisplayProps {
  timeLeft: number;
}

export function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  
  const formatDisplay = () => {
    const hoursStr = h > 0 ? `${h.toString().padStart(2, '0')}:` : '';
    const minsStr = m.toString().padStart(2, '0');
    const secsStr = s.toString().padStart(2, '0');
    return `${hoursStr}${minsStr}:${secsStr}`;
  };

  return (
    <div className="flex justify-center items-center py-6 sm:py-10">
      <span className="text-7xl sm:text-8xl md:text-9xl font-mono font-bold tracking-tighter text-foreground tabular-nums drop-shadow-sm">
        {formatDisplay()}
      </span>
    </div>
  );
}
