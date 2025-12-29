import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  size?: "sm" | "default" | "lg";
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
  autoFocus = false,
  size = "default",
}) => {
  const sizeClasses = {
    sm: "h-8 pl-8 pr-8 text-sm",
    default: "h-10 pl-10 pr-10",
    lg: "h-12 pl-12 pr-12 text-base",
  };

  const iconSizeClasses = {
    sm: "h-3.5 w-3.5 left-2.5",
    default: "h-4 w-4 left-3",
    lg: "h-5 w-5 left-4",
  };

  const clearButtonClasses = {
    sm: "right-1 h-6 w-6",
    default: "right-1 h-8 w-8",
    lg: "right-2 h-8 w-8",
  };

  return (
    <div className={cn("relative", className)}>
      <Search
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
          iconSizeClasses[size]
        )}
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className={cn(sizeClasses[size], "w-full")}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange("")}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 hover:bg-transparent",
            clearButtonClasses[size]
          )}
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
};
