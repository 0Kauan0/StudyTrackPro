import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudySessions } from "@/hooks/use-study-sessions";
import { useSubjects } from "@/hooks/use-subjects";
import { groupBy } from "lodash";
import { Zap, BarChart2, Clock, CheckCircle } from "lucide-react";

const StudyInsights: React.FC = () => {
  const { allSessions } = useStudySessions();
  const { subjects } = useSubjects();
  
  const insights = useMemo(() => {
    if (!allSessions.length || !subjects.length) {
      return {
        bestDay: { day: "Quinta", hours: 0 },
        favoriteSubject: { name: "Matemática", percentage: 0 },
        productiveTime: { start: "19h", end: "21h" }
      };
    }
    
    // Find best day of the week
    const sessionsByWeekday = groupBy(allSessions, (session) => {
      const date = new Date(session.day);
      return date.getDay();
    });
    
    let bestDay = { day: 0, duration: 0 };
    
    Object.entries(sessionsByWeekday).forEach(([day, sessions]) => {
      const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
      if (totalDuration > bestDay.duration) {
        bestDay = { day: parseInt(day), duration: totalDuration };
      }
    });
    
    const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const bestDayName = weekdays[bestDay.day];
    const bestDayHours = (bestDay.duration / 3600).toFixed(1);
    
    // Find favorite subject
    const sessionsBySubject = groupBy(allSessions, 'subjectId');
    let favoriteSubject = { id: 0, duration: 0 };
    
    Object.entries(sessionsBySubject).forEach(([subjectId, sessions]) => {
      const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
      if (totalDuration > favoriteSubject.duration) {
        favoriteSubject = { id: parseInt(subjectId), duration: totalDuration };
      }
    });
    
    const subject = subjects.find(s => s.id === favoriteSubject.id);
    const totalStudyTime = allSessions.reduce((sum, session) => sum + session.duration, 0);
    const subjectPercentage = Math.round((favoriteSubject.duration / totalStudyTime) * 100);
    
    // Find most productive time period (simplified)
    // In a real app, this would analyze session start/end times more precisely
    
    return {
      bestDay: { day: bestDayName, hours: bestDayHours },
      favoriteSubject: { name: subject?.name || "Desconhecido", percentage: subjectPercentage },
      productiveTime: { start: "19h", end: "21h" }
    };
  }, [allSessions, subjects]);

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-white">Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-primary-900/30 border border-primary-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex-shrink-0 flex items-center justify-center text-primary-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-300 mb-1">Seu melhor dia</p>
                <p className="text-xs text-slate-400">
                  {insights.bestDay.day} é o dia em que você estuda mais, com média de {insights.bestDay.hours}h por sessão.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-secondary-900/30 border border-secondary-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-500/20 flex-shrink-0 flex items-center justify-center text-secondary-400">
                <BarChart2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-300 mb-1">Matéria favorita</p>
                <p className="text-xs text-slate-400">
                  Você dedicou {insights.favoriteSubject.percentage}% do seu tempo à {insights.favoriteSubject.name} esta semana.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-accent-900/30 border border-accent-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-500/20 flex-shrink-0 flex items-center justify-center text-accent-400">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-300 mb-1">Horário produtivo</p>
                <p className="text-xs text-slate-400">
                  Sua produtividade é maior entre {insights.productiveTime.start} e {insights.productiveTime.end}. Aproveite este período!
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-slate-700/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-emerald-400">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">Próxima conquista</p>
                <p className="text-xs text-slate-400">
                  Estude mais 2h para desbloquear a conquista "Esforço Constante".
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyInsights;
