import React from "react";
import GoalCard from "./goals/GoalCard";
import GoalDetails from "./goals/GoalDetails";

interface GoalGridProps {
  goals?: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    priority: "high" | "medium" | "low";
    progress: number;
    dueDate: string;
    milestones: Array<{
      title: string;
      completed: boolean;
      date: string;
    }>;
    history: Array<{
      date: string;
      action: string;
      progress: number;
    }>;
  }>;
  onGoalClick?: (goalId: string) => void;
}

const GoalGrid = ({
  goals = [
    {
      id: "1",
      title: "Complete Project Documentation",
      description:
        "Create comprehensive documentation for the current project including technical specs and user guides.",
      category: "work",
      priority: "high",
      progress: 75,
      dueDate: "2024-06-30",
      milestones: [
        { title: "Outline Creation", completed: true, date: "2024-05-01" },
        { title: "First Draft", completed: true, date: "2024-05-15" },
        { title: "Review Process", completed: false, date: "2024-06-01" },
        { title: "Final Version", completed: false, date: "2024-06-15" },
      ],
      history: [
        { date: "2024-05-01", action: "Goal Created", progress: 0 },
        {
          date: "2024-05-15",
          action: "First Milestone Complete",
          progress: 25,
        },
        {
          date: "2024-05-30",
          action: "Second Milestone Complete",
          progress: 50,
        },
        { date: "2024-06-15", action: "Progress Update", progress: 75 },
      ],
    },
    {
      id: "2",
      title: "Improve Fitness Level",
      description:
        "Achieve better physical fitness through regular exercise and proper nutrition.",
      category: "health",
      priority: "medium",
      progress: 45,
      dueDate: "2024-12-31",
      milestones: [
        { title: "Set Fitness Goals", completed: true, date: "2024-01-15" },
        { title: "Establish Routine", completed: true, date: "2024-02-01" },
        { title: "Mid-year Review", completed: false, date: "2024-06-30" },
        { title: "Final Assessment", completed: false, date: "2024-12-15" },
      ],
      history: [
        { date: "2024-01-15", action: "Goal Created", progress: 0 },
        { date: "2024-02-01", action: "Started Workout Plan", progress: 15 },
        { date: "2024-03-15", action: "Monthly Check-in", progress: 30 },
        { date: "2024-04-30", action: "Progress Update", progress: 45 },
      ],
    },
  ],
  onGoalClick = () => {},
}: GoalGridProps) => {
  const [selectedGoal, setSelectedGoal] = React.useState<string | null>(null);

  const handleGoalClick = (goalId: string) => {
    setSelectedGoal(goalId);
    onGoalClick(goalId);
  };

  const selectedGoalData = goals.find((goal) => goal.id === selectedGoal);

  return (
    <div className="w-full min-h-[500px] p-6 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            title={goal.title}
            description={goal.description}
            category={goal.category}
            priority={goal.priority}
            progress={goal.progress}
            dueDate={goal.dueDate}
            onClick={() => handleGoalClick(goal.id)}
          />
        ))}
      </div>

      {selectedGoalData && (
        <GoalDetails
          open={!!selectedGoal}
          onOpenChange={(open) => !open && setSelectedGoal(null)}
          title={selectedGoalData.title}
          description={selectedGoalData.description}
          category={selectedGoalData.category}
          priority={selectedGoalData.priority}
          progress={selectedGoalData.progress}
          dueDate={selectedGoalData.dueDate}
          milestones={selectedGoalData.milestones}
          history={selectedGoalData.history}
        />
      )}
    </div>
  );
};

export default GoalGrid;
