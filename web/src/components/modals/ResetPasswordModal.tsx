import { Modal } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { User } from "@/types/user";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import React from "react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";

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

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  form,
  showNewPassword,
  showConfirmPassword,
  setShowNewPassword,
  setShowConfirmPassword,
  isResetting,
}) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Password"
      icon={<RefreshCw className="w-5 h-5 text-yellow-700" />}
      size="md"
      headerClassName="bg-gradient-to-r from-yellow-50 to-yellow-100"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...field}
                      className="w-full border rounded px-3 py-2.5 md:py-2 pr-10 text-base md:text-sm"
                      disabled={isResetting}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
                      onClick={() => setShowNewPassword((v) => !v)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...field}
                      className="w-full border rounded px-3 py-2.5 md:py-2 pr-10 text-base md:text-sm"
                      disabled={isResetting}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white"
              disabled={isResetting}
            >
              {isResetting ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-1" />
              )}
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;
