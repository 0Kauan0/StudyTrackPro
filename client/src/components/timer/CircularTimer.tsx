import React from "react";
import { motion } from "framer-motion";

type CircularTimerProps = {
  time: number;
  isRunning: boolean;
};

const CircularTimer: React.FC<CircularTimerProps> = ({ time, isRunning }) => {
  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Calculate circumference of the circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  
  // For animation - we'll use a fixed duration for the animation
  // In a real app, this would be based on the actual session length
  const maxDuration = 3 * 60 * 60; // 3 hours
  const progress = Math.min(1, time / maxDuration);
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
      {/* Circle background */}
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#334155" strokeWidth="6" />
        
        {/* Progress circle */}
        <motion.circle 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="none" 
          stroke="#6366f1" 
          strokeWidth="6" 
          strokeDasharray={circumference} 
          strokeDashoffset={dashOffset} 
          transform="rotate(-90 50 50)" 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Timer display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-4xl font-mono font-semibold text-white"
          animate={{ scale: isRunning ? [1, 1.03, 1] : 1 }}
          transition={{ 
            repeat: isRunning ? Infinity : 0, 
            duration: 2, 
            repeatType: "reverse" 
          }}
        >
          {formatTime(time)}
        </motion.span>
        <span className="text-sm text-slate-400 mt-1">Sessão atual</span>
      </div>
    </div>
  );
};

export default CircularTimer;
