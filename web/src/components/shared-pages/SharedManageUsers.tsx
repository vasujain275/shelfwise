
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Edit, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import UserDetailModal from "@/components/modals/UserDetailModal";
import type { User, UserSearchResponse } from '@/types/user';
import EditUserModal from '@/components/modals/EditUserModal';
import ResetPasswordModal from '@/components/modals/ResetPasswordModal';

// --- User Form Schema ---
const userRoles = ["MEMBER", "ADMIN", "SUPER_ADMIN"] as const;
const userStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED", "EXPIRED"] as const;
const userFormSchema = z.object({
  fullName: z.string().min(1, "Full Name is required."),
  email: z.string().email().optional().nullable(),
  phoneMobile: z.string().optional().nullable(),
  phoneOffice: z.string().optional().nullable(),
  division: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  floorNumber: z.string().optional().nullable(),
  officeRoom: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  userRole: z.enum(userRoles),
  userStatus: z.enum(userStatuses),
  booksIssued: z.number().int().optional().nullable(),
  expirationDate: z.string().optional().nullable(),
  photoPath: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  emergencyPhone: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
});
type UserFormValues = z.infer<typeof userFormSchema>;

const passwordResetSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm the new password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const SharedManageUsers: React.FC = () => {
  const { user } = useAuthStore();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const resetForm = useForm<{ newPassword: string; confirmPassword: string }>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUserConfirmOpen, setIsUserConfirmOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<UserFormValues | null>(null);

  // Only admin and super admin can access
  if (user?.userRole !== "ADMIN" && user?.userRole !== "SUPER_ADMIN") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
            <p className="text-red-600">Only Admins and Super Admins can access the Manage Users page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Fetch Users ---
  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        fetchUsers(0, true);
      } else {
        fetchUsers(0, false);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch users, optionally as search
  const fetchUsers = useCallback(async (page: number, isSearch = false) => {
    setIsLoading(true);
    setError(null);
    try {
      let url;
      if (isSearch && query) {
        url = `/api/users/search?query=${encodeURIComponent(query)}&page=${page}&size=10&sortBy=fullName&sortDir=ASC`;
      } else {
        url = `/api/users?page=${page}&size=10&sortBy=fullName&sortDir=ASC`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch users");
      const result: UserSearchResponse = await response.json();
      let filteredUsers = result.data;
      // Admins can only manage Members
      if (user.userRole === "ADMIN") {
        filteredUsers = filteredUsers.filter(u => u.userRole === "MEMBER");
      }
      setUsers(filteredUsers);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.currentPage);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [query, user.userRole]);

  useEffect(() => {
    if (!query) fetchUsers(0, false);
  }, []);

  const handlePageChange = (page: number) => {
    if (query) {
      fetchUsers(page, true);
    } else {
      fetchUsers(page, false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(0);
  };

  // --- Edit User Modal Logic ---
  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {},
  });

  const openEditModal = (userObj: User) => {
    setEditUser(userObj);
    setIsEditModalOpen(true);
    const formValues: UserFormValues = {
      fullName: userObj.fullName ?? "",
      email: userObj.email ?? "",
      phoneMobile: userObj.phoneMobile ?? "",
      phoneOffice: userObj.phoneOffice ?? "",
      division: userObj.division ?? "",
      department: userObj.department ?? "",
      designation: userObj.designation ?? "",
      floorNumber: userObj.floorNumber ?? "",
      officeRoom: userObj.officeRoom ?? "",
      address: userObj.address ?? "",
      userRole: userObj.userRole,
      userStatus: userObj.userStatus ?? "ACTIVE",
      booksIssued: userObj.booksIssued ?? 0,
      expirationDate: userObj.expirationDate ? userObj.expirationDate.split("T")[0] : "",
      photoPath: userObj.photoPath ?? "",
      emergencyContact: userObj.emergencyContact ?? "",
      emergencyPhone: userObj.emergencyPhone ?? "",
      remarks: userObj.remarks ?? "",
    };
    editForm.reset(formValues);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditUser(null);
    editForm.reset({});
  };

  const handleEditSubmit = async (values: UserFormValues) => {
    if (!editUser) return;
    // Convert empty strings to null for optional fields
    const payload = {
      ...values,
      email: values.email === "" ? null : values.email,
      phoneMobile: values.phoneMobile === "" ? null : values.phoneMobile,
      phoneOffice: values.phoneOffice === "" ? null : values.phoneOffice,
      division: values.division === "" ? null : values.division,
      department: values.department === "" ? null : values.department,
      designation: values.designation === "" ? null : values.designation,
      floorNumber: values.floorNumber === "" ? null : values.floorNumber,
      officeRoom: values.officeRoom === "" ? null : values.officeRoom,
      address: values.address === "" ? null : values.address,
      expirationDate: values.expirationDate === "" ? null : values.expirationDate,
      photoPath: values.photoPath === "" ? null : values.photoPath,
      emergencyContact: values.emergencyContact === "" ? null : values.emergencyContact,
      emergencyPhone: values.emergencyPhone === "" ? null : values.emergencyPhone,
      remarks: values.remarks === "" ? null : values.remarks,
    };
    try {
      const response = await fetch(`/api/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user.");
      }
      toast.success("User updated successfully!");
      closeEditModal();
      fetchUsers(currentPage);
    } catch (err: any) {
      toast.error(err.message || "Failed to update user.");
    }
  };

  // --- Delete User Dialog Logic ---
  const openDeleteDialog = (userObj: User) => {
    setDeleteUser(userObj);
    setIsDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteUser(null);
  };
  const handleDelete = async () => {
    if (!deleteUser) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${deleteUser.id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user.");
      }
      toast.success("User deleted successfully!");
      closeDeleteDialog();
      fetchUsers(currentPage);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openResetModal = (userObj: User) => {
    setResetUser(userObj);
    setIsResetModalOpen(true);
    resetForm.reset({ newPassword: "", confirmPassword: "" });
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };
  const closeResetModal = () => {
    setIsResetModalOpen(false);
    setResetUser(null);
    resetForm.reset({ newPassword: "", confirmPassword: "" });
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };
  const handleResetPassword = async (values: { newPassword: string; confirmPassword: string }) => {
    if (!resetUser) return;
    setIsResetting(true);
    try {
      const response = await fetch(`/api/users/${resetUser.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: values.newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password.");
      }
      toast.success("Password reset successfully!");
      closeResetModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password.");
    } finally {
      setIsResetting(false);
    }
  };

  const closeUserConfirmModal = () => {
    setIsUserConfirmOpen(false);
    setPendingUser(null);
  };

  const handleCreateUser = async (values: UserFormValues) => {
    if (!pendingUser) return;
    try {
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user.");
      }
      toast.success("User created successfully!");
      closeUserConfirmModal();
      fetchUsers(currentPage);
    } catch (err: any) {
      toast.error(err.message || "Failed to create user.");
    }
  };

  // Helper to generate pagination window
  const getPaginationWindow = (current: number, total: number, window: number = 3) => {
    const pages: (number | 'ellipsis')[] = [];
    if (total <= 7 + window * 2) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
      const left = Math.max(0, current - window);
      const right = Math.min(total - 1, current + window);
      if (left > 1) {
        pages.push(0);
        pages.push('ellipsis');
      } else {
        for (let i = 0; i < left; i++) pages.push(i);
      }
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < total - 2) {
        pages.push('ellipsis');
        pages.push(total - 1);
      } else {
        for (let i = right + 1; i < total; i++) pages.push(i);
      }
    }
    return pages;
  };

  // --- Render ---
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto p-4 md:p-6">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, or division..."
                className="w-full pl-10 py-3 text-base"
                value={query}
                onChange={handleSearch}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center justify-center my-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Loading users...</p>
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Alert variant="destructive" className="max-w-2xl mx-auto">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            {!isLoading && !error && users.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-lg border overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Books</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}
                          className="cursor-pointer hover:bg-blue-50 transition-colors"
                          onClick={e => {
                            // Prevent modal open if clicking edit/delete
                            if ((e.target as HTMLElement).closest("button")) return;
                            setSelectedUser(u);
                            setIsUserModalOpen(true);
                          }}
                        >
                          <TableCell>{u.fullName}</TableCell>
                          <TableCell className="font-mono text-sm">{u.employeeId}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.department}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{u.userStatus.toLowerCase()}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{u.userRole.toLowerCase()}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm font-medium">{u.booksIssued}</span>
                          </TableCell>
                          <TableCell className="flex gap-2 justify-center">
                            <Button size="icon" variant="outline" onClick={e => { e.stopPropagation(); openEditModal(u); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={e => { e.stopPropagation(); openDeleteDialog(u); }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="outline" onClick={e => { e.stopPropagation(); openResetModal(u); }} title="Reset Password">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      {/* First Page Button */}
                      <PaginationItem>
                        <PaginationLink
                          isActive={currentPage === 0}
                          onClick={currentPage === 0 ? undefined : () => handlePageChange(0)}
                          className={currentPage === 0 ? 'pointer-events-none opacity-50' : ''}
                        >
                          First
                        </PaginationLink>
                      </PaginationItem>
                      {/* Jump -10 Pages */}
                      {totalPages > 20 && (
                        <PaginationItem>
                          <PaginationLink
                            isActive={false}
                            onClick={currentPage < 10 ? undefined : () => handlePageChange(Math.max(0, currentPage - 10))}
                            className={currentPage < 10 ? 'pointer-events-none opacity-50' : ''}
                          >
                            -10
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(Math.max(0, currentPage - 1))} />
                      </PaginationItem>
                      {getPaginationWindow(currentPage, totalPages, 3).map((page, i) => (
                        page === 'ellipsis' ? (
                          <PaginationItem key={`ellipsis-${i}`}>
                            <span className="px-2">...</span>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={page}>
                            <PaginationLink isActive={page === currentPage} onClick={() => handlePageChange(page as number)}>
                              {(page as number) + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      ))}
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))} />
                      </PaginationItem>
                      {/* Jump +10 Pages */}
                      {totalPages > 20 && (
                        <PaginationItem>
                          <PaginationLink
                            isActive={false}
                            onClick={currentPage > totalPages - 11 ? undefined : () => handlePageChange(Math.min(totalPages - 1, currentPage + 10))}
                            className={currentPage > totalPages - 11 ? 'pointer-events-none opacity-50' : ''}
                          >
                            +10
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      {/* Last Page Button */}
                      <PaginationItem>
                        <PaginationLink
                          isActive={currentPage === totalPages - 1}
                          onClick={currentPage === totalPages - 1 ? undefined : () => handlePageChange(totalPages - 1)}
                          className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                        >
                          Last
                        </PaginationLink>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </motion.div>
            )}
            {!isLoading && !error && users.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="text-center text-muted-foreground mt-8">
                <p>No users found. Try a different search.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        user={editUser}
        form={editForm}
      />

      {/* Delete User Dialog */}
      <ConfirmationModal
        isOpen={isDeleteDialogOpen}
        onCancel={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete user "${deleteUser?.fullName}"? This action cannot be undone.`}
        details={deleteUser && (
          <div className="space-y-2 text-sm">
            <div><b>Email:</b> {deleteUser.email}</div>
            <div><b>Role:</b> {deleteUser.userRole}</div>
            {/* Add more fields as needed */}
          </div>
        )}
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={isDeleting}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={closeResetModal}
        onSubmit={handleResetPassword}
        user={resetUser}
        form={resetForm}
        showNewPassword={showNewPassword}
        showConfirmPassword={showConfirmPassword}
        setShowNewPassword={setShowNewPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        isResetting={isResetting}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />

      {/* User Creation Confirmation Modal */}
      <ConfirmationModal
        isOpen={isUserConfirmOpen}
        onCancel={closeUserConfirmModal}
        onConfirm={() => { if (pendingUser) handleCreateUser(pendingUser); }}
        title="Confirm User Creation"
        description={`Are you sure you want to create user "${pendingUser?.fullName}"? This action cannot be undone.`}
        details={pendingUser && (
          <div className="space-y-2 text-sm">
            <div><b>Email:</b> {pendingUser.email}</div>
            <div><b>Role:</b> {pendingUser.userRole}</div>
            {/* Add more fields as needed */}
          </div>
        )}
        confirmLabel="Create"
        confirmVariant="default"
        loading={false}
      />
    </motion.div>
  );
};

export default SharedManageUsers;
