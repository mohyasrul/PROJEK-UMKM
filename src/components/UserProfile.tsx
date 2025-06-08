import React, { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { useAuthStore } from '@/stores/authStore';
import { validateEmail, validatePassword } from '@/utils/auth';

const UserProfile: React.FC = () => {
  const { user, updateProfile, changePassword, isLoading, error, clearError } =
    useAuthStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {}
  );

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  const [successMessage, setSuccessMessage] = useState('');

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));

    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (error) clearError();
    if (successMessage) setSuccessMessage('');
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (error) clearError();
    if (successMessage) setSuccessMessage('');
  };

  const validateProfileForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!profileData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (profileData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters long';
    }

    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const passwordValidation = validatePassword(passwordData.newPassword);
      if (!passwordValidation.isValid) {
        errors.newPassword = passwordValidation.errors[0];
      }
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    const success = await updateProfile({
      full_name: profileData.fullName,
      email: profileData.email,
    });

    if (success) {
      setSuccessMessage('Profile updated successfully!');
      setProfileErrors({});
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    const success = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (success) {
      setSuccessMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    }
  };

  if (!user) {
    return (
      <Card title="Error">
        <p className="text-red-600">User not found</p>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="User Profile" subtitle="Manage your account settings">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'password'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-6">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Username"
                value={user.username}
                disabled
                helperText="Username cannot be changed"
              />
              <Input
                label="Role"
                value={user.role}
                disabled
                helperText="Role is managed by administrators"
              />
            </div>

            <Input
              label="Full Name"
              name="fullName"
              value={profileData.fullName}
              onChange={handleProfileInputChange}
              error={profileErrors.fullName}
              disabled={isLoading}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileInputChange}
              error={profileErrors.email}
              disabled={isLoading}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              error={passwordErrors.currentPassword}
              disabled={isLoading}
              autoComplete="current-password"
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              error={passwordErrors.newPassword}
              disabled={isLoading}
              autoComplete="new-password"
              helperText="At least 6 characters with uppercase, lowercase, and number"
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              error={passwordErrors.confirmPassword}
              disabled={isLoading}
              autoComplete="new-password"
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default UserProfile;
