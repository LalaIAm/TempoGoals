import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import ChatInterface from "./ChatInterface";
import GoalStructurePanel from "./GoalStructurePanel";
import ProgressTracker from "./ProgressTracker";
import SuggestionDialog from "./SuggestionDialog";
import GoalAdjustmentDialog from "./GoalAdjustmentDialog";
import NotificationBell from "./NotificationBell";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import {
  createGoal,
  createMilestone,
  updateGoal,
  addGoalHistory,
  updateMilestone,
  deleteMilestone,
} from "@/lib/goals";
import { generateGoalAdjustments, analyzeAdjustmentFeedback } from "@/lib/ai";
import type { Notification } from "@/lib/notifications";

interface GoalCoachProps {
  userAvatar?: string;
  userName?: string;
}

const GoalCoach = ({
  userAvatar = "https://dummyimage.com/200/cccccc/666666&text=U",
  userName = "User",
}: GoalCoachProps) => {
  const [adjustments, setAdjustments] = useState([]);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeGoal, setActiveGoal] = useState(null);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { notifications, markAsRead, clearNotification } = useNotifications(
    user?.id || "anonymous",
  );

  const handleMessage = async (message: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    switch (notification.action?.type) {
      case "check-in":
        if (notification.goalId) {
          setActiveGoal(notification.goalId);
          // Handle check-in
        }
        break;
      case "view-milestone":
        if (notification.goalId && notification.milestoneId) {
          setActiveGoal(notification.goalId);
          // Scroll to milestone
        }
        break;
      case "update-progress":
        if (notification.goalId) {
          setActiveGoal(notification.goalId);
          setShowAdjustments(true);
        }
        break;
    }
  };

  const handleAcceptSuggestion = async (suggestion: any) => {
    try {
      setIsLoading(true);
      // Implement suggestion acceptance logic
      setShowSuggestion(false);
      toast({
        title: "Success",
        description: "Suggestion applied successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply suggestion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifySuggestion = async (suggestion: any, feedback: string) => {
    try {
      setIsLoading(true);
      // Implement suggestion modification logic
      setShowSuggestion(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to modify suggestion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptAdjustment = async (adjustment: any) => {
    try {
      setIsLoading(true);
      // Implement adjustment acceptance logic
      setShowAdjustments(false);
      toast({
        title: "Success",
        description: "Adjustments applied successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply adjustments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifyAdjustment = async (adjustment: any, feedback: string) => {
    try {
      setIsLoading(true);
      // Implement adjustment modification logic
      setShowAdjustments(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to modify adjustments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-[1200px]">
        <Card className="p-6 bg-background">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Goal Coach</h2>
            <NotificationBell
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onClearNotification={clearNotification}
            />
          </div>

          <div className="space-y-6">
            <ProgressTracker
              progress={activeGoal?.progress || 0}
              nextMilestone={activeGoal?.nextMilestone}
              nextCheckIn={new Date(
                Date.now() + 24 * 60 * 60 * 1000,
              ).toISOString()}
              notificationsEnabled={true}
              isLoading={isLoading}
            />

            <div className="flex gap-6">
              <ChatInterface
                messages={messages}
                onSendMessage={handleMessage}
                isLoading={isLoading}
                userAvatar={userAvatar}
                userName={userName}
              />

              <GoalStructurePanel
                category={activeGoal?.category || "personal"}
                confidence={currentSuggestion?.confidence || 0}
                milestones={activeGoal?.milestones || []}
                isLoading={isLoading}
              />
            </div>

            {currentSuggestion && (
              <SuggestionDialog
                open={showSuggestion}
                onOpenChange={setShowSuggestion}
                suggestion={currentSuggestion}
                onAccept={handleAcceptSuggestion}
                onModify={handleModifySuggestion}
                isLoading={isLoading}
              />
            )}

            <GoalAdjustmentDialog
              open={showAdjustments}
              onOpenChange={setShowAdjustments}
              adjustments={adjustments}
              onAccept={handleAcceptAdjustment}
              onModify={handleModifyAdjustment}
              isLoading={isLoading}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GoalCoach;
