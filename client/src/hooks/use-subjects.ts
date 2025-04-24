import { useQuery } from "@tanstack/react-query";
import { Subject } from "@shared/schema";

export function useSubjects() {
  const { data: subjects = [], isLoading } = useQuery<Subject[]>({
    queryKey: ['/api/subjects'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return {
    subjects,
    isLoading
  };
}
