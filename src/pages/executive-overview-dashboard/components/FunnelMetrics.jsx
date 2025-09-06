import React from 'react';
import Icon from '../../../components/AppIcon';

const FunnelMetrics = ({ metrics }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const getIconColor = (percentage) => {
    if (percentage >= 80) return 'var(--color-success)';
    if (percentage >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Key Funnel Metrics</h3>
      <div className="space-y-6">
        {metrics?.map((metric) => (
          <div key={metric?.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-muted/20 flex items-center justify-center">
                  <Icon 
                    name={metric?.icon} 
                    size={16} 
                    color={getIconColor(metric?.percentage)} 
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{metric?.title}</h4>
                  <p className="text-xs text-muted-foreground">{metric?.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">{metric?.percentage}%</p>
                <p className="text-xs text-muted-foreground">
                  {metric?.current?.toLocaleString()} / {metric?.total?.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="w-full bg-muted/20 rounded-full h-2">
              <div
                className={`${getProgressColor(metric?.percentage)} h-2 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${metric?.percentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Target: {metric?.target}%</span>
              <span className={metric?.change >= 0 ? 'text-success' : 'text-error'}>
                {metric?.change >= 0 ? '+' : ''}{metric?.change}% vs last period
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelMetrics;