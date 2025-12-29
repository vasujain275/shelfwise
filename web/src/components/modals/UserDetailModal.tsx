import { Modal } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types/user";
import { motion } from "framer-motion";
import {
  BookOpen,
  Building,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Shield,
  UserCheck,
} from "lucide-react";
import React from "react";

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "SUSPENDED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ADMIN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MEMBER":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      subtitle="Complete information about this user"
      size="xl"
      showBackButton
    >
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {user.fullName}
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-3">
          Employee ID: {user.employeeId}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(user.userStatus)}>
            {user.userStatus}
          </Badge>
          <Badge className={getRoleColor(user.userRole)}>
            {user.userRole.replace("_", " ")}
          </Badge>
          <Badge variant="outline">{user.designation}</Badge>
        </div>
      </motion.div>

      {/* Main Info Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6"
      >
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs md:text-sm font-medium text-gray-500">
                Email Address
              </p>
              <p className="text-sm md:text-base text-gray-900 truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 md:h-5 md:w-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500">
                Phone Numbers
              </p>
              <p className="text-sm md:text-base text-gray-900">
                Mobile: {user.phoneMobile || "Not provided"}
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                Office: {user.phoneOffice || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building className="h-4 w-4 md:h-5 md:w-5 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500">
                Work Information
              </p>
              <p className="text-sm md:text-base text-gray-900">
                Division: {user.division}
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                Department: {user.department}
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                Floor: {user.floorNumber} | Room: {user.officeRoom}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-orange-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500">
                Address
              </p>
              <p className="text-sm md:text-base text-gray-900">
                {user.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 md:h-5 md:w-5 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500">
                Account Details
              </p>
              <p className="text-sm md:text-base text-gray-900">
                Role: {user.userRole.replace("_", " ")}
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                Status: {user.userStatus}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500">
                Book Activity
              </p>
              <p className="text-sm md:text-base text-gray-900">
                Total Issued: {user.booksIssued}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500">
                Important Dates
              </p>
              <p className="text-sm md:text-base text-gray-900">
                Registration:{" "}
                {user.registrationDate
                  ? new Date(user.registrationDate).toLocaleDateString()
                  : "Not set"}
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                Expiration:{" "}
                {user.expirationDate
                  ? new Date(user.expirationDate).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-pink-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500">
                Emergency Contact
              </p>
              <p className="text-sm md:text-base text-gray-900">
                {user.emergencyContact || "Not provided"}
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                {user.emergencyPhone || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Details */}
      {user.remarks && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">
            Remarks
          </p>
          <p className="text-sm md:text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
            {user.remarks}
          </p>
        </motion.div>
      )}
    </Modal>
  );
};

export default UserDetailModal;
