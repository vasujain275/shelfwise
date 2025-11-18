import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Book,
  CheckCircle,
  History,
  UploadCloud,
  Users,
} from "lucide-react";
import Papa from "papaparse";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

const IMPORT_OPTIONS = [
  {
    label: "Users",
    endpoint: "/api/import/users",
    icon: Users,
    sample: `id,employeeId,fullName,email,phoneMobile,phoneOffice,division,department,designation,floorNumber,officeRoom,address,userRole,userStatus,booksIssued,registrationDate,expirationDate,photoPath,emergencyContact,emergencyPhone,remarks,password\r\n1962c9d4-3b05-44fc-9318-35b083354563,EMP001,Dr. Anil Verma,superadmin@example.com,+919876543210,01123456789,Administration,IT,Chief Librarian,3,301,\"Main Office\",SUPER_ADMIN,ACTIVE,0,,2030-12-31,/photos/superadmin.jpg,Dr. Anil Verma's Family,+919988776655,Initial super admin user for system setup,$2a$12$uH2VAwnxs9kumKoneBtOduOQ9u/Uo64NiDDzkPNJ62beby5GLpxP6\r\n`,
    accept: ".csv",
    description:
      "Import users as CSV. Only Admins and Super Admins can access this feature.",
  },
  {
    label: "Books",
    endpoint: "/api/import/books",
    icon: Book,
    sample: `id,accessionNumber,isbn,title,subtitle,authorPrimary,authorSecondary,publisher,publicationPlace,publicationYear,edition,pages,language,price,billNumber,vendorName,purchaseDate,keywords,classificationNumber,locationShelf,locationRack,bookCondition,bookStatus,totalCopies,availableCopies,bookType,isReferenceOnly,registrationDate,notes\r\n014be107-046d-419f-a874-9fff4b0e9cac,4,,Mind and its body: the foundations of psychology,,Charles Fox,,\"Kegan Paul, Trench, Trubner\",London,1931,International library of psychology/ed. C. K. Moore,323,English,,,,,\"Psychological physiology, Animal-Psychological, Human-Physiological psychological\",612.821,,,GOOD,AVAILABLE,1,1,GENERAL,false,2025-07-14T18:11:42.913130,Includes bibliographical references and index\r\n`,
    accept: ".csv",
    description:
      "Import books as CSV. Only Admins and Super Admins can access this feature.",
  },
  {
    label: "Transactions",
    endpoint: "/api/import/transactions",
    icon: History,
    sample: `id,bookId,userId,transactionType,status,issueDate,dueDate,returnDate,transactionNotes\r\n89f85bea-f5db-4b51-89e4-3f6d98ffbc92,c13a5ac8-f848-4d16-8f57-72ea1cd795b1,48359918-80db-4eaa-8b07-4a40d45e19c5,ISSUE,ACTIVE,2025-07-14T00:00,2025-08-13T00:00,,\r\n`,
    accept: ".csv",
    description:
      "Import transactions as CSV. Only Admins and Super Admins can access this feature.",
  },
];

const DataImport: React.FC = () => {
  const { user } = useAuthStore();
  const [selected, setSelected] = useState(IMPORT_OPTIONS[0]);

  if (user?.userRole !== "ADMIN" && user?.userRole !== "SUPER_ADMIN") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Access Denied
            </h2>
            <p className="text-red-600">
              Only Admins and Super Admins can access the Data Import page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto my-12 p-4"
    >
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <UploadCloud className="w-7 h-7 text-primary" />
            Data Import
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Import users, books, or transactions from CSV files. Data will be
            validated and added to the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex justify-center gap-4 mb-4">
            {IMPORT_OPTIONS.map((opt) => (
              <Button
                key={opt.label}
                variant={selected.label === opt.label ? "default" : "outline"}
                onClick={() => setSelected(opt)}
                className="flex items-center gap-2"
              >
                <opt.icon className="w-5 h-5" /> {opt.label}
              </Button>
            ))}
          </div>
          <ImportStepCard option={selected} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ImportStepCard: React.FC<{ option: (typeof IMPORT_OPTIONS)[0] }> = ({
  option,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importStep, setImportStep] = useState<
    "select" | "preview" | "loading" | "result"
  >("select");
  const [importResult, setImportResult] = useState<null | {
    successfulImports: number;
    failedImports: number;
    failedRecordIdentifiers: string[];
    message: string;
  }>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setImportResult(null);
    setImportError(null);
    if (f) {
      parseCsvPreview(f);
      setImportStep("preview");
    }
  };

  const parseCsvPreview = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        setPreview(results.data.slice(0, 5));
        setHeaders(results.meta.fields || []);
      },
      error: () => {
        setPreview(null);
        setHeaders([]);
      },
    });
  };

  const handleImport = async () => {
    if (!file) {
      setImportError("Please select a CSV file to import.");
      return;
    }
    setImportStep("loading");
    setImportResult(null);
    setImportError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(option.endpoint, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const text = await response.text();
      let parsed: any = {};
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { message: text };
      }
      if (!response.ok) {
        setImportError(
          parsed.message ||
            "Import failed. Please check your file and try again."
        );
        setImportStep("result");
        toast.error(parsed.message || "Import failed.");
        return;
      }
      if (
        typeof parsed.successfulImports === "number" ||
        typeof parsed.failedImports === "number" ||
        Array.isArray(parsed.failedRecordIdentifiers)
      ) {
        setImportResult({
          successfulImports: parsed.successfulImports ?? 0,
          failedImports: parsed.failedImports ?? 0,
          failedRecordIdentifiers: parsed.failedRecordIdentifiers ?? [],
          message: parsed.message ?? "Import completed.",
        });
      } else {
        setImportResult({
          successfulImports: 0,
          failedImports: 0,
          failedRecordIdentifiers: [],
          message: parsed.message ?? "Import completed.",
        });
      }
      setImportStep("result");
      toast.success(`${option.label} import successful!`);
    } catch (err) {
      setImportError("An unexpected error occurred. Please try again.");
      setImportStep("result");
      toast.error("An unexpected error occurred.");
    } finally {
      setFile(null);
      setPreview(null);
      setHeaders([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setImportResult(null);
      setImportError(null);
      parseCsvPreview(e.dataTransfer.files[0]);
      setImportStep("preview");
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDownloadFailed = () => {
    if (!importResult?.failedRecordIdentifiers?.length) return;
    const csv = ["failedRecordIdentifier"]
      .concat(importResult.failedRecordIdentifiers)
      .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `failed-${option.label.toLowerCase()}-records.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const resetImport = () => {
    setFile(null);
    setPreview(null);
    setHeaders([]);
    setImportResult(null);
    setImportError(null);
    setImportStep("select");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {importStep === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="border-2 border-dashed border-blue-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition min-h-[120px] w-full"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
              <span className="font-medium text-blue-700">
                Drag & drop CSV here, or click to select
              </span>
              <input
                type="file"
                accept={option.accept}
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Button
                variant="link"
                size="sm"
                className="px-1 py-0 h-5 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  const blob = new Blob([option.sample], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `sample-${option.label.toLowerCase()}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                }}
              >
                Download Sample
              </Button>
            </div>
          </motion.div>
        )}
        {importStep === "preview" && preview && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <div className="w-full overflow-x-auto border rounded bg-gray-50">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    {headers.map((h) => (
                      <th
                        key={h}
                        className="px-2 py-1 font-semibold text-left border-b"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i}>
                      {headers.map((h) => (
                        <td key={h} className="px-2 py-1 border-b">
                          {row[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-xs text-muted-foreground p-2">
                Previewing first {preview.length} rows
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={resetImport}>
                Choose Another File
              </Button>
              <Button
                onClick={handleImport}
                className="flex items-center gap-2"
              >
                <UploadCloud className="w-5 h-5" /> Import
              </Button>
            </div>
          </motion.div>
        )}
        {importStep === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-center gap-4 py-8"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
              <UploadCloud className="w-8 h-8 text-blue-500" />
            </div>
            <span className="text-blue-700 font-medium">
              Importing... Please wait.
            </span>
          </motion.div>
        )}
        {importStep === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-center gap-4 py-4 w-full"
          >
            {importError ? (
              <div className="flex flex-col items-center gap-2">
                <AlertCircle className="w-10 h-10 text-red-600" />
                <span className="text-red-700 font-semibold">
                  {importError}
                </span>
                <Button variant="outline" onClick={resetImport}>
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <CheckCircle className="w-10 h-10 text-green-600" />
                <span className="text-green-700 font-semibold text-lg">
                  Import Complete!
                </span>
                <div className="flex gap-8 mt-2">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-green-700">
                      {importResult?.successfulImports ?? 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Successful
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-red-700">
                      {importResult?.failedImports ?? 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Failed
                    </span>
                  </div>
                </div>
                {importResult?.failedRecordIdentifiers?.length ? (
                  <div className="w-full mt-4">
                    <div className="text-xs text-red-700 font-semibold mb-1">
                      Failed Records:
                    </div>
                    <div className="max-h-24 overflow-y-auto border rounded bg-red-50 p-2 text-xs text-red-800">
                      {importResult.failedRecordIdentifiers.map((id, idx) => (
                        <div key={idx}>{id}</div>
                      ))}
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 mt-1"
                      onClick={handleDownloadFailed}
                    >
                      Download Failed Records as CSV
                    </Button>
                  </div>
                ) : null}
                <div className="mt-2 text-xs text-muted-foreground text-center max-w-xs">
                  {importResult?.message}
                </div>
                <Button className="mt-4" onClick={resetImport}>
                  Import Another File
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataImport;
