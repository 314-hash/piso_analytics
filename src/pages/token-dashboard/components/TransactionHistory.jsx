import React from 'react';
import tokenService from '../../../services/tokenService';

export default function TransactionHistory({ transactions, contract }) {
  if (!transactions?.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center text-gray-500 py-8">No transactions found</div>
      </div>
    );
  }

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'transfer':
        return 'bg-blue-100 text-blue-800';
      case 'mint':
        return 'bg-green-100 text-green-800';
      case 'burn':
        return 'bg-red-100 text-red-800';
      case 'approval':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'transfer':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'mint':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'burn':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
      case 'approval':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        <p className="text-sm text-gray-600 mt-1">
          Recent transactions for {contract?.name || 'this token'}
        </p>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions?.map((transaction) => (
          <div key={transaction?.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getTransactionTypeColor(transaction?.transaction_type)}`}>
                  {getTransactionIcon(transaction?.transaction_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction?.transaction_type)}`}>
                      {transaction?.transaction_type}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {transaction?.amount && contract?.decimals
                        ? tokenService?.formatTokenAmount(transaction?.amount, contract?.decimals)
                        : '0'
                      } {contract?.symbol || 'TOKENS'}
                    </span>
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-600">
                    {transaction?.transaction_type === 'transfer' && (
                      <>
                        From: <span className="font-medium">
                          {transaction?.from_user?.full_name || 'Unknown'}
                        </span>
                        {' → '}
                        To: <span className="font-medium">
                          {transaction?.to_user?.full_name || 'Unknown'}
                        </span>
                      </>
                    )}
                    {transaction?.transaction_type === 'mint' && (
                      <>
                        Minted to: <span className="font-medium">
                          {transaction?.to_user?.full_name || 'Unknown'}
                        </span>
                      </>
                    )}
                    {transaction?.transaction_type === 'burn' && (
                      <>
                        Burned from: <span className="font-medium">
                          {transaction?.from_user?.full_name || 'Unknown'}
                        </span>
                      </>
                    )}
                    {transaction?.transaction_type === 'approval' && (
                      <>
                        Owner: <span className="font-medium">
                          {transaction?.from_user?.full_name || 'Unknown'}
                        </span>
                        {' → '}
                        Spender: <span className="font-medium">
                          {transaction?.to_user?.full_name || 'Unknown'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {transaction?.created_at 
                    ? new Date(transaction.created_at)?.toLocaleDateString()
                    : 'Unknown date'
                  }
                </div>
                <div className="text-xs text-gray-400">
                  {transaction?.created_at 
                    ? new Date(transaction.created_at)?.toLocaleTimeString()
                    : ''
                  }
                </div>
                {transaction?.transaction_hash && (
                  <div className="text-xs text-gray-400 font-mono mt-1">
                    Hash: {transaction?.transaction_hash?.slice(0, 8)}...
                  </div>
                )}
                {transaction?.block_number && (
                  <div className="text-xs text-gray-400">
                    Block: {transaction?.block_number}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {transactions?.length >= 50 && (
        <div className="px-6 py-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Showing latest 50 transactions
          </p>
        </div>
      )}
    </div>
  );
}