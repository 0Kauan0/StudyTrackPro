import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useStudySessions } from "@/hooks/use-study-sessions";
import { useSubjects } from "@/hooks/use-subjects";

const SubjectDistribution: React.FC = () => {
  const { allSessions } = useStudySessions();
  const { subjects } = useSubjects();
  
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!allSessions.length || !subjects.length) return [];
    
    // Group sessions by subject and calculate total duration for each
    const subjectTotals = allSessions.reduce((acc, session) => {
      const { subjectId, duration } = session;
      acc[subjectId] = (acc[subjectId] || 0) + duration;
      return acc;
    }, {} as Record<number, number>);
    
    // Convert to array for chart
    return Object.entries(subjectTotals).map(([subjectId, duration]) => {
      const subject = subjects.find(s => s.id === parseInt(subjectId));
      return {
        name: subject?.name || "Desconhecido",
        value: duration,
        color: subject?.color || "#6366f1"
      };
    }).sort((a, b) => b.value - a.value);
  }, [allSessions, subjects]);
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      
      return (
        <div className="bg-slate-800 p-2 border border-slate-700 rounded text-sm">
          <p className="font-medium text-white">{name}</p>
          <p className="text-slate-300">
            {hours > 0 ? `${hours}h ` : ""}{minutes}min
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-white">Distribuição por Matéria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="chart-container w-48 h-48 relative mb-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <p className="text-sm text-slate-400">Sem dados suficientes</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full text-sm">
            {chartData.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectDistribution;
