import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAvatar } from "@/hooks/useAvatar";
import { useToast } from "@/components/ui/use-toast";

interface AvatarUploadProps {
  currentAvatar?: string;
  name?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AvatarUpload = ({
  currentAvatar = "https://dummyimage.com/200/cccccc/666666&text=Avatar",
  name = "User",
  isOpen = true,
  onOpenChange = () => {},
}: AvatarUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadAvatar, deleteAvatar, isUploading, error } = useAvatar();
  const { toast } = useToast();

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadAvatar(selectedFile);
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Upload failed",
        variant: "destructive",
      });
    }
  };

  const handleReset = async () => {
    if (currentAvatar && currentAvatar !== previewUrl) {
      try {
        await deleteAvatar(currentAvatar);
        toast({
          title: "Success",
          description: "Profile picture removed successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Delete failed",
          variant: "destructive",
        });
      }
    }
    setPreviewUrl(currentAvatar);
    setSelectedFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={previewUrl} alt={name} />
                <AvatarFallback>
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {selectedFile && (
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -top-2 -right-2"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Card className="w-full bg-muted/50">
              <CardContent className="p-4">
                <div className="flex flex-col items-center gap-4">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Upload New Picture</p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF, max 5MB
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">
              {error.message}
            </p>
          )}

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarUpload;
