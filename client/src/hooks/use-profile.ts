import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { UpdateUserProfile } from "@shared/schema";

// Extended profile type with level title
export type ProfileWithTitle = {
  id: number;
  name: string;
  joinedAt: Date;
  totalStudyHours: number;
  level: number;
  xp: number;
  levelTitle: string;
};

export function useProfile() {
  const queryClient = useQueryClient();
  
  // Get user profile
  const { data: profile, isLoading } = useQuery<ProfileWithTitle>({
    queryKey: ['/api/user-profile'],
  });
  
  // Update user profile
  const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation<
    ProfileWithTitle,
    Error,
    UpdateUserProfile
  >({
    mutationFn: async (profileData) => {
      const response = await apiRequest("PATCH", "/api/user-profile", profileData);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/user-profile'] });
    }
  });
  
  return {
    profile,
    isLoading,
    updateProfile,
    isUpdating
  };
}