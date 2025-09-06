import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import UserMetricsCard from './components/UserMetricsCard';
import OnboardingFunnel from './components/OnboardingFunnel';
import UserSegmentBreakdown from './components/UserSegmentBreakdown';
import EngagementHeatmap from './components/EngagementHeatmap';
import RetentionCohort from './components/RetentionCohort';
import FeatureAdoption from './components/FeatureAdoption';
import GlobalControls from './components/GlobalControls';
import Icon from '../../components/AppIcon';

const UserAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('engagement');
  const [filters, setFilters] = useState({
    cohort: 'all',
    segment: 'all',
    channel: 'all',
    dateRange: '30d',
    comparison: false
  });

  // Mock KPI data
  const kpiData = [
    {
      title: 'User Acquisition Cost',
      value: '$24.50',
      change: '-8.2%',
      trend: 'down',
      icon: 'DollarSign',
      color: 'primary'
    },
    {
      title: 'Lifetime Value',
      value: '$186.40',
      change: '+12.5%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      title: 'Onboarding Conversion',
      value: '26.9%',
      change: '+3.1%',
      trend: 'up',
      icon: 'UserCheck',
      color: 'accent'
    },
    {
      title: 'Avg Session Duration',
      value: '8m 42s',
      change: '+1.8%',
      trend: 'up',
      icon: 'Clock',
      color: 'warning'
    }
  ];

  const tabs = [
    { id: 'engagement', label: 'Engagement Heatmaps', icon: 'Activity' },
    { id: 'adoption', label: 'Feature Adoption', icon: 'TrendingUp' },
    { id: 'retention', label: 'Retention Cohorts', icon: 'Users' }
  ];

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Here you would typically trigger data refetch with new filters
    console.log('Filters updated:', newFilters);
  };

  useEffect(() => {
    // Simulate data loading based on filters
    const timer = setTimeout(() => {
      console.log('Data refreshed with filters:', filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'engagement':
        return <EngagementHeatmap />;
      case 'adoption':
        return <FeatureAdoption />;
      case 'retention':
        return <RetentionCohort />;
      default:
        return <EngagementHeatmap />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Icon name="Users" size={24} color="var(--color-background)" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">User Analytics Dashboard</h1>
                <p className="text-muted-foreground">Analyze user behavior patterns, onboarding performance, and engagement metrics</p>
              </div>
            </div>
          </div>

          {/* Global Controls */}
          <GlobalControls onFiltersChange={handleFiltersChange} />

          {/* KPI Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <UserMetricsCard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                trend={kpi?.trend}
                icon={kpi?.icon}
                color={kpi?.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
            {/* Onboarding Funnel - Main Content (12 cols equivalent) */}
            <div className="xl:col-span-3">
              <OnboardingFunnel />
            </div>

            {/* User Segment Breakdown - Right Panel (4 cols equivalent) */}
            <div className="xl:col-span-1">
              <UserSegmentBreakdown />
            </div>
          </div>

          {/* Tabbed Interface */}
          <div className="bg-card border border-border rounded-lg">
            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    {tab?.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>

          {/* Additional Insights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Target" size={16} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Conversion Insights</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Wallet Connection</span>
                  <span className="text-sm font-medium text-foreground">75%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">First Transaction</span>
                  <span className="text-sm font-medium text-foreground">42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Badge Earned</span>
                  <span className="text-sm font-medium text-foreground">33.6%</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={16} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Top Performing Features</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Wallet Connect</span>
                  <span className="text-sm font-medium text-success">96%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gas Abstraction</span>
                  <span className="text-sm font-medium text-success">71%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gamification</span>
                  <span className="text-sm font-medium text-warning">62%</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Areas for Improvement</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Social Recovery Setup</span>
                  <span className="text-sm font-medium text-error">43%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">3-Month Retention</span>
                  <span className="text-sm font-medium text-error">20.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Weekend Engagement</span>
                  <span className="text-sm font-medium text-warning">-30%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserAnalyticsDashboard;