import { create } from "zustand";
import type { AuthState, UserProfile } from "../types/auth";

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isAuthenticating: true, // Initially true while checking auth status
    error: null,

    login: async (username, password) => {
      set({ isLoading: true, error: null });

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Login failed");
        }

        // Login successful, now fetch user profile
        await get().fetchProfile();

        set({ isLoading: false, error: null });
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        set({
          isLoading: false,
          error: errorMessage,
          user: null,
          isAuthenticated: false,
        });
        return false;
      }
    },

    logout: async () => {
      set({ isLoading: true });

      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          // Even if logout fails on server, clear client state for UX
          console.error("Logout failed on server, but clearing client state.");
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    },

    fetchProfile: async () => {
      set({ isLoading: true });
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const userProfile: UserProfile = data.data;
          set({ user: userProfile, isAuthenticated: true, error: null });
        } else if ([401, 403, 500].includes(response.status)) {
          // Handle common unauthenticated statuses (401, 403).
          // A 500 is included as a workaround for cases where the backend
          // might throw an unhandled exception for unauthenticated users
          // on the /api/auth/me route, preventing an error flash on the login page.
          set({ user: null, isAuthenticated: false, error: null });
        } else {
          // Other errors during profile fetch
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch user profile");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch user profile";
        console.error("Fetch profile error:", errorMessage);
        set({ user: null, isAuthenticated: false, error: errorMessage });
      } finally {
        set({ isLoading: false });
      }
    },

    initializeAuth: async () => {
      set({ isAuthenticating: true });
      await get().fetchProfile();
      set({ isAuthenticating: false });
    },

    clearError: () => set({ error: null }),
  }),
);