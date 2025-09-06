import React from 'react';
import Icon from '../../../components/AppIcon';

const TreasuryMetricsCard = ({ title, value, change, changeType, icon, currency = 'USD' }) => {
  const formatValue = (val) => {
    if (currency === 'PISO') {
      return `${val?.toLocaleString()} PISO`;
    } else if (currency === 'ETH') {
      return `${val?.toFixed(4)} ETH`;
    } else {
      return `$${val?.toLocaleString()}`;
    }
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 transition-smooth hover:border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} color="var(--color-primary)" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">
          {formatValue(value)}
        </div>
        
        <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
          <Icon name={getChangeIcon()} size={14} />
          <span>{Math.abs(change)}%</span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      </div>
    </div>
  );
};

export default TreasuryMetricsCard;