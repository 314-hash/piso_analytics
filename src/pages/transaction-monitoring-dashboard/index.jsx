import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import AlertBanner from './components/AlertBanner';
import MetricsRow from './components/MetricsRow';
import TransactionChart from './components/TransactionChart';
import LiveTransactionFeed from './components/LiveTransactionFeed';
import SmartContractGrid from './components/SmartContractGrid';
import DashboardControls from './components/DashboardControls';

const TransactionMonitoringDashboard = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdated, setLastUpdated] = useState('2 seconds ago');

  // Mock data for alerts
  const mockAlerts = [
    {
      id: 1,
      severity: 'critical',
      title: 'High Transaction Failure Rate on Ethereum',
      description: 'Transaction success rate has dropped to 87% in the last 15 minutes. Investigating gas price volatility and network congestion.',
      startTime: '14:32 UTC',
      estimatedResolution: '15-20 minutes',
      affectedUsers: 1247
    },
    {
      id: 2,
      severity: 'warning',
      title: 'Paymaster Gas Efficiency Below Threshold',
      description: 'Gas abstraction efficiency on Polygon has decreased to 72%. Monitoring smart contract performance.',
      startTime: '14:28 UTC',
      estimatedResolution: '10-15 minutes',
      affectedUsers: 523
    }
  ];

  // Mock data for metrics
  const mockMetrics = [
    {
      id: 1,
      type: 'throughput',
      title: 'Transaction Throughput',
      subtitle: 'Transactions per second',
      value: 1247,
      change: 12.5,
      average24h: 1156,
      target: 1500,
      max: 2000,
      isLive: true
    },
    {
      id: 2,
      type: 'success_rate',
      title: 'Success Rate',
      subtitle: 'Overall transaction success',
      value: 94.7,
      change: -2.1,
      average24h: 96.2,
      target: 98.0,
      max: 100,
      isLive: true
    },
    {
      id: 3,
      type: 'gas_cost',
      title: 'Average Gas Cost',
      subtitle: 'ETH per transaction',
      value: 0.0234,
      change: -8.3,
      average24h: 0.0267,
      target: 0.0200,
      max: 0.1,
      isLive: true
    },
    {
      id: 4,
      type: 'paymaster_efficiency',
      title: 'Paymaster Efficiency',
      subtitle: 'Gas abstraction success',
      value: 87.3,
      change: 5.7,
      average24h: 82.1,
      target: 90.0,
      max: 100,
      isLive: true
    }
  ];

  // Mock data for transaction chart
  const mockChartData = [
    {
      timestamp: '00:00',
      ethereum_volume: 1200,
      polygon_volume: 800,
      bsc_volume: 600,
      arbitrum_volume: 400,
      ethereum_success_rate: 95.2,
      polygon_success_rate: 97.1,
      bsc_success_rate: 94.8,
      arbitrum_success_rate: 96.3,
      ethereum_gas_usage: 0.025,
      polygon_gas_usage: 0.008,
      bsc_gas_usage: 0.012,
      arbitrum_gas_usage: 0.015
    },
    {
      timestamp: '04:00',
      ethereum_volume: 1350,
      polygon_volume: 920,
      bsc_volume: 680,
      arbitrum_volume: 450,
      ethereum_success_rate: 94.8,
      polygon_success_rate: 96.8,
      bsc_success_rate: 95.2,
      arbitrum_success_rate: 96.1,
      ethereum_gas_usage: 0.028,
      polygon_gas_usage: 0.009,
      bsc_gas_usage: 0.013,
      arbitrum_gas_usage: 0.016
    },
    {
      timestamp: '08:00',
      ethereum_volume: 1100,
      polygon_volume: 750,
      bsc_volume: 550,
      arbitrum_volume: 380,
      ethereum_success_rate: 96.1,
      polygon_success_rate: 97.5,
      bsc_success_rate: 95.8,
      arbitrum_success_rate: 96.7,
      ethereum_gas_usage: 0.022,
      polygon_gas_usage: 0.007,
      bsc_gas_usage: 0.011,
      arbitrum_gas_usage: 0.014
    },
    {
      timestamp: '12:00',
      ethereum_volume: 1450,
      polygon_volume: 1100,
      bsc_volume: 820,
      arbitrum_volume: 600,
      ethereum_success_rate: 93.2,
      polygon_success_rate: 96.2,
      bsc_success_rate: 94.1,
      arbitrum_success_rate: 95.8,
      ethereum_gas_usage: 0.032,
      polygon_gas_usage: 0.011,
      bsc_gas_usage: 0.015,
      arbitrum_gas_usage: 0.018
    },
    {
      timestamp: '16:00',
      ethereum_volume: 1680,
      polygon_volume: 1250,
      bsc_volume: 950,
      arbitrum_volume: 720,
      ethereum_success_rate: 87.3,
      polygon_success_rate: 95.1,
      bsc_success_rate: 92.7,
      arbitrum_success_rate: 94.9,
      ethereum_gas_usage: 0.045,
      polygon_gas_usage: 0.014,
      bsc_gas_usage: 0.019,
      arbitrum_gas_usage: 0.022
    },
    {
      timestamp: '20:00',
      ethereum_volume: 1520,
      polygon_volume: 1080,
      bsc_volume: 780,
      arbitrum_volume: 580,
      ethereum_success_rate: 91.8,
      polygon_success_rate: 96.7,
      bsc_success_rate: 94.5,
      arbitrum_success_rate: 95.6,
      ethereum_gas_usage: 0.038,
      polygon_gas_usage: 0.012,
      bsc_gas_usage: 0.016,
      arbitrum_gas_usage: 0.019
    }
  ];

  // Mock data for live transactions
  const mockTransactions = [
    {
      hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      status: 'success',
      network: 'ethereum',
      value: 0.5234,
      gasUsed: 21000,
      from: '0x742d35Cc6634C0532925a3b8D4C8C8b4C8C8C8C8',
      to: '0x8ba1f109551bD432803012645Hac136c22C8C8C8',
      timestamp: '16:51:12 UTC',
      type: 'paymaster'
    },
    {
      hash: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
      status: 'pending',
      network: 'polygon',
      value: 125.67,
      gasUsed: 45000,
      from: '0x853f46Dd7635C1532925a3b8D4C8C8b4C8C8C8C8',
      to: '0x9cb2f209661cE532803012645Hac136c22C8C8C8',
      timestamp: '16:51:10 UTC',
      type: 'standard'
    },
    {
      hash: '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
      status: 'failed',
      network: 'bsc',
      value: 0.0123,
      gasUsed: 0,
      from: '0x964g57Ee8746D1632925a3b8D4C8C8b4C8C8C8C8',
      to: '0xacb3f309771dF632803012645Hac136c22C8C8C8',
      timestamp: '16:51:08 UTC',
      type: 'batch',
      error: 'Insufficient gas limit. Transaction requires at least 65,000 gas but only 45,000 was provided.'
    },
    {
      hash: '0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789',
      status: 'success',
      network: 'arbitrum',
      value: 2.4567,
      gasUsed: 32000,
      from: '0xa75h68Ff9857E1732925a3b8D4C8C8b4C8C8C8C8',
      to: '0xbdc4f409881eG732803012645Hac136c22C8C8C8',
      timestamp: '16:51:06 UTC',
      type: 'bridge'
    },
    {
      hash: '0xe5f6789012345678901234567890abcdef1234567890abcdef1234567890',
      status: 'success',
      network: 'ethereum',
      value: 0.8901,
      gasUsed: 28000,
      from: '0xb86i79Gg0968F1832925a3b8D4C8C8b4C8C8C8C8',
      to: '0xced5f509991fH832803012645Hac136c22C8C8C8',
      timestamp: '16:51:04 UTC',
      type: 'paymaster'
    }
  ];

  // Mock data for smart contracts
  const mockContracts = [
    {
      name: 'PISO Token Contract',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      network: 'ethereum',
      volume: 45678,
      volumeChange: 12.5,
      success_rate: 97.8,
      gas_efficiency: 89.2,
      avgGasUsed: 45000,
      lastBlock: 18567890,
      lastActivity: '2 minutes ago'
    },
    {
      name: 'Paymaster Contract',
      address: '0x2345678901bcdef1234567890abcdef123456789',
      network: 'polygon',
      volume: 32145,
      volumeChange: -3.2,
      success_rate: 94.1,
      gas_efficiency: 76.8,
      avgGasUsed: 32000,
      lastBlock: 48567123,
      lastActivity: '5 minutes ago'
    },
    {
      name: 'BadgeNFT Contract',
      address: '0x3456789012cdef1234567890abcdef1234567890',
      network: 'ethereum',
      volume: 28934,
      volumeChange: 8.7,
      success_rate: 99.2,
      gas_efficiency: 92.5,
      avgGasUsed: 38000,
      lastBlock: 18567885,
      lastActivity: '1 minute ago'
    },
    {
      name: 'Guardian Wallet Factory',
      address: '0x4567890123def1234567890abcdef12345678901',
      network: 'bsc',
      volume: 19876,
      volumeChange: 15.3,
      success_rate: 96.7,
      gas_efficiency: 84.1,
      avgGasUsed: 52000,
      lastBlock: 32567456,
      lastActivity: '3 minutes ago'
    },
    {
      name: 'Bridge Contract',
      address: '0x567890124ef1234567890abcdef123456789012',
      network: 'arbitrum',
      volume: 15432,
      volumeChange: -1.8,
      success_rate: 91.3,
      gas_efficiency: 78.9,
      avgGasUsed: 41000,
      lastBlock: 145678234,
      lastActivity: '7 minutes ago'
    }
  ];

  // Auto refresh effect
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated('Just now');
        // Simulate connection status changes
        const statuses = ['connected', 'connecting', 'disconnected'];
        const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
        setConnectionStatus(randomStatus);
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh, refreshInterval]);

  // Update last updated time
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(prev => {
        if (prev === 'Just now') return '1 second ago';
        if (prev === '1 second ago') return '2 seconds ago';
        if (prev === '2 seconds ago') return '3 seconds ago';
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setLastUpdated('Just now');
    setConnectionStatus('connected');
  };

  const handleAutoRefreshToggle = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-[1920px] mx-auto p-6">
          {/* Dashboard Controls */}
          <DashboardControls
            selectedNetwork={selectedNetwork}
            onNetworkChange={setSelectedNetwork}
            refreshInterval={refreshInterval}
            onRefreshIntervalChange={setRefreshInterval}
            isAutoRefresh={isAutoRefresh}
            onAutoRefreshToggle={handleAutoRefreshToggle}
            onManualRefresh={handleManualRefresh}
            lastUpdated={lastUpdated}
            connectionStatus={connectionStatus}
          />

          {/* Alert Banner */}
          <AlertBanner alerts={mockAlerts} />

          {/* Metrics Row */}
          <MetricsRow metrics={mockMetrics} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Transaction Chart - 2/3 width */}
            <div className="xl:col-span-2">
              <TransactionChart 
                data={mockChartData}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
            </div>

            {/* Live Transaction Feed - 1/3 width */}
            <div className="xl:col-span-1">
              <LiveTransactionFeed 
                transactions={mockTransactions}
                isConnected={connectionStatus === 'connected'}
              />
            </div>
          </div>

          {/* Smart Contract Performance Grid */}
          <SmartContractGrid contracts={mockContracts} />
        </div>
      </main>
    </div>
  );
};

export default TransactionMonitoringDashboard;