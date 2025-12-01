import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const LoginForm = ({ onSubmit, isLoading = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Mock credentials for demo
  const mockCredentials = {
    email: 'user@mediverify.com',
    password: 'MediVerify123'
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
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
    
    // Check mock credentials
    if (formData?.email !== mockCredentials?.email || formData?.password !== mockCredentials?.password) {
      setErrors({
        general: `Invalid credentials. Use: ${mockCredentials?.email} / ${mockCredentials?.password}`
      });
      return;
    }
    
    try {
      await onSubmit?.(formData);
      navigate('/user-dashboard');
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality will be available soon. Use demo credentials for now.');
  };

  const handleGoogleSignIn = () => {
    alert('Google Sign-In will be available in the next update.');
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
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 focus-medical"
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          loading={isLoading}
          fullWidth
          className="h-12"
          iconName="LogIn"
          iconPosition="right"
        >
          Sign In
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
          fullWidth
          className="h-12"
          iconName="Chrome"
          iconPosition="left"
        >
          Sign in with Google
        </Button>

        {/* Demo Credentials Info */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} color="var(--color-accent)" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Demo Credentials</p>
              <p className="text-xs text-muted-foreground">
                Email: {mockCredentials?.email}<br />
                Password: {mockCredentials?.password}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;