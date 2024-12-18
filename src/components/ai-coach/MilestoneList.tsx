import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, CheckCircle2, Clock, Plus } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface MilestoneListProps {
  milestones?: Milestone[];
  onToggle?: (id: string, completed: boolean) => void;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

const MilestoneList = ({
  milestones = [
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
  ],
  onToggle = () => {},
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
  isLoading = false,
}: MilestoneListProps) => {
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (dueDate: string, completed: boolean) => {
    if (completed) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
        </Badge>
      );
    }

    const daysRemaining = getDaysRemaining(dueDate);
    if (daysRemaining < 0) {
      return (
        <Badge variant="destructive">
          <Clock className="w-3 h-3 mr-1" /> Overdue
        </Badge>
      );
    }
    if (daysRemaining <= 3) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" /> Due soon
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        <Clock className="w-3 h-3 mr-1" /> In progress
      </Badge>
    );
  };

  return (
    <Card className="w-[360px] h-[400px] bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Milestones</h3>
        <Button size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      <ScrollArea className="h-[340px]">
        <div className="p-4 space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={milestone.completed}
                  onCheckedChange={(checked) =>
                    onToggle(milestone.id, checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {milestone.title}
                    </span>
                    {getStatusBadge(milestone.dueDate, milestone.completed)}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon className="w-3 h-3" />
                    <span>
                      Due {new Date(milestone.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {milestones.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No milestones yet
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default MilestoneList;
