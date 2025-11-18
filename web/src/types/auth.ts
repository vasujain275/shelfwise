export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MEMBER";

// User profile data from /api/auth/me
export interface UserProfile {
  id: string;
  fullName: string;
  employeeId: string;
  email: string;
  department: string;
  division: string;
  userRole: UserRole;
  userStatus: string;
  expirationDate: string;
  currentBorrowedBooksCount: number;
}

export interface AuthState {
  user: UserProfile | null; // Stores the full profile from /api/auth/me
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthenticating: boolean; // New state for initial auth check
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>; // New function for initial auth check
}
