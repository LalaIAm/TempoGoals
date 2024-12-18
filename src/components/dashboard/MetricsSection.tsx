import React from "react";
import MetricCard from "./metrics/MetricCard";
import { useMetrics } from "@/hooks/useMetrics";
import { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"];

interface MetricsSectionProps {
  goals?: Goal[];
}

const MetricsSection = ({ goals = [] }: MetricsSectionProps) => {
  const { metrics } = useMetrics(goals);

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
