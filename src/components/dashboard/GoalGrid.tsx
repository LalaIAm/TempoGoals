import React, { useEffect, useState } from "react";
import { fetchGoals } from "@/lib/goals";
import GoalCard from "./goals/GoalCard";
import GoalDetails from "./goals/GoalDetails";
import { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"] & {
  milestones: Database["public"]["Tables"]["milestones"]["Row"][];
  goal_history: Database["public"]["Tables"]["goal_history"]["Row"][];
};

interface GoalGridProps {
  goals?: Goal[];
  onGoalClick?: (goalId: string) => void;
}

const GoalGrid = ({ goals = [], onGoalClick = () => {} }: GoalGridProps) => {
  const [selectedGoal, setSelectedGoal] = React.useState<string | null>(null);
  const [loadedGoals, setLoadedGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await fetchGoals();
        setLoadedGoals(data || []);
      } catch (error) {
        console.error("Error loading goals:", error);
      }
    };
    loadGoals();
  }, []);

  const handleGoalClick = (goalId: string) => {
    setSelectedGoal(goalId);
    onGoalClick(goalId);
  };

  const selectedGoalData = loadedGoals.find((goal) => goal.id === selectedGoal);

  return (
    <div className="w-full min-h-[500px] p-6 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loadedGoals.map((goal) => (
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

      {selectedGoalData && (
        <GoalDetails
          open={!!selectedGoal}
          onOpenChange={(open) => !open && setSelectedGoal(null)}
          title={selectedGoalData.title}
          description={selectedGoalData.description || ""}
          category={selectedGoalData.category}
          priority={selectedGoalData.priority}
          progress={selectedGoalData.progress}
          dueDate={selectedGoalData.due_date}
          milestones={selectedGoalData.milestones.map((m) => ({
            title: m.title,
            completed: m.completed || false,
            date: m.due_date,
          }))}
          history={selectedGoalData.goal_history.map((h) => ({
            date: h.created_at || "",
            action: h.action,
            progress: h.progress,
          }))}
        />
      )}
    </div>
  );
};

export default GoalGrid;
