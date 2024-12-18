import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CheckInReminder from "./CheckInReminder";

interface ProgressTrackerProps {
  progress?: number;
  nextMilestone?: {
    title: string;
    dueDate: string;
  };
  nextCheckIn?: string;
  notificationsEnabled?: boolean;
  onToggleNotifications?: (enabled: boolean) => void;
  onScheduleChange?: () => void;
  isLoading?: boolean;
}

const ProgressTracker = ({
  progress = 0,
  nextMilestone = {
    title: "Complete project documentation",
    dueDate: "2024-03-15",
  },
  nextCheckIn = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  notificationsEnabled = true,
  onToggleNotifications = () => {},
  onScheduleChange = () => {},
  isLoading = false,
}: ProgressTrackerProps) => {
  return (
    <Card className="w-[1200px] h-[120px] p-6 bg-background">
      <div className="flex items-center justify-between gap-8">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-primary">🎯</div>
              <span className="font-medium">Overall Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-primary">📅</div>
              <span className="font-medium">Next Milestone</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{nextMilestone.title}</Badge>
              <span className="text-sm text-muted-foreground">
                Due {new Date(nextMilestone.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="border-l h-16" />

          <CheckInReminder
            nextCheckIn={nextCheckIn}
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={onToggleNotifications}
            onScheduleChange={onScheduleChange}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProgressTracker;
