import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const FeatureAdoption = () => {
  const adoptionData = [
    {
      week: 'Week 1',
      walletConnect: 85,
      gasAbstraction: 45,
      badgeNFT: 25,
      socialRecovery: 15,
      gamification: 35
    },
    {
      week: 'Week 2',
      walletConnect: 88,
      gasAbstraction: 52,
      badgeNFT: 32,
      socialRecovery: 22,
      gamification: 42
    },
    {
      week: 'Week 3',
      walletConnect: 91,
      gasAbstraction: 58,
      badgeNFT: 38,
      socialRecovery: 28,
      gamification: 48
    },
    {
      week: 'Week 4',
      walletConnect: 93,
      gasAbstraction: 63,
      badgeNFT: 44,
      socialRecovery: 34,
      gamification: 53
    },
    {
      week: 'Week 5',
      walletConnect: 94,
      gasAbstraction: 67,
      badgeNFT: 49,
      socialRecovery: 39,
      gamification: 58
    },
    {
      week: 'Week 6',
      walletConnect: 96,
      gasAbstraction: 71,
      badgeNFT: 54,
      socialRecovery: 43,
      gamification: 62
    }
  ];

  const features = [
    { key: 'walletConnect', name: 'Wallet Connect', color: '#00D4FF', icon: 'Wallet' },
    { key: 'gasAbstraction', name: 'Gas Abstraction', color: '#00FF88', icon: 'Fuel' },
    { key: 'badgeNFT', name: 'Badge NFT', color: '#F59E0B', icon: 'Award' },
    { key: 'socialRecovery', name: 'Social Recovery', color: '#EF4444', icon: 'Shield' },
    { key: 'gamification', name: 'Gamification', color: '#8B5CF6', icon: 'Trophy' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            {payload?.map((entry) => (
              <div key={entry?.dataKey} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                ></div>
                <span className="text-sm text-muted-foreground">
                  {entry?.name}: <span className="text-foreground font-medium">{entry?.value}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Feature Adoption Curves</h3>
          <p className="text-sm text-muted-foreground">Adoption rate over time by feature</p>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">6 weeks</span>
        </div>
      </div>
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={adoptionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="week" 
              stroke="#8B949E"
              fontSize={12}
            />
            <YAxis 
              stroke="#8B949E" 
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {features?.map((feature) => (
              <Line
                key={feature?.key}
                type="monotone"
                dataKey={feature?.key}
                stroke={feature?.color}
                strokeWidth={2}
                dot={{ fill: feature?.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: feature?.color, strokeWidth: 2 }}
                name={feature?.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {features?.map((feature) => {
          const latestData = adoptionData?.[adoptionData?.length - 1];
          const adoptionRate = latestData?.[feature?.key];
          const previousRate = adoptionData?.[adoptionData?.length - 2]?.[feature?.key];
          const change = adoptionRate - previousRate;
          
          return (
            <div key={feature?.key} className="text-center p-4 bg-muted/10 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${feature?.color}20` }}
                >
                  <Icon name={feature?.icon} size={16} style={{ color: feature?.color }} />
                </div>
              </div>
              <div className="text-lg font-bold text-foreground">{adoptionRate}%</div>
              <div className="text-xs text-muted-foreground mb-1">{feature?.name}</div>
              <div className={`text-xs flex items-center justify-center gap-1 ${change >= 0 ? 'text-success' : 'text-error'}`}>
                <Icon name={change >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
                +{change}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureAdoption;