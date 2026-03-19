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
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    // Süre tam 0 olduğunda yapılacaklar
    else if (timeLeft === 0 && isActive) {
      setIsActive(false);
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
    // Yeni saniye gelirse onu, gelmezse başlangıçtaki saniyeyi set et
    setTimeLeft(newSeconds !== undefined ? newSeconds : initialSeconds);
  }, [initialSeconds]);

  return {
    timeLeft,
    isActive,
    start,
    toggle,
    pause,
    reset,
    setTimeLeft,
    setIsActive
  };
};