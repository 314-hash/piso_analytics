import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertBanner = ({ alerts }) => {
  if (!alerts || alerts?.length === 0) return null;

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          textColor: 'text-error',
          iconColor: 'text-error'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          textColor: 'text-warning',
          iconColor: 'text-warning'
        };
      case 'info':
        return {
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          textColor: 'text-primary',
          iconColor: 'text-primary'
        };
      default:
        return {
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/20',
          textColor: 'text-muted-foreground',
          iconColor: 'text-muted-foreground'
        };
    }
  };

  return (
    <div className="w-full mb-6">
      {alerts?.map((alert) => {
        const config = getSeverityConfig(alert?.severity);
        return (
          <div
            key={alert?.id}
            className={`${config?.bgColor} ${config?.borderColor} border rounded-lg p-4 mb-2 last:mb-0`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Icon 
                  name={alert?.severity === 'critical' ? 'AlertTriangle' : alert?.severity === 'warning' ? 'AlertCircle' : 'Info'} 
                  size={20} 
                  className={`${config?.iconColor} mt-0.5`} 
                />
                <div className="flex-1">
                  <h4 className={`font-semibold ${config?.textColor} mb-1`}>
                    {alert?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {alert?.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Started: {alert?.startTime}</span>
                    <span>ETA: {alert?.estimatedResolution}</span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Users" size={12} />
                      <span>{alert?.affectedUsers} users affected</span>
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertBanner;