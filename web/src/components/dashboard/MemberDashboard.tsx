import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import type { CustomApiResponse, MemberDashboardDTO } from "@/types/dashboard";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle,
  Package,
  RefreshCw,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const MemberDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<MemberDashboardDTO | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching member dashboard data...");
      console.log("User authenticated:", isAuthenticated);
      console.log("Current user:", user);

      const response = await fetch("/api/dashboard/member", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch dashboard data: ${response.status} ${response.statusText}`
        );
      }

      const data: CustomApiResponse<MemberDashboardDTO> = await response.json();
      console.log("Dashboard data received:", data);

      if (data.data) {
        setDashboardData(data.data);
        console.log("Overdue books count:", data.data.overdueBooksCount);
        console.log("Overdue books:", data.data.overdueBooks);
      } else {
        console.warn("No data field in response:", data);
        throw new Error("No data received from server");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("MemberDashboard component mounted, fetching data...");
    console.log("Authentication state:", { isAuthenticated, user });
    if (isAuthenticated && user) {
      fetchDashboardData();
    } else {
      console.log("Not authenticated or no user, skipping fetch");
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    console.log("Dashboard data changed:", dashboardData);
    if (dashboardData) {
      console.log("Borrowed books count:", dashboardData.borrowedBooksCount);
      console.log("Overdue books count:", dashboardData.overdueBooksCount);
      console.log("Overdue books array:", dashboardData.overdueBooks);
    }
  }, [dashboardData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OVERDUE":
        return "bg-red-100 text-red-800 border-red-200";
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const statsCards = [
    {
      title: "Borrowed Books",
      value: dashboardData?.borrowedBooksCount || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Currently borrowed",
    },
    {
      title: "Overdue Books",
      value: dashboardData?.overdueBooksCount || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Past due date",
    },
  ];

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-600 mb-4">
              Please log in to view your dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchDashboardData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-end">
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Main Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Overdue Books Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className={""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-6 w-6 text-red-600 animate-bounce" />
              <span className="font-bold">Overdue Books Alert</span>
              <Badge variant="destructive" className="ml-2 text-base px-3 py-1">
                {dashboardData?.overdueBooksCount || 0}
              </Badge>
            </CardTitle>
            <CardDescription className="text-red-700 font-medium">
              {dashboardData?.overdueBooksCount
                ? "You have overdue books! Please return or renew them immediately to avoid penalties."
                : "Books that are past their due date"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!dashboardData?.overdueBooks ||
            dashboardData.overdueBooks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  Great! You have no overdue books
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Keep up the good work!
                </p>
              </div>
            ) : (
              <div
                className={`space-y-4 ${
                  dashboardData.overdueBooks.length > 5
                    ? "max-h-64 overflow-y-auto"
                    : ""
                }`}
              >
                {dashboardData.overdueBooks.slice(0, 5).map((book) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 border border-red-300 rounded-lg shadow-md"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-red-500" />
                        <div>
                          <h4 className="font-semibold text-red-800">
                            {book.bookTitle}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Issued on: {formatDate(book.issueDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Due Date</p>
                        <p className="font-bold text-red-700 text-lg">
                          {formatDate(book.dueDate)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(book.status)}>
                        {book.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
                {dashboardData.overdueBooks.length > 5 && (
                  <React.Fragment>
                    <div className="flex justify-end mt-4">
                      <a href="/dashboard/member/my-books">
                        <Button
                          variant="destructive"
                          className="font-bold animate-pulse"
                        >
                          Go to My Books to Return/Renew
                        </Button>
                      </a>
                    </div>
                    <div className="text-xs text-gray-500 text-center pb-2">
                      Showing 5 of {dashboardData.overdueBooks.length} overdue
                      books
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common member tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm">Search Books</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Package className="h-5 w-5" />
                <span className="text-sm">My Books</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">History</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <User className="h-5 w-5" />
                <span className="text-sm">Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MemberDashboard;
