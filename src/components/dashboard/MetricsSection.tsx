import React from "react";
import MetricCard from "./metrics/MetricCard";

interface MetricsSectionProps {
  metrics?: Array<{
    title: string;
    value: string | number;
    change: number;
    progress: number;
    description: string;
  }>;
}

const MetricsSection = ({
  metrics = [
    {
      title: "Goals Completed",
      value: 12,
      change: 8,
      progress: 75,
      description: "Total goals completed this month",
    },
    {
      title: "In Progress",
      value: 5,
      change: -2,
      progress: 45,
      description: "Goals currently in progress",
    },
    {
      title: "Success Rate",
      value: "85%",
      change: 5,
      progress: 85,
      description: "Overall goal completion rate",
    },
    {
      title: "Time to Complete",
      value: "4.2 days",
      change: -1,
      progress: 65,
      description: "Average time to complete goals",
    },
  ],
}: MetricsSectionProps) => {
  return (
    <div className="w-full h-[200px] p-6 bg-background">
      <div className="flex items-center justify-between gap-6 overflow-x-auto">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            progress={metric.progress}
            description={metric.description}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricsSection;
