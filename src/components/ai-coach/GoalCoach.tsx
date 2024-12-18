import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import ChatInterface from "./ChatInterface";
import GoalStructurePanel from "./GoalStructurePanel";
import ProgressTracker from "./ProgressTracker";
import SuggestionDialog from "./SuggestionDialog";
import { useToast } from "@/components/ui/use-toast";
import { createGoal } from "@/lib/goals";
import { generateChatResponse, generateGoalSuggestion } from "@/lib/ai";

interface Message {
  id: string;
  type: "user" | "ai";
  message: string;
  timestamp: string;
}

interface Suggestion {
  text: string;
  category: "personal" | "work" | "health";
  confidence: number;
  milestones: Array<{
    title: string;
    dueDate: string;
  }>;
}

interface GoalCoachProps {
  userAvatar?: string;
  userName?: string;
}

const GoalCoach = ({
  userAvatar = "https://dummyimage.com/200/cccccc/666666&text=U",
  userName = "User",
}: GoalCoachProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      message: "Hello! I'm your AI Goal Coach. How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(
    null,
  );
  const { toast } = useToast();

  useEffect(() => {
    document.title = "AI Goal Coach";
  }, []);

  // Process user message and generate AI response
  const handleMessage = async (userMessage: string) => {
    try {
      setIsLoading(true);

      // Add user message
      const userMsg: Message = {
        id: Date.now().toString(),
        type: "user",
        message: userMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Convert messages to OpenAI format
      const aiMessages = messages.map((msg) => ({
        role: msg.type === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.message,
      }));
      aiMessages.push({ role: "user", content: userMessage });

      // Generate suggestion if goal intent detected
      if (userMessage.toLowerCase().includes("goal")) {
        const suggestion = await generateGoalSuggestion(userMessage);
        setCurrentSuggestion(suggestion);
        setShowSuggestion(true);
      }

      // Get AI response
      const aiResponseText = await generateChatResponse(aiMessages);

      // Add AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        message: aiResponseText,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle accepting a goal suggestion
  const handleAcceptSuggestion = async () => {
    if (!currentSuggestion) return;

    try {
      setIsLoading(true);

      // Create the goal
      await createGoal({
        title: currentSuggestion.text,
        category: currentSuggestion.category,
        description: "",
        priority: "medium",
        due_date:
          currentSuggestion.milestones[currentSuggestion.milestones.length - 1]
            .dueDate,
        progress: 0,
      });

      // Add confirmation message
      const aiResponse: Message = {
        id: Date.now().toString(),
        type: "ai",
        message:
          "Great! I've created the goal for you. Let's break it down into milestones.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiResponse]);

      toast({
        title: "Success",
        description: "Goal created successfully",
      });

      setShowSuggestion(false);
      setCurrentSuggestion(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modifying a goal suggestion
  const handleModifySuggestion = () => {
    if (!currentSuggestion) return;

    // Add modification prompt
    const aiResponse: Message = {
      id: Date.now().toString(),
      type: "ai",
      message:
        "What would you like to modify about this goal? You can change the description, timeline, or milestones.",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, aiResponse]);

    setShowSuggestion(false);
  };

  return (
    <div className="container mx-auto py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-[1200px]">
        <Card className="p-6 bg-background">
          <div className="space-y-6">
            <ProgressTracker
              progress={65}
              nextMilestone={{
                title: "Complete project documentation",
                dueDate: "2024-03-15",
              }}
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
                category="personal"
                confidence={85}
                milestones={[
                  {
                    id: "1",
                    title: "Research and define target audience",
                    dueDate: "2024-03-15",
                    completed: false,
                  },
                  {
                    id: "2",
                    title: "Create project timeline",
                    dueDate: "2024-03-20",
                    completed: true,
                  },
                  {
                    id: "3",
                    title: "Develop initial prototype",
                    dueDate: "2024-04-01",
                    completed: false,
                  },
                ]}
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GoalCoach;
