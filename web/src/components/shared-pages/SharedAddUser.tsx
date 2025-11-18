import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building,
  CalendarIcon,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Phone,
  Plus,
  Shield,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

// Import ShadCN UI Components
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";

// Define arrays for dropdowns
const userRoles = ["MEMBER", "ADMIN", "SUPER_ADMIN"] as const;

const userStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

// Define the form validation schema using Zod
const addUserFormSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required."),
  fullName: z.string().min(1, "Full Name is required."),
  email: z.string().email("Invalid email address."),
  phoneMobile: z.string().optional(),
  phoneOffice: z.string().optional(),
  division: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  floorNumber: z.string().optional(),
  officeRoom: z.string().optional(),
  address: z.string().optional(),
  userRole: z.enum(userRoles),
  userStatus: z.enum(userStatuses).optional(),
  expirationDate: z.date().optional(),
  photoPath: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  remarks: z.string().optional(),
  password: z.string().min(8, "Password is required."),
});

type AddUserFormValues = z.infer<typeof addUserFormSchema>;

// Step configuration
const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Employee details and identification",
    icon: User,
    fields: ["employeeId", "fullName", "email", "password"],
  },
  {
    id: 2,
    title: "Contact Details",
    description: "Phone numbers and address",
    icon: Phone,
    fields: [
      "phoneMobile",
      "phoneOffice",
      "address",
      "emergencyContact",
      "emergencyPhone",
    ],
  },
  {
    id: 3,
    title: "Work Information",
    description: "Division, department, and office details",
    icon: Building,
    fields: [
      "division",
      "department",
      "designation",
      "floorNumber",
      "officeRoom",
    ],
  },
  {
    id: 4,
    title: "Account Settings",
    description: "User role, status, and additional details",
    icon: Shield,
    fields: ["userRole", "userStatus", "expirationDate", "remarks"],
  },
];

const SharedAddUser: React.FC = () => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState<AddUserFormValues | null>(
    null
  );

  // Determine available roles based on current user's role
  const getAvailableRoles = () => {
    if (user?.userRole === "SUPER_ADMIN") {
      return userRoles;
    } else if (user?.userRole === "ADMIN") {
      return ["MEMBER"] as const;
    }
    return ["MEMBER"] as const;
  };

  const availableRoles = getAvailableRoles();

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: {
      employeeId: "",
      fullName: "",
      email: "",
      password: "",
      userRole: availableRoles[0],
      userStatus: "ACTIVE",
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

  const onSubmit = async (data: AddUserFormValues) => {
    setIsSubmitting(true);
    const payload = {
      ...data,
      expirationDate: data.expirationDate
        ? format(data.expirationDate, "yyyy-MM-dd")
        : undefined,
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to add user. Please try again."
        );
      }

      const result = await response.json();
      setCreatedUser(result.data);
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
    setCreatedUser(null);
    form.reset();
    setCurrentStep(1);
  };

  if (isSuccess && createdUser) {
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
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-blue-600" />
                </motion.div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-blue-800">
                  User Added Successfully!
                </h2>
                <p className="text-blue-600">
                  The user has been added to the library system.
                </p>
              </div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-lg">
                      {createdUser.fullName || createdUser.email}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Added
                  </Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{createdUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-medium">{createdUser.userRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employee ID:</span>
                    <span className="font-medium">
                      {createdUser.employeeId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">
                      {createdUser.userStatus}
                    </span>
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
                  Add Another User
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
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Employee ID <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2021CA1042" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Vivek Sharma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="At least 8 characters"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground mt-1">
                    Password must be at least 8 characters.
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                name="phoneMobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="9821102350" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneOffice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="01112345680" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Building, Street, City"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Meena Mehta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543215" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                name="division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <FormControl>
                      <Input placeholder="Research" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Avionics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Scientist A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="floorNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor Number</FormLabel>
                    <FormControl>
                      <Input placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officeRoom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Room</FormLabel>
                    <FormControl>
                      <Input placeholder="307" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                name="userRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
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
                name="userStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
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
                name="expirationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiration Date</FormLabel>
                    <div className="flex items-center gap-2">
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
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(undefined)}
                          className="text-xs text-muted-foreground"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional remarks about the user..."
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
              Add a New User
            </CardTitle>
            <CardDescription className="text-lg">
              Fill in the details below to add a new user to the library system
            </CardDescription>
            {user?.userRole === "SUPER_ADMIN" && (
              <p className="text-sm text-muted-foreground mt-2">
                Super Admin can add Admin, Super Admin, and Member users.
              </p>
            )}
            {user?.userRole === "ADMIN" && (
              <p className="text-sm text-muted-foreground mt-2">
                Admin can only add Member users.
              </p>
            )}
          </CardHeader>

          {/* Progress Indicator */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300",
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
                        <step.icon className="w-5 h-5" />
                      )}
                    </motion.div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
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
                  <AnimatePresence mode="wait">
                    {renderStepContent(currentStep)}
                  </AnimatePresence>
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
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <AnimatePresence mode="wait">
                    {renderStepContent(currentStep)}
                  </AnimatePresence>
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
                        {isSubmitting && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        {isSubmitting ? "Adding User..." : "Add User"}
                      </Button>
                    </div>
                  </motion.div>
                </form>
              )}
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SharedAddUser;
