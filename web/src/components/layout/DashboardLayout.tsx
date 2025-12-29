import Navigation from "@/components/layout/Navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/hooks/use-sidebar";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  const { isOpen, close } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Toaster richColors position="top-right" />
      <Navigation />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        <AnimatePresence>
          {isMobile && isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={close}
            />
          )}
        </AnimatePresence>

        {/* Sidebar - hidden on mobile by default, shown when toggled */}
        <div
          className={`
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
            transform transition-transform duration-300 ease-in-out
            ${
              isMobile
                ? isOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
                : "translate-x-0"
            }
            lg:translate-x-0
          `}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
