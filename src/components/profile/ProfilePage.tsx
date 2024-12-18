import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import PasswordChangeForm from "./PasswordChangeForm";
import AvatarUpload from "./AvatarUpload";
import { UserCircle, Lock } from "lucide-react";

interface ProfilePageProps {
  userData?: {
    name: string;
    email: string;
    location: string;
    phone: string;
    occupation: string;
    bio: string;
    avatarUrl: string;
  };
  onUpdateProfile?: (values: any) => Promise<void>;
  onUpdatePassword?: (values: any) => Promise<void>;
  onUpdateAvatar?: (file: File) => Promise<void>;
  isLoading?: boolean;
}

const ProfilePage = ({
  userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    location: "San Francisco, CA",
    phone: "+1 234 567 8900",
    occupation: "Software Engineer",
    bio: "Passionate about building great software and solving complex problems.",
    avatarUrl: "https://dummyimage.com/200/cccccc/666666&text=JD",
  },
  onUpdateProfile = async () => {},
  onUpdatePassword = async () => {},
  onUpdateAvatar = async () => {},
  isLoading = false,
}: ProfilePageProps) => {
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  return (
    <div className="w-full max-w-[800px] mx-auto p-6 space-y-6 bg-background">
      <ProfileHeader
        name={userData.name}
        email={userData.email}
        location={userData.location}
        avatarUrl={userData.avatarUrl}
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
                  fullName: userData.name,
                  email: userData.email,
                  phone: userData.phone,
                  location: userData.location,
                  occupation: userData.occupation,
                  bio: userData.bio,
                }}
                onSubmit={onUpdateProfile}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <div className="flex justify-center">
                <PasswordChangeForm
                  onSubmit={onUpdatePassword}
                  isLoading={isLoading}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AvatarUpload
        currentAvatar={userData.avatarUrl}
        name={userData.name}
        onUpload={onUpdateAvatar}
        isOpen={isAvatarDialogOpen}
        onOpenChange={setIsAvatarDialogOpen}
      />
    </div>
  );
};

export default ProfilePage;
