import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";

interface Suggestion {
  id: string;
  text: string;
  category: "personal" | "work" | "health";
  confidence: number;
}

interface GoalSuggestionsProps {
  suggestions?: Suggestion[];
  onAccept?: (suggestion: Suggestion) => void;
  onReject?: (suggestion: Suggestion) => void;
  isLoading?: boolean;
}

const GoalSuggestions = ({
  suggestions = [
    {
      id: "1",
      text: "Run 5km three times a week to improve cardiovascular health",
      category: "health",
      confidence: 0.85,
    },
    {
      id: "2",
      text: "Complete the project documentation by end of next week",
      category: "work",
      confidence: 0.92,
    },
    {
      id: "3",
      text: "Learn to play one new song on the guitar each month",
      category: "personal",
      confidence: 0.78,
    },
  ],
  onAccept = () => {},
  onReject = () => {},
  isLoading = false,
}: GoalSuggestionsProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "personal":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "work":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case "health":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  if (isLoading) {
    return (
      <div className="w-[600px] h-[150px] bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Generating suggestions...</p>
      </div>
    );
  }

  return (
    <div className="w-[600px] space-y-4 bg-background">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4" />
        <span>AI-Generated Suggestions</span>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={getCategoryColor(suggestion.category)}
                  >
                    {suggestion.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-sm">{suggestion.text}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-green-600 hover:text-green-700 hover:bg-green-100"
                  onClick={() => onAccept(suggestion)}
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-100"
                  onClick={() => onReject(suggestion)}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalSuggestions;
