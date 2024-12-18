import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["user_profiles"]["Row"];

export function useProfile() {
  const { profile, updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateUserProfile = async (updates: Partial<Profile>) => {
    setIsUpdating(true);
    setError(null);
    try {
      await updateProfile(updates);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update profile"),
      );
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    isUpdating,
    error,
    updateProfile: updateUserProfile,
  };
}
