import React from "react";
import CircularTimer from "./CircularTimer";
import SubjectSelector from "./SubjectSelector";
import SessionSummary from "./SessionSummary";
import { useTimer } from "@/hooks/use-timer";
import { useStudySessions } from "@/hooks/use-study-sessions";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const StudyTimer: React.FC = () => {
  const { toast } = useToast();
  const { 
    time, 
    isRunning, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    selectedSubjectId,
    startTime,
    setSelectedSubjectId
  } = useTimer();
  
  const { todaySessions, createSession, isCreatingSession } = useStudySessions();
  
  const handleTimerAction = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      if (!selectedSubjectId) {
        toast({
          title: "Selecione uma matéria",
          description: "Por favor, selecione a matéria que está estudando",
          variant: "destructive",
        });
        return;
      }
      
      startTimer();
    }
  };
  
  const handleReset = () => {
    if (isRunning || time > 0) {
      if (window.confirm("Tem certeza que deseja zerar o cronômetro? O tempo atual será perdido.")) {
        resetTimer();
      }
    }
  };
  
  const handleStop = async () => {
    if (time < 60) { // Less than 1 minute
      toast({
        title: "Sessão muito curta",
        description: "Estude por pelo menos 1 minuto para registrar a sessão",
        variant: "destructive",
      });
      return;
    }
    
    pauseTimer();
    
    if (selectedSubjectId && startTime) {
      const endTime = new Date();
      const duration = Math.floor(time);
      
      try {
        await createSession({
          subjectId: selectedSubjectId,
          startTime,
          endTime,
          duration,
          day: new Date()
        });
        
        toast({
          title: "Sessão registrada!",
          description: `Você estudou por ${Math.floor(duration / 60)} minutos e ${duration % 60} segundos.`,
        });
        
        resetTimer();
      } catch (error) {
        console.error("Error creating session:", error);
        toast({
          title: "Erro ao registrar sessão",
          description: "Ocorreu um erro ao registrar sua sessão de estudo",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <Card className="md:col-span-2 bg-slate-800 border-slate-700 p-6 shadow-lg card-hover">
        <div className="flex flex-col items-center">
          <CircularTimer time={time} isRunning={isRunning} />
          
          <div className="flex items-center gap-3 mt-6">
            <button 
              className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-colors"
              onClick={handleReset}
              disabled={isCreatingSession}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button 
              className={`w-16 h-16 rounded-full ${isRunning ? 'bg-primary-600 hover:bg-primary-700' : 'bg-emerald-600 hover:bg-emerald-700'} flex items-center justify-center text-white shadow-lg shadow-primary-600/20 transition-colors`}
              onClick={handleTimerAction}
              disabled={isCreatingSession}
            >
              {isRunning ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            <button 
              className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-colors"
              onClick={handleStop}
              disabled={time === 0 || isCreatingSession}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </Card>
      
      <Card className="md:col-span-3 bg-slate-800 border-slate-700 p-6 shadow-lg card-hover flex flex-col">
        <SubjectSelector 
          selectedSubjectId={selectedSubjectId} 
          onSubjectChange={setSelectedSubjectId} 
          disabled={isRunning || isCreatingSession}
        />
        
        <SessionSummary sessions={todaySessions} isLoading={isCreatingSession} />
      </Card>
    </div>
  );
};

export default StudyTimer;
