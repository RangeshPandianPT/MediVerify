import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const LoginForm = ({
  onEmailPasswordAuth,
  onGoogleAuth,
  onForgotPassword,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const [authMode, setAuthMode] = useState(initialMode);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (authMode === 'signup' && !formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required to create an account';
    }
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onEmailPasswordAuth?.(formData, authMode);
      navigate('/user-dashboard');
    } catch (error) {
      setErrors({ general: error?.message || 'Authentication failed. Please try again.' });
    }
  };

  const handleForgotPassword = async () => {
    if (!formData?.email) {
      setErrors({ email: 'Enter your email first to reset password.' });
      return;
    }

    try {
      await onForgotPassword?.(formData?.email);
      setErrors({ general: 'Password reset email sent. Please check your inbox.' });
    } catch (error) {
      setErrors({ general: error?.message || 'Unable to send reset email. Please try again.' });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await onGoogleAuth?.();
      navigate('/user-dashboard');
    } catch (error) {
      setErrors({ general: error?.message || 'Google sign-in failed. Please try again.' });
    }
  };

  const toggleMode = (mode) => {
    setAuthMode(mode);
    setErrors({});
    setSearchParams(mode === 'signup' ? { mode: 'signup' } : {});
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error */}
        {errors?.general && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <p className="text-sm text-error">{errors?.general}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 bg-muted/40 rounded-lg p-1 gap-1">
          <button
            type="button"
            className={`py-2 text-sm rounded-md transition-colors ${authMode === 'signin' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => toggleMode('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`py-2 text-sm rounded-md transition-colors ${authMode === 'signup' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => toggleMode('signup')}
          >
            Create Account
          </button>
        </div>

        {authMode === 'signup' && (
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData?.fullName}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            error={errors?.fullName}
            required
            className="mb-0"
          />
        )}

        {/* Email Field */}
        <Input
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
          className="mb-0"
        />

        {/* Password Field */}
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
            className="mb-0"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground focus-medical"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={formData?.rememberMe}
            onChange={(e) => handleInputChange('rememberMe', e?.target?.checked)}
            size="sm"
          />
          {authMode === 'signin' && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 focus-medical"
            >
              Forgot password?
            </button>
          )}
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          loading={isLoading}
          fullWidth
          className="h-12"
          iconName={authMode === 'signup' ? 'UserPlus' : 'LogIn'}
          iconPosition="right"
        >
          {authMode === 'signup' ? 'Create Account' : 'Sign In'}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          loading={isLoading}
          fullWidth
          className="h-12"
          iconName="Chrome"
          iconPosition="left"
        >
          Continue with Google
        </Button>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} color="var(--color-accent)" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Secure Authentication Enabled</p>
              <p className="text-xs text-muted-foreground">
                Use your Firebase email login or Google account for secure access.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;