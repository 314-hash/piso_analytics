import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GlobalControls = ({ onFiltersChange }) => {
  const [cohortSelector, setCohortSelector] = useState('all');
  const [userSegment, setUserSegment] = useState('all');
  const [attributionChannel, setAttributionChannel] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);

  const cohortOptions = [
    { value: 'all', label: 'All Cohorts' },
    { value: 'dec2024', label: 'December 2024' },
    { value: 'nov2024', label: 'November 2024' },
    { value: 'oct2024', label: 'October 2024' },
    { value: 'sep2024', label: 'September 2024' }
  ];

  const segmentOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'new', label: 'New Users' },
    { value: 'active', label: 'Active Users' },
    { value: 'power', label: 'Power Users' },
    { value: 'dormant', label: 'Dormant Users' }
  ];

  const channelOptions = [
    { value: 'all', label: 'All Channels' },
    { value: 'organic', label: 'Organic Search' },
    { value: 'social', label: 'Social Media' },
    { value: 'referral', label: 'Referral' },
    { value: 'direct', label: 'Direct' },
    { value: 'paid', label: 'Paid Ads' }
  ];

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      cohort: cohortSelector,
      segment: userSegment,
      channel: attributionChannel,
      dateRange: dateRange,
      comparison: comparisonEnabled
    };

    switch (filterType) {
      case 'cohort':
        setCohortSelector(value);
        newFilters.cohort = value;
        break;
      case 'segment':
        setUserSegment(value);
        newFilters.segment = value;
        break;
      case 'channel':
        setAttributionChannel(value);
        newFilters.channel = value;
        break;
      case 'dateRange':
        setDateRange(value);
        newFilters.dateRange = value;
        break;
      case 'comparison':
        setComparisonEnabled(value);
        newFilters.comparison = value;
        break;
    }

    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const resetFilters = () => {
    setCohortSelector('all');
    setUserSegment('all');
    setAttributionChannel('all');
    setDateRange('30d');
    setComparisonEnabled(false);
    
    if (onFiltersChange) {
      onFiltersChange({
        cohort: 'all',
        segment: 'all',
        channel: 'all',
        dateRange: '30d',
        comparison: false
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Analytics Controls</h3>
          <p className="text-sm text-muted-foreground">Configure data filters and comparison settings</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset Filters
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Cohort Selector */}
        <div>
          <Select
            label="Cohort"
            options={cohortOptions}
            value={cohortSelector}
            onChange={(value) => handleFilterChange('cohort', value)}
            className="w-full"
          />
        </div>

        {/* User Segment Filter */}
        <div>
          <Select
            label="User Segment"
            options={segmentOptions}
            value={userSegment}
            onChange={(value) => handleFilterChange('segment', value)}
            className="w-full"
          />
        </div>

        {/* Attribution Channel */}
        <div>
          <Select
            label="Attribution Channel"
            options={channelOptions}
            value={attributionChannel}
            onChange={(value) => handleFilterChange('channel', value)}
            className="w-full"
          />
        </div>

        {/* Date Range */}
        <div>
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
            className="w-full"
          />
        </div>

        {/* Comparison Toggle */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-2">Comparison</label>
          <Button
            variant={comparisonEnabled ? "default" : "outline"}
            size="default"
            onClick={() => handleFilterChange('comparison', !comparisonEnabled)}
            iconName={comparisonEnabled ? "ToggleRight" : "ToggleLeft"}
            iconPosition="left"
            className="justify-start"
          >
            {comparisonEnabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </div>
      {/* Active Filters Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {cohortSelector !== 'all' && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
              <Icon name="Users" size={12} />
              {cohortOptions?.find(opt => opt?.value === cohortSelector)?.label}
            </div>
          )}
          
          {userSegment !== 'all' && (
            <div className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded text-xs">
              <Icon name="Target" size={12} />
              {segmentOptions?.find(opt => opt?.value === userSegment)?.label}
            </div>
          )}
          
          {attributionChannel !== 'all' && (
            <div className="flex items-center gap-1 bg-warning/10 text-warning px-2 py-1 rounded text-xs">
              <Icon name="Share2" size={12} />
              {channelOptions?.find(opt => opt?.value === attributionChannel)?.label}
            </div>
          )}
          
          {comparisonEnabled && (
            <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded text-xs">
              <Icon name="GitCompare" size={12} />
              Comparison Mode
            </div>
          )}
          
          {cohortSelector === 'all' && userSegment === 'all' && attributionChannel === 'all' && !comparisonEnabled && (
            <span className="text-xs text-muted-foreground">No filters applied</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalControls;