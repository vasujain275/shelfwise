import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, UploadCloud, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const exampleJson = [
  {
    "accessionNumber": "1",
    "isbn": null,
    "title": "Self-analysis",
    "subtitle": null,
    "authorPrimary": "Karen Horney",
    "publisher": "Kegan Paul, Trench, Trubner",
    "publicationPlace": "London",
    "publicationYear": 1942,
    "edition": null,
    "pages": "309 p.",
    "language": "English",
    "price": null,
    "billNumber": null,
    "vendorName": null,
    "purchaseDate": null,
    "keywords": "Self analysis, Psychoanalysis, Self study, Personal psychology, Psychoanalytical process",
    "classificationNumber": "159.964.2",
    "locationShelf": "R1",
    "locationRack": "5",
    "bookCondition": "GOOD",
    "bookStatus": "AVAILABLE",
    "totalCopies": 1,
    "availableCopies": 1,
    "bookType": "GENERAL",
    "isReferenceOnly": false,
    "notes": "I. Title.",
    "authorSecondary": ""
  },
  {
    "accessionNumber": "2",
    "isbn": null,
    "title": "First course in statistics",
    "subtitle": null,
    "authorPrimary": "D. Caradog Jones",
    "publisher": "G. Bell and Sons",
    "publicationPlace": "London",
    "publicationYear": 1924,
    "edition": "2nd Edition",
    "pages": "ix, 208 p.: ill.+tab.",
    "language": "English",
    "price": null,
    "billNumber": null,
    "vendorName": null,
    "purchaseDate": null,
    "keywords": "Statistics, Statistical methods",
    "classificationNumber": "519.2",
    "locationShelf": "E1",
    "locationRack": "2",
    "bookCondition": "GOOD",
    "bookStatus": "AVAILABLE",
    "totalCopies": 1,
    "availableCopies": 1,
    "bookType": "GENERAL",
    "isReferenceOnly": false,
    "notes": "Series: Bell's mathematical series/ed. William P. Milne.",
    "authorSecondary": ""
  }
];

const BulkBookUpload: React.FC = () => {
  const { user } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (user?.userRole !== "SUPER_ADMIN") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
            <p className="text-red-600">Only Super Admins can access the Bulk Book Upload page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a JSON file to upload.");
      return;
    }
    setIsUploading(true);
    setError(null);
    setUploadResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/books/bulk", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Bulk upload failed. Please check your file and try again.");
        setIsUploading(false);
        return;
      }
      setUploadResult(result);
      toast.success("Bulk book upload successful!");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto my-12 p-4"
    >
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <UploadCloud className="w-8 h-8 text-primary" />
            Bulk Book Upload
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Upload a JSON file to register multiple books at once. Only Super Admins can use this feature.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* File Upload UI */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <input
              type="file"
              accept="application/json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 text-lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <FileText className="w-5 h-5" />
              {file ? file.name : "Choose JSON File"}
            </Button>
            {file && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {file.name}
              </Badge>
            )}
            <Button
              onClick={handleUpload}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              disabled={!file || isUploading}
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-center mt-2"
              >
                <AlertCircle className="inline w-5 h-5 mr-1" />
                {error}
              </motion.div>
            )}
            {uploadResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-700 text-center mt-2 flex flex-col items-center"
              >
                <CheckCircle className="w-8 h-8 mb-2 text-green-600" />
                <span className="font-semibold">Bulk upload successful!</span>
                <pre className="bg-green-50 border border-green-200 rounded p-2 mt-2 text-xs max-w-full overflow-x-auto text-left">
                  {JSON.stringify(uploadResult, null, 2)}
                </pre>
              </motion.div>
            )}
          </motion.div>

          {/* JSON Structure Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card className="bg-blue-50/50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Expected JSON Structure
                </CardTitle>
                <CardDescription className="text-blue-700 mt-2">
                  The uploaded file should be a JSON array of book objects. <br />
                  <span className="font-semibold">Required field:</span> <Badge className="bg-red-100 text-red-700 ml-1">accessionNumber</Badge>
                  <br />Other fields are optional but recommended for best results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-blue-100 border border-blue-200 rounded p-4 text-xs max-w-full overflow-x-auto text-left">
                  {JSON.stringify(exampleJson, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BulkBookUpload; 