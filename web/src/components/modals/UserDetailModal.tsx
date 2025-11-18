import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Mail, Phone, Building, MapPin, Shield, Calendar, BookOpen, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types/user';

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose }) => {
  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MEMBER':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring" as const, damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="hover:bg-white/50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
                    <p className="text-sm text-gray-600">Complete information about this user</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="p-6">
                  {/* Title Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.fullName}</h1>
                    <p className="text-lg text-gray-600 mb-3">Employee ID: {user.employeeId}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(user.userStatus)}>
                        {user.userStatus}
                      </Badge>
                      <Badge className={getRoleColor(user.userRole)}>
                        {user.userRole.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {user.designation}
                      </Badge>
                    </div>
                  </motion.div>

                  {/* Main Info Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                  >
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email Address</p>
                          <p className="text-gray-900">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone Numbers</p>
                          <p className="text-gray-900">
                            Mobile: {user.phoneMobile || 'Not provided'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Office: {user.phoneOffice || 'Not provided'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Building className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Work Information</p>
                          <p className="text-gray-900">Division: {user.division}</p>
                          <p className="text-sm text-gray-600">Department: {user.department}</p>
                          <p className="text-sm text-gray-600">Floor: {user.floorNumber} | Room: {user.officeRoom}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Address</p>
                          <p className="text-gray-900">{user.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-indigo-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Account Details</p>
                          <p className="text-gray-900">Role: {user.userRole.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-600">Status: {user.userStatus}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Book Activity</p>
                          <p className="text-gray-900">Total Issued: {user.booksIssued}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-teal-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Important Dates</p>
                          <p className="text-gray-900">
                            Registration: {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'Not set'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Expiration: {user.expirationDate ? new Date(user.expirationDate).toLocaleDateString() : 'Not set'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <UserCheck className="h-5 w-5 text-pink-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                          <p className="text-gray-900">{user.emergencyContact || 'Not provided'}</p>
                          <p className="text-sm text-gray-600">{user.emergencyPhone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Additional Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    {user.remarks && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Remarks</p>
                        <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">{user.remarks}</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserDetailModal; 