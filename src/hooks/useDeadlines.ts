import { useState, useEffect } from "react";
import { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"] & {
  milestones: Database["public"]["Tables"]["milestones"]["Row"][];
};

type Deadline = {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  daysRemaining: number;
};

export const useDeadlines = (goals: Goal[]) => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  useEffect(() => {
    const calculateDeadlines = () => {
      const now = new Date();
      const allDeadlines: Deadline[] = [];

      // Add goals deadlines
      goals.forEach((goal) => {
        const dueDate = new Date(goal.due_date);
        const daysRemaining = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysRemaining > 0) {
          allDeadlines.push({
            id: goal.id,
            title: goal.title,
            dueDate: goal.due_date,
            priority: goal.priority,
            daysRemaining,
          });
        }
      });

      // Add milestone deadlines
      goals.forEach((goal) => {
        goal.milestones?.forEach((milestone) => {
          if (!milestone.completed) {
            const dueDate = new Date(milestone.due_date);
            const daysRemaining = Math.ceil(
              (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
            );

            if (daysRemaining > 0) {
              allDeadlines.push({
                id: milestone.id,
                title: `${milestone.title} (${goal.title})`,
                dueDate: milestone.due_date,
                priority: goal.priority,
                daysRemaining,
              });
            }
          }
        });
      });

      // Sort by days remaining and limit to next 5 deadlines
      const sortedDeadlines = allDeadlines
        .sort((a, b) => a.daysRemaining - b.daysRemaining)
        .slice(0, 5);

      setDeadlines(sortedDeadlines);
    };

    calculateDeadlines();
  }, [goals]);

  return { deadlines };
};
