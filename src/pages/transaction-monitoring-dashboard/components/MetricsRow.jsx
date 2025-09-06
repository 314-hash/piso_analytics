import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsRow = ({ metrics }) => {
  const getMetricIcon = (type) => {
    switch (type) {
      case 'throughput':
        return 'Activity';
      case 'success_rate':
        return 'CheckCircle';
      case 'gas_cost':
        return 'Fuel';
      case 'paymaster_efficiency':
        return 'Zap';
      default:
        return 'BarChart3';
    }
  };

  const getMetricColor = (type, value, threshold) => {
    switch (type) {
      case 'success_rate':
        return value >= 95 ? 'text-success' : value >= 90 ? 'text-warning' : 'text-error';
      case 'paymaster_efficiency':
        return value >= 85 ? 'text-success' : value >= 70 ? 'text-warning' : 'text-error';
      default:
        return 'text-foreground';
    }
  };

  const formatValue = (type, value) => {
    switch (type) {
      case 'throughput':
        return `${value?.toLocaleString()} TPS`;
      case 'success_rate': case'paymaster_efficiency':
        return `${value?.toFixed(1)}%`;
      case 'gas_cost':
        return `${value?.toFixed(4)} ETH`;
      default:
        return value?.toString();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon 
                  name={getMetricIcon(metric?.type)} 
                  size={20} 
                  className="text-primary" 
                />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{metric?.title}</h3>
                <p className="text-xs text-muted-foreground">{metric?.subtitle}</p>
              </div>
            </div>
            {metric?.isLive && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs text-success">Live</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-bold ${getMetricColor(metric?.type, metric?.value, metric?.threshold)}`}>
                {formatValue(metric?.type, metric?.value)}
              </span>
              <div className={`flex items-center space-x-1 text-sm ${
                metric?.change >= 0 ? 'text-success' : 'text-error'
              }`}>
                <Icon 
                  name={metric?.change >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                  size={14} 
                />
                <span>{Math.abs(metric?.change)?.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  metric?.type === 'success_rate' || metric?.type === 'paymaster_efficiency'
                    ? metric?.value >= 90 ? 'bg-success': metric?.value >= 70 ? 'bg-warning' : 'bg-error' :'bg-primary'
                }`}
                style={{ width: `${Math.min(100, (metric?.value / metric?.max) * 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>24h avg: {formatValue(metric?.type, metric?.average24h)}</span>
              <span>Target: {formatValue(metric?.type, metric?.target)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsRow;