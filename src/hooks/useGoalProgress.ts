import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { calculateGoalHealth, getNextMilestone } from "@/lib/goals";
import { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"];
type Milestone = Database["public"]["Tables"]["milestones"]["Row"];

interface GoalProgress {
  goal: Goal;
  nextMilestone: Milestone | null;
  health: {
    isOnTrack: boolean;
    progressDelta: number;
    remainingDays: number;
    overdueMilestones: number;
  };
  recentUpdates: Array<{
    date: string;
    progress: number;
    action: string;
  }>;
}

export function useGoalProgress(goalId: string) {
  const [progress, setProgress] = useState<GoalProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);

        // Fetch goal with milestones and history
        const { data: goal, error: goalError } = await supabase
          .from("goals")
          .select(
            `
            *,
            milestones (*),
            goal_history (*)
          `,
          )
          .eq("id", goalId)
          .single();

        if (goalError) throw goalError;

        // Get next milestone
        const nextMilestone = await getNextMilestone(goalId);

        // Calculate goal health
        const health = await calculateGoalHealth(goalId);

        // Get recent updates
        const recentUpdates = goal.goal_history
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 5)
          .map((h: any) => ({
            date: h.created_at,
            progress: h.progress,
            action: h.action,
          }));

        setProgress({
          goal,
          nextMilestone,
          health,
          recentUpdates,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load progress"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();

    // Subscribe to real-time updates
    const goalSubscription = supabase
      .channel(`goal-${goalId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "goals",
          filter: `id=eq.${goalId}`,
        },
        loadProgress,
      )
      .subscribe();

    const milestoneSubscription = supabase
      .channel(`milestones-${goalId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "milestones",
          filter: `goal_id=eq.${goalId}`,
        },
        loadProgress,
      )
      .subscribe();

    return () => {
      goalSubscription.unsubscribe();
      milestoneSubscription.unsubscribe();
    };
  }, [goalId]);

  return { progress, isLoading, error };
}
