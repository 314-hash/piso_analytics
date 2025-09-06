import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RevenueContractsTable = ({ contracts }) => {
  const [sortField, setSortField] = useState('revenue');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedContracts = [...contracts]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatAddress = (address) => {
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Top Revenue Contracts</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-smooth">
            <Icon name="Download" size={16} color="var(--color-muted-foreground)" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-smooth">
            <Icon name="Filter" size={16} color="var(--color-muted-foreground)" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Contract</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('revenue')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Revenue</span>
                  <Icon name={getSortIcon('revenue')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('transactions')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Transactions</span>
                  <Icon name={getSortIcon('transactions')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('change')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>24h Change</span>
                  <Icon name={getSortIcon('change')} size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedContracts?.map((contract, index) => (
              <tr key={contract?.address} className="border-b border-border/50 hover:bg-muted/20 transition-smooth">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={contract?.icon} size={16} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{contract?.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {formatAddress(contract?.address)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-foreground">
                    ${contract?.revenue?.toLocaleString()}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-foreground">
                    {contract?.transactions?.toLocaleString()}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className={`text-sm font-medium ${getChangeColor(contract?.change)}`}>
                    {contract?.change > 0 ? '+' : ''}{contract?.change?.toFixed(2)}%
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-1 hover:bg-muted rounded transition-smooth">
                      <Icon name="ExternalLink" size={14} color="var(--color-muted-foreground)" />
                    </button>
                    <button className="p-1 hover:bg-muted rounded transition-smooth">
                      <Icon name="MoreHorizontal" size={14} color="var(--color-muted-foreground)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueContractsTable;