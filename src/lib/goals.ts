import { supabase } from "./supabase";

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

export const updateGoal = async (id: string, updates) => {
  const { data, error } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const createMilestone = async (milestone) => {
  const { data, error } = await supabase
    .from("milestones")
    .insert(milestone)
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

export const addGoalHistory = async (history) => {
  const { data, error } = await supabase
    .from("goal_history")
    .insert(history)
    .select();

  if (error) throw error;
  return data[0];
};
