import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const LiveTransactionFeed = ({ transactions, isConnected }) => {
  const [filter, setFilter] = useState('all');
  const [autoScroll, setAutoScroll] = useState(true);

  const filterOptions = [
    { value: 'all', label: 'All', icon: 'List' },
    { value: 'success', label: 'Success', icon: 'CheckCircle' },
    { value: 'failed', label: 'Failed', icon: 'XCircle' },
    { value: 'pending', label: 'Pending', icon: 'Clock' }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'success':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          icon: 'CheckCircle'
        };
      case 'failed':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'XCircle'
        };
      case 'pending':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          icon: 'Clock'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/20',
          icon: 'Circle'
        };
    }
  };

  const getNetworkConfig = (network) => {
    const configs = {
      ethereum: { color: '#627EEA', name: 'ETH' },
      polygon: { color: '#8247E5', name: 'MATIC' },
      bsc: { color: '#F3BA2F', name: 'BSC' },
      arbitrum: { color: '#28A0F0', name: 'ARB' },
      optimism: { color: '#FF0420', name: 'OP' }
    };
    return configs?.[network] || { color: '#8B949E', name: 'UNK' };
  };

  const truncateHash = (hash) => {
    return `${hash?.slice(0, 6)}...${hash?.slice(-4)}`;
  };

  const formatValue = (value, decimals = 4) => {
    return parseFloat(value)?.toFixed(decimals);
  };

  const filteredTransactions = transactions?.filter(tx => {
    if (filter === 'all') return true;
    return tx?.status === filter;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-foreground">Live Transaction Feed</h3>
          <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${
            isConnected ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-success animate-pulse' : 'bg-error'
            }`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-2 rounded-lg transition-colors ${
              autoScroll ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
            title={autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}
          >
            <Icon name="ArrowDown" size={16} />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Settings" size={16} />
          </button>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 mb-4 bg-muted rounded-lg p-1">
        {filterOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => setFilter(option?.value)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === option?.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={option?.icon} size={14} />
            <span>{option?.label}</span>
          </button>
        ))}
      </div>
      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredTransactions?.map((tx) => {
          const statusConfig = getStatusConfig(tx?.status);
          const networkConfig = getNetworkConfig(tx?.network);
          
          return (
            <div
              key={tx?.hash}
              className={`${statusConfig?.bgColor} ${statusConfig?.borderColor} border rounded-lg p-4 transition-all hover:shadow-sm`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={statusConfig?.icon} 
                    size={16} 
                    className={statusConfig?.color} 
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(tx?.hash)}
                        className="font-mono text-sm text-foreground hover:text-primary transition-colors"
                        title="Click to copy"
                      >
                        {truncateHash(tx?.hash)}
                      </button>
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: networkConfig?.color }}
                        title={tx?.network}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">{tx?.timestamp}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {formatValue(tx?.value)} {networkConfig?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Gas: {formatValue(tx?.gasUsed, 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground">
                    From: {truncateHash(tx?.from)}
                  </span>
                  <Icon name="ArrowRight" size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground">
                    To: {truncateHash(tx?.to)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {tx?.type === 'paymaster' && (
                    <span className="px-2 py-0.5 bg-accent/10 text-accent rounded text-xs font-medium">
                      Paymaster
                    </span>
                  )}
                  <button
                    className="text-primary hover:text-primary/80 transition-colors"
                    title="View details"
                  >
                    <Icon name="ExternalLink" size={12} />
                  </button>
                </div>
              </div>
              {tx?.error && (
                <div className="mt-2 p-2 bg-error/5 border border-error/10 rounded text-xs text-error">
                  {tx?.error}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-success">
              {filteredTransactions?.filter(tx => tx?.status === 'success')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Success</p>
          </div>
          <div>
            <p className="text-lg font-bold text-warning">
              {filteredTransactions?.filter(tx => tx?.status === 'pending')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div>
            <p className="text-lg font-bold text-error">
              {filteredTransactions?.filter(tx => tx?.status === 'failed')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTransactionFeed;