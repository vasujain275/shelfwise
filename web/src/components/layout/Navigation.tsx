import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { LogOut, Menu } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const Navigation: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { toggle } = useSidebar();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.nav
      className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-lg sticky top-0 z-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Left side - Hamburger + Logo */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            {isAuthenticated && (
              <motion.div variants={itemVariants} className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggle}
                  className="h-9 w-9"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {/* Logo Section */}
            <motion.div variants={itemVariants}>
              <Link
                to="/"
                className="flex items-center space-x-2 md:space-x-3 group"
              >
                <motion.div
                  className="flex-shrink-0 relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="/shelfwise.webp"
                    alt="ShelfWise Logo"
                    className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-sm"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-20 blur-sm"
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <div className="hidden sm:block">
                  <motion.h1
                    className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300"
                    whileHover={{ x: 2 }}
                  >
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      ShelfWise
                    </span>
                  </motion.h1>
                  <motion.p
                    className="text-xs md:text-sm text-gray-600 group-hover:text-gray-500 transition-colors duration-300 hidden md:block"
                    whileHover={{ x: 2 }}
                  >
                    Library Management System
                  </motion.p>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Right Side - User Actions */}
          {isAuthenticated ? (
            <motion.div
              className="flex items-center gap-2 md:gap-4"
              variants={itemVariants}
            >
              {/* Logout */}
              <motion.div variants={buttonVariants}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 group h-8 md:h-9 px-2 md:px-3"
                  >
                    <LogOut className="w-4 h-4 md:mr-2 group-hover:text-red-600 transition-colors duration-300" />
                    <span className="hidden md:inline">Logout</span>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div variants={buttonVariants}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-8 md:h-9"
                >
                  <Link to="/login">Login</Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative gradient line */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.nav>
  );
};

export default Navigation;
