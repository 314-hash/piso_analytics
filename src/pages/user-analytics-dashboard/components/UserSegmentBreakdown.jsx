import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const UserSegmentBreakdown = () => {
  const segmentData = [
    { name: 'New Users', value: 35, count: 3500, color: '#00D4FF' },
    { name: 'Active Users', value: 28, count: 2800, color: '#00FF88' },
    { name: 'Power Users', value: 22, count: 2200, color: '#F59E0B' },
    { name: 'Dormant Users', value: 15, count: 1500, color: '#8B949E' }
  ];

  const demographicData = [
    { label: 'Age 18-25', percentage: 32, icon: 'Users' },
    { label: 'Age 26-35', percentage: 45, icon: 'User' },
    { label: 'Age 36-45', percentage: 18, icon: 'UserCheck' },
    { label: 'Age 45+', percentage: 5, icon: 'UserX' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            Count: <span className="text-foreground font-medium">{data?.count?.toLocaleString()}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <span className="text-foreground font-medium">{data?.value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">User Segments</h3>
          <p className="text-sm text-muted-foreground">Behavioral clustering analysis</p>
        </div>
        <Icon name="PieChart" size={20} className="text-muted-foreground" />
      </div>
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segmentData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {segmentData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3 mb-6">
        {segmentData?.map((segment) => (
          <div key={segment?.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: segment?.color }}
              ></div>
              <span className="text-sm text-foreground">{segment?.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{segment?.value}%</div>
              <div className="text-xs text-muted-foreground">{segment?.count?.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Demographics</h4>
        <div className="space-y-2">
          {demographicData?.map((demo) => (
            <div key={demo?.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name={demo?.icon} size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{demo?.label}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{demo?.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSegmentBreakdown;