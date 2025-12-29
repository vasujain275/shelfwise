import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  headerClassName?: string;
  showBackButton?: boolean;
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full mx-4",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  size = "md",
  headerClassName = "bg-gradient-to-r from-blue-50 to-indigo-50",
  showBackButton = false,
  footer,
}) => {
  const isMobile = useIsMobile();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed inset-0 z-50 flex items-end md:items-center justify-center ${
              isMobile ? "p-0" : "p-4"
            }`}
          >
            <motion.div
              initial={{ y: isMobile ? "100%" : 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: isMobile ? "100%" : 50, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className={`
                bg-white shadow-2xl w-full overflow-hidden
                ${
                  isMobile
                    ? "rounded-t-2xl max-h-[90vh]"
                    : `rounded-xl ${sizeClasses[size]} max-h-[90vh]`
                }
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between p-4 md:p-6 border-b ${headerClassName}`}
              >
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  {showBackButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="hover:bg-white/50 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {icon && <span className="shrink-0">{icon}</span>}
                  <div className="min-w-0">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
                      {title}
                    </h2>
                    {subtitle && (
                      <p className="text-xs md:text-sm text-gray-600 truncate">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-gray-100 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="p-4 md:p-6">{children}</div>
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-4 md:px-6 md:py-4 border-t bg-gray-50">
                  {footer}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
