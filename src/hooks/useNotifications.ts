import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  requestNotificationPermission,
  scheduleNotification,
  cancelScheduledNotification,
  type Notification,
} from "@/lib/notifications";

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [scheduledNotifications] = useState<Map<string, number>>(new Map());
  const { toast } = useToast();

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const perm = await requestNotificationPermission();
        setPermission(perm);
      } catch (error) {
        console.error("Failed to request notification permission:", error);
      }
    };

    checkPermission();
  }, []);

  useEffect(() => {
    // Load notifications from local storage
    const storedNotifications = localStorage.getItem(`notifications_${userId}`);
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }

    // Subscribe to goal updates
    const goalsSubscription = supabase
      .channel("goals-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "goals",
        },
        (payload) => {
          handleGoalUpdate(payload.new);
        },
      )
      .subscribe();

    // Subscribe to milestone updates
    const milestonesSubscription = supabase
      .channel("milestones-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "milestones",
        },
        (payload) => {
          handleMilestoneUpdate(payload.new);
        },
      )
      .subscribe();

    return () => {
      goalsSubscription.unsubscribe();
      milestonesSubscription.unsubscribe();
      // Clear all scheduled notifications
      scheduledNotifications.forEach((timerId) => {
        cancelScheduledNotification(timerId);
      });
    };
  }, [userId]);

  const handleGoalUpdate = (goal: any) => {
    // Schedule check-in notification
    const nextCheckIn = new Date(goal.next_check_in);
    const now = new Date();
    const delay = nextCheckIn.getTime() - now.getTime();

    if (delay > 0) {
      const notificationId = `check-in-${goal.id}`;
      const timerId = scheduleNotification(
        {
          type: "check-in",
          title: "Goal Check-in Reminder",
          message: `Time to check in on your goal: ${goal.title}`,
          goalId: goal.id,
          action: { type: "check-in", data: { goalId: goal.id } },
        },
        delay,
      );

      scheduledNotifications.set(notificationId, timerId);
    }
  };

  const handleMilestoneUpdate = (milestone: any) => {
    // Schedule milestone deadline notification
    const dueDate = new Date(milestone.due_date);
    const now = new Date();
    const delay = dueDate.getTime() - now.getTime() - 24 * 60 * 60 * 1000; // 1 day before

    if (delay > 0 && !milestone.completed) {
      const notificationId = `milestone-${milestone.id}`;
      const timerId = scheduleNotification(
        {
          type: "milestone",
          title: "Milestone Deadline Approaching",
          message: `Milestone "${milestone.title}" is due tomorrow`,
          goalId: milestone.goal_id,
          milestoneId: milestone.id,
          action: {
            type: "view-milestone",
            data: { milestoneId: milestone.id },
          },
        },
        delay,
      );

      scheduledNotifications.set(notificationId, timerId);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  };

  const clearNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const showNotification = (notification: Notification) => {
    if (permission === "granted") {
      toast({
        title: notification.title,
        description: notification.message,
        action:
          notification.action?.type === "check-in"
            ? {
                label: "Check In",
                onClick: () => {
                  // Handle check-in action
                },
              }
            : undefined,
      });
    }
  };

  return {
    notifications,
    permission,
    markAsRead,
    clearNotification,
    showNotification,
  };
}
