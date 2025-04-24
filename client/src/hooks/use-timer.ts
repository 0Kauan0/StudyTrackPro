import { useState, useEffect, useCallback } from "react";

export function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Start the timer
  const startTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      if (!startTime) {
        setStartTime(new Date());
      }
    }
  }, [isRunning, startTime]);
  
  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
    }
  }, [isRunning]);
  
  // Reset the timer
  const resetTimer = useCallback(() => {
    setTime(0);
    setIsRunning(false);
    setStartTime(null);
  }, []);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  
  return {
    time,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    selectedSubjectId,
    setSelectedSubjectId,
    startTime
  };
}
