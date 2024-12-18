import React from "react";
import CompletionRate from "./summary/CompletionRate";
import DeadlinesList from "./summary/DeadlinesList";
import { useDeadlines } from "@/hooks/useDeadlines";
import { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"] & {
  milestones: Database["public"]["Tables"]["milestones"]["Row"][];
};

interface SummarySectionProps {
  goals?: Goal[];
}

const SummarySection = ({ goals = [] }: SummarySectionProps) => {
  const { deadlines } = useDeadlines(goals);

  const completionData = {
    totalGoals: goals.length,
    completedGoals: goals.filter((goal) => goal.progress === 100).length,
    rate: goals.length
      ? (goals.filter((goal) => goal.progress === 100).length / goals.length) *
        100
      : 0,
    trend: 0, // You would calculate this based on historical data
  };

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
