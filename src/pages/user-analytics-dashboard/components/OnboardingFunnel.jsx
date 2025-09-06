import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const OnboardingFunnel = () => {
  const funnelData = [
    { step: 'Landing Page', users: 10000, conversion: 100, dropOff: 0 },
    { step: 'Wallet Connect', users: 7500, conversion: 75, dropOff: 25 },
    { step: 'Profile Setup', users: 6000, conversion: 60, dropOff: 20 },
    { step: 'First Transaction', users: 4200, conversion: 42, dropOff: 30 },
    { step: 'Badge Earned', users: 3360, conversion: 33.6, dropOff: 20 },
    { step: 'Active User', users: 2688, conversion: 26.9, dropOff: 20 }
  ];

  const colors = ['#00D4FF', '#00FF88', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Users: <span className="text-foreground font-medium">{data?.users?.toLocaleString()}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Conversion: <span className="text-foreground font-medium">{data?.conversion}%</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Drop-off: <span className="text-error font-medium">{data?.dropOff}%</span>
            </p>
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
          <h3 className="text-lg font-semibold text-foreground mb-1">User Onboarding Funnel</h3>
          <p className="text-sm text-muted-foreground">Step-by-step conversion analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Last 30 days</span>
        </div>
      </div>
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="step" 
              stroke="#8B949E"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#8B949E" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="users" radius={[4, 4, 0, 0]}>
              {funnelData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors?.[index % colors?.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {funnelData?.map((step, index) => (
          <div key={step?.step} className="text-center">
            <div className="text-lg font-bold text-foreground">{step?.conversion}%</div>
            <div className="text-xs text-muted-foreground">{step?.step}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingFunnel;