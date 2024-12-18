import React from "react";
import { Progress } from "@/components/ui/progress";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password?: string;
  strength?: number;
  requirements?: Array<{
    label: string;
    met: boolean;
  }>;
}

const PasswordStrengthIndicator = ({
  password = "",
  strength = 0,
  requirements = [
    { label: "At least 8 characters", met: false },
    { label: "At least one uppercase letter", met: false },
    { label: "At least one number", met: false },
    { label: "At least one special character", met: false },
  ],
}: PasswordStrengthIndicatorProps) => {
  const getStrengthColor = () => {
    if (strength >= 75) return "text-green-500";
    if (strength >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getStrengthIcon = () => {
    if (strength >= 75)
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    if (strength >= 50) return <Shield className="h-5 w-5 text-yellow-500" />;
    return <ShieldAlert className="h-5 w-5 text-red-500" />;
  };

  const getStrengthLabel = () => {
    if (strength >= 75) return "Strong";
    if (strength >= 50) return "Medium";
    return "Weak";
  };

  return (
    <div className="w-[300px] space-y-3 bg-background p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStrengthIcon()}
          <span className={`text-sm font-medium ${getStrengthColor()}`}>
            {getStrengthLabel()}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">{strength}%</span>
      </div>

      <Progress value={strength} className="h-2" />

      <ul className="text-xs space-y-1.5">
        {requirements.map((requirement, index) => (
          <li
            key={index}
            className={`flex items-center gap-2 ${requirement.met ? "text-green-500" : "text-muted-foreground"}`}
          >
            <span className="text-xs">•</span>
            {requirement.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
