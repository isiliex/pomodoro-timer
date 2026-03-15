import { useState, useEffect, useCallback } from "react";
import { PomodoroTimer } from "./components/pomodoro/PomodoroTimer";
import { Button } from "./components/ui/Button";
import TaskList from './components/pomodoro/TaskList';
import Queue, { type QueueItem } from './components/pomodoro/Queue';

function App() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  /**
   * Seans bittiğinde SADECE SES çalar ve bir sonraki seansa geçer.
   * Alert (bildirim kutusu) kaldırıldı.
   */
  const handleNextSession = useCallback(() => {
    const playNotificationSound = () => {
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Ses engellendi:", e));
    };

    if (currentIndex < queue.length - 1) {
      playNotificationSound();
      setCurrentIndex((prev) => prev + 1);
      setTimerKey((prev) => prev + 1);
    } else {
      // Program tamamen bittiğinde de sadece ses çal ve listeyi temizle
      playNotificationSound();
      setQueue([]);
      setCurrentIndex(0);
      setTimerKey((prev) => prev + 1);
    }
  }, [currentIndex, queue.length]);

  const generateQueue = (totalHours: number, totalMins: number, focusMins: number, breakMins: number) => {
    if (totalHours === 0 && totalMins === 0) {
      setQueue([]);
      setCurrentIndex(0);
      setTimerKey((prev) => prev + 1);
      return;
    }

    const totalSeconds = (totalHours * 3600) + (totalMins * 60);
    const sessionTotal = (focusMins + breakMins) * 60;
    const numberOfSessions = Math.floor(totalSeconds / sessionTotal);

    if (numberOfSessions === 0) return;

    const newQueue: QueueItem[] = [];
    for (let i = 0; i < numberOfSessions; i++) {
      newQueue.push({
        id: `focus-${i}-${Date.now()}`,
        mode: 'focus',
        label: `Deep Work ${i + 1}`,
        duration: focusMins * 60
      });
      newQueue.push({
        id: `break-${i}-${Date.now()}`,
        mode: 'shortBreak',
        label: `Quick Break`,
        duration: breakMins * 60
      });
    }

    setQueue(newQueue);
    setCurrentIndex(0);
    setTimerKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <main className={`relative min-h-screen flex items-center justify-center p-4 sm:p-8 transition-colors duration-500 overflow-hidden ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* ARKA PLAN DESENİ */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)]"></div>

      {/* 12 KOZMİK KÜRE */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-blue-600 opacity-20' : 'bg-blue-400 opacity-30'}`}></div>
        <div className={`absolute -top-40 -right-40 w-[450px] h-[450px] rounded-full blur-[110px] transition-all duration-1000 ${isDark ? 'bg-purple-600 opacity-20' : 'bg-purple-300 opacity-25'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[130px] transition-all duration-1000 ${isDark ? 'bg-emerald-600 opacity-20' : 'bg-emerald-300 opacity-25'}`}></div>
        <div className={`absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full blur-[110px] transition-all duration-1000 ${isDark ? 'bg-rose-600 opacity-20' : 'bg-rose-300 opacity-30'}`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] rounded-full blur-[160px] transition-all duration-1000 ${isDark ? 'bg-slate-800 opacity-5' : 'bg-slate-200 opacity-20'}`}></div>
      </div>

      <Button variant="outline" size="icon" onClick={() => setIsDark(!isDark)} className="fixed top-6 right-6 z-50 rounded-full w-12 h-12 border-white/10 bg-background shadow-md">
        {isDark ? '🌙' : '☀️'}
      </Button>

      <div className="relative z-10 w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-[380px_1fr_380px] items-center gap-6">
        <div className="flex justify-center lg:justify-end">
          <Queue queue={queue} currentIndex={currentIndex} isDark={isDark} onGenerateQueue={generateQueue} />
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <PomodoroTimer
              key={timerKey}
              isDark={isDark}
              initialTime={queue[currentIndex]?.duration}
              onFinish={handleNextSession}
              autoStart={queue.length > 0}
            />
          </div>
        </div>

        <div className="flex justify-center lg:justify-start">
          <div className="w-full max-w-sm">
            <TaskList isDark={isDark} />
          </div>
        </div>
      </div>

      <footer className="fixed bottom-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-black opacity-30">
        Pomodoro Focus • No Interruptions
      </footer>
    </main>
  );
}

export default App;