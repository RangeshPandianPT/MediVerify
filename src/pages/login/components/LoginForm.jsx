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
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={18} color="var(--color-error)" className="mt-0.5" />
              <p className="text-sm text-error font-medium">{errors?.general}</p>
            </div>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="grid grid-cols-2 bg-muted rounded-lg p-1.5 gap-1.5">
          <button
            type="button"
            className={`py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-200 ${authMode === 'signin' ? 'bg-card text-foreground shadow-subtle' : 'text-muted-foreground hover:text-foreground/70'}`}
            onClick={() => toggleMode('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-200 ${authMode === 'signup' ? 'bg-card text-foreground shadow-subtle' : 'text-muted-foreground hover:text-foreground/70'}`}
            onClick={() => toggleMode('signup')}
          >
            Create Account
          </button>
        </div>

        {/* Full Name Field - Signup Only */}
        {authMode === 'signup' && (
          <Input
            type="text"
            label="Full Name"
            placeholder="e.g., Priya Sharma"
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
          placeholder="you@example.com"
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
            placeholder="••••••••"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
            className="mb-0"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-11 text-muted-foreground hover:text-foreground focus-medical transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
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
              className="text-sm font-semibold text-primary hover:text-primary/80 focus-medical transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>

        {/* Sign In / Create Account Button */}
        <Button
          type="submit"
          loading={isLoading}
          fullWidth
          size="lg"
          className="h-12 font-semibold text-base"
          iconName={authMode === 'signup' ? 'UserPlus' : 'LogIn'}
          iconPosition="right"
        >
          {authMode === 'signup' ? 'Create Account' : 'Sign In Securely'}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-background text-muted-foreground font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          loading={isLoading}
          fullWidth
          size="lg"
          className="h-12 font-semibold text-base"
          iconName="Chrome"
          iconPosition="left"
        >
          Google
        </Button>

        {/* Security Notice */}
        <div className="bg-accent/15 border border-accent/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="Lock" size={14} color="var(--color-accent)" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Encrypted & Secure</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your data is protected with enterprise-grade encryption. Never share your login credentials.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;