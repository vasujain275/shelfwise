import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, ChevronLeft, ChevronRight, Check, CheckCircle, Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

// Import ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ConfirmationModal from '@/components/modals/ConfirmationModal';

// Define arrays for dropdowns from the types
const bookConditions = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "DAMAGED",
] as const;
const bookStatuses = [
  "AVAILABLE",
  "ISSUED",
  "LOST",
  "DAMAGED",
  "UNDER_REPAIR",
  "UNAVAILABLE",
] as const;
const bookTypes = [
  "REFERENCE",
  "GENERAL",
  "JOURNAL",
  "MAGAZINE",
  "THESIS",
  "REPORT",
  "TEST",
  "GIFTED",
  "OTHER",
] as const;

// Define the form validation schema using Zod
const addBookFormSchema = z.object({
  accessionNumber: z.string().min(1, "Accession Number is required."),
  isbn: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  authorPrimary: z.string().optional(),
  authorSecondary: z.string().optional(),
  publisher: z.string().optional(),
  publicationPlace: z.string().optional(),
  publicationYear: z.coerce.number().optional(),
  edition: z.string().optional(),
  pages: z.string().optional(),
  language: z.string().optional(),
  price: z.coerce.number().optional(),
  billNumber: z.string().optional(),
  vendorName: z.string().optional(),
  purchaseDate: z.date().optional(),
  keywords: z.string().optional(),
  classificationNumber: z.string().optional(),
  locationShelf: z.string().optional(),
  locationRack: z.string().optional(),
  bookCondition: z.enum(bookConditions).optional(),
  bookStatus: z.enum(bookStatuses).optional(),
  totalCopies: z.coerce.number().optional(),
  availableCopies: z.coerce.number().optional(),
  bookType: z.enum(bookTypes).optional(),
  isReferenceOnly: z.boolean().default(false).optional(),
  notes: z.string().optional(),
});

type AddBookFormValues = z.infer<typeof addBookFormSchema>;

// Step configuration
const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Enter the core book details",
    fields: ["accessionNumber", "title", "authorPrimary", "isbn", "publisher"],
  },
  {
    id: 2,
    title: "Publication Details",
    description: "Publication and physical information",
    fields: ["publicationYear", "edition", "pages", "language", "subtitle", "authorSecondary", "publicationPlace"],
  },
  {
    id: 3,
    title: "Purchase & Classification",
    description: "Purchase details and classification",
    fields: ["purchaseDate", "vendorName", "price", "billNumber", "keywords", "classificationNumber", "locationShelf", "locationRack"],
  },
  {
    id: 4,
    title: "Library Management",
    description: "Library-specific settings and notes",
    fields: ["bookType", "bookCondition", "totalCopies", "availableCopies", "isReferenceOnly", "notes"],
  },
];

const SharedAddBook: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdBook, setCreatedBook] = useState<AddBookFormValues | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingBook, setPendingBook] = useState<AddBookFormValues | null>(null);

  const form = useForm<AddBookFormValues>({
    resolver: zodResolver(addBookFormSchema),
    defaultValues: {
      accessionNumber: "",
      isReferenceOnly: false,
      title: "",
      authorPrimary: "",
      publisher: "",
      language: "English",
      totalCopies: 1,
      availableCopies: 1,
      bookCondition: "GOOD",
      bookStatus: "AVAILABLE",
      bookType: "GENERAL",
    },
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: AddBookFormValues) => {
    setIsSubmitting(true);
    const payload = {
      ...data,
      purchaseDate: data.purchaseDate
        ? format(data.purchaseDate, "yyyy-MM-dd")
        : undefined,
    };

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to add book. Please try again."
        );
      }

      const result = await response.json();
      setCreatedBook(result.data);
      setIsSuccess(true);
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setIsSuccess(false);
    setCreatedBook(null);
    form.reset();
    setCurrentStep(1);
  };

  const handleConfirm = (data: AddBookFormValues) => {
    setPendingBook(data);
    setIsConfirmOpen(true);
  };

  if (isSuccess && createdBook) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto my-12 p-4"
      >
        <Card className="overflow-hidden border-blue-200 bg-blue-50/50">
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-blue-600" />
                </motion.div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-blue-800">Book Added Successfully!</h2>
                <p className="text-blue-600">The book has been added to the library.</p>
              </div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-lg">{createdBook.title || createdBook.accessionNumber}</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Added
                  </Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Author:</span>
                    <span className="font-medium">{createdBook.authorPrimary || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publisher:</span>
                    <span className="font-medium">{createdBook.publisher || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accession #:</span>
                    <span className="font-medium">{createdBook.accessionNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{createdBook.bookType}</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button
                  onClick={handleAddAnother}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Book
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="accessionNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Accession Number <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ACC001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input placeholder="978-3-16-148410-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="The Art of Programming" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="authorPrimary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Author</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publisher</FormLabel>
                    <FormControl>
                      <Input placeholder="Tech Books Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="publicationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="edition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edition</FormLabel>
                    <FormControl>
                      <Input placeholder="3rd Edition" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pages</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="viii, 374+7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="English" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="A Comprehensive Guide" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorSecondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="publicationPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Place</FormLabel>
                  <FormControl>
                    <Input placeholder="New York, NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Purchase Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <FormControl>
                      <Input placeholder="Book Supplies Ltd." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="29.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill Number</FormLabel>
                    <FormControl>
                      <Input placeholder="BILL-2024-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="classificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classification Number</FormLabel>
                    <FormControl>
                      <Input placeholder="005.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationShelf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Shelf</FormLabel>
                    <FormControl>
                      <Input placeholder="A1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="locationRack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Rack</FormLabel>
                  <FormControl>
                    <Input placeholder="R1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., programming, algorithms, data structures"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bookType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bookTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bookCondition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bookConditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="totalCopies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Copies</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableCopies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Copies</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isReferenceOnly"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Reference Only</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      This book cannot be borrowed, only used in the library
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about the book..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Add a New Book
            </CardTitle>
            <CardDescription className="text-lg">
              Fill in the details below to add a new book to the library
            </CardDescription>
          </CardHeader>

          {/* Progress Indicator */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300",
                        currentStep > step.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : currentStep === step.id
                          ? "bg-primary/10 text-primary border-primary"
                          : "bg-muted text-muted-foreground border-muted-foreground"
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </motion.div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <motion.div
                      className={cn(
                        "flex-1 h-0.5 mx-4 transition-all duration-300",
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      )}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: currentStep > step.id ? 1 : 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <CardContent>
            <Form {...form}>
              {currentStep < steps.length ? (
                <div className="space-y-6">
                  <AnimatePresence mode="wait">{renderStepContent(currentStep)}</AnimatePresence>
                  {/* Navigation Buttons */}
                  <motion.div
                    className="flex justify-between pt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(handleConfirm)} className="space-y-6">
                  <AnimatePresence mode="wait">{renderStepContent(currentStep)}</AnimatePresence>
                  <motion.div
                    className="flex justify-between pt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                      >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? "Adding Book..." : "Add Book"}
                      </Button>
                    </div>
                  </motion.div>
                </form>
              )}
            </Form>
          </CardContent>
        </Card>
      </motion.div>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onCancel={() => {
          setIsConfirmOpen(false);
          setPendingBook(null);
        }}
        onConfirm={() => {
          if (pendingBook) {
            onSubmit(pendingBook);
            setIsConfirmOpen(false);
            setPendingBook(null);
          }
        }}
        title="Confirm Book Creation"
        description="Are you sure you want to create this book with the following details?"
        details={pendingBook && (
          <div className="space-y-2 text-sm">
            <div><b>Title:</b> {pendingBook.title}</div>
            <div><b>Accession Number:</b> {pendingBook.accessionNumber}</div>
            <div><b>Author:</b> {pendingBook.authorPrimary}</div>
            <div><b>Publisher:</b> {pendingBook.publisher}</div>
            <div><b>Year:</b> {pendingBook.publicationYear}</div>
            <div><b>Status:</b> {pendingBook.bookStatus}</div>
            {/* Add more fields as needed */}
          </div>
        )}
        confirmLabel="Create Book"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default SharedAddBook;
