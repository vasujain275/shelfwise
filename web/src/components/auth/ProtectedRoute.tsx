import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { getDashboardPath } from "@/lib/auth-utils";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isAuthenticating } = useAuthStore();
  const location = useLocation();

  if (isAuthenticating) {
    // Optionally render a loading spinner or skeleton here
    return <div>Loading authentication...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If isAuthenticated is true but user is null, it means something went wrong with fetching profile
  // or the token became invalid after initial check. Redirect to login.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.userRole;
  const userHasRequiredRole = allowedRoles ? allowedRoles.includes(userRole) : true;

  if (!userHasRequiredRole) {
    // Redirect to the user's default dashboard if they try to access a restricted page
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  return <Outlet />;
}; 

export default ProtectedRoute;