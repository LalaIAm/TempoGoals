import { useState, useEffect, useCallback } from "react";
import { fetchGoals } from "@/lib/goals";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"] & {
  milestones: Database["public"]["Tables"]["milestones"]["Row"][];
  goal_history: Database["public"]["Tables"]["goal_history"]["Row"][];
};

type Filters = {
  category?: string;
  timeline?: string;
  priority?: string;
};

export const useGoals = (initialFilters?: Filters) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState(
    initialFilters || {
      category: "all",
      timeline: "all",
      priority: "all",
    },
  );

  const loadGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchGoals();
      setGoals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch goals"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();

    // Subscribe to goals changes
    const goalsSubscription = supabase
      .channel("goals-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "goals",
        },
        () => {
          loadGoals();
        },
      )
      .subscribe();

    // Subscribe to milestones changes
    const milestonesSubscription = supabase
      .channel("milestones-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "milestones",
        },
        () => {
          loadGoals();
        },
      )
      .subscribe();

    // Subscribe to goal history changes
    const historySubscription = supabase
      .channel("history-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "goal_history",
        },
        () => {
          loadGoals();
        },
      )
      .subscribe();

    return () => {
      goalsSubscription.unsubscribe();
      milestonesSubscription.unsubscribe();
      historySubscription.unsubscribe();
    };
  }, [loadGoals]);

  useEffect(() => {
    let filtered = [...goals];

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((goal) => goal.category === filters.category);
    }

    if (filters.priority && filters.priority !== "all") {
      filtered = filtered.filter((goal) => goal.priority === filters.priority);
    }

    if (filters.timeline && filters.timeline !== "all") {
      const now = new Date();
      filtered = filtered.filter((goal) => {
        const dueDate = new Date(goal.due_date);
        const daysUntilDue = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        switch (filters.timeline) {
          case "daily":
            return daysUntilDue <= 1;
          case "weekly":
            return daysUntilDue <= 7;
          case "monthly":
            return daysUntilDue <= 30;
          case "quarterly":
            return daysUntilDue <= 90;
          default:
            return true;
        }
      });
    }

    setFilteredGoals(filtered);
  }, [filters, goals]);

  return {
    goals: filteredGoals,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: loadGoals,
  };
};
