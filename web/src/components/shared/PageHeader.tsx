import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  centered?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  actions,
  centered = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-6 ${
        centered
          ? "text-center"
          : "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      }`}
    >
      <div className={centered ? "" : "flex items-center gap-3"}>
        {Icon && (
          <div className="hidden sm:flex p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap">{actions}</div>
      )}
    </motion.div>
  );
};
