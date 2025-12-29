import { IssuedBooksReportPDF } from "@/components/pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import React, { useMemo } from "react";

const SharedIssuedBooksReport: React.FC = () => {
  const { user } = useAuthStore();
  const {
    data: issuedBooks = [],
    isLoading: isLoadingIssued,
    error: issuedError,
  } = useQuery({
    queryKey: ["issued-books"],
    queryFn: async () => {
      const res = await fetch("/api/transactions/active?page=0&size=1000", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch issued books");
      const data = await res.json();
      return data.data || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const issuedBooksPDFDoc = useMemo(
    () => <IssuedBooksReportPDF data={issuedBooks} />,
    [issuedBooks]
  );

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
          All Issued Books Report
        </h1>
        <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl">
          Download a PDF of all currently issued books. Only Admins and Super
          Admins can access this page.
        </p>
      </div>
      <Card className="mb-8 shadow-lg border-blue-100 bg-blue-50/30 max-w-md mx-auto p-0">
        <CardHeader className="flex flex-col items-center justify-center text-center pt-6 pb-2">
          <div className="flex flex-col items-center gap-2 w-full">
            <Download className="w-10 h-10 text-blue-700 mb-1" />
            <span className="text-xl font-bold text-blue-900">
              All Issued Books Report
            </span>
            <span className="text-sm text-muted-foreground mb-2">
              Download a PDF of all currently issued books
            </span>
            {!isLoadingIssued && !issuedError && (
              <PDFDownloadLink
                document={issuedBooksPDFDoc}
                fileName="all-issued-books-report.pdf"
              >
                {({ loading }) => (
                  <Button
                    disabled={loading}
                    variant="default"
                    className="gap-2 bg-blue-700 text-white hover:bg-blue-800 w-full mt-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Download />
                    )}
                    {loading ? "Generating..." : "Download Report"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingIssued && (
            <div className="flex items-center gap-2 justify-center py-8">
              <Loader2 className="animate-spin" /> Loading...
            </div>
          )}
          {issuedError && (
            <div className="text-red-600 text-center py-8">
              {issuedError.message || issuedError.toString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedIssuedBooksReport;
