import React from 'react';
import Icon from '../../../components/AppIcon';

const ExecutiveAlerts = ({ alerts }) => {
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          textColor: 'text-error',
          icon: 'AlertTriangle'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          textColor: 'text-warning',
          icon: 'AlertCircle'
        };
      case 'info':
        return {
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          textColor: 'text-primary',
          icon: 'Info'
        };
      case 'success':
        return {
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          textColor: 'text-success',
          icon: 'CheckCircle'
        };
      default:
        return {
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/20',
          textColor: 'text-muted-foreground',
          icon: 'Bell'
        };
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Executive Alerts</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse-status"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {alerts?.map((alert) => {
          const config = getSeverityConfig(alert?.severity);
          return (
            <div
              key={alert?.id}
              className={`${config?.bgColor} ${config?.borderColor} border rounded-lg p-4 transition-smooth hover:shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <div className={`${config?.textColor} mt-0.5`}>
                  <Icon name={config?.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {alert?.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatTime(alert?.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {alert?.message}
                  </p>
                  {alert?.action && (
                    <button className={`mt-2 text-xs font-medium ${config?.textColor} hover:underline`}>
                      {alert?.action}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExecutiveAlerts;