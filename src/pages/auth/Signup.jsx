import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    walletAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.email?.trim() || !formData?.password?.trim() || !formData?.confirmPassword?.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData?.password !== formData?.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData?.password?.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const userData = {
        full_name: formData?.fullName?.trim(),
        wallet_address: formData?.walletAddress?.trim()
      };

      const { user, error: signUpError } = await signUp(formData?.email, formData?.password, userData);
      
      if (signUpError) {
        setError(signUpError?.message || 'Failed to create account');
        return;
      }

      if (user) {
        navigate('/token-dashboard');
      }
    } catch (error) {
      setError('Failed to create account: ' + error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData?.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData?.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">
                Wallet Address
              </label>
              <Input
                id="walletAddress"
                name="walletAddress"
                type="text"
                value={formData?.walletAddress}
                onChange={handleInputChange}
                placeholder="Enter your wallet address (optional)"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData?.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData?.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  );
}