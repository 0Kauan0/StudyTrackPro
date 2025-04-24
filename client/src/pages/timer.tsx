import React from "react";
import StudyTimer from "@/components/timer/StudyTimer";
import { useQuery } from "@tanstack/react-query";

const TimerPage: React.FC = () => {
  // Get streak data
  const { data: streak } = useQuery({
    queryKey: ['/api/streak'],
    staleTime: 60 * 1000, // 1 minute
  });

  const currentStreak = streak?.currentStreak || 0;

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h2 className="text-2xl font-heading font-bold text-white mb-2 md:mb-0">Cronômetro de Estudos</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Streak atual:</span>
          <div className="flex items-center gap-1 text-sm font-medium text-secondary-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
            <span>{currentStreak} dias</span>
          </div>
        </div>
      </div>
      
      <StudyTimer />
    </div>
  );
};

export default TimerPage;
