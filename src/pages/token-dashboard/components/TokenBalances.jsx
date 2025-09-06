import React from 'react';
import tokenService from '../../../services/tokenService';

export default function TokenBalances({ balances, allowances }) {
  if (!balances?.length && !allowances?.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center text-gray-500">No token balances or allowances found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Balances */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Token Balances</h3>
        </div>
        <div className="p-6">
          {balances?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Token</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Balance</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {balances?.map((balance) => (
                    <tr key={balance?.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {balance?.token_contracts?.name || 'Unknown Token'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {balance?.token_contracts?.symbol || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {balance?.balance && balance?.token_contracts?.decimals
                              ? tokenService?.formatTokenAmount(balance?.balance, balance?.token_contracts?.decimals)
                              : '0'
                            }
                          </span>
                          <span className="text-sm text-gray-500">
                            {balance?.token_contracts?.symbol || 'TOKENS'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-500">
                        {balance?.updated_at 
                          ? new Date(balance.updated_at)?.toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No token balances found</div>
          )}
        </div>
      </div>
      {/* Token Allowances */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Token Allowances</h3>
          <p className="text-sm text-gray-600 mt-1">Tokens you have approved others to spend</p>
        </div>
        <div className="p-6">
          {allowances?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Token</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Spender</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Allowance</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allowances?.map((allowance) => (
                    <tr key={allowance?.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {allowance?.token_contracts?.name || 'Unknown Token'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {allowance?.token_contracts?.symbol || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {allowance?.spender?.full_name || 'Unknown User'}
                          </span>
                          <span className="text-sm text-gray-500 font-mono">
                            {allowance?.spender?.wallet_address || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {allowance?.allowance && allowance?.token_contracts?.decimals
                              ? tokenService?.formatTokenAmount(allowance?.allowance, allowance?.token_contracts?.decimals)
                              : '0'
                            }
                          </span>
                          <span className="text-sm text-gray-500">
                            {allowance?.token_contracts?.symbol || 'TOKENS'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-500">
                        {allowance?.created_at 
                          ? new Date(allowance.created_at)?.toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No token allowances found</div>
          )}
        </div>
      </div>
    </div>
  );
}