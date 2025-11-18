import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to change password");
      }
      toast.success("Password changed successfully");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password. Use a strong, unique password.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
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
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ChangePasswordForm; 