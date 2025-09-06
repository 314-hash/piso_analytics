import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const TransactionChart = ({ data, timeRange, onTimeRangeChange }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(['ethereum', 'polygon', 'bsc']);
  const [chartType, setChartType] = useState('volume');

  const timeRangeOptions = [
    { value: '1h', label: '1H' },
    { value: '6h', label: '6H' },
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' }
  ];

  const chartTypeOptions = [
    { value: 'volume', label: 'Volume', icon: 'BarChart3' },
    { value: 'success_rate', label: 'Success Rate', icon: 'CheckCircle' },
    { value: 'gas_usage', label: 'Gas Usage', icon: 'Fuel' }
  ];

  const networkColors = {
    ethereum: '#627EEA',
    polygon: '#8247E5',
    bsc: '#F3BA2F',
    arbitrum: '#28A0F0',
    optimism: '#FF0420'
  };

  const toggleMetric = (metric) => {
    setSelectedMetrics(prev => 
      prev?.includes(metric) 
        ? prev?.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const formatTooltipValue = (value, name) => {
    switch (chartType) {
      case 'volume':
        return [`${value?.toLocaleString()} txns`, name];
      case 'success_rate':
        return [`${value?.toFixed(2)}%`, name];
      case 'gas_usage':
        return [`${value?.toFixed(4)} ETH`, name];
      default:
        return [value, name];
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              ></div>
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-foreground">
                {formatTooltipValue(entry?.value, entry?.name)?.[0]}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Chart Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Multi-Chain Transaction Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time transaction monitoring across blockchain networks
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {chartTypeOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setChartType(option?.value)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  chartType === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={option?.icon} size={14} />
                <span className="hidden sm:inline">{option?.label}</span>
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {timeRangeOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => onTimeRangeChange(option?.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Network Toggle Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {Object.keys(networkColors)?.map((network) => (
          <button
            key={network}
            onClick={() => toggleMetric(network)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              selectedMetrics?.includes(network)
                ? 'border-primary/20 bg-primary/10 text-primary' :'border-border bg-background text-muted-foreground hover:text-foreground'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: networkColors?.[network] }}
            ></div>
            <span className="capitalize">{network}</span>
          </button>
        ))}
      </div>
      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#8B949E"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#8B949E"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => {
                if (chartType === 'volume') return `${(value / 1000)?.toFixed(0)}K`;
                if (chartType === 'success_rate') return `${value}%`;
                if (chartType === 'gas_usage') return `${value?.toFixed(2)}`;
                return value;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {selectedMetrics?.map((network) => (
              <Line
                key={network}
                type="monotone"
                dataKey={`${network}_${chartType}`}
                stroke={networkColors?.[network]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: networkColors?.[network], strokeWidth: 2 }}
                name={network?.charAt(0)?.toUpperCase() + network?.slice(1)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        {selectedMetrics?.slice(0, 4)?.map((network) => {
          const latestData = data?.[data?.length - 1];
          const value = latestData ? latestData?.[`${network}_${chartType}`] : 0;
          
          return (
            <div key={network} className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: networkColors?.[network] }}
                ></div>
                <span className="text-sm font-medium text-foreground capitalize">
                  {network}
                </span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {chartType === 'volume' ? value?.toLocaleString() : 
                 chartType === 'success_rate' ? `${value?.toFixed(1)}%` :
                 `${value?.toFixed(3)} ETH`}
              </p>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionChart;