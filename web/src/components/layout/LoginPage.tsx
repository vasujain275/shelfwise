import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  Shield,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";

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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const inputVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.3,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
  },
};

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%),
                            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.4) 0%, transparent 50%)`,
        }}
      />

      {/* Floating particles */}
      <motion.div
        className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full opacity-60"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-32 w-3 h-3 bg-blue-500 rounded-full opacity-60"
        animate={{
          y: [0, -40, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-32 left-32 w-2 h-2 bg-blue-400 rounded-full opacity-60"
        animate={{
          y: [0, -25, 0],
          x: [0, 25, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={cardVariants}>
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-6 text-center pb-8">
                {/* Logo with floating animation */}
                <motion.div
                  className="flex justify-center mb-4"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src="/shelfwise.png"
                      alt="ShelfWise Logo"
                      className="w-20 h-20 object-contain drop-shadow-lg"
                    />
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-20 blur-xl" />
                  </motion.div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-3">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      ShelfWise
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base font-medium">
                    Library Management System
                  </CardDescription>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-center gap-2"
                >
                  <Badge
                    variant="outline"
                    className="border-blue-200 text-blue-700 bg-blue-50"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Secure Access
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-blue-200 text-blue-700 bg-blue-50"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Research Portal
                  </Badge>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-6">
                <motion.div variants={itemVariants}>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert className="bg-red-50 border-red-200 shadow-sm">
                        <AlertDescription className="text-red-800 text-sm font-medium">
                          {error}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={inputVariants} className="space-y-3">
                    <label
                      htmlFor="username"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      Employee ID
                    </label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        placeholder="2021CA1042"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full h-12 border-gray-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      />
                      <motion.div
                        className="absolute inset-0 border-2 border-transparent rounded-md pointer-events-none"
                        animate={{
                          borderColor: username
                            ? "rgba(59, 130, 246, 0.3)"
                            : "transparent",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={inputVariants} className="space-y-3">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-blue-600" />
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full h-12 pr-12 border-gray-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      />
                      <motion.div
                        className="absolute inset-0 border-2 border-transparent rounded-md pointer-events-none"
                        animate={{
                          borderColor: password
                            ? "rgba(59, 130, 246, 0.3)"
                            : "transparent",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-md transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div variants={buttonVariants}>
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading}
                    >
                      <motion.div
                        className="flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            Signing In...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.div>
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  variants={itemVariants}
                  className="pt-6 text-center border-t border-gray-100"
                >
                  <p className="text-xs text-gray-500 font-medium">
                    For technical support, contact{" "}
                    <span className="text-blue-600 font-semibold">
                      IT Department
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Secure access to research resources
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-10 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-10 blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
