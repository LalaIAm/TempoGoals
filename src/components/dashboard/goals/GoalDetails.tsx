import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, ClockIcon, TargetIcon, HistoryIcon } from "lucide-react";

interface GoalDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  category?: string;
  priority?: "high" | "medium" | "low";
  progress?: number;
  dueDate?: string;
  milestones?: Array<{
    title: string;
    completed: boolean;
    date: string;
  }>;
  history?: Array<{
    date: string;
    action: string;
    progress: number;
  }>;
}

const GoalDetails = ({
  open = true,
  onOpenChange = () => {},
  title = "Sample Goal",
  description = "This is a sample goal description that provides detailed information about what needs to be accomplished.",
  category = "personal",
  priority = "medium",
  progress = 65,
  dueDate = "2024-12-31",
  milestones = [
    { title: "Initial Planning", completed: true, date: "2024-01-15" },
    { title: "Research Phase", completed: true, date: "2024-02-15" },
    { title: "Implementation", completed: false, date: "2024-03-15" },
    { title: "Review & Testing", completed: false, date: "2024-04-15" },
  ],
  history = [
    { date: "2024-01-15", action: "Goal Created", progress: 0 },
    { date: "2024-02-01", action: "Updated Progress", progress: 25 },
    { date: "2024-03-01", action: "Milestone Completed", progress: 50 },
    { date: "2024-03-15", action: "Updated Progress", progress: 65 },
  ],
}: GoalDetailsProps) => {
  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline" className={getPriorityColor()}>
              {priority}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
            </div>
          </div>

          <p className="text-muted-foreground">{description}</p>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Tabs defaultValue="milestones" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="milestones"
                className="flex items-center gap-2"
              >
                <TargetIcon className="w-4 h-4" /> Milestones
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4" /> History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="milestones" className="mt-4 space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${milestone.completed ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span>{milestone.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ClockIcon className="w-4 h-4" />
                    <span>{new Date(milestone.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="history" className="mt-4 space-y-4">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span>{entry.action}</span>
                    <Badge variant="secondary">{entry.progress}%</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button>Update Progress</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDetails;
