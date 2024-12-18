import React from "react";
import FilterDropdown from "./filters/FilterDropdown";

interface FilterBarProps {
  onCategoryChange?: (value: string) => void;
  onTimelineChange?: (value: string) => void;
  onPriorityChange?: (value: string) => void;
  selectedCategory?: string;
  selectedTimeline?: string;
  selectedPriority?: string;
}

const FilterBar = ({
  onCategoryChange = () => {},
  onTimelineChange = () => {},
  onPriorityChange = () => {},
  selectedCategory,
  selectedTimeline,
  selectedPriority,
}: FilterBarProps) => {
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
    <div className="w-full h-[60px] px-6 bg-background border-b flex items-center justify-start gap-4">
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
  );
};

export default FilterBar;
