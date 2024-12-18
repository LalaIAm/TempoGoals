import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface CheckInReminderProps {
  nextCheckIn?: string;
  notificationsEnabled?: boolean;
  onToggleNotifications?: (enabled: boolean) => void;
  onScheduleChange?: () => void;
  isLoading?: boolean;
}

const CheckInReminder = ({
  nextCheckIn = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  notificationsEnabled = true,
  onToggleNotifications = () => {},
  onScheduleChange = () => {},
  isLoading = false,
}: CheckInReminderProps) => {
  const formatDate = (date: string) => {
    const checkInDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (checkInDate.toDateString() === today.toDateString()) {
      return `Today at ${checkInDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    if (checkInDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${checkInDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return checkInDate.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-[300px] h-[80px] p-4 bg-background">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 text-primary">📅</div>
            <span className="text-sm font-medium">Next Check-in</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{formatDate(nextCheckIn)}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onScheduleChange}
              disabled={isLoading}
              className="h-6 px-2 text-xs"
            >
              Change
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 ${notificationsEnabled ? "text-primary" : "text-muted-foreground"}`}
          >
            🔔
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={onToggleNotifications}
            disabled={isLoading}
          />
        </div>
      </div>
    </Card>
  );
};

export default CheckInReminder;
