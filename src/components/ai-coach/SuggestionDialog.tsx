import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, ThumbsUp, ThumbsDown } from "lucide-react";

interface SuggestionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  suggestion?: {
    text: string;
    category: "personal" | "work" | "health";
    confidence: number;
    milestones?: Array<{
      title: string;
      dueDate: string;
    }>;
  };
  onAccept?: () => void;
  onModify?: () => void;
  isLoading?: boolean;
}

const SuggestionDialog = ({
  open = true,
  onOpenChange = () => {},
  suggestion = {
    text: "Run 5km three times a week to improve cardiovascular health",
    category: "health",
    confidence: 0.85,
    milestones: [
      {
        title: "Start with 1km runs twice a week",
        dueDate: "2024-03-15",
      },
      {
        title: "Increase to 3km runs",
        dueDate: "2024-03-30",
      },
      {
        title: "Achieve 5km run goal",
        dueDate: "2024-04-15",
      },
    ],
  },
  onAccept = () => {},
  onModify = () => {},
  isLoading = false,
}: SuggestionDialogProps) => {
  const getCategoryColor = () => {
    switch (suggestion.category) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Suggestion
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={getCategoryColor()}>
                {suggestion.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Progress
                  value={suggestion.confidence * 100}
                  className="w-[100px] h-2"
                />
                <span className="text-xs text-muted-foreground">
                  {Math.round(suggestion.confidence * 100)}% confidence
                </span>
              </div>
            </div>

            <p className="text-foreground">{suggestion.text}</p>
          </div>

          {suggestion.milestones && suggestion.milestones.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Suggested Milestones</h4>
              <div className="space-y-2">
                {suggestion.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm">{milestone.title}</span>
                      <span className="text-xs text-muted-foreground">
                        Due {new Date(milestone.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-green-600 hover:text-green-700 hover:bg-green-100"
              onClick={onAccept}
              disabled={isLoading}
            >
              <ThumbsUp className="w-4 h-4 mr-2" /> Accept
            </Button>
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-100"
              onClick={onModify}
              disabled={isLoading}
            >
              <ThumbsDown className="w-4 h-4 mr-2" /> Modify
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionDialog;
