import { Button } from "../ui/Button";

interface TimerControlsProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export function TimerControls({
  isActive,
  onToggle,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex gap-4 items-center justify-center">
      <Button 
        onClick={onToggle} 
        size="lg" 
        variant={isActive ? "secondary" : "default"} 
        className="w-32 text-lg shadow-sm transition-all"
      >
        {isActive ? 'Durdur' : 'Başlat'}
      </Button>
      <Button onClick={onReset} size="lg" variant="outline" className="w-32 text-lg shadow-sm transition-all">
        Sıfırla
      </Button>
    </div>
  );
}
