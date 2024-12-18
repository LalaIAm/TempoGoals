import React, { useState } from "react";
import FilterDropdown from "./filters/FilterDropdown";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CreateGoalDialog from "./goals/CreateGoalDialog";
import { Database } from "@/types/supabase";

type GoalCategory = Database["public"]["Enums"]["goal_category"];
type PriorityLevel = Database["public"]["Enums"]["priority_level"];

interface FilterBarProps {
  onCategoryChange?: (value: string) => void;
  onTimelineChange?: (value: string) => void;
  onPriorityChange?: (value: string) => void;
  selectedCategory?: string;
  selectedTimeline?: string;
  selectedPriority?: string;
  onGoalCreated?: () => void;
}

const FilterBar = ({
  onCategoryChange = () => {},
  onTimelineChange = () => {},
  onPriorityChange = () => {},
  selectedCategory = "all",
  selectedTimeline = "all",
  selectedPriority = "all",
  onGoalCreated = () => {},
}: FilterBarProps) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "personal", label: "Personal" },
    { value: "work", label: "Work" },
    { value: "health", label: "Health" },
  ];

  const timelineOptions = [
    { value: "all", label: "All Timelines" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="w-full h-[60px] px-6 bg-background border-b flex items-center justify-between">
      <div className="flex items-center gap-4">
        <FilterDropdown
          label="Category"
          options={categoryOptions}
          value={selectedCategory}
          onChange={onCategoryChange}
        />
        <FilterDropdown
          label="Timeline"
          options={timelineOptions}
          value={selectedTimeline}
          onChange={onTimelineChange}
        />
        <FilterDropdown
          label="Priority"
          options={priorityOptions}
          value={selectedPriority}
          onChange={onPriorityChange}
        />
      </div>

      <Button
        onClick={() => setCreateDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <PlusIcon className="w-4 h-4" /> New Goal
      </Button>

      <CreateGoalDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onGoalCreated={onGoalCreated}
      />
    </div>
  );
};

export default FilterBar;
