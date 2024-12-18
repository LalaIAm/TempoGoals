import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, MapPin } from "lucide-react";

interface ProfileHeaderProps {
  name?: string;
  email?: string;
  location?: string;
  avatarUrl?: string;
  onEditAvatar?: () => void;
}

const ProfileHeader = ({
  name = "John Doe",
  email = "john.doe@example.com",
  location = "San Francisco, CA",
  avatarUrl = "https://dummyimage.com/200/cccccc/666666&text=JD",
  onEditAvatar = () => {},
}: ProfileHeaderProps) => {
  return (
    <Card className="w-full bg-background">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onEditAvatar}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">Profile Complete</Badge>
              <Badge variant="outline">Email Verified</Badge>
            </div>
          </div>

          <Button variant="outline">Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
