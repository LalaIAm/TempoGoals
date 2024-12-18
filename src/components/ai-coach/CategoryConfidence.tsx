import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain } from "lucide-react";

interface CategoryConfidenceProps {
  category?: "personal" | "work" | "health";
  confidence?: number;
  isLoading?: boolean;
}

const CategoryConfidence = ({
  category = "personal",
  confidence = 85,
  isLoading = false,
}: CategoryConfidenceProps) => {
  const getCategoryColor = () => {
    switch (category) {
      case "personal":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "work":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case "health":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  return (
    <Card className="w-[360px] h-[80px] p-4 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <div className="space-y-1">
            <Badge variant="secondary" className={getCategoryColor()}>
              {category}
            </Badge>
            <div className="flex items-center gap-2">
              <Progress value={confidence} className="w-[100px] h-2" />
              <span className="text-xs text-muted-foreground">
                {confidence}% confidence
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CategoryConfidence;
