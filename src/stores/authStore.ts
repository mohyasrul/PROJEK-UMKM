import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@/types';
import {
  authenticateUser,
  generateSessionToken,
  hashPassword,
} from '@/utils/auth';
import { UserService } from '@/db/services';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
  }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        token: null,
        isLoading: false,
        error: null,

        login: async (usernameOrEmail: string, password: string) => {
          set({ isLoading: true, error: null }, false, 'auth/login-start');

          try {
            const user = authenticateUser(usernameOrEmail, password);

            if (user) {
              const token = generateSessionToken();
              set(
                {
                  user,
                  token,
                  isAuthenticated: true,
                  isLoading: false,
                },
                false,
                'auth/login-success'
              );
              return true;
            } else {
              set(
                {
                  error: 'Invalid username/email or password',
                  isLoading: false,
                },
                false,
                'auth/login-failure'
              );
              return false;
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Login failed';
            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              'auth/login-error'
            );
            return false;
          }
        },

        register: async (userData) => {
          set({ isLoading: true, error: null }, false, 'auth/register-start');

          try {
            // Check if username already exists
            const existingUsername = UserService.findByUsername(
              userData.username
            );
            if (existingUsername) {
              set(
                {
                  error: 'Username already exists',
                  isLoading: false,
                },
                false,
                'auth/register-failure'
              );
              return false;
            }

            // Check if email already exists
            const existingEmail = UserService.findByEmail(userData.email);
            if (existingEmail) {
              set(
                {
                  error: 'Email already exists',
                  isLoading: false,
                },
                false,
                'auth/register-failure'
              );
              return false;
            }

            // Create new user
            const hashedPassword = hashPassword(userData.password);
            const newUser = await UserService.create({
              username: userData.username,
              email: userData.email,
              password_hash: hashedPassword,
              full_name: userData.fullName,
              role: 'user',
              is_active: true,
            });

            // Auto-login after registration
            const token = generateSessionToken();
            set(
              {
                user: newUser,
                token,
                isAuthenticated: true,
                isLoading: false,
              },
              false,
              'auth/register-success'
            );
            return true;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Registration failed';
            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              'auth/register-error'
            );
            return false;
          }
        },

        logout: () => {
          set(
            {
              user: null,
              token: null,
              isAuthenticated: false,
              error: null,
            },
            false,
            'auth/logout'
          );
        },

        clearError: () => {
          set({ error: null }, false, 'auth/clear-error');
        },

        updateProfile: async (userData) => {
          const { user } = get();
          if (!user) return false;

          set(
            { isLoading: true, error: null },
            false,
            'auth/update-profile-start'
          );

          try {
            const success = UserService.update(user.id, {
              full_name: userData.full_name,
              email: userData.email,
              // Don't allow changing username or role through profile update
            });

            if (success) {
              const updatedUser = UserService.findById(user.id);
              if (updatedUser) {
                set(
                  {
                    user: updatedUser,
                    isLoading: false,
                  },
                  false,
                  'auth/update-profile-success'
                );
                return true;
              }
            }

            set(
              {
                error: 'Failed to update profile',
                isLoading: false,
              },
              false,
              'auth/update-profile-failure'
            );
            return false;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Update failed';
            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              'auth/update-profile-error'
            );
            return false;
          }
        },

        changePassword: async (
          currentPassword: string,
          newPassword: string
        ) => {
          const { user } = get();
          if (!user) return false;

          set(
            { isLoading: true, error: null },
            false,
            'auth/change-password-start'
          );

          try {
            // Verify current password
            const verifiedUser = authenticateUser(
              user.username,
              currentPassword
            );
            if (!verifiedUser) {
              set(
                {
                  error: 'Current password is incorrect',
                  isLoading: false,
                },
                false,
                'auth/change-password-failure'
              );
              return false;
            }

            // Update password
            const hashedNewPassword = hashPassword(newPassword);
            const success = UserService.update(user.id, {
              password_hash: hashedNewPassword,
            });

            if (success) {
              set({ isLoading: false }, false, 'auth/change-password-success');
              return true;
            }

            set(
              {
                error: 'Failed to change password',
                isLoading: false,
              },
              false,
              'auth/change-password-failure'
            );
            return false;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Password change failed';
            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              'auth/change-password-error'
            );
            return false;
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);
