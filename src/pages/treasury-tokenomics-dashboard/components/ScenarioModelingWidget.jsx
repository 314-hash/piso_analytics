import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ScenarioModelingWidget = () => {
  const [scenario, setScenario] = useState({
    userGrowth: 25,
    feeIncrease: 10,
    burnRate: 5,
    timeframe: 12
  });

  const [projections, setProjections] = useState({
    revenue: 2450000,
    tokenPrice: 1.85,
    marketCap: 185000000,
    burnAmount: 125000
  });

  const handleScenarioChange = (field, value) => {
    const newScenario = { ...scenario, [field]: parseFloat(value) || 0 };
    setScenario(newScenario);
    
    // Mock calculation for projections
    const baseRevenue = 2000000;
    const basePrice = 1.50;
    const baseCap = 150000000;
    const baseBurn = 100000;

    setProjections({
      revenue: Math.round(baseRevenue * (1 + newScenario?.userGrowth / 100) * (1 + newScenario?.feeIncrease / 100)),
      tokenPrice: parseFloat((basePrice * (1 + newScenario?.userGrowth / 200) * (1 + newScenario?.burnRate / 100))?.toFixed(2)),
      marketCap: Math.round(baseCap * (1 + newScenario?.userGrowth / 100) * (1 + newScenario?.burnRate / 200)),
      burnAmount: Math.round(baseBurn * (1 + newScenario?.burnRate / 100))
    });
  };

  const scenarios = [
    { name: 'Conservative', userGrowth: 15, feeIncrease: 5, burnRate: 3, timeframe: 12 },
    { name: 'Moderate', userGrowth: 25, feeIncrease: 10, burnRate: 5, timeframe: 12 },
    { name: 'Aggressive', userGrowth: 50, feeIncrease: 20, burnRate: 10, timeframe: 12 }
  ];

  const loadScenario = (scenarioData) => {
    setScenario(scenarioData);
    handleScenarioChange('userGrowth', scenarioData?.userGrowth);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Scenario Modeling</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Calculator" size={16} color="var(--color-primary)" />
        </div>
      </div>
      {/* Preset Scenarios */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-3 block">Quick Scenarios</label>
        <div className="flex space-x-2">
          {scenarios?.map((preset) => (
            <Button
              key={preset?.name}
              variant="outline"
              size="sm"
              onClick={() => loadScenario(preset)}
              className="text-xs"
            >
              {preset?.name}
            </Button>
          ))}
        </div>
      </div>
      {/* Input Parameters */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Input
          label="User Growth (%)"
          type="number"
          value={scenario?.userGrowth}
          onChange={(e) => handleScenarioChange('userGrowth', e?.target?.value)}
          className="text-sm"
        />
        <Input
          label="Fee Increase (%)"
          type="number"
          value={scenario?.feeIncrease}
          onChange={(e) => handleScenarioChange('feeIncrease', e?.target?.value)}
          className="text-sm"
        />
        <Input
          label="Burn Rate (%)"
          type="number"
          value={scenario?.burnRate}
          onChange={(e) => handleScenarioChange('burnRate', e?.target?.value)}
          className="text-sm"
        />
        <Input
          label="Timeframe (months)"
          type="number"
          value={scenario?.timeframe}
          onChange={(e) => handleScenarioChange('timeframe', e?.target?.value)}
          className="text-sm"
        />
      </div>
      {/* Projections */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Projected Outcomes</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="DollarSign" size={16} color="var(--color-success)" />
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              ${projections?.revenue?.toLocaleString()}
            </div>
            <div className="text-xs text-success">
              +{((projections?.revenue - 2000000) / 2000000 * 100)?.toFixed(1)}% vs current
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Coins" size={16} color="var(--color-primary)" />
              <span className="text-sm text-muted-foreground">Token Price</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              ${projections?.tokenPrice}
            </div>
            <div className="text-xs text-primary">
              +{((projections?.tokenPrice - 1.50) / 1.50 * 100)?.toFixed(1)}% vs current
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} color="var(--color-accent)" />
              <span className="text-sm text-muted-foreground">Market Cap</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              ${(projections?.marketCap / 1000000)?.toFixed(0)}M
            </div>
            <div className="text-xs text-accent">
              +{((projections?.marketCap - 150000000) / 150000000 * 100)?.toFixed(1)}% vs current
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Flame" size={16} color="var(--color-warning)" />
              <span className="text-sm text-muted-foreground">Burn Amount</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              {projections?.burnAmount?.toLocaleString()} PISO
            </div>
            <div className="text-xs text-warning">
              +{((projections?.burnAmount - 100000) / 100000 * 100)?.toFixed(1)}% vs current
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="primary" size="sm" iconName="Save" iconPosition="left" fullWidth>
          Save Scenario
        </Button>
      </div>
    </div>
  );
};

export default ScenarioModelingWidget;