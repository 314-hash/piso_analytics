import React from 'react';
import Icon from '../../../components/AppIcon';

const RetentionCohort = () => {
  // Generate mock cohort data
  const cohorts = [
    {
      period: 'Dec 2024',
      users: 1250,
      week1: 68,
      week2: 45,
      week3: 32,
      week4: 28,
      month2: 22,
      month3: 18
    },
    {
      period: 'Nov 2024',
      users: 980,
      week1: 72,
      week2: 48,
      week3: 35,
      week4: 31,
      month2: 25,
      month3: 21
    },
    {
      period: 'Oct 2024',
      users: 1100,
      week1: 65,
      week2: 42,
      week3: 29,
      week4: 25,
      month2: 20,
      month3: 16
    },
    {
      period: 'Sep 2024',
      users: 850,
      week1: 70,
      week2: 46,
      week3: 33,
      week4: 29,
      month2: 23,
      month3: 19
    },
    {
      period: 'Aug 2024',
      users: 920,
      week1: 74,
      week2: 51,
      week3: 38,
      week4: 34,
      month2: 27,
      month3: 23
    }
  ];

  const getRetentionColor = (percentage) => {
    if (percentage >= 60) return 'bg-success/80 text-white';
    if (percentage >= 40) return 'bg-warning/60 text-white';
    if (percentage >= 25) return 'bg-primary/40 text-white';
    if (percentage >= 15) return 'bg-error/40 text-white';
    return 'bg-muted/20 text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Retention Cohort Analysis</h3>
          <p className="text-sm text-muted-foreground">User retention by signup cohort</p>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Users" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">5 cohorts</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-sm font-medium text-muted-foreground pb-3">Cohort</th>
              <th className="text-center text-sm font-medium text-muted-foreground pb-3">Users</th>
              <th className="text-center text-sm font-medium text-muted-foreground pb-3">Week 1</th>
              <th className="text-center text-sm font-medium text-muted-foreground pb-3">Week 2</th>
              <th className="text-center text-sm font-medium text-muted-foreground pb-3">Week 3</th>
              <th className="text-center text-sm font-medium text-muted-foreground pb-3">Week 4</th>
              <th className="text-center text-sm font-medium text-muted-foreground pb-3">Month 2</th>
              <th className="text-center text-sm font-medium text-muted-foreground pb-3">Month 3</th>
            </tr>
          </thead>
          <tbody>
            {cohorts?.map((cohort, index) => (
              <tr key={cohort?.period} className="border-b border-border/50">
                <td className="py-3">
                  <div className="text-sm font-medium text-foreground">{cohort?.period}</div>
                </td>
                <td className="text-center py-3">
                  <div className="text-sm font-medium text-foreground">{cohort?.users?.toLocaleString()}</div>
                </td>
                <td className="text-center py-3">
                  <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium ${getRetentionColor(cohort?.week1)}`}>
                    {cohort?.week1}%
                  </div>
                </td>
                <td className="text-center py-3">
                  <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium ${getRetentionColor(cohort?.week2)}`}>
                    {cohort?.week2}%
                  </div>
                </td>
                <td className="text-center py-3">
                  <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium ${getRetentionColor(cohort?.week3)}`}>
                    {cohort?.week3}%
                  </div>
                </td>
                <td className="text-center py-3">
                  <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium ${getRetentionColor(cohort?.week4)}`}>
                    {cohort?.week4}%
                  </div>
                </td>
                <td className="text-center py-3">
                  <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium ${getRetentionColor(cohort?.month2)}`}>
                    {cohort?.month2}%
                  </div>
                </td>
                <td className="text-center py-3">
                  <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium ${getRetentionColor(cohort?.month3)}`}>
                    {cohort?.month3}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success/80"></div>
            <span className="text-xs text-muted-foreground">60%+ Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning/60"></div>
            <span className="text-xs text-muted-foreground">40-59% Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary/40"></div>
            <span className="text-xs text-muted-foreground">25-39% Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-error/40"></div>
            <span className="text-xs text-muted-foreground">15-24% Poor</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Avg 3-month retention: 20.2%
        </div>
      </div>
    </div>
  );
};

export default RetentionCohort;