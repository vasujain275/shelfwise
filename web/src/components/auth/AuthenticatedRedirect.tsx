import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { getDashboardPath } from "@/lib/auth-utils";

interface AuthenticatedRedirectProps {
  children: React.ReactNode;
}

const AuthenticatedRedirect: React.FC<AuthenticatedRedirectProps> = ({
  children,
}) => {
  const { isAuthenticated, user, isAuthenticating } = useAuthStore();

  if (isAuthenticating) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  if (isAuthenticated && user) {
    const redirectPath = getDashboardPath(user.userRole);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}; 

export default AuthenticatedRedirect;
