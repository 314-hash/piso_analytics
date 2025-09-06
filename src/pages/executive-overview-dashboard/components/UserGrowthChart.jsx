import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserGrowthChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.name === 'Success Rate' ? `${entry?.value}%` : entry?.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">User Growth & Transaction Success</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Active Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Success Rate</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="users"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="rate"
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              yAxisId="users"
              dataKey="activeUsers" 
              fill="var(--color-primary)" 
              name="Active Users"
              radius={[2, 2, 0, 0]}
            />
            <Line 
              yAxisId="rate"
              type="monotone" 
              dataKey="successRate" 
              stroke="var(--color-accent)" 
              strokeWidth={3}
              name="Success Rate"
              dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;