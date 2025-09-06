import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, trend, icon, color = 'primary' }) => {
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

  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'error':
        return 'border-error/20 bg-error/5';
      default:
        return 'border-primary/20 bg-primary/5';
    }
  };

  return (
    <div className={`bg-card border ${getColorClasses()} rounded-lg p-6 transition-smooth hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center`}>
          <Icon name={icon} size={24} color={`var(--color-${color})`} />
        </div>
        <div className="flex items-center space-x-2">
          <Icon name={getChangeIcon()} size={16} className={getChangeColor()} />
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {change}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      {trend && (
        <div className="mt-4 h-12 flex items-end space-x-1">
          {trend?.map((point, index) => (
            <div
              key={index}
              className={`bg-${color}/30 rounded-sm flex-1`}
              style={{ height: `${point}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MetricCard;