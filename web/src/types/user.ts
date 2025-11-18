export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MEMBER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

// Extended user interface that matches the API response
export interface User {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phoneMobile: string | null;
  phoneOffice: string | null;
  division: string;
  department: string;
  designation: string;
  floorNumber: string;
  officeRoom: string;
  address: string | null;
  userRole: UserRole;
  userStatus: UserStatus;
  booksIssued: number;
  registrationDate: string | null;
  expirationDate: string | null;
  photoPath: string | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  remarks: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UserSearchResponse {
  status: string;
  data: User[];
  timestamp: string;
  pagination: Pagination;
}

export interface Pagination {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
} 