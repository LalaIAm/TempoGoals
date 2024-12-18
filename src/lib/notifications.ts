export interface Notification {
  id: string;
  type: "check-in" | "milestone" | "progress";
  title: string;
  message: string;
  timestamp: string;
  goalId?: string;
  milestoneId?: string;
  read: boolean;
  action?: {
    type: "check-in" | "view-milestone" | "update-progress";
    data?: any;
  };
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return Promise.reject("Notifications not supported");
  }

  return Notification.requestPermission();
}

export function scheduleNotification(
  notification: Omit<Notification, "id" | "timestamp" | "read">,
  delay: number,
): number {
  return window.setTimeout(() => {
    if (Notification.permission === "granted") {
      const systemNotification = new Notification(notification.title, {
        body: notification.message,
        icon: "/notification-icon.png",
        tag: notification.type,
      });

      systemNotification.onclick = () => {
        window.focus();
        if (notification.action) {
          // Handle notification click based on action type
          window.dispatchEvent(
            new CustomEvent("notification-click", {
              detail: notification,
            }),
          );
        }
      };
    }
  }, delay);
}

export function cancelScheduledNotification(timerId: number) {
  window.clearTimeout(timerId);
}
