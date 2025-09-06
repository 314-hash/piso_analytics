import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data, selectedPeriod }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="text-foreground font-medium">
                ${entry?.value?.toLocaleString()}
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Revenue Sources Breakdown</h3>
        <div className="text-sm text-muted-foreground">
          Period: {selectedPeriod}
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="paymasterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="badgeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="governanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-warning)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-warning)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="paymaster"
              stackId="1"
              stroke="var(--color-primary)"
              fill="url(#paymasterGradient)"
              name="Paymaster Fees"
            />
            <Area
              type="monotone"
              dataKey="badgeNFT"
              stackId="1"
              stroke="var(--color-accent)"
              fill="url(#badgeGradient)"
              name="BadgeNFT Sales"
            />
            <Area
              type="monotone"
              dataKey="governance"
              stackId="1"
              stroke="var(--color-warning)"
              fill="url(#governanceGradient)"
              name="Governance Rewards"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;