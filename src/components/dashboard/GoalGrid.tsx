import React, { useState } from "react";
import { useGoals } from "@/hooks/useGoals";
import GoalCard from "./goals/GoalCard";
import GoalDetails from "./goals/GoalDetails";
import FilterBar from "./FilterBar";
import { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"] & {
  milestones: Database["public"]["Tables"]["milestones"]["Row"][];
  goal_history: Database["public"]["Tables"]["goal_history"]["Row"][];
};

interface GoalGridProps {
  onGoalClick?: (goalId: string) => void;
}

const GoalGrid = ({ onGoalClick = () => {} }: GoalGridProps) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const { goals, isLoading, error, filters, setFilters, refresh } = useGoals();

  const handleGoalClick = (goalId: string) => {
    setSelectedGoal(goalId);
    onGoalClick(goalId);
  };

  const selectedGoalData = goals.find((goal) => goal.id === selectedGoal);

  return (
    <div className="w-full bg-background">
      <FilterBar
        selectedCategory={filters.category}
        selectedTimeline={filters.timeline}
        selectedPriority={filters.priority}
        onCategoryChange={(value) =>
          setFilters((prev) => ({ ...prev, category: value }))
        }
        onTimelineChange={(value) =>
          setFilters((prev) => ({ ...prev, timeline: value }))
        }
        onGoalCreated={refresh}
        onPriorityChange={(value) =>
          setFilters((prev) => ({ ...prev, priority: value }))
        }
      />

      <div className="min-h-[500px] p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Loading goals...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[200px] text-destructive">
            Error loading goals: {error.message}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                title={goal.title}
                description={goal.description || ""}
                category={goal.category}
                priority={goal.priority}
                progress={goal.progress}
                dueDate={goal.due_date}
                onClick={() => handleGoalClick(goal.id)}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && goals.length === 0 && (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No goals match the selected filters
          </div>
        )}

        {selectedGoalData && (
          <GoalDetails
            open={!!selectedGoal}
            goalId={selectedGoalData.id}
            onOpenChange={(open) => !open && setSelectedGoal(null)}
            title={selectedGoalData.title}
            description={selectedGoalData.description || ""}
            category={selectedGoalData.category}
            priority={selectedGoalData.priority}
            progress={selectedGoalData.progress}
            dueDate={selectedGoalData.due_date}
            milestones={selectedGoalData.milestones}
            history={selectedGoalData.goal_history.map((h) => ({
              date: h.created_at || "",
              action: h.action,
              progress: h.progress,
            }))}
            onProgressUpdate={refresh}
          />
        )}
      </div>
    </div>
  );
};

export default GoalGrid;
