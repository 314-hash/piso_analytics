import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FinancialAnalyticsTable = ({ analytics }) => {
  const [selectedTab, setSelectedTab] = useState('fees');
  const [exportFormat, setExportFormat] = useState('csv');

  const tabs = [
    { id: 'fees', label: 'Transaction Fees', icon: 'DollarSign' },
    { id: 'savings', label: 'Gas Savings', icon: 'TrendingDown' },
    { id: 'roi', label: 'ROI Metrics', icon: 'Target' }
  ];

  const handleExport = () => {
    const filename = `piso-analytics-${selectedTab}-${new Date()?.toISOString()?.split('T')?.[0]}.${exportFormat}`;
    console.log(`Exporting ${filename}...`);
    // Mock export functionality
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'fees':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Network</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total Fees</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Avg Fee</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Volume</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.fees?.map((fee, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-smooth">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="Zap" size={12} color="var(--color-primary)" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{fee?.network}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">${fee?.totalFees?.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-foreground">${fee?.avgFee?.toFixed(4)}</td>
                    <td className="py-4 px-4 text-sm text-foreground">{fee?.volume?.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium ${fee?.change >= 0 ? 'text-success' : 'text-error'}`}>
                        {fee?.change >= 0 ? '+' : ''}{fee?.change?.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'savings':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Feature</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Gas Saved</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">USD Value</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Users Benefited</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.savings?.map((saving, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-smooth">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center">
                          <Icon name="Fuel" size={12} color="var(--color-accent)" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{saving?.feature}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">{saving?.gasSaved?.toLocaleString()} gwei</td>
                    <td className="py-4 px-4 text-sm text-foreground">${saving?.usdValue?.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-foreground">{saving?.users?.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="bg-accent h-2 rounded-full" 
                            style={{ width: `${saving?.efficiency}%` }}
                          />
                        </div>
                        <span className="text-sm text-foreground">{saving?.efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'roi':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Investment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cost</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ROI</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Payback Period</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.roi?.map((roi, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-smooth">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-warning/10 rounded-full flex items-center justify-center">
                          <Icon name="TrendingUp" size={12} color="var(--color-warning)" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{roi?.investment}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">${roi?.cost?.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-foreground">${roi?.revenue?.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium ${roi?.roiPercent >= 0 ? 'text-success' : 'text-error'}`}>
                        {roi?.roiPercent >= 0 ? '+' : ''}{roi?.roiPercent?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">{roi?.paybackPeriod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Financial Analytics</h3>
        <div className="flex items-center space-x-3">
          <select 
            value={exportFormat}
            onChange={(e) => setExportFormat(e?.target?.value)}
            className="bg-muted border border-border rounded-lg px-3 py-1 text-sm text-foreground"
          >
            <option value="csv">CSV</option>
            <option value="xlsx">Excel</option>
            <option value="pdf">PDF</option>
          </select>
          <Button 
            variant="outline" 
            size="sm" 
            iconName="Download" 
            iconPosition="left"
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setSelectedTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
              selectedTab === tab?.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {renderTabContent()}
    </div>
  );
};

export default FinancialAnalyticsTable;