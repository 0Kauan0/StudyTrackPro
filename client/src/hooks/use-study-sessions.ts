import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, subDays, startOfDay, parseISO } from "date-fns";
import { StudySession, InsertStudySession } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useStudySessions() {
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Get all sessions
  const { data: allSessions = [] } = useQuery<StudySession[]>({
    queryKey: ['/api/study-sessions'],
  });
  
  // Get today's sessions
  const { data: todaySessions = [] } = useQuery<StudySession[]>({
    queryKey: ['/api/study-sessions', { day: today }],
  });
  
  // Get sessions for the last 7 days
  const lastWeek = format(subDays(new Date(), 7), "yyyy-MM-dd");
  const { data: weekSessions = [] } = useQuery<StudySession[]>({
    queryKey: ['/api/study-sessions', { startDate: lastWeek, endDate: today }],
  });
  
  // Create a new session
  const { mutateAsync: createSession, isPending: isCreatingSession } = useMutation<
    StudySession,
    Error,
    InsertStudySession
  >({
    mutationFn: async (session) => {
      const response = await apiRequest("POST", "/api/study-sessions", session);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/study-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/streak'] });
    }
  });
  
  // Group sessions by day
  const sessionsByDay = allSessions.reduce((acc, session) => {
    const dayStr = format(parseISO(session.day.toString()), "yyyy-MM-dd");
    if (!acc[dayStr]) {
      acc[dayStr] = [];
    }
    acc[dayStr].push(session);
    return acc;
  }, {} as Record<string, StudySession[]>);
  
  return {
    allSessions,
    todaySessions,
    weekSessions,
    sessionsByDay,
    createSession,
    isCreatingSession
  };
}
