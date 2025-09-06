import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import tokenService from '../../../services/tokenService';
import Button from '../../../components/ui/Button';

export default function TransferForm({ contract, userBalance, onTransactionComplete }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    toAddress: '',
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
      setError('You must be signed in to transfer tokens');
      return;
    }

    if (!contract?.id) {
      setError('No token contract selected');
      return;
    }

    if (!formData?.toAddress?.trim()) {
      setError('Please enter a recipient address');
      return;
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Convert amount to wei (considering decimals)
      const decimals = contract?.decimals || 18;
      const amountInWei = tokenService?.parseTokenAmount(formData?.amount, decimals);

      // Check if user has enough balance
      const currentBalance = userBalance?.balance || '0';
      if (parseInt(currentBalance) < amountInWei) {
        setError(`Insufficient balance. You have ${tokenService?.formatTokenAmount(currentBalance, decimals)} ${contract?.symbol || 'tokens'}`);
        return;
      }

      // Perform transfer
      const { data: transferResult, error: transferError } = await tokenService?.transfer(
        contract?.id,
        formData?.toAddress?.trim(),
        amountInWei
      );

      if (transferError) {
        setError(`Transfer failed: ${transferError?.message}`);
        return;
      }

      if (!transferResult) {
        setError('Transfer failed. Please check your balance and try again.');
        return;
      }

      setSuccess(`Successfully transferred ${formData?.amount} ${contract?.symbol || 'tokens'}!`);
      setFormData({ toAddress: '', amount: '' });
      
      // Trigger parent component to reload data
      if (onTransactionComplete) {
        onTransactionComplete();
      }

    } catch (error) {
      setError(`Transfer failed: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const maxAmount = userBalance?.balance && contract?.decimals
    ? tokenService?.formatTokenAmount(userBalance?.balance, contract?.decimals)
    : '0';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Transfer Tokens</h3>
        <p className="text-sm text-gray-600">
          Send {contract?.name || 'tokens'} to another address
        </p>
      </div>
      {/* Current Balance Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Available Balance:</span>
          <span className="text-lg font-bold text-gray-900">
            {maxAmount} {contract?.symbol || 'TOKENS'}
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="toAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address *
          </label>
          <input
            type="text"
            id="toAddress"
            name="toAddress"
            value={formData?.toAddress}
            onChange={handleInputChange}
            placeholder="Enter recipient address or user ID"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount *
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
              max={maxAmount}
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
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              Max: {maxAmount} {contract?.symbol || 'TOKENS'}
            </span>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, amount: maxAmount }))}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              disabled={loading}
            >
              Use Max
            </button>
          </div>
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
          disabled={loading || !user || !formData?.toAddress?.trim() || !formData?.amount}
          className="w-full"
        >
          {loading ? 'Processing Transfer...' : 'Transfer Tokens'}
        </Button>

        {!user && (
          <p className="text-sm text-amber-600 text-center">
            Please sign in to transfer tokens
          </p>
        )}
      </form>
    </div>
  );
}