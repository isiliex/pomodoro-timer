import { useState, useEffect, useCallback, useRef } from 'react';
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
  const workerRef = useRef<Worker | null>(null);
  const onFinishRef = useRef(onFinish);

  // Sync onFinish ref with the latest callback
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  // Web Worker Setup (Inline Blob-based)
  useEffect(() => {
    const workerCode = `
      let timer = null;
      self.onmessage = (e) => {
        if (e.data === 'START') {
          if (timer) return;
          timer = setInterval(() => {
            self.postMessage('TICK');
          }, 1000);
        } else if (e.data === 'STOP') {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<string>) => {
      if (e.data === 'TICK') {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            worker.postMessage('STOP');
            setIsActive(false);
            onFinishRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }
    };

    return () => {
      worker.terminate();
      URL.revokeObjectURL(url);
      workerRef.current = null;
    };
  }, []); // Only initialize once

  // Send START/STOP commands based on isActive state
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      workerRef.current?.postMessage('START');
    } else {
      workerRef.current?.postMessage('STOP');
    }
  }, [isActive, timeLeft]);

  const toggle = useCallback(() => setIsActive((prev) => !prev), []);
  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);

  const reset = useCallback((newSeconds?: number) => {
    setIsActive(false);
    workerRef.current?.postMessage('STOP');
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