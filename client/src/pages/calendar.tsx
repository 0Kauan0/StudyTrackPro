import React from "react";
import StudyCalendar from "@/components/calendar/StudyCalendar";

const CalendarPage: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h2 className="text-2xl font-heading font-bold text-white mb-2 md:mb-0">
          Calendário de Estudos
        </h2>
      </div>
      
      <StudyCalendar />
    </div>
  );
};

export default CalendarPage;
