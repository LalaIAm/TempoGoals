import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, AlertCircleIcon } from "lucide-react";

interface DeadlinesListProps {
  deadlines?: Array<{
    id: string;
    title: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
    daysRemaining: number;
  }>;
}

const DeadlinesList = ({
  deadlines = [
    {
      id: "1",
      title: "Complete Project Documentation",
      dueDate: "2024-06-30",
      priority: "high",
      daysRemaining: 5,
    },
    {
      id: "2",
      title: "Review Q2 Goals",
      dueDate: "2024-07-15",
      priority: "medium",
      daysRemaining: 12,
    },
    {
      id: "3",
      title: "Update Team Progress",
      dueDate: "2024-07-01",
      priority: "low",
      daysRemaining: 7,
    },
  ],
}: DeadlinesListProps) => {
  const getPriorityColor = (priority: string) => {
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

  const getUrgencyIcon = (daysRemaining: number) => {
    if (daysRemaining <= 3) {
      return <AlertCircleIcon className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <Card className="w-[300px] bg-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{deadline.title}</span>
                  {getUrgencyIcon(deadline.daysRemaining)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(deadline.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={getPriorityColor(deadline.priority)}
              >
                {deadline.priority}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeadlinesList;
