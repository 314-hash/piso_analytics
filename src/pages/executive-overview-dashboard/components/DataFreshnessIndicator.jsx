import React from 'react';
import Icon from '../../../components/AppIcon';

const DataFreshnessIndicator = ({ lastUpdated, isLive = false }) => {
  const formatLastUpdated = (timestamp) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffInSeconds = Math.floor((now - updated) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse-status' : 'bg-muted-foreground'}`}></div>
        <span>{isLive ? 'Live' : 'Updated'}</span>
      </div>
      {!isLive && (
        <>
          <span>•</span>
          <span>{formatLastUpdated(lastUpdated)}</span>
        </>
      )}
      <Icon name="RefreshCw" size={12} className="opacity-60" />
    </div>
  );
};

export default DataFreshnessIndicator;