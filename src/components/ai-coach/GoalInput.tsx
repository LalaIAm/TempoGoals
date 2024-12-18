import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import GoalSuggestions from "./GoalSuggestions";

interface GoalInputProps {
  onSubmit?: (goal: string) => Promise<void>;
  onSuggestionAccept?: (suggestion: {
    id: string;
    text: string;
    category: "personal" | "work" | "health";
    confidence: number;
  }) => void;
  onSuggestionReject?: (suggestion: {
    id: string;
    text: string;
    category: "personal" | "work" | "health";
    confidence: number;
  }) => void;
  isLoading?: boolean;
  isSuggestionsLoading?: boolean;
}

const GoalInput = ({
  onSubmit = async () => {},
  onSuggestionAccept = () => {},
  onSuggestionReject = () => {},
  isLoading = false,
  isSuggestionsLoading = false,
}: GoalInputProps) => {
  const [goalInput, setGoalInput] = useState("");

  const handleSubmit = async () => {
    if (!goalInput.trim()) return;
    try {
      await onSubmit(goalInput);
      setGoalInput("");
    } catch (error) {
      console.error("Error submitting goal:", error);
    }
  };

  return (
    <div className="w-[600px] space-y-6 bg-background">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Tell me about your goal</span>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="Describe your goal in natural language..."
              className="min-h-[100px] resize-none"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!goalInput.trim() || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Get AI Suggestions
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <GoalSuggestions
        onAccept={onSuggestionAccept}
        onReject={onSuggestionReject}
        isLoading={isSuggestionsLoading}
      />
    </div>
  );
};

export default GoalInput;
