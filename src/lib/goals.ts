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

export const deleteGoal = async (id: string) => {
  // First delete all related milestones
  const { error: milestoneError } = await supabase
    .from("milestones")
    .delete()
    .eq("goal_id", id);

  if (milestoneError) throw milestoneError;

  // Then delete all related history
  const { error: historyError } = await supabase
    .from("goal_history")
    .delete()
    .eq("goal_id", id);

  if (historyError) throw historyError;

  // Finally delete the goal itself
  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) throw error;
};

export const updateGoal = async (id: string, updates) => {
  const { data, error } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const createMilestone = async (milestone: MilestoneInsert) => {
  const { data, error } = await supabase
    .from("milestones")
    .insert(milestone)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteMilestone = async (id: string) => {
  const { error } = await supabase.from("milestones").delete().eq("id", id);

  if (error) throw error;
};

export const toggleMilestoneCompletion = async (
  id: string,
  completed: boolean,
) => {
  const { data, error } = await supabase
    .from("milestones")
    .update({ completed })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const updateMilestoneTitle = async (id: string, title: string) => {
  const { data, error } = await supabase
    .from("milestones")
    .update({ title })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const updateMilestone = async (id: string, updates) => {
  const { data, error } = await supabase
    .from("milestones")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const addGoalHistory = async (history: GoalHistoryInsert) => {
  const { data, error } = await supabase
    .from("goal_history")
    .insert(history)
    .select();

  if (error) throw error;
  return data[0];
};
