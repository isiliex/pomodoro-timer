import { useState, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface UseTimerReturn {
  timeLeft: number;
  isActive: boolean;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: (newSeconds?: number) => void;
  setTimeLeft: Dispatch<SetStateAction<number>>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
}

export const useTimer = (initialSeconds: number, onFinish?: () => void): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const toggle = () => setIsActive(!isActive);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;

          // BAŞLIK GÜNCELLEME BURADA (React render'ından bağımsız)
          if (newTime <= 0) {
            document.title = "Pomodoro Timer";
          } else {
            const m = Math.floor(newTime / 60).toString().padStart(2, '0');
            const s = (newTime % 60).toString().padStart(2, '0');
            // Mod bilgisini dışarıdan alamadığımız için genel bir Running yazısı
            // PomodoroTimer bileşeni bunu saniye içinde üzerine yazacak
            document.title = `(${m}:${s}) Running...`;
          }

          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      document.title = "Pomodoro Timer"; // Bittiğinde zorla sabitle
      if (onFinish) onFinish();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onFinish]);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);

  const reset = useCallback((newSeconds?: number) => {
    setIsActive(false);
    document.title = "Pomodoro Timer";
    setTimeLeft(newSeconds !== undefined ? newSeconds : initialSeconds);
  }, [initialSeconds]);

  return { timeLeft, isActive, start, toggle, pause, reset, setTimeLeft, setIsActive };
};