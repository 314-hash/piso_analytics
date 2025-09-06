import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const DashboardControls = ({ 
  selectedNetwork, 
  onNetworkChange, 
  refreshInterval, 
  onRefreshIntervalChange, 
  isAutoRefresh, 
  onAutoRefreshToggle, 
  onManualRefresh,
  lastUpdated,
  connectionStatus 
}) => {
  const networkOptions = [
    { value: 'all', label: 'All Networks' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'bsc', label: 'BSC' },
    { value: 'arbitrum', label: 'Arbitrum' },
    { value: 'optimism', label: 'Optimism' }
  ];

  const refreshIntervalOptions = [
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' }
  ];

  const transactionTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'paymaster', label: 'Paymaster' },
    { value: 'standard', label: 'Standard' },
    { value: 'batch', label: 'Batch' },
    { value: 'bridge', label: 'Bridge' }
  ];

  const getConnectionStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'Wifi',
          text: 'Connected'
        };
      case 'connecting':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'Loader2',
          text: 'Connecting'
        };
      case 'disconnected':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          icon: 'WifiOff',
          text: 'Disconnected'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          icon: 'Circle',
          text: 'Unknown'
        };
    }
  };

  const statusConfig = getConnectionStatusConfig();

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Side - Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Network Filter */}
          <div className="min-w-[160px]">
            <Select
              options={networkOptions}
              value={selectedNetwork}
              onChange={onNetworkChange}
              placeholder="Select Network"
            />
          </div>

          {/* Transaction Type Filter */}
          <div className="min-w-[140px]">
            <Select
              options={transactionTypeOptions}
              value="all"
              onChange={() => {}}
              placeholder="Transaction Type"
            />
          </div>

          {/* Time Range Quick Filters */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Quick:</span>
            <div className="flex items-center space-x-1">
              {['1H', '6H', '24H', '7D']?.map((range) => (
                <button
                  key={range}
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Controls & Status */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Connection Status */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${statusConfig?.bgColor}`}>
            <Icon 
              name={statusConfig?.icon} 
              size={14} 
              className={`${statusConfig?.color} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} 
            />
            <span className={`text-sm font-medium ${statusConfig?.color}`}>
              {statusConfig?.text}
            </span>
          </div>

          {/* Refresh Controls */}
          <div className="flex items-center space-x-2">
            {/* Auto Refresh Toggle */}
            <button
              onClick={onAutoRefreshToggle}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isAutoRefresh 
                  ? 'bg-primary/10 text-primary border border-primary/20' :'bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="RotateCcw" size={14} />
              <span>Auto</span>
            </button>

            {/* Refresh Interval */}
            {isAutoRefresh && (
              <div className="min-w-[120px]">
                <Select
                  options={refreshIntervalOptions}
                  value={refreshInterval}
                  onChange={onRefreshIntervalChange}
                  placeholder="Interval"
                />
              </div>
            )}

            {/* Manual Refresh */}
            <button
              onClick={onManualRefresh}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
              title="Manual refresh"
            >
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>Updated: {lastUpdated}</span>
            </div>
          </div>

          {/* Settings */}
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
            <Icon name="Settings" size={16} />
          </button>
        </div>
      </div>
      {/* Advanced Filters (Collapsible) */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Filters:</span>
            <div className="flex items-center space-x-2">
              <button className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md flex items-center space-x-1">
                <span>Success Rate &gt; 95%</span>
                <Icon name="X" size={12} />
              </button>
              <button className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-md flex items-center space-x-1">
                <span>Gas &lt; 100k</span>
                <Icon name="X" size={12} />
              </button>
            </div>
          </div>
          
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            + Add Filter
          </button>
          
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;