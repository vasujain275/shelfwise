import { cn } from "@/lib/utils";
import React from "react";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "outline";
  size?: "sm" | "default";
}

const statusConfig: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  // Book statuses
  AVAILABLE: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  ISSUED: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  LOST: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
  DAMAGED: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
  },
  UNDER_REPAIR: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  UNAVAILABLE: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
  },

  // Book conditions
  EXCELLENT: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  GOOD: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  FAIR: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  POOR: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
  },

  // User statuses
  ACTIVE: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  INACTIVE: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
  },
  SUSPENDED: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
  EXPIRED: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
  },

  // Transaction statuses
  RETURNED: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  OVERDUE: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
  RENEWED: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },

  // Default
  DEFAULT: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "default",
  size = "default",
}) => {
  const normalizedStatus = status.toUpperCase().replace(/\s+/g, "_");
  const config = statusConfig[normalizedStatus] || statusConfig.DEFAULT;

  const displayText = status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variant === "outline" ? "border" : "",
        config.bg,
        config.text,
        variant === "outline" && config.border,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
    >
      {displayText}
    </span>
  );
};
