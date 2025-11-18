import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Users, Book, History, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const EXPORT_OPTIONS = [
  {
    label: "Users",
    endpoint: "/api/export/users",
    icon: Users,
    filename: "users.csv",
    description: "Export all users as CSV.",
  },
  {
    label: "Books",
    endpoint: "/api/export/books",
    icon: Book,
    filename: "books.csv",
    description: "Export all books as CSV.",
  },
  {
    label: "Transactions",
    endpoint: "/api/export/transactions",
    icon: History,
    filename: "transactions.csv",
    description: "Export all transactions as CSV.",
  },
];

const DataExport: React.FC = () => {
  const { user } = useAuthStore();
  if (user?.userRole !== "ADMIN" && user?.userRole !== "SUPER_ADMIN") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
            <p className="text-red-600">Only Admins and Super Admins can access the Data Export page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto my-12 p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {EXPORT_OPTIONS.map(option => (
        <ExportCard key={option.label} option={option} />
      ))}
    </motion.div>
  );
};

const ExportCard: React.FC<{ option: typeof EXPORT_OPTIONS[0] }> = ({ option }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const response = await fetch(option.endpoint, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        const text = await response.text();
        setError(text || "Failed to export data");
        toast.error(text || "Failed to export data");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = option.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setSuccess(`${option.label} exported as ${option.filename}`);
      toast.success(`${option.label} exported!`);
    } catch (err) {
      setError("Failed to export. Please try again.");
      toast.error("Failed to export. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
      <Card className="shadow-lg overflow-hidden flex flex-col h-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <option.icon className="w-7 h-7 text-primary" />
            {option.label}
          </CardTitle>
          <CardDescription className="text-base mt-2 min-h-[48px]">{option.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-6 justify-center items-center">
          <Button onClick={handleExport} disabled={loading} className="flex items-center gap-2 w-full justify-center">
            {loading ? <Skeleton className="w-5 h-5" /> : <Download className="w-5 h-5" />}
            {loading ? "Exporting..." : "Export as CSV"}
          </Button>
          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-green-700 justify-center">
                <CheckCircle className="w-4 h-4" />
                <span>{success}</span>
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-red-700 justify-center">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataExport; 