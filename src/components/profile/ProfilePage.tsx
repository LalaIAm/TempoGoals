import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import PasswordChangeForm from "./PasswordChangeForm";
import AvatarUpload from "./AvatarUpload";
import { UserCircle, Lock } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, isUpdating, updateProfile } = useProfile();
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdateProfile = async (values: any) => {
    try {
      await updateProfile(values);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Update failed",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePassword = async (values: any) => {
    try {
      // Password update is handled by AuthContext
      await updatePassword(values.newPassword);
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Update failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto p-6 space-y-6 bg-background">
      <ProfileHeader
        name={profile?.full_name || user?.email || ""}
        email={user?.email || ""}
        location={profile?.location || ""}
        avatarUrl={profile?.avatar_url || ""}
        onEditAvatar={() => setIsAvatarDialogOpen(true)}
      />

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" /> Profile Information
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="w-4 h-4" /> Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <ProfileForm
                defaultValues={{
                  fullName: profile?.full_name || "",
                  email: user?.email || "",
                  phone: profile?.phone || "",
                  location: profile?.location || "",
                  occupation: profile?.occupation || "",
                  bio: profile?.bio || "",
                }}
                onSubmit={handleUpdateProfile}
                isLoading={isUpdating}
              />
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <div className="flex justify-center">
                <PasswordChangeForm
                  onSubmit={handleUpdatePassword}
                  isLoading={isUpdating}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AvatarUpload
        currentAvatar={profile?.avatar_url || ""}
        name={profile?.full_name || user?.email || ""}
        isOpen={isAvatarDialogOpen}
        onOpenChange={setIsAvatarDialogOpen}
      />
    </div>
  );
};

export default ProfilePage;
