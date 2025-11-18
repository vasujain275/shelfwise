import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, RefreshCw, X } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import type { User } from '@/types/user';
import type { UseFormReturn } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<any>;
  user: User | null;
  form: UseFormReturn<any>;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  setShowNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isResetting: boolean;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, onSubmit, user, form, showNewPassword, showConfirmPassword, setShowNewPassword, setShowConfirmPassword, isResetting }) => {
  if (!user) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
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
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-yellow-50 to-yellow-100">
                <h2 className="text-xl font-semibold text-yellow-700 flex items-center gap-2"><RefreshCw className="w-5 h-5" /> Reset Password</h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100"><X className="h-4 w-4" /></Button>
              </div>
              <div className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="newPassword" render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <input type={showNewPassword ? "text" : "password"} autoComplete="new-password" {...field} className="w-full border rounded px-3 py-2 pr-10" disabled={isResetting} />
                            <button type="button" tabIndex={-1} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowNewPassword(v => !v)}>
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <input type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" {...field} className="w-full border rounded px-3 py-2 pr-10" disabled={isResetting} />
                            <button type="button" tabIndex={-1} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowConfirmPassword(v => !v)}>
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                      <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white" disabled={isResetting}>
                        {isResetting ? <RefreshCw className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />} Reset Password
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResetPasswordModal; 