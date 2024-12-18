import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const FilterDropdown = ({
  label = "Filter",
  options = [
    { value: "all", label: "All" },
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ],
  value,
  onChange,
  className,
}: FilterDropdownProps) => {
  return (
    <div className={cn("w-[200px] bg-background", className)}>
      <Select
        value={value}
        onValueChange={onChange}
        defaultValue={options[0]?.value}
      >
        <SelectTrigger className="w-full h-10">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterDropdown;
