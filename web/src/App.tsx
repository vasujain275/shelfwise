import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Layout Components
import HomePage from "@/components/pages/HomePage";
import LoginPage from "@/components/layout/LoginPage";
import NotFoundPage from "@/components/pages/NotFoundPage";

// Dashboard Components
import SuperAdminDashboard from "@/components/dashboard/SuperAdminDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import MemberDashboard from "@/components/dashboard/MemberDashboard";

// Shared Pages
import SharedSearchBooks from "@/components/shared-pages/SharedSearchBooks";
import SharedProfile from "@/components/shared-pages/SharedProfile";
import SharedIssueBook from "@/components/shared-pages/SharedIssueBook";
import SharedReturnBook from "@/components/shared-pages/SharedReturnBook";
import SharedRenewBook from "@/components/shared-pages/SharedRenewBook";
import SharedAllTransactions from "@/components/shared-pages/SharedAllTransactions";
import SharedAddBook from "@/components/shared-pages/SharedAddBook";
import SharedManageBooks from "@/components/shared-pages/SharedManageBooks";
import SharedAnalytics from "@/components/shared-pages/SharedAnalytics";
import SharedAddUser from "@/components/shared-pages/SharedAddUser";
import SharedManageUsers from "@/components/shared-pages/SharedManageUsers";
import DataImport from "@/components/shared-pages/DataImport";
import DataExport from "@/components/shared-pages/DataExport";
import SharedIssuedBooksReport from "@/components/shared-pages/SharedIssuedBooksReport";
import SharedUserReports from "@/components/shared-pages/SharedUserReports";
import SharedBookReports from "@/components/shared-pages/SharedBookReports";
import SharedGenerateBarcodes from "@/components/shared-pages/SharedGenerateBarcodes";

// Member Specific Pages
import MemberMyBooks from "@/components/dashboard/member/pages/MyBooks";

// Super Admin Specific Pages
import SuperAdminCategories from "@/components/dashboard/super-admin/pages/Categories";
import SuperAdminUserRoles from "@/components/dashboard/super-admin/pages/UserRoles";
import SuperAdminAuditLogs from "@/components/dashboard/super-admin/pages/AuditLogs";
import SuperAdminBulkBookUpload from "@/components/dashboard/super-admin/pages/BulkBookUpload";

// Auth Components
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthenticatedRedirect from "@/components/auth/AuthenticatedRedirect";
import DashboardIndexRedirect from "@/components/auth/DashboardIndexRedirect";

import DashboardLayout from "@/components/layout/DashboardLayout";

const App: React.FC = () => {
  const { initializeAuth, isAuthenticating } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <AuthenticatedRedirect>
            <LoginPage />
          </AuthenticatedRedirect>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<DashboardIndexRedirect />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
          <Route path="super-admin" element={<SuperAdminDashboard />} />
          <Route path="super-admin/issue-book" element={<SharedIssueBook />} />
          <Route path="super-admin/return-book" element={<SharedReturnBook />} />
          <Route path="super-admin/renew-book" element={<SharedRenewBook />} />
          <Route path="super-admin/transactions" element={<SharedAllTransactions />} />
          <Route path="super-admin/search-books" element={<SharedSearchBooks />} />
          <Route path="super-admin/add-book" element={<SharedAddBook />} />
          <Route path="super-admin/bulk-upload" element={<SuperAdminBulkBookUpload />} />
          <Route path="super-admin/manage-books" element={<SharedManageBooks />} />
          <Route path="super-admin/categories" element={<SuperAdminCategories />} />
          <Route path="super-admin/add-user" element={<SharedAddUser />} />
          <Route path="super-admin/manage-users" element={<SharedManageUsers />} />
          <Route path="super-admin/user-roles" element={<SuperAdminUserRoles />} />
          <Route path="super-admin/analytics" element={<SharedAnalytics />} />
          <Route path="super-admin/audit-logs" element={<SuperAdminAuditLogs />} />
          <Route path="super-admin/profile" element={<SharedProfile />} />
          <Route path="super-admin/data-import" element={<DataImport />} />
          <Route path="super-admin/data-export" element={<DataExport />} />
          <Route path="super-admin/reports">
            <Route index element={<SharedIssuedBooksReport />} />
            <Route path="issued-books" element={<SharedIssuedBooksReport />} />
            <Route path="user-reports" element={<SharedUserReports />} />
            <Route path="book-reports" element={<SharedBookReports />} />
          </Route>
          <Route path="super-admin/generate-barcodes" element={<SharedGenerateBarcodes />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/issue-book" element={<SharedIssueBook />} />
          <Route path="admin/return-book" element={<SharedReturnBook />} />
          <Route path="admin/renew-book" element={<SharedRenewBook />} />
          <Route path="admin/transactions" element={<SharedAllTransactions />} />
          <Route path="admin/search-books" element={<SharedSearchBooks />} />
          <Route path="admin/add-book" element={<SharedAddBook />} />
          <Route path="admin/manage-books" element={<SharedManageBooks />} />
          <Route path="admin/add-user" element={<SharedAddUser />} />
          <Route path="admin/manage-users" element={<SharedManageUsers />} />
          <Route path="admin/analytics" element={<SharedAnalytics />} />
          <Route path="admin/profile" element={<SharedProfile />} />
          <Route path="admin/data-import" element={<DataImport />} />
          <Route path="admin/data-export" element={<DataExport />} />
          <Route path="admin/reports">
            <Route index element={<SharedIssuedBooksReport />} />
            <Route path="issued-books" element={<SharedIssuedBooksReport />} />
            <Route path="user-reports" element={<SharedUserReports />} />
            <Route path="book-reports" element={<SharedBookReports />} />
          </Route>
          <Route path="admin/generate-barcodes" element={<SharedGenerateBarcodes />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["MEMBER", "ADMIN", "SUPER_ADMIN"]} />}>
          <Route path="member" element={<MemberDashboard />} />
          <Route path="member/search-books" element={<SharedSearchBooks />} />
          <Route path="member/my-books" element={<MemberMyBooks />} />
          <Route path="member/profile" element={<SharedProfile />} />
        </Route>
      </Route>

      {/* Catch all route - show 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
