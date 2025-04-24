import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Flame, Award, Clock } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { data: streak } = useQuery({
    queryKey: ['/api/streak'],
  });

  const { data: studySessions } = useQuery({
    queryKey: ['/api/study-sessions'],
  });

  // Calculate total study time in hours
  const totalStudyTime = studySessions 
    ? studySessions.reduce((total, session) => total + session.duration, 0) / 3600 
    : 0;
  
  const formattedStudyTime = totalStudyTime.toFixed(1);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-heading font-bold text-white mb-6">Perfil do Estudante</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-primary-400 text-xl font-medium">
                JP
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">João Pedro</h3>
                <p className="text-sm text-slate-400">Estudante desde julho 2023</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-secondary-400" />
                <div>
                  <p className="text-sm font-medium text-white">Streak Atual</p>
                  <p className="text-xs text-slate-400">{streak?.currentStreak || 0} dias consecutivos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-sm font-medium text-white">Nível Atual</p>
                  <p className="text-xs text-slate-400">Nível 3 - Estudante Dedicado</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent-400" />
                <div>
                  <p className="text-sm font-medium text-white">Tempo Total de Estudo</p>
                  <p className="text-xs text-slate-400">{formattedStudyTime} horas acumuladas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Conquistas e Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-primary-900/30 border border-primary-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-500/20 flex-shrink-0 flex items-center justify-center text-primary-400">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-300 mb-1">Consistência</p>
                  <p className="text-xs text-slate-400">Complete 7 dias consecutivos de estudos</p>
                  <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-primary-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, (streak?.currentStreak || 0) / 7 * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-secondary-900/30 border border-secondary-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-500/20 flex-shrink-0 flex items-center justify-center text-secondary-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-300 mb-1">Maratonista</p>
                  <p className="text-xs text-slate-400">Acumule 30 horas de estudo</p>
                  <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-secondary-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, totalStudyTime / 30 * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-slate-700/50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">Equilíbrio Perfeito</p>
                  <p className="text-xs text-slate-400">Estude pelo menos 4 matérias diferentes em uma semana</p>
                  <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
