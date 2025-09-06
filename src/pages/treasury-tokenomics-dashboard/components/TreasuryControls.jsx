import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TreasuryControls = ({ 
  selectedWallet, 
  setSelectedWallet, 
  currency, 
  setCurrency, 
  reportingPeriod, 
  setReportingPeriod,
  onRefresh 
}) => {
  const walletOptions = [
    { value: 'main', label: 'Main Treasury', description: '0x1234...5678' },
    { value: 'paymaster', label: 'Paymaster Wallet', description: '0x2345...6789' },
    { value: 'governance', label: 'Governance Treasury', description: '0x3456...7890' },
    { value: 'reserve', label: 'Reserve Fund', description: '0x4567...8901' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'PISO', label: 'PISO Token' }
  ];

  const periodOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'q1', label: 'Q1 2025' },
    { value: 'q2', label: 'Q2 2025' },
    { value: 'q3', label: 'Q3 2025' },
    { value: 'q4', label: 'Q4 2025' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Treasury Controls</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={onRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Select
            label="Treasury Wallet"
            options={walletOptions}
            value={selectedWallet}
            onChange={setSelectedWallet}
            placeholder="Select wallet"
          />
        </div>

        <div>
          <Select
            label="Currency Display"
            options={currencyOptions}
            value={currency}
            onChange={setCurrency}
            placeholder="Select currency"
          />
        </div>

        <div>
          <Select
            label="Reporting Period"
            options={periodOptions}
            value={reportingPeriod}
            onChange={setReportingPeriod}
            placeholder="Select period"
          />
        </div>
      </div>
      {/* Quick Stats Bar */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-status"></div>
            <span className="text-sm text-muted-foreground">Live Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} color="var(--color-muted-foreground)" />
            <span className="text-sm text-muted-foreground">
              Updated: {new Date()?.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={14} color="var(--color-muted-foreground)" />
            <span className="text-sm text-muted-foreground">15min delay</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={14} color="var(--color-success)" />
            <span className="text-sm text-success">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryControls;