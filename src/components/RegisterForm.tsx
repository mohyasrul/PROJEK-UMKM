import React, { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { useAuthStore } from '@/stores/authStore';
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '@/utils/auth';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { register, isLoading, error, clearError } = useAuthStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Clear global error
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate username
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else {
      const usernameValidation = validateUsername(formData.username);
      if (!usernameValidation.isValid) {
        errors.username = usernameValidation.errors[0];
      }
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate full name
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters long';
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors[0];
      }
    }

    // Validate password confirmation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await register({
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      password: formData.password,
    });

    if (success) {
      // Reset form on successful registration
      setFormData({
        username: '',
        email: '',
        fullName: '',
        password: '',
        confirmPassword: '',
      });
      setFieldErrors({});
    }
  };

  return (
    <Card title="Register" subtitle="Create a new account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          error={fieldErrors.username}
          placeholder="Choose a username"
          autoComplete="username"
          disabled={isLoading}
          helperText="3-20 characters, letters, numbers, and underscores only"
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={fieldErrors.email}
          placeholder="Enter your email address"
          autoComplete="email"
          disabled={isLoading}
        />

        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          error={fieldErrors.fullName}
          placeholder="Enter your full name"
          autoComplete="name"
          disabled={isLoading}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={fieldErrors.password}
          placeholder="Create a password"
          autoComplete="new-password"
          disabled={isLoading}
          helperText="At least 6 characters with uppercase, lowercase, and number"
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={fieldErrors.confirmPassword}
          placeholder="Confirm your password"
          autoComplete="new-password"
          disabled={isLoading}
        />

        <div className="flex flex-col space-y-3">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>

          {onSwitchToLogin && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                  disabled={isLoading}
                >
                  Sign in here
                </button>
              </p>
            </div>
          )}
        </div>
      </form>
    </Card>
  );
};

export default RegisterForm;
