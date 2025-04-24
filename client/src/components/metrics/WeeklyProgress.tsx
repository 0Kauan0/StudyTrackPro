import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useStudySessions } from "@/hooks/use-study-sessions";
import { subDays, format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, TrendingDown } from "lucide-react";

const WeeklyProgress: React.FC = () => {
  const { allSessions } = useStudySessions();
  
  // Prepare weekly data
  const weeklyData = useMemo(() => {
    const today = new Date();
    const weekData = [];
    
    // Create data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayName = format(date, 'EEE', { locale: ptBR }).charAt(0).toUpperCase() + format(date, 'EEE', { locale: ptBR }).slice(1);
      
      // Find sessions for this day
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const sessionsForDay = allSessions.filter(session => {
        const sessionDate = new Date(session.day);
        return isWithinInterval(sessionDate, { start: dayStart, end: dayEnd });
      });
      
      // Calculate total duration in hours
      const totalDuration = sessionsForDay.reduce((total, session) => total + session.duration, 0) / 3600;
      
      weekData.push({
        day: dayName,
        hours: parseFloat(totalDuration.toFixed(1)),
        date
      });
    }
    
    return weekData;
  }, [allSessions]);
  
  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    if (weeklyData.length === 0) return { average: 0, change: 0 };
    
    // Calculate average daily hours
    const totalHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
    const average = totalHours / weeklyData.length;
    
    // Calculate change from previous week (simplified)
    const currentWeekTotal = totalHours;
    const previousWeekAverage = 2; // This would be calculated from actual data
    const change = ((currentWeekTotal / 7) - previousWeekAverage) / previousWeekAverage * 100;
    
    return {
      average: average,
      change: change
    };
  }, [weeklyData]);
  
  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const hours = payload[0].value;
      const minutes = Math.round((hours - Math.floor(hours)) * 60);
      
      return (
        <div className="bg-slate-800 p-2 border border-slate-700 rounded text-sm">
          <p className="font-medium text-white">{label}</p>
          <p className="text-slate-300">
            {Math.floor(hours)}h {minutes > 0 ? `${minutes}min` : ""}
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-white">Progresso Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickFormatter={(value) => `${value}h`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="hours" 
                radius={[2, 2, 0, 0]} 
                fill="#6366f1" 
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-slate-400">Média diária</p>
          <p className="text-2xl font-medium text-white">
            {weeklyStats.average.toFixed(1)}h
          </p>
          {weeklyStats.change !== 0 && (
            <p className={`text-xs flex items-center justify-center gap-1 mt-1 ${weeklyStats.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {weeklyStats.change > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(weeklyStats.change).toFixed(0)}% {weeklyStats.change > 0 ? 'a mais' : 'a menos'} que a semana anterior
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;
