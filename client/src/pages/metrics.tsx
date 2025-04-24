import React from "react";
import SubjectDistribution from "@/components/metrics/SubjectDistribution";
import WeeklyProgress from "@/components/metrics/WeeklyProgress";
import StudyInsights from "@/components/metrics/StudyInsights";

const MetricsPage: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-heading font-bold text-white mb-4">Métricas de Estudo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SubjectDistribution />
        <WeeklyProgress />
        <StudyInsights />
      </div>
    </div>
  );
};

export default MetricsPage;
