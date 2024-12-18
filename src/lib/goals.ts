import { supabase } from "./supabase";
import { Database } from "@/types/supabase";

type MilestoneInsert = Database["public"]["Tables"]["milestones"]["Insert"];
type GoalHistoryInsert = Database["public"]["Tables"]["goal_history"]["Insert"];

export const fetchGoals = async () => {
  const { data, error } = await supabase.from("goals").select(`
    *,
    milestones (*),
    goal_history (*)
  `);

  if (error) throw error;
  return data;
};

export const createGoal = async (goal) => {
  const { data, error } = await supabase.from("goals").insert(goal).select();

  if (error) throw error;
  return data[0];
};

export const updateGoal = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteGoal = async (id: string) => {
  const { error: milestoneError } = await supabase
    .from("milestones")
    .delete()
    .eq("goal_id", id);

  if (milestoneError) throw milestoneError;

  const { error: historyError } = await supabase
    .from("goal_history")
    .delete()
    .eq("goal_id", id);

  if (historyError) throw historyError;

  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) throw error;
};

export const createMilestone = async (milestone: MilestoneInsert) => {
  const { data, error } = await supabase
    .from("milestones")
    .insert(milestone)
    .select();

  if (error) throw error;
  return data[0];
};

export const updateMilestone = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("milestones")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;

  // Update parent goal progress
  if ("completed" in updates) {
    const { data: milestone } = await supabase
      .from("milestones")
      .select("goal_id")
      .eq("id", id)
      .single();

    if (milestone) {
      await updateGoalProgress(milestone.goal_id);
    }
  }

  return data[0];
};

export const deleteMilestone = async (id: string) => {
  const { data: milestone } = await supabase
    .from("milestones")
    .select("goal_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("milestones").delete().eq("id", id);
  if (error) throw error;

  if (milestone) {
    await updateGoalProgress(milestone.goal_id);
  }
};

export const addGoalHistory = async (history: GoalHistoryInsert) => {
  const { data, error } = await supabase
    .from("goal_history")
    .insert(history)
    .select();

  if (error) throw error;
  return data[0];
};

export const updateGoalProgress = async (goalId: string) => {
  // Fetch all milestones for the goal
  const { data: milestones, error: milestonesError } = await supabase
    .from("milestones")
    .select("*")
    .eq("goal_id", goalId);

  if (milestonesError) throw milestonesError;

  // Calculate progress based on completed milestones
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.completed).length;
  const progress =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

  // Update goal progress
  const { data, error } = await supabase
    .from("goals")
    .update({ progress })
    .eq("id", goalId)
    .select();

  if (error) throw error;

  // Add history entry for progress update
  await addGoalHistory({
    goal_id: goalId,
    action: "Milestone Progress Update",
    progress,
  });

  return data[0];
};

export const getNextMilestone = async (goalId: string) => {
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("goal_id", goalId)
    .eq("completed", false)
    .order("due_date", { ascending: true })
    .limit(1);

  if (error) throw error;
  return data[0];
};

export const calculateGoalHealth = async (goalId: string) => {
  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select(
      `
      *,
      milestones (*)
    `,
    )
    .eq("id", goalId)
    .single();

  if (goalError) throw goalError;

  const now = new Date();
  const dueDate = new Date(goal.due_date);
  const totalDuration = dueDate.getTime() - new Date(goal.created_at).getTime();
  const remainingTime = dueDate.getTime() - now.getTime();
  const expectedProgress =
    ((totalDuration - remainingTime) / totalDuration) * 100;

  return {
    isOnTrack: goal.progress >= expectedProgress,
    progressDelta: goal.progress - expectedProgress,
    remainingDays: Math.ceil(remainingTime / (1000 * 60 * 60 * 24)),
    overdueMilestones: goal.milestones.filter(
      (m: any) => !m.completed && new Date(m.due_date) < now,
    ).length,
  };
};
