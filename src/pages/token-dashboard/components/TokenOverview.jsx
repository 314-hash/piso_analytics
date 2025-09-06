import React, { useState, useEffect } from 'react';
import tokenService from '../../../services/tokenService';

export default function TokenOverview({ contract, userBalance }) {
  const [tokenDetails, setTokenDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contract?.id) {
      loadTokenDetails();
    }
  }, [contract?.id]);

  const loadTokenDetails = async () => {
    try {
      setLoading(true);
      
      const [nameRes, symbolRes, decimalsRes, totalSupplyRes, maxSupplyRes] = await Promise.all([
        tokenService?.getName(contract?.id),
        tokenService?.getSymbol(contract?.id),
        tokenService?.getDecimals(contract?.id),
        tokenService?.getTotalSupply(contract?.id),
        tokenService?.getMaxSupply(contract?.id)
      ]);

      setTokenDetails({
        name: nameRes?.data,
        symbol: symbolRes?.data,
        decimals: decimalsRes?.data,
        totalSupply: totalSupplyRes?.data,
        maxSupply: maxSupplyRes?.data
      });
    } catch (error) {
      console.error('Error loading token details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Token Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium text-gray-900">{tokenDetails?.name || 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Symbol:</span>
            <span className="font-medium text-gray-900">{tokenDetails?.symbol || 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Decimals:</span>
            <span className="font-medium text-gray-900">{tokenDetails?.decimals || 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Contract:</span>
            <span className="font-mono text-sm text-gray-700 truncate max-w-32" title={contract?.contract_address}>
              {contract?.contract_address || 'N/A'}
            </span>
          </div>
        </div>
      </div>
      {/* Supply Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Supply</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Supply:</span>
            <span className="font-medium text-gray-900">
              {tokenDetails?.totalSupply 
                ? tokenService?.formatTokenAmount(tokenDetails?.totalSupply, tokenDetails?.decimals)
                : 'Loading...'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Max Supply:</span>
            <span className="font-medium text-gray-900">
              {tokenDetails?.maxSupply 
                ? tokenService?.formatTokenAmount(tokenDetails?.maxSupply, tokenDetails?.decimals)
                : 'Loading...'
              }
            </span>
          </div>
          <div className="pt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Supply Progress</span>
              <span>
                {tokenDetails?.totalSupply && tokenDetails?.maxSupply
                  ? `${Math.round((parseInt(tokenDetails?.totalSupply) / parseInt(tokenDetails?.maxSupply)) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: tokenDetails?.totalSupply && tokenDetails?.maxSupply
                    ? `${Math.min((parseInt(tokenDetails?.totalSupply) / parseInt(tokenDetails?.maxSupply)) * 100, 100)}%`
                    : '0%'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {/* User Balance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Balance</h3>
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {userBalance?.balance && tokenDetails?.decimals
                ? tokenService?.formatTokenAmount(userBalance?.balance, tokenDetails?.decimals)
                : '0'
              }
            </div>
            <div className="text-sm text-gray-500">{tokenDetails?.symbol || 'TOKENS'}</div>
          </div>
          
          {userBalance?.balance && tokenDetails?.totalSupply && (
            <div className="pt-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Your Share</span>
                <span>
                  {Math.round((parseInt(userBalance?.balance) / parseInt(tokenDetails?.totalSupply)) * 10000) / 100}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((parseInt(userBalance?.balance) / parseInt(tokenDetails?.totalSupply)) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            Last updated: {userBalance?.updated_at 
              ? new Date(userBalance.updated_at)?.toLocaleDateString()
              : 'Never'
            }
          </div>
        </div>
      </div>
    </div>
  );
}