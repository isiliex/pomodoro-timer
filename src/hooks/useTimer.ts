import { useState, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface UseTimerReturn {
  timeLeft: number;
  isActive: boolean;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: (newSeconds: number) => void;
  setTimeLeft: Dispatch<SetStateAction<number>>;
}



export const useTimer = (initialMinutes: number): UseTimerReturn => {
  const initialSeconds = initialMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const toggle = () => setIsActive(!isActive);



  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setTimeout(() => {
        setIsActive(false);
        window.alert("Süre doldu! Mola vakti.");
      }, 0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  const reset = useCallback((newSeconds?: number) => {
    setIsActive(false);
    setTimeLeft(newSeconds !== undefined ? newSeconds : initialMinutes * 60);
  }, [initialSeconds]);

  return { timeLeft, isActive, start, toggle, pause, reset, setTimeLeft };
};