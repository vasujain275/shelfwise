import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, User, Mail, Shield, Building2, Layers, UserCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import type { UserProfile } from "@/types/auth";
import ChangePasswordForm from "./ChangePasswordForm";
import { Button } from "@/components/ui/button";

const profileFields: Array<{ key: keyof UserProfile; label: string; icon: React.ReactNode }> = [
  { key: "fullName", label: "Full Name", icon: <User className="w-5 h-5 text-primary" /> },
  { key: "email", label: "Email", icon: <Mail className="w-5 h-5 text-primary" /> },
  { key: "employeeId", label: "Employee ID", icon: <Badge className="w-5 h-5 text-primary" /> },
  { key: "department", label: "Department", icon: <Layers className="w-5 h-5 text-primary" /> },
  { key: "division", label: "Division", icon: <Building2 className="w-5 h-5 text-primary" /> },
  { key: "userRole", label: "Role", icon: <Shield className="w-5 h-5 text-primary" /> },
  { key: "userStatus", label: "Status", icon: <UserCheck className="w-5 h-5 text-primary" /> },
  { key: "expirationDate", label: "Expiration Date", icon: <AlertCircle className="w-5 h-5 text-primary" /> },
  { key: "currentBorrowedBooksCount", label: "Books Borrowed", icon: <Layers className="w-5 h-5 text-primary" /> },
];

const SharedProfile: React.FC = () => {
  const { user } = useAuthStore();
  const [showChangePassword, setShowChangePassword] = React.useState(false);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-16">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Not Logged In</h2>
            <p className="text-red-600">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, type: "spring" }} className="max-w-2xl mx-auto my-10 p-2">
      <Card className="border bg-white/95">
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 p-4">
          {/* Left: Avatar and name/role */}
          <div className="flex flex-col items-center justify-center min-w-[160px] md:border-r md:pr-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div className="text-lg font-bold text-primary text-center leading-tight mb-0.5">{user.fullName}</div>
            <Badge variant="outline" className="capitalize text-xs px-2 py-0.5 mt-1 bg-primary/10 border-primary/20 text-primary">
              {user.userRole.toLowerCase()}
            </Badge>
          </div>
          {/* Right: Profile fields */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profileFields.map(({ key, label, icon }) => {
                const value = user[key];
                if (value === undefined || value === null || value === "" || key === "fullName" || key === "userRole") return null;
                return (
                  <div
                    key={key as string}
                    className="flex items-center gap-3 bg-muted/30 rounded-lg px-3 py-2"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
                      {icon}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-0.5">{label}</div>
                      <div className="text-sm font-medium text-foreground">
                        {key === "userStatus" ? (
                          <Badge variant="outline" className="capitalize bg-primary/10 border-primary/20 text-primary text-xs px-2 py-0.5">
                            {String(value).toLowerCase()}
                          </Badge>
                        ) : key === "expirationDate" ? (
                          new Date(value as string).toLocaleDateString()
                        ) : (
                          String(value)
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <Button variant="outline" onClick={() => setShowChangePassword((v) => !v)}>
                {showChangePassword ? "Hide Change Password" : "Change Password"}
              </Button>
            </div>
            {showChangePassword && <ChangePasswordForm onSuccess={() => setShowChangePassword(false)} />}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SharedProfile;
