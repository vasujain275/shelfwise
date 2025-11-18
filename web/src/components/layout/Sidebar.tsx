import { Badge } from "@/components/ui/badge";
import { adminLinks, memberLinks, superAdminLinks } from "@/lib/sidebar-links";
import { useAuthStore } from "@/store/authStore";
import type { Variants } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Shield } from "lucide-react";
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarLink {
  label: string;
  href?: string;
  icon?: React.ElementType;
  isHeader?: boolean;
  children?: SidebarLink[];
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
  exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
};

const dropdownVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const sidebarVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const SidebarItem: React.FC<{
  link: SidebarLink;
  isChild?: boolean;
}> = ({ link, isChild = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Check if any child link is active
  const hasActiveChild = link.children?.some(
    (child) => child.href && location.pathname === child.href
  );

  // Auto-open dropdown if it contains the active route
  React.useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  // Dashboard highlight fix: only match exact path
  const isDashboard = link.label === "Dashboard";

  if (link.children) {
    return (
      <div className={isChild ? "ml-4" : ""}>
        <motion.button
          layout
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 group relative overflow-hidden ${
            hasActiveChild
              ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200 shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-expanded={isOpen}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Hover effect background */}
          <motion.div
            layoutId="sidebar-hover-bg"
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ zIndex: 0 }}
          />
          <div className="flex items-center relative z-10">
            {link.icon && (
              <motion.div
                className="mr-3"
                animate={{
                  rotate: isOpen ? 90 : 0,
                  scale: isOpen ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <link.icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              </motion.div>
            )}
            <span className="transition-all duration-300 group-hover:translate-x-1 font-medium">
              {link.label}
            </span>
          </div>
          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0,
              scale: isOpen ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <ChevronDown className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          </motion.div>
        </motion.button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="dropdown"
              initial="closed"
              animate="open"
              exit="closed"
              variants={dropdownVariants}
              style={{ overflow: "hidden" }}
            >
              <div className="mt-2 space-y-1 pl-2">
                {link.children.map((child, idx) => (
                  <motion.div
                    key={child.label}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={fadeInUp}
                  >
                    <SidebarItem link={child} isChild={true} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={link.href!}
      end={isDashboard}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 group relative overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-[1.02]"
            : "text-muted-foreground hover:text-foreground hover:scale-[1.01]"
        } ${isChild ? "ml-4" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active state indicator */}
          {isActive && (
            <motion.div
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          {/* Hover effect background */}
          <motion.div
            layoutId="sidebar-hover-bg"
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ zIndex: 0 }}
          />
          <div className="flex items-center relative z-10">
            {link.icon && (
              <motion.div
                className="mr-3"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <link.icon className="h-4 w-4 transition-all duration-300" />
              </motion.div>
            )}
            <span className="transition-all duration-300 group-hover:translate-x-1 font-medium">
              {link.label}
            </span>
          </div>
        </>
      )}
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const getLinks = (): SidebarLink[] => {
    switch (user?.userRole) {
      case "SUPER_ADMIN":
        return superAdminLinks;
      case "ADMIN":
        return adminLinks;
      case "MEMBER":
        return memberLinks;
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <motion.aside
      className="w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200/50 flex flex-col h-full shadow-xl"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      {/* Header */}
      <motion.div
        className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 via-blue-100/30 to-blue-50/50"
        variants={headerVariants}
      >
        <div className="flex items-center mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/shelfwise.png"
              alt="ShelfWise Logo"
              className="h-12 w-12 object-contain drop-shadow-sm"
            />
          </motion.div>
          <div className="ml-3">
            <h2 className="text-lg font-bold text-gray-900">ShelfWise</h2>
            <p className="text-sm text-gray-600 font-medium">Welcome</p>
            <p className="text-sm text-gray-800 font-semibold">
              {user?.fullName || user?.employeeId}
            </p>
          </div>
        </div>

        {/* User Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="border-green-200 text-green-700 bg-green-50"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
            Active
          </Badge>
          <Badge
            variant="outline"
            className="border-blue-200 text-blue-700 bg-blue-50"
          >
            <Shield className="w-3 h-3 mr-1" />
            {user?.userRole?.replace("_", " ")}
          </Badge>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {links.map((link, index) => (
            <motion.div
              key={link.label}
              custom={index}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInUp}
            >
              <SidebarItem link={link} />
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      {/* Decorative gradient line */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
    </motion.aside>
  );
};

export default Sidebar;
