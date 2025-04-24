import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSubjects } from "@/hooks/use-subjects";
import { StudySession } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/utils/date-utils";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

type SessionSummaryProps = {
  sessions: StudySession[];
  isLoading: boolean;
};

const SessionSummary: React.FC<SessionSummaryProps> = ({ sessions, isLoading }) => {
  const { subjects } = useSubjects();
  
  // Get current date in Portuguese format (e.g., "15 de julho")
  const today = format(new Date(), "dd 'de' MMMM", { locale: ptBR });
  
  // Calculate total study time for today
  const totalDuration = sessions.reduce((total, session) => total + session.duration, 0);
  const formattedTotalDuration = formatDuration(totalDuration);
  
  // Get subject info by ID
  const getSubject = (subjectId: number) => {
    return subjects.find(s => s.id === subjectId);
  };
  
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-400">Resumo da sessão</h3>
        <span className="text-xs text-slate-500">Hoje, {today}</span>
      </div>
      
      <div className="space-y-3 mb-4 flex-1">
        {isLoading ? (
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))
        ) : sessions.length > 0 ? (
          sessions.map((session) => {
            const subject = getSubject(session.subjectId);
            const startTime = new Date(session.startTime);
            const endTime = new Date(session.endTime);
            
            return (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center" 
                    style={{ 
                      backgroundColor: `${subject?.color}20`,
                      color: subject?.color 
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{subject?.name}</p>
                    <p className="text-xs text-slate-400">
                      {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-white">{formatDuration(session.duration)}</span>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-slate-400 mb-2">Nenhuma sessão de estudo hoje</p>
            <p className="text-xs text-slate-500">Comece uma sessão para registrar seu progresso</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
        <div>
          <p className="text-sm text-slate-400">Total de hoje</p>
          <p className="text-lg font-medium text-white">{formattedTotalDuration}</p>
        </div>
        
        <Link href="/metrics">
          <a className="flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
            <span>Ver histórico completo</span>
            <ArrowRight className="h-5 w-5" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default SessionSummary;
