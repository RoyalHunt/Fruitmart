import React, { useState, useEffect, useCallback, useRef } from 'react';

type UseTimerOptions = {
  time: number;
  onTimerEnd: () => void;
};

export const useTimer = ({ time, onTimerEnd }: UseTimerOptions) => {
  const [remainingTime, setRemainingTime] = useState(time);
  const [isActive, setIsActive] = useState(true);
  const startTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    setRemainingTime(time);
    setIsActive(true);
    startTimeRef.current = Date.now();

    // Cancel any existing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [time]);

  useEffect(() => {
    if (!isActive || remainingTime <= 0) return;

    const animate = () => {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - startTimeRef.current) / 1000);
      const newRemainingTime = Math.max(time - elapsedTime, 0);

      setRemainingTime(newRemainingTime);

      if (newRemainingTime > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsActive(false);
        onTimerEnd();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, time, onTimerEnd]);

  const TimerComponent = () => (
    <span className='text-xl font-bold'>
      {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
    </span>
  );

  return [TimerComponent, { resetTimer }] as const;
};
