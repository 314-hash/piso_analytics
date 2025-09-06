import React from 'react';
import Icon from '../../../components/AppIcon';

const UserMetricsCard = ({ title, value, change, trend, icon, color = 'primary' }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 transition-smooth hover:border-primary/30">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center`}>
          <Icon name={icon} size={24} className={`text-${color}`} />
        </div>
        <div className={`flex items-center gap-1 ${getTrendColor()}`}>
          <Icon name={getTrendIcon()} size={16} />
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
};

export default UserMetricsCard;