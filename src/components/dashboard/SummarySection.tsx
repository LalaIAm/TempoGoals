import React from "react";
import CompletionRate from "./summary/CompletionRate";
import DeadlinesList from "./summary/DeadlinesList";

interface SummarySectionProps {
  completionData?: {
    totalGoals: number;
    completedGoals: number;
    rate: number;
    trend: number;
  };
  deadlines?: Array<{
    id: string;
    title: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
    daysRemaining: number;
  }>;
}

const SummarySection = ({
  completionData = {
    totalGoals: 10,
    completedGoals: 7,
    rate: 70,
    trend: 5,
  },
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
}: SummarySectionProps) => {
  return (
    <div className="w-full h-[150px] p-6 bg-background">
      <div className="flex items-start justify-between gap-6">
        <CompletionRate
          totalGoals={completionData.totalGoals}
          completedGoals={completionData.completedGoals}
          rate={completionData.rate}
          trend={completionData.trend}
        />
        <DeadlinesList deadlines={deadlines} />
      </div>
    </div>
  );
};

export default SummarySection;
