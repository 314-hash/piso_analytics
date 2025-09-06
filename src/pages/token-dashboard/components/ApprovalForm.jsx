import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import tokenService from '../../../services/tokenService';
import Button from '../../../components/ui/Button';

export default function ApprovalForm({ contract, onTransactionComplete }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    spenderAddress: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user types
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!user) {
      setError('You must be signed in to approve token spending');
      return;
    }

    if (!contract?.id) {
      setError('No token contract selected');
      return;
    }

    if (!formData?.spenderAddress?.trim()) {
      setError('Please enter a spender address');
      return;
    }

    if (!formData?.amount || parseFloat(formData?.amount) < 0) {
      setError('Please enter a valid amount (use 0 to revoke approval)');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Convert amount to wei (considering decimals)
      const decimals = contract?.decimals || 18;
      const amountInWei = tokenService?.parseTokenAmount(formData?.amount, decimals);

      // Perform approval
      const { data: approvalResult, error: approvalError } = await tokenService?.approve(
        contract?.id,
        formData?.spenderAddress?.trim(),
        amountInWei
      );

      if (approvalError) {
        setError(`Approval failed: ${approvalError?.message}`);
        return;
      }

      if (!approvalResult) {
        setError('Approval failed. Please try again.');
        return;
      }

      const actionText = parseFloat(formData?.amount) === 0 ? 'revoked approval for' : 'approved';
      setSuccess(`Successfully ${actionText} ${formData?.amount} ${contract?.symbol || 'tokens'}!`);
      setFormData({ spenderAddress: '', amount: '' });
      
      // Trigger parent component to reload data
      if (onTransactionComplete) {
        onTransactionComplete();
      }

    } catch (error) {
      setError(`Approval failed: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Approve Token Spending</h3>
        <p className="text-sm text-gray-600">
          Allow another address to spend your {contract?.name || 'tokens'} on your behalf
        </p>
      </div>
      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">About Token Approvals</h4>
            <p className="text-sm text-blue-700 mt-1">
              Approving tokens allows another address to transfer tokens from your account up to the approved amount. 
              Set amount to 0 to revoke an existing approval.
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="spenderAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Spender Address *
          </label>
          <input
            type="text"
            id="spenderAddress"
            name="spenderAddress"
            value={formData?.spenderAddress}
            onChange={handleInputChange}
            placeholder="Enter spender address or user ID"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Approval Amount *
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData?.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="any"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16"
              required
              disabled={loading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm font-medium text-gray-500">
                {contract?.symbol || 'TOKENS'}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter 0 to revoke an existing approval
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !user || !formData?.spenderAddress?.trim() || formData?.amount === ''}
          className="w-full"
        >
          {loading ? 'Processing Approval...' : 'Approve Tokens'}
        </Button>

        {!user && (
          <p className="text-sm text-amber-600 text-center">
            Please sign in to approve token spending
          </p>
        )}
      </form>
    </div>
  );
}