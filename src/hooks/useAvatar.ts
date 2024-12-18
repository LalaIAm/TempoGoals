import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function useAvatar() {
  const { user, updateProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadAvatar = async (file: File) => {
    if (!user) throw new Error("No user");

    setIsUploading(true);
    setError(null);

    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      // Generate unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update user profile with new avatar URL
      await updateProfile({
        avatar_url: publicUrl,
      });

      return publicUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to upload avatar"),
      );
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteAvatar = async (url: string) => {
    if (!user) throw new Error("No user");

    try {
      // Extract file path from URL
      const filePath = url.split("/").pop();
      if (!filePath) throw new Error("Invalid avatar URL");

      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([`avatars/${filePath}`]);

      if (deleteError) throw deleteError;

      // Update profile to remove avatar_url
      await updateProfile({
        avatar_url: null,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete avatar"),
      );
      throw err;
    }
  };

  return {
    uploadAvatar,
    deleteAvatar,
    isUploading,
    error,
  };
}
