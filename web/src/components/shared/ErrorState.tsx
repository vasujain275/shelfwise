import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import React from "react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: "alert" | "card" | "inline";
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Error",
  message,
  onRetry,
  retryLabel = "Try Again",
  variant = "alert",
}) => {
  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-destructive text-sm"
      >
        <AlertCircle className="h-4 w-4" />
        <span>{message}</span>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="ml-2">
            <RefreshCw className="h-3 w-3 mr-1" />
            {retryLabel}
          </Button>
        )}
      </motion.div>
    );
  }

  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center"
      >
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
        <h3 className="font-semibold text-destructive mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryLabel}
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{message}</span>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-4"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {retryLabel}
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};
