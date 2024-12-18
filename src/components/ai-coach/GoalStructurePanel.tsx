import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CategoryConfidence from "./CategoryConfidence";
import MilestoneList from "./MilestoneList";

interface GoalStructurePanelProps {
  category?: "personal" | "work" | "health";
  confidence?: number;
  milestones?: Array<{
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }>;
  onMilestoneToggle?: (id: string, completed: boolean) => void;
  onMilestoneAdd?: () => void;
  onMilestoneEdit?: (id: string) => void;
  onMilestoneDelete?: (id: string) => void;
  isLoading?: boolean;
}

const GoalStructurePanel = ({
  category = "personal",
  confidence = 85,
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
  onMilestoneToggle = () => {},
  onMilestoneAdd = () => {},
  onMilestoneEdit = () => {},
  onMilestoneDelete = () => {},
  isLoading = false,
}: GoalStructurePanelProps) => {
  return (
    <Card className="w-[400px] h-[600px] flex flex-col bg-background">
      <div className="p-4 border-b">
        <CategoryConfidence
          category={category}
          confidence={confidence}
          isLoading={isLoading}
        />
      </div>

      <ScrollArea className="flex-1 p-4">
        <MilestoneList
          milestones={milestones}
          onToggle={onMilestoneToggle}
          onAdd={onMilestoneAdd}
          onEdit={onMilestoneEdit}
          onDelete={onMilestoneDelete}
          isLoading={isLoading}
        />
      </ScrollArea>
    </Card>
  );
};

export default GoalStructurePanel;
