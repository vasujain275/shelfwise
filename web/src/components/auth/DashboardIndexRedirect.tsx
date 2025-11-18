
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getDashboardPath } from '@/lib/auth-utils';

const DashboardIndexRedirect: React.FC = () => {
  const { user, isAuthenticating } = useAuthStore();

  if (isAuthenticating) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const redirectPath = getDashboardPath(user.userRole);
  return <Navigate to={redirectPath} replace />;
}; 

export default DashboardIndexRedirect;
