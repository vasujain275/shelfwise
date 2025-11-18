import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Toaster richColors position="top-right" />
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
