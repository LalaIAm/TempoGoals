import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Lightbulb, ArrowRight } from "lucide-react";

interface GoalAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adjustments: Array<{
    type: "timeline" | "milestone" | "scope" | "strategy";
    recommendation: string;
    reasoning: string;
    impact: string;
    changes: any;
  }>;
  onAccept: (adjustment: any) => void;
  onModify: (adjustment: any, feedback: string) => void;
  isLoading?: boolean;
}

const GoalAdjustmentDialog = ({
  open,
  onOpenChange,
  adjustments = [],
  onAccept,
  onModify,
  isLoading = false,
}: GoalAdjustmentDialogProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "timeline":
        return <Calendar className="h-4 w-4" />;
      case "milestone":
        return <Target className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "timeline":
        return "bg-blue-100 text-blue-800";
      case "milestone":
        return "bg-green-100 text-green-800";
      case "scope":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Suggested Goal Adjustments
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {adjustments.map((adjustment, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg space-y-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={`flex items-center gap-1 ${getTypeColor(
                      adjustment.type,
                    )}`}
                  >
                    {getTypeIcon(adjustment.type)}
                    {adjustment.type.charAt(0).toUpperCase() +
                      adjustment.type.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">{adjustment.recommendation}</p>
                  <p className="text-sm text-muted-foreground">
                    {adjustment.reasoning}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-primary">
                    <ArrowRight className="h-4 w-4" />
                    <span>{adjustment.impact}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onModify(adjustment, "")}
                    disabled={isLoading}
                  >
                    Modify
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onAccept(adjustment)}
                    disabled={isLoading}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
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

export default GoalAdjustmentDialog;
