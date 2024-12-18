import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircleIcon, CheckCircle2Icon } from "lucide-react";

interface CompletionRateProps {
  totalGoals?: number;
  completedGoals?: number;
  rate?: number;
  trend?: number;
}

const CompletionRate = ({
  totalGoals = 10,
  completedGoals = 7,
  rate = 70,
  trend = 5,
}: CompletionRateProps) => {
  return (
    <Card className="w-[300px] h-[130px] bg-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Goal Completion Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">{rate}%</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CircleIcon className="w-2 h-2 fill-current" />
              <span>
                {completedGoals}/{totalGoals} Goals
              </span>
            </div>
          </div>

          <Progress value={rate} className="h-2" />

          <p className="text-sm text-muted-foreground">
            {trend > 0 ? "+" : ""}
            {trend}% from last period
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionRate;
