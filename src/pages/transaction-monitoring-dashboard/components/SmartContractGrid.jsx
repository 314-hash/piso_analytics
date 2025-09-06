import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SmartContractGrid = ({ contracts }) => {
  const [sortBy, setSortBy] = useState('volume');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterNetwork, setFilterNetwork] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sortOptions = [
    { value: 'volume', label: 'Volume' },
    { value: 'success_rate', label: 'Success Rate' },
    { value: 'gas_efficiency', label: 'Gas Efficiency' },
    { value: 'last_activity', label: 'Last Activity' }
  ];

  const networkOptions = [
    { value: 'all', label: 'All Networks' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'bsc', label: 'BSC' },
    { value: 'arbitrum', label: 'Arbitrum' }
  ];

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

  const getStatusColor = (value, type) => {
    switch (type) {
      case 'success_rate':
        return value >= 95 ? 'text-success' : value >= 90 ? 'text-warning' : 'text-error';
      case 'gas_efficiency':
        return value >= 80 ? 'text-success' : value >= 60 ? 'text-warning' : 'text-error';
      default:
        return 'text-foreground';
    }
  };

  const truncateAddress = (address) => {
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedContracts = contracts?.filter(contract => {
      const matchesNetwork = filterNetwork === 'all' || contract?.network === filterNetwork;
      const matchesSearch = contract?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           contract?.address?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      return matchesNetwork && matchesSearch;
    })?.sort((a, b) => {
      const aValue = a?.[sortBy];
      const bValue = b?.[sortBy];
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string') {
        return aValue?.localeCompare(bValue) * multiplier;
      }
      return (aValue - bValue) * multiplier;
    });

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Smart Contract Performance
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor contract interactions and performance metrics
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Network Filter */}
          <select
            value={filterNetwork}
            onChange={(e) => setFilterNetwork(e?.target?.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {networkOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {sortOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                Sort by {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Table Header */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 pb-3 border-b border-border text-sm font-medium text-muted-foreground">
        <div className="col-span-3">Contract</div>
        <div className="col-span-2">Network</div>
        <div className="col-span-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('volume')}>
          <div className="flex items-center space-x-1">
            <span>Volume (24h)</span>
            {sortBy === 'volume' && (
              <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
            )}
          </div>
        </div>
        <div className="col-span-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('success_rate')}>
          <div className="flex items-center space-x-1">
            <span>Success Rate</span>
            {sortBy === 'success_rate' && (
              <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
            )}
          </div>
        </div>
        <div className="col-span-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('gas_efficiency')}>
          <div className="flex items-center space-x-1">
            <span>Gas Efficiency</span>
            {sortBy === 'gas_efficiency' && (
              <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
            )}
          </div>
        </div>
        <div className="col-span-1">Actions</div>
      </div>
      {/* Contract List */}
      <div className="space-y-4 mt-4">
        {filteredAndSortedContracts?.map((contract) => {
          const networkConfig = getNetworkConfig(contract?.network);
          
          return (
            <div
              key={contract?.address}
              className="lg:grid lg:grid-cols-12 gap-4 p-4 bg-background border border-border rounded-lg hover:shadow-sm transition-all"
            >
              {/* Contract Info */}
              <div className="col-span-3 mb-3 lg:mb-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FileCode" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{contract?.name}</h4>
                    <button
                      onClick={() => copyToClipboard(contract?.address)}
                      className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
                      title="Click to copy address"
                    >
                      {truncateAddress(contract?.address)}
                    </button>
                  </div>
                </div>
              </div>
              {/* Network */}
              <div className="col-span-2 mb-3 lg:mb-0">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: networkConfig?.color }}
                  ></div>
                  <span className="text-sm font-medium text-foreground capitalize">
                    {contract?.network}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Block: {contract?.lastBlock?.toLocaleString()}
                </p>
              </div>
              {/* Volume */}
              <div className="col-span-2 mb-3 lg:mb-0">
                <p className="text-lg font-bold text-foreground">
                  {contract?.volume?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {contract?.volumeChange >= 0 ? '+' : ''}{contract?.volumeChange?.toFixed(1)}% vs yesterday
                </p>
              </div>
              {/* Success Rate */}
              <div className="col-span-2 mb-3 lg:mb-0">
                <p className={`text-lg font-bold ${getStatusColor(contract?.success_rate, 'success_rate')}`}>
                  {contract?.success_rate?.toFixed(1)}%
                </p>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div 
                    className={`h-2 rounded-full ${
                      contract?.success_rate >= 95 ? 'bg-success' : 
                      contract?.success_rate >= 90 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${contract?.success_rate}%` }}
                  ></div>
                </div>
              </div>
              {/* Gas Efficiency */}
              <div className="col-span-2 mb-3 lg:mb-0">
                <p className={`text-lg font-bold ${getStatusColor(contract?.gas_efficiency, 'gas_efficiency')}`}>
                  {contract?.gas_efficiency?.toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Avg: {contract?.avgGasUsed?.toLocaleString()} gas
                </p>
              </div>
              {/* Actions */}
              <div className="col-span-1 flex items-center space-x-2">
                <button
                  className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                  title="View contract details"
                >
                  <Icon name="Eye" size={16} />
                </button>
                <button
                  className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                  title="View on explorer"
                >
                  <Icon name="ExternalLink" size={16} />
                </button>
                <button
                  className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                  title="Add to watchlist"
                >
                  <Icon name="Star" size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedContracts?.length} of {contracts?.length} contracts
        </p>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Previous
          </button>
          <div className="flex items-center space-x-1">
            <button className="w-8 h-8 bg-primary text-primary-foreground rounded text-sm">1</button>
            <button className="w-8 h-8 text-muted-foreground hover:text-foreground rounded text-sm">2</button>
            <button className="w-8 h-8 text-muted-foreground hover:text-foreground rounded text-sm">3</button>
          </div>
          <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartContractGrid;