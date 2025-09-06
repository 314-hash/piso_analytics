import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import tokenService from '../../services/tokenService';
import TokenOverview from './components/TokenOverview';
import TokenBalances from './components/TokenBalances';
import TransferForm from './components/TransferForm';
import ApprovalForm from './components/ApprovalForm';
import TransactionHistory from './components/TransactionHistory';
import Header from '../../components/ui/Header';

export default function TokenDashboard() {
  const { user, userProfile } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [userBalances, setUserBalances] = useState([]);
  const [userAllowances, setUserAllowances] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load token contracts
      const { data: contractsData, error: contractsError } = await tokenService?.getTokenContracts();
      if (contractsError) {
        setError('Failed to load token contracts: ' + contractsError?.message);
        return;
      }

      setContracts(contractsData || []);

      if (contractsData?.length > 0) {
        setSelectedContract(contractsData?.[0]);
        
        // Load user data if authenticated
        if (user?.id) {
          await loadUserData(user?.id, contractsData?.[0]?.id);
        }
      }
    } catch (error) {
      setError('Failed to load dashboard data: ' + error?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId, contractId) => {
    try {
      // Load user balances
      const { data: balancesData } = await tokenService?.getUserBalances(userId);
      setUserBalances(balancesData || []);

      // Load user allowances
      const { data: allowancesData } = await tokenService?.getUserAllowances(userId);
      setUserAllowances(allowancesData || []);

      // Load transaction history
      const { data: transactionsData } = await tokenService?.getTransactions(contractId);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleContractChange = async (contract) => {
    setSelectedContract(contract);
    if (user?.id && contract?.id) {
      await loadUserData(user?.id, contract?.id);
    }
  };

  const handleTransactionComplete = async () => {
    if (user?.id && selectedContract?.id) {
      await loadUserData(user?.id, selectedContract?.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading token dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Token Dashboard</h1>
          <p className="text-gray-600">
            Manage your ERC-20 tokens, view balances, and perform transactions
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {contracts?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No token contracts found</div>
          </div>
        ) : (
          <>
            {/* Contract Selector */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Token Contract
              </label>
              <select
                value={selectedContract?.id || ''}
                onChange={(e) => {
                  const contract = contracts?.find(c => c?.id === e?.target?.value);
                  if (contract) handleContractChange(contract);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {contracts?.map((contract) => (
                  <option key={contract?.id} value={contract?.id}>
                    {contract?.name} ({contract?.symbol})
                  </option>
                ))}
              </select>
            </div>

            {selectedContract && (
              <>
                {/* Tab Navigation */}
                <div className="mb-6 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'balances', label: 'Balances' },
                      { id: 'transfer', label: 'Transfer' },
                      { id: 'approve', label: 'Approve' },
                      { id: 'history', label: 'History' }
                    ]?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab?.id
                            ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab?.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {activeTab === 'overview' && (
                    <TokenOverview 
                      contract={selectedContract}
                      userBalance={userBalances?.find(b => b?.token_contract_id === selectedContract?.id)}
                    />
                  )}

                  {activeTab === 'balances' && (
                    <TokenBalances 
                      balances={userBalances}
                      allowances={userAllowances}
                    />
                  )}

                  {activeTab === 'transfer' && user && (
                    <TransferForm
                      contract={selectedContract}
                      userBalance={userBalances?.find(b => b?.token_contract_id === selectedContract?.id)}
                      onTransactionComplete={handleTransactionComplete}
                    />
                  )}

                  {activeTab === 'approve' && user && (
                    <ApprovalForm
                      contract={selectedContract}
                      onTransactionComplete={handleTransactionComplete}
                    />
                  )}

                  {activeTab === 'history' && (
                    <TransactionHistory 
                      transactions={transactions}
                      contract={selectedContract}
                    />
                  )}
                </div>

                {/* Preview Mode Banner */}
                {!user && (
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-800 font-medium mb-2">Preview Mode</div>
                    <p className="text-blue-700">
                      You are viewing the token dashboard in preview mode. 
                      <span className="font-medium"> Sign in to perform transactions and manage your tokens.</span>
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}