import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import TreasuryControls from './components/TreasuryControls';
import TreasuryMetricsCard from './components/TreasuryMetricsCard';
import RevenueChart from './components/RevenueChart';
import TokenDistributionChart from './components/TokenDistributionChart';
import RevenueContractsTable from './components/RevenueContractsTable';
import FinancialAnalyticsTable from './components/FinancialAnalyticsTable';
import ScenarioModelingWidget from './components/ScenarioModelingWidget';

const TreasuryTokenomicsDashboard = () => {
  const [selectedWallet, setSelectedWallet] = useState('main');
  const [currency, setCurrency] = useState('USD');
  const [reportingPeriod, setReportingPeriod] = useState('30d');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock data for treasury metrics
  const treasuryMetrics = [
    {
      title: 'Total Treasury Value',
      value: 12450000,
      change: 8.5,
      changeType: 'positive',
      icon: 'Wallet',
      currency: currency
    },
    {
      title: 'Revenue Growth Rate',
      value: 23.7,
      change: 4.2,
      changeType: 'positive',
      icon: 'TrendingUp',
      currency: 'percent'
    },
    {
      title: 'Token Circulation',
      value: 85600000,
      change: -2.1,
      changeType: 'negative',
      icon: 'Coins',
      currency: 'PISO'
    },
    {
      title: 'Burn/Mint Ratio',
      value: 1.35,
      change: 12.8,
      changeType: 'positive',
      icon: 'Flame',
      currency: 'ratio'
    }
  ];

  // Mock data for revenue chart
  const revenueData = [
    { date: 'Jan 1', paymaster: 45000, badgeNFT: 12000, governance: 8000 },
    { date: 'Jan 8', paymaster: 52000, badgeNFT: 15000, governance: 9500 },
    { date: 'Jan 15', paymaster: 48000, badgeNFT: 18000, governance: 11000 },
    { date: 'Jan 22', paymaster: 61000, badgeNFT: 22000, governance: 13500 },
    { date: 'Jan 29', paymaster: 58000, badgeNFT: 25000, governance: 15000 },
    { date: 'Feb 5', paymaster: 67000, badgeNFT: 28000, governance: 16500 },
    { date: 'Feb 12', paymaster: 72000, badgeNFT: 31000, governance: 18000 },
    { date: 'Feb 19', paymaster: 69000, badgeNFT: 34000, governance: 19500 },
    { date: 'Feb 26', paymaster: 78000, badgeNFT: 37000, governance: 21000 },
    { date: 'Mar 5', paymaster: 82000, badgeNFT: 40000, governance: 22500 }
  ];

  // Mock data for token distribution
  const tokenDistribution = [
    { name: 'Circulating Supply', value: 85600000, percentage: 42.8 },
    { name: 'Treasury Reserve', value: 45200000, percentage: 22.6 },
    { name: 'Staking Rewards', value: 32800000, percentage: 16.4 },
    { name: 'Team & Advisors', value: 20000000, percentage: 10.0 },
    { name: 'Ecosystem Fund', value: 12400000, percentage: 6.2 },
    { name: 'Burned Tokens', value: 4000000, percentage: 2.0 }
  ];

  // Mock data for revenue contracts
  const revenueContracts = [
    {
      name: 'Paymaster Contract',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      revenue: 245000,
      transactions: 15420,
      change: 12.5,
      icon: 'Zap'
    },
    {
      name: 'BadgeNFT Minter',
      address: '0x2345678901bcdef12345678901bcdef123456789',
      revenue: 128000,
      transactions: 8930,
      change: 8.7,
      icon: 'Award'
    },
    {
      name: 'Guardian Wallet',
      address: '0x3456789012cdef123456789012cdef1234567890',
      revenue: 89000,
      transactions: 5670,
      change: -3.2,
      icon: 'Shield'
    },
    {
      name: 'Governance Token',
      address: '0x456789013def123456789013def12345678901a',
      revenue: 67000,
      transactions: 4320,
      change: 15.8,
      icon: 'Vote'
    },
    {
      name: 'Bridge Contract',
      address: '0x56789014ef123456789014ef123456789014ef1',
      revenue: 45000,
      transactions: 2890,
      change: 6.4,
      icon: 'ArrowLeftRight'
    }
  ];

  // Mock data for financial analytics
  const financialAnalytics = {
    fees: [
      { network: 'Ethereum', totalFees: 125000, avgFee: 0.0045, volume: 28500, change: 8.2 },
      { network: 'Polygon', totalFees: 89000, avgFee: 0.0012, volume: 74200, change: 12.7 },
      { network: 'Arbitrum', totalFees: 67000, avgFee: 0.0023, volume: 29100, change: -2.1 },
      { network: 'Optimism', totalFees: 45000, avgFee: 0.0019, volume: 23700, change: 15.3 }
    ],
    savings: [
      { feature: 'Gas Abstraction', gasSaved: 2450000, usdValue: 89000, users: 15420, efficiency: 87 },
      { feature: 'Batch Transactions', gasSaved: 1890000, usdValue: 67000, users: 12300, efficiency: 92 },
      { feature: 'Smart Routing', gasSaved: 1230000, usdValue: 45000, users: 8900, efficiency: 78 },
      { feature: 'Auto Optimization', gasSaved: 890000, usdValue: 32000, users: 6700, efficiency: 83 }
    ],
    roi: [
      { investment: 'Paymaster Infrastructure', cost: 450000, revenue: 890000, roiPercent: 97.8, paybackPeriod: '8 months' },
      { investment: 'BadgeNFT Platform', cost: 230000, revenue: 420000, roiPercent: 82.6, paybackPeriod: '6 months' },
      { investment: 'Guardian System', cost: 180000, revenue: 290000, roiPercent: 61.1, paybackPeriod: '9 months' },
      { investment: 'Bridge Development', cost: 320000, revenue: 380000, roiPercent: 18.8, paybackPeriod: '14 months' }
    ]
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // Mock refresh functionality
    console.log('Refreshing treasury data...');
  };

  useEffect(() => {
    // Mock data refresh interval
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 900000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Treasury & Tokenomics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive financial insights and tokenomics monitoring for the PISO ecosystem
            </p>
          </div>

          {/* Treasury Controls */}
          <TreasuryControls
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
            currency={currency}
            setCurrency={setCurrency}
            reportingPeriod={reportingPeriod}
            setReportingPeriod={setReportingPeriod}
            onRefresh={handleRefresh}
          />

          {/* Treasury Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {treasuryMetrics?.map((metric, index) => (
              <TreasuryMetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                currency={metric?.currency === 'percent' ? 'percent' : metric?.currency === 'ratio' ? 'ratio' : currency}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Revenue Chart - 8 columns */}
            <div className="lg:col-span-8">
              <RevenueChart data={revenueData} selectedPeriod={reportingPeriod} />
            </div>

            {/* Right Panel - 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              {/* Token Distribution Chart */}
              <TokenDistributionChart data={tokenDistribution} />
              
              {/* Scenario Modeling Widget */}
              <ScenarioModelingWidget />
            </div>
          </div>

          {/* Revenue Contracts Table */}
          <div className="mb-8">
            <RevenueContractsTable contracts={revenueContracts} />
          </div>

          {/* Financial Analytics Table */}
          <div className="mb-8">
            <FinancialAnalyticsTable analytics={financialAnalytics} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TreasuryTokenomicsDashboard;