import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const DashboardControls = ({ 
  timeRange, 
  setTimeRange, 
  selectedNetwork, 
  setSelectedNetwork, 
  autoRefresh, 
  setAutoRefresh,
  onExport 
}) => {
  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const networkOptions = [
    { value: 'all', label: 'All Networks' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'bsc', label: 'BSC' },
    { value: 'arbitrum', label: 'Arbitrum' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            label="Time Range"
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="min-w-[140px]"
          />
          
          <Select
            label="Network"
            options={networkOptions}
            value={selectedNetwork}
            onChange={setSelectedNetwork}
            className="min-w-[140px]"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
            iconName={autoRefresh ? 'Pause' : 'Play'}
            iconPosition="left"
            size="sm"
          >
            {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
            size="sm"
          >
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;