import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import MetricCard from './components/MetricCard';
import DashboardControls from './components/DashboardControls';
import UserGrowthChart from './components/UserGrowthChart';
import ExecutiveAlerts from './components/ExecutiveAlerts';
import FunnelMetrics from './components/FunnelMetrics';
import DataFreshnessIndicator from './components/DataFreshnessIndicator';

const ExecutiveOverviewDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data for metrics cards
  const metricsData = [
    {
      title: "Total Active Users",
      value: "847K",
      change: "+12.5%",
      changeType: "positive",
      icon: "Users",
      color: "primary",
      trend: [45, 52, 48, 61, 55, 67, 73, 69, 78, 82, 88, 95]
    },
    {
      title: "Transaction Volume",
      value: "$2.4M",
      change: "+8.3%",
      changeType: "positive",
      icon: "TrendingUp",
      color: "success",
      trend: [38, 42, 51, 47, 58, 62, 69, 74, 71, 79, 85, 91]
    },
    {
      title: "Treasury Revenue",
      value: "$156K",
      change: "+15.7%",
      changeType: "positive",
      icon: "DollarSign",
      color: "warning",
      trend: [25, 31, 28, 35, 42, 38, 45, 51, 48, 56, 62, 68]
    },
    {
      title: "User Retention Rate",
      value: "73.2%",
      change: "-2.1%",
      changeType: "negative",
      icon: "UserCheck",
      color: "error",
      trend: [85, 82, 78, 75, 73, 71, 69, 72, 74, 73, 71, 73]
    }
  ];

  // Mock data for user growth chart
  const chartData = [
    { date: "Jan", activeUsers: 45000, successRate: 94.2 },
    { date: "Feb", activeUsers: 52000, successRate: 95.1 },
    { date: "Mar", activeUsers: 48000, successRate: 93.8 },
    { date: "Apr", activeUsers: 61000, successRate: 96.3 },
    { date: "May", activeUsers: 55000, successRate: 94.7 },
    { date: "Jun", activeUsers: 67000, successRate: 97.1 },
    { date: "Jul", activeUsers: 73000, successRate: 95.9 },
    { date: "Aug", activeUsers: 69000, successRate: 96.8 },
    { date: "Sep", activeUsers: 78000, successRate: 97.5 }
  ];

  // Mock data for executive alerts
  const alertsData = [
    {
      id: 1,
      title: "Gas Abstraction Milestone Reached",
      message: "Successfully processed 1M+ gasless transactions, saving users $2.3M in fees this month.",
      severity: "success",
      timestamp: new Date(Date.now() - 300000),
      action: "View Details"
    },
    {
      id: 2,
      title: "Network Congestion Alert",
      message: "Ethereum network experiencing high congestion. Transaction success rate dropped to 89%.",
      severity: "warning",
      timestamp: new Date(Date.now() - 900000),
      action: "Monitor Status"
    },
    {
      id: 3,
      title: "Security Incident Resolved",
      message: "Attempted phishing attack on wallet recovery system was successfully blocked by our security measures.",
      severity: "critical",
      timestamp: new Date(Date.now() - 1800000),
      action: "Read Report"
    },
    {
      id: 4,
      title: "BadgeNFT Engagement Surge",
      message: "Achievement completion rates increased by 34% following the new gamification features launch.",
      severity: "info",
      timestamp: new Date(Date.now() - 3600000),
      action: "View Analytics"
    },
    {
      id: 5,
      title: "Treasury Milestone",
      message: "Monthly revenue target exceeded by 15.7% with $156K generated from Paymaster fees.",
      severity: "success",
      timestamp: new Date(Date.now() - 7200000),
      action: "View Treasury"
    }
  ];

  // Mock data for funnel metrics
  const funnelData = [
    {
      id: 1,
      title: "Onboarding Completion",
      description: "Users completing full setup process",
      percentage: 78.5,
      current: 157000,
      total: 200000,
      target: 80,
      change: 5.2,
      icon: "UserPlus"
    },
    {
      id: 2,
      title: "Gas Abstraction Adoption",
      description: "Users utilizing gasless transactions",
      percentage: 65.3,
      current: 130600,
      total: 200000,
      target: 70,
      change: 8.7,
      icon: "Zap"
    },
    {
      id: 3,
      title: "BadgeNFT Engagement",
      description: "Users earning achievement badges",
      percentage: 42.8,
      current: 85600,
      total: 200000,
      target: 50,
      change: 12.4,
      icon: "Award"
    }
  ];

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 300000); // 5 minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleExport = () => {
    // Mock export functionality
    const exportData = {
      timestamp: new Date()?.toISOString(),
      timeRange,
      network: selectedNetwork,
      metrics: metricsData,
      alerts: alertsData?.length,
      funnelMetrics: funnelData
    };
    
    console.log('Exporting executive summary:', exportData);
    alert('Executive summary PDF export initiated. Check your downloads folder.');
  };

  return (
    <>
      <Helmet>
        <title>Executive Overview Dashboard - PISO Analytics</title>
        <meta name="description" content="C-level stakeholder dashboard with high-level KPIs and strategic insights into PISO DApp ecosystem performance and growth metrics." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Executive Overview</h1>
                  <p className="text-muted-foreground mt-1">
                    Strategic insights and high-level KPIs for PISO DApp ecosystem
                  </p>
                </div>
                <DataFreshnessIndicator lastUpdated={lastUpdated} isLive={autoRefresh} />
              </div>
            </div>

            {/* Dashboard Controls */}
            <DashboardControls
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              selectedNetwork={selectedNetwork}
              setSelectedNetwork={setSelectedNetwork}
              autoRefresh={autoRefresh}
              setAutoRefresh={setAutoRefresh}
              onExport={handleExport}
            />

            {/* Metrics Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {metricsData?.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
              {/* User Growth Chart - 8 columns */}
              <div className="xl:col-span-8">
                <UserGrowthChart data={chartData} />
              </div>

              {/* Executive Alerts - 4 columns */}
              <div className="xl:col-span-4">
                <ExecutiveAlerts alerts={alertsData} />
              </div>
            </div>

            {/* Funnel Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <FunnelMetrics metrics={funnelData} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ExecutiveOverviewDashboard;