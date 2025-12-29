import { UserReportPDF } from "@/components/pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Search, X } from "lucide-react";
import React, { useState } from "react";

const USER_SEARCH_DEBOUNCE = 400;
function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

type User = {
  id: string;
  fullName: string;
  employeeId: string;
  email: string;
  userRole: string;
};
type Transaction = {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userFullName: string;
  transactionType: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  renewalCount: number;
  issuedByUserId: string;
  issuedByUserFullName: string;
  returnedToUserId?: string | null;
  returnedToUserFullName?: string | null;
  status: string;
  transactionNotes?: string | null;
  accessionNumber?: string;
  employeeId?: string;
  language?: string;
};

const SharedUserReports: React.FC = () => {
  const { user } = useAuthStore();
  const [userQuery, setUserQuery] = useState("");
  const debouncedUserQuery = useDebouncedValue(userQuery, USER_SEARCH_DEBOUNCE);
  const {
    data: userResults = [],
    isLoading: isSearchingUsers,
    error: userSearchError,
  } = useQuery<User[]>({
    queryKey: ["user-search", debouncedUserQuery],
    queryFn: async () => {
      if (debouncedUserQuery.length < 2) return [];
      const res = await fetch(
        `/api/users/search?query=${encodeURIComponent(debouncedUserQuery)}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to search users");
      const data = await res.json();
      return data.data || [];
    },
    enabled: debouncedUserQuery.length >= 2,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const {
    data: userActiveBooks = [],
    isLoading: isLoadingUserActive,
    error: userActiveError,
  } = useQuery<Transaction[]>({
    queryKey: ["user-active-books", selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return [];
      const res = await fetch(
        `/api/transactions/user/${selectedUser.id}/active?page=0&size=1000`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch user active books");
      const data = await res.json();
      return data.data || [];
    },
    enabled: !!selectedUser,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const {
    data: userHistory = [],
    isLoading: isLoadingUserHistory,
    error: userHistoryError,
  } = useQuery<Transaction[]>({
    queryKey: ["user-history", selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return [];
      const res = await fetch(
        `/api/transactions/user/${selectedUser.id}/history`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch user history");
      const data = await res.json();
      return data.data || [];
    },
    enabled: !!selectedUser,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (user?.userRole !== "ADMIN" && user?.userRole !== "SUPER_ADMIN") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Access Denied
            </h2>
            <p className="text-red-600">
              Only Admins and Super Admins can access the Reports page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-2 md:px-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <img
          src="/shelfwise.webp"
          alt="ShelfWise Logo"
          className="w-20 h-20 mb-2"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-800 to-blue-400 bg-clip-text text-transparent mb-2">
          User Reports
        </h1>
        <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl">
          Search for a user and generate their active books and transaction
          history reports. Only Admins and Super Admins can access this page.
        </p>
      </div>
      <Card className="shadow-lg border-blue-100 bg-blue-50/30 mb-8 md:mb-0 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg font-semibold">User Reports</span>
            <Search className="h-5 w-5 text-blue-700" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search user by name or employee no..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="pl-10 pr-10 rounded-lg border-blue-200 focus:border-blue-500 shadow-sm"
              />
              {userQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => {
                    setUserQuery("");
                    setSelectedUser(null);
                  }}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {userSearchError && (
                <div className="text-xs text-red-600 mt-1">
                  {userSearchError.message || userSearchError.toString()}
                </div>
              )}
            </div>
            {/* Search Results */}
            {isSearchingUsers && (
              <div className="flex items-center gap-2 justify-center py-4">
                <Loader2 className="animate-spin" /> Searching users...
              </div>
            )}
            {!isSearchingUsers && userResults.length > 0 && (
              <div className="space-y-4">
                <div className="font-medium text-sm text-muted-foreground">
                  Select a user to generate their report:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userResults.map((u) => (
                    <div
                      key={u.id}
                      className={cn(
                        "p-4 border rounded-xl transition-all relative cursor-pointer bg-white/80 shadow-sm hover:shadow-lg",
                        selectedUser?.id === u.id
                          ? "bg-blue-100 border-blue-400 shadow-md"
                          : "hover:bg-blue-50 border-blue-200"
                      )}
                      onClick={() => setSelectedUser(u)}
                    >
                      <p className="font-semibold text-blue-900">
                        {u.fullName}
                      </p>
                      <p className="text-sm text-blue-700">
                        Employee No: {u.employeeId}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Selected User Reports */}
            {selectedUser && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-blue-900">
                    {selectedUser.fullName} ({selectedUser.employeeId})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                    aria-label="Clear selection"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear selection</span>
                  </Button>
                </div>
                {isLoadingUserActive || isLoadingUserHistory ? (
                  <div className="flex items-center gap-2 justify-center py-4">
                    <Loader2 className="animate-spin" /> Loading user reports...
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Active Books Report */}
                    <PDFDownloadLink
                      document={
                        <UserReportPDF
                          user={selectedUser}
                          data={userActiveBooks}
                          type="active"
                        />
                      }
                      fileName={`user-${selectedUser.employeeId}-active-books.pdf`}
                    >
                      {({ loading }) => (
                        <Button
                          disabled={loading || isLoadingUserActive}
                          variant="default"
                          className="w-full sm:w-auto gap-2 bg-blue-700 text-white hover:bg-blue-800"
                        >
                          {loading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Download />
                          )}
                          {loading
                            ? "Generating..."
                            : "Download Active Books Report"}
                        </Button>
                      )}
                    </PDFDownloadLink>
                    {/* Transaction History Report */}
                    <PDFDownloadLink
                      document={
                        <UserReportPDF
                          user={selectedUser}
                          data={userHistory}
                          type="history"
                        />
                      }
                      fileName={`user-${selectedUser.employeeId}-history.pdf`}
                    >
                      {({ loading }) => (
                        <Button
                          disabled={loading || isLoadingUserHistory}
                          variant="default"
                          className="w-full sm:w-auto gap-2 bg-blue-700 text-white hover:bg-blue-800"
                        >
                          {loading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Download />
                          )}
                          {loading
                            ? "Generating..."
                            : "Download Transaction History"}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </div>
                )}
                {(userActiveError || userHistoryError) && (
                  <div className="text-xs text-red-600 mt-1">
                    {(userActiveError?.message ||
                      userActiveError?.toString() ||
                      "") +
                      (userHistoryError
                        ? ` / ${
                            userHistoryError.message ||
                            userHistoryError.toString()
                          }`
                        : "")}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedUserReports;
