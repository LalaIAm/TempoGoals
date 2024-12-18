import { useState, useEffect } from "react";
import { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"];

type Metric = {
  title: string;
  value: string | number;
  change: number;
  progress: number;
  description: string;
};

export const useMetrics = (goals: Goal[]) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    const calculateMetrics = () => {
      const totalGoals = goals.length;
      const completedGoals = goals.filter(
        (goal) => goal.progress === 100,
      ).length;
      const inProgressGoals = goals.filter(
        (goal) => goal.progress > 0 && goal.progress < 100,
      ).length;
      const averageProgress =
        goals.reduce((acc, goal) => acc + goal.progress, 0) / totalGoals || 0;

      const newMetrics: Metric[] = [
        {
          title: "Goals Completed",
          value: completedGoals,
          change: 0, // You would calculate this based on historical data
          progress: (completedGoals / totalGoals) * 100 || 0,
          description: "Total goals completed",
        },
        {
          title: "In Progress",
          value: inProgressGoals,
          change: 0,
          progress: (inProgressGoals / totalGoals) * 100 || 0,
          description: "Goals currently in progress",
        },
        {
          title: "Success Rate",
          value: `${Math.round(averageProgress)}%`,
          change: 0,
          progress: averageProgress,
          description: "Overall goal completion rate",
        },
      ];

      setMetrics(newMetrics);
    };

    calculateMetrics();
  }, [goals]);

  return { metrics };
};
