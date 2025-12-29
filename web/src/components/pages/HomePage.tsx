import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardPath } from "@/lib/auth-utils";
import { useAuthStore } from "@/store/authStore";
import type { AdminDashboardDTO } from "@/types/dashboard";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Book,
  Clock,
  FileText,
  Globe,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const featureCardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
    },
  },
};

const statsVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const features = [
  {
    icon: Book,
    title: "Extensive Collection",
    description:
      "Access books, research papers, and digital resources carefully curated for psychological research",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Search,
    title: "Advanced Search",
    description:
      "Powerful search capabilities to find exactly what you need with filters and advanced cataloging",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Users,
    title: "User Management",
    description:
      "Streamlined user management system for researchers, faculty, and administrative staff",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: FileText,
    title: "Digital Resources",
    description:
      "Access to digital journals, e-books, and online databases for comprehensive research support",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Clock,
    title: "Issue Tracking",
    description:
      "Efficient book issuing and return process with automated tracking and notifications",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Shield,
    title: "Secure Access",
    description:
      "Role-based access control ensuring secure and authorized access to all library resources",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const currentYear = new Date().getFullYear();

  // Dashboard stats state
  const [dashboard, setDashboard] = useState<AdminDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dashboard/admin", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await res.json();
        setDashboard(data.data);
      } catch (e) {
        setError((e as Error).message || "Error loading dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <motion.div variants={heroVariants} className="mb-12">
            {/* Logo with floating animation */}
            <motion.div className="flex justify-center mb-8">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/shelfwise.webp"
                  alt="ShelfWise Logo"
                  className="w-24 h-24 object-contain drop-shadow-2xl"
                />
                <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-20 blur-xl" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                ShelfWise
              </span>
            </motion.h1>

            <motion.h2
              className="text-2xl md:text-3xl font-semibold text-gray-300 mb-8"
              variants={itemVariants}
            >
              Library Management System
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Your gateway to knowledge and research resources. Access thousands
              of books, journals, and digital resources with our modern library
              management platform.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {isAuthenticated ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8 py-4 h-14 shadow-2xl"
                    asChild
                  >
                    <Link
                      to={user ? getDashboardPath(user.userRole) : "/dashboard"}
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8 py-4 h-14 shadow-2xl"
                    asChild
                  >
                    <Link to="/login">Sign In to Continue</Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Comprehensive Features
            </motion.div>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Library Features
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive digital library management system designed for
              modern libraries and efficient resource management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={featureCardVariants}
                whileHover="hover"
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
                  <CardContent className="p-8">
                    <motion.div
                      className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 5 }}
                    >
                      <feature.icon
                        className={`w-8 h-8 ${feature.iconColor}`}
                      />
                    </motion.div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {feature.description}
                    </p>
                    <motion.div
                      className="mt-6 flex justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div
                        className={`w-12 h-1 bg-gradient-to-r ${feature.color} rounded-full`}
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h3 className="text-4xl font-bold text-white mb-6">
              Library Statistics
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the scale and impact of our comprehensive library
              resources
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-white text-lg">Loading statistics...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-red-400 text-lg">{error}</span>
            </div>
          ) : dashboard ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <motion.div
                variants={statsVariants}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Book className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {dashboard.totalBookCopies?.toLocaleString() ?? "-"}
                </div>
                <div className="text-gray-300 font-medium">
                  Books & Resources
                </div>
              </motion.div>
              <motion.div
                variants={statsVariants}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {dashboard.totalUniqueBooks?.toLocaleString() ?? "-"}
                </div>
                <div className="text-gray-300 font-medium">Unique Titles</div>
              </motion.div>
              <motion.div
                variants={statsVariants}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-300 font-medium">Digital Access</div>
              </motion.div>
            </div>
          ) : null}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={itemVariants}>
            <motion.div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Ready to Get Started?
            </motion.div>
            <h3 className="text-4xl font-bold text-white mb-6">
              Join Our Research Community
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Access world-class research resources and contribute to the
              advancement of psychological research
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
            >
              {isAuthenticated ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4 h-14 shadow-2xl"
                    asChild
                  >
                    <Link
                      to={user ? getDashboardPath(user.userRole) : "/dashboard"}
                    >
                      Access Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4 h-14 shadow-2xl"
                    asChild
                  >
                    <Link to="/login">Log In</Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative gradient line */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-white py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center" variants={itemVariants}>
            <div className="flex items-center justify-center mb-6">
              <img
                src="/shelfwise.webp"
                alt="ShelfWise Logo"
                className="w-12 h-12 object-contain mr-4"
              />
              <h4 className="text-xl font-semibold">ShelfWise</h4>
            </div>
            <p className="text-gray-400 mb-4">
              © {currentYear} ShelfWise. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">Library Management System</p>
            <motion.div
              className="flex items-center justify-center gap-2 mt-4"
              variants={itemVariants}
            >
              <Badge
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                <Award className="w-3 h-3 mr-1" />
                Research Excellence
              </Badge>
              <Badge
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Innovation
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;
