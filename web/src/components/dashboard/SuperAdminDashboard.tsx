import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  AdminDashboardDTO,
  BookTransactionDTO,
  CustomApiResponse,
} from "@/types/dashboard";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Eye,
  Package,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<AdminDashboardDTO | null>(
    null
  );
  const [overdueTransactions, setOverdueTransactions] = useState<
    BookTransactionDTO[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [dashboardResponse, overdueResponse] = await Promise.all([
        fetch("/api/dashboard/admin", {
          credentials: "include",
        }),
        fetch("/api/transactions/overdue?size=10", {
          credentials: "include",
        }),
      ]);

      if (!dashboardResponse.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      if (!overdueResponse.ok) {
        throw new Error("Failed to fetch overdue transactions");
      }

      const dashboardData: CustomApiResponse<AdminDashboardDTO> =
        await dashboardResponse.json();
      const overdueData: CustomApiResponse<BookTransactionDTO[]> =
        await overdueResponse.json();

      setDashboardData(dashboardData.data);
      setOverdueTransactions(overdueData.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First refresh the dashboard statistics
      const refreshResponse = await fetch("/api/dashboard/refresh", {
        method: "GET",
        credentials: "include",
      });

      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh dashboard statistics");
      }

      // Then fetch the updated data
      const [dashboardResponse, overdueResponse] = await Promise.all([
        fetch("/api/dashboard/admin", {
          credentials: "include",
        }),
        fetch("/api/transactions/overdue?size=10", {
          credentials: "include",
        }),
      ]);

      if (!dashboardResponse.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      if (!overdueResponse.ok) {
        throw new Error("Failed to fetch overdue transactions");
      }

      const dashboardData: CustomApiResponse<AdminDashboardDTO> =
        await dashboardResponse.json();
      const overdueData: CustomApiResponse<BookTransactionDTO[]> =
        await overdueResponse.json();

      setDashboardData(dashboardData.data);
      setOverdueTransactions(overdueData.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statsCards = [
    {
      title: "Total Books",
      value: dashboardData?.totalBookCopies || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "All copies",
    },
    {
      title: "Available",
      value: dashboardData?.availableBooks || 0,
      icon: Package,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Ready to borrow",
    },
    {
      title: "Issued",
      value: dashboardData?.issuedBooks || 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Currently borrowed",
    },
    {
      title: "Overdue",
      value: dashboardData?.overdueBooks || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Past due date",
    },
    {
      title: "Total Users",
      value: dashboardData?.totalUsers || 0,
      icon: UserCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Registered",
    },
    {
      title: "Active Users",
      value: dashboardData?.activeUsers || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Active members",
    },
  ];

  const quickActions = [
    {
      title: "Issue Book",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      path: "/dashboard/super-admin/issue-book",
    },
    {
      title: "Return Book",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
      path: "/dashboard/super-admin/return-book",
    },
    {
      title: "Add Book",
      icon: Plus,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      path: "/dashboard/super-admin/add-book",
    },
    {
      title: "Add User",
      icon: UserCheck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      path: "/dashboard/super-admin/add-user",
    },
    {
      title: "Search",
      icon: Search,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      path: "/dashboard/super-admin/search-books",
    },
    {
      title: "Transactions",
      icon: Calendar,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      path: "/dashboard/super-admin/transactions",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <h3 className="text-sm font-semibold mb-1">
              Error Loading Dashboard
            </h3>
            <p className="text-xs text-gray-600 mb-3">{error}</p>
            <Button onClick={refreshDashboard} variant="outline" size="sm">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <Button
          onClick={refreshDashboard}
          variant="outline"
          size="sm"
          className="h-8 md:h-9"
        >
          <RefreshCw className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Refresh</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] md:text-xs font-medium text-muted-foreground truncate">
                      {stat.title}
                    </p>
                    <p className="text-base md:text-lg font-bold text-foreground">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "p-1.5 md:p-2 rounded-lg shrink-0",
                      stat.bgColor
                    )}
                  >
                    <stat.icon
                      className={cn("h-3.5 w-3.5 md:h-4 md:w-4", stat.color)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Overdue Books */}
        <Card className="lg:col-span-2 order-2 lg:order-1">
          <CardHeader className="pb-2 md:pb-3 px-3 md:px-6">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Overdue Books
              <Badge variant="destructive" className="text-xs">
                {overdueTransactions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 md:px-6">
            {overdueTransactions.length === 0 ? (
              <div className="text-center py-4 md:py-6">
                <Package className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-2" />
                <p className="text-xs md:text-sm text-green-700 font-medium">
                  No overdue books
                </p>
              </div>
            ) : (
              <div
                className={`space-y-2 ${
                  overdueTransactions.length > 5
                    ? "max-h-48 md:max-h-64 overflow-y-auto"
                    : ""
                }`}
              >
                {overdueTransactions.slice(0, 5).map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 md:p-3 border border-red-200 rounded-lg bg-red-50"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-medium text-gray-900 truncate">
                        {transaction.bookTitle}
                      </h4>
                      <p className="text-[10px] md:text-xs text-gray-600 truncate">
                        {transaction.userFullName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Due</p>
                        <p className="text-xs font-medium text-red-600">
                          {formatDate(transaction.dueDate)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {overdueTransactions.length > 5 && (
                  <React.Fragment>
                    <div className="text-center pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate("/dashboard/super-admin/transactions")
                        }
                        className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-7 md:h-8"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View All
                      </Button>
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500 text-center pb-2">
                      Showing 5 of {overdueTransactions.length} overdue books
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="order-1 lg:order-2">
          <CardHeader className="pb-2 md:pb-3 px-3 md:px-6">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 md:px-6">
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-1.5 md:gap-2">
              {quickActions.map((action) => (
                <motion.div
                  key={action.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-14 md:h-16 w-full flex flex-col gap-0.5 md:gap-1 hover:shadow-sm transition-all duration-200 px-1 md:px-2"
                    onClick={() => navigate(action.path)}
                  >
                    <div className={cn("p-1 rounded", action.bgColor)}>
                      <action.icon className={cn("h-3 w-3", action.color)} />
                    </div>
                    <span className="text-[10px] md:text-xs font-medium text-center leading-tight">
                      {action.title}
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader className="pb-2 md:pb-3 px-3 md:px-6">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="flex items-center gap-2 md:gap-3 p-2 md:p-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Transactions (7d)
                    </div>
                    <div className="text-lg font-bold text-blue-900">
                      {dashboardData?.transactionsLast7Days || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-green-50 border-green-200">
                <CardContent className="flex items-center gap-2 md:gap-3 p-2 md:p-3">
                  <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                  <div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">
                      Books Added (7d)
                    </div>
                    <div className="text-base md:text-lg font-bold text-green-900">
                      {dashboardData?.booksAddedLast7Days || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="flex items-center gap-2 md:gap-3 p-2 md:p-3">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-indigo-600" />
                  <div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">
                      New Users (30d)
                    </div>
                    <div className="text-base md:text-lg font-bold text-indigo-900">
                      {dashboardData?.newUsersLast30Days || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-red-50 border-red-200">
                <CardContent className="flex items-center gap-2 md:gap-3 p-2 md:p-3">
                  <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                  <div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">
                      Lost Books
                    </div>
                    <div className="text-base md:text-lg font-bold text-red-700">
                      {dashboardData?.lostBooks || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
