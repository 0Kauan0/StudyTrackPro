import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudySessions } from "@/hooks/use-study-sessions";
import { useSubjects } from "@/hooks/use-subjects";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay, isToday, parseISO, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

const StudyCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { allSessions } = useStudySessions();
  const { subjects } = useSubjects();
  
  // Handle month navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Get calendar data for current month
  const calendarData = useMemo(() => {
    // Get days in month
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = monthStart;
    const endDate = monthEnd;
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Get day of week of first day (0 = Sunday, 1 = Monday, etc.)
    const startDay = getDay(monthStart);
    
    // Create days from previous month to fill in first row
    const prevMonthDays = [];
    for (let i = startDay - 1; i >= 0; i--) {
      const day = new Date(monthStart);
      day.setDate(day.getDate() - (i + 1));
      prevMonthDays.push({ date: day, isCurrentMonth: false });
    }
    
    // Create days from next month to fill in last row
    const nextMonthDays = [];
    const lastWeekDay = getDay(monthEnd);
    if (lastWeekDay < 6) {
      for (let i = 1; i <= 6 - lastWeekDay; i++) {
        const day = new Date(monthEnd);
        day.setDate(day.getDate() + i);
        nextMonthDays.push({ date: day, isCurrentMonth: false });
      }
    }
    
    // Create current month days
    const currentMonthDays = days.map(day => ({ date: day, isCurrentMonth: true }));
    
    // Combine all days
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [currentMonth]);
  
  // Get sessions for each day
  const sessionsPerDay = useMemo(() => {
    const sessionMap: Record<string, Record<number, boolean>> = {};
    
    allSessions.forEach(session => {
      const day = format(parseISO(session.day.toString()), 'yyyy-MM-dd');
      if (!sessionMap[day]) {
        sessionMap[day] = {};
      }
      sessionMap[day][session.subjectId] = true;
    });
    
    return sessionMap;
  }, [allSessions]);
  
  // Week days in Portuguese
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Card className="bg-slate-800 border-slate-700 p-4 md:p-6 shadow-lg card-hover">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <Button
          variant="outline"
          className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600 border-0 mb-2 md:mb-0"
        >
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 border-0 p-0"
            onClick={prevMonth}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 border-0 p-0"
            onClick={nextMonth}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Calendar header */}
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center text-sm font-medium text-slate-400">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarData.map((day, i) => {
          const dateStr = format(day.date, 'yyyy-MM-dd');
          const daySubjects = sessionsPerDay[dateStr] || {};
          const subjectIds = Object.keys(daySubjects).map(Number);
          
          return (
            <div key={i} className="aspect-square p-1">
              <div 
                className={`w-full h-full rounded-lg 
                  ${!day.isCurrentMonth ? 'bg-slate-800' : isToday(day.date) ? 'bg-primary-600' : 'bg-slate-700'} 
                  flex flex-col items-center justify-center relative`
                }
              >
                <span className={`text-sm font-medium ${!day.isCurrentMonth ? 'text-slate-500' : isToday(day.date) ? 'text-white' : 'text-white'}`}>
                  {format(day.date, 'd')}
                </span>
                
                {/* Dots for subjects studied on this day */}
                {subjectIds.length > 0 && (
                  <div className="flex items-center mt-1 gap-0.5">
                    {subjectIds.slice(0, 3).map((subjectId) => {
                      const subject = subjects.find(s => s.id === subjectId);
                      return (
                        <motion.div 
                          key={subjectId} 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: subject?.color || '#6366f1' }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      );
                    })}
                    {subjectIds.length > 3 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                )}
                
                {/* Current day indicator */}
                {isToday(day.date) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary-500 border-2 border-slate-800"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 flex-wrap">
        {subjects.slice(0, 5).map((subject) => (
          <div key={subject.id} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
            <span className="text-sm text-slate-300">{subject.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StudyCalendar;
