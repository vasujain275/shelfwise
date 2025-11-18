import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import type { User } from '@/types/user';
import type { UseFormReturn } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<any>;
  user: User | null;
  form: UseFormReturn<any>;
}

const userRoles = ["MEMBER", "ADMIN", "SUPER_ADMIN"] as const;
const userStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED", "EXPIRED"] as const;

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSubmit, user, form }) => {
  if (!user) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Row 1: Full Name, Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 2: Phone Mobile, Phone Office */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="phoneMobile" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phoneOffice" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Office Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 3: Division, Department */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="division" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Division</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="department" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 4: Designation, Floor Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="designation" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="floorNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 5: Office Room, Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="officeRoom" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Office Room</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 6: User Role, User Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="userRole" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full border rounded px-2 py-2">
                              {userRoles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="userStatus" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full border rounded px-2 py-2">
                              {userStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 7: Books Issued, Expiration Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="booksIssued" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Books Issued</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="expirationDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 8: Photo Path, Emergency Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="photoPath" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photo Path</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="emergencyContact" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 9: Emergency Phone, Remarks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="emergencyPhone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="remarks" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remarks</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditUserModal; 