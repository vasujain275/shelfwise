import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description?: string;
  details?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'default' | 'destructive';
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  details,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'default',
  loading = false,
}) => {
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
            onClick={onCancel}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {/* Description */}
              {description && (
                <div className="px-6 pt-4 text-gray-700 text-sm">{description}</div>
              )}
              {/* Details */}
              {details && (
                <div className="px-6 pt-2 pb-2 text-gray-900 text-sm">
                  {details}
                </div>
              )}
              {/* Actions */}
              <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                  {cancelLabel}
                </Button>
                <Button type="button" variant={confirmVariant} onClick={onConfirm} disabled={loading}>
                  {loading ? 'Processing...' : confirmLabel}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal; 