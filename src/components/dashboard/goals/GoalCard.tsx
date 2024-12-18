import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GoalCardProps {
  title?: string;
  description?: string;
  category?: string;
  priority?: "high" | "medium" | "low";
  progress?: number;
  dueDate?: string;
  onClick?: () => void;
}

const GoalCard = ({
  title = "Sample Goal",
  description = "This is a sample goal description that shows what the goal is about.",
  category = "personal",
  priority = "medium",
  progress = 0,
  dueDate = "2024-12-31",
  onClick = () => {},
}: GoalCardProps) => {
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
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className="w-[350px] h-[200px] bg-background cursor-pointer hover:shadow-md transition-shadow"
          onClick={onClick}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <Badge variant="outline" className={getPriorityColor()}>
                {priority}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">{category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  {new Date(dueDate).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <div className="bg-background p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex gap-2 mb-4">
          <Badge variant="secondary">{category}</Badge>
          <Badge variant="outline" className={getPriorityColor()}>
            {priority}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Due: {new Date(dueDate).toLocaleDateString()}
        </p>
      </div>
    </Dialog>
  );
};

export default GoalCard;
