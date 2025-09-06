import React from 'react';
import Icon from '../../../components/AppIcon';

const EngagementHeatmap = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate mock heatmap data
  const generateHeatmapData = () => {
    const data = [];
    days?.forEach((day, dayIndex) => {
      hours?.forEach((hour) => {
        // Create realistic patterns - higher activity during business hours and evenings
        let intensity = Math.random() * 0.3; // Base low activity
        
        // Business hours boost (9-17)
        if (hour >= 9 && hour <= 17) {
          intensity += Math.random() * 0.4;
        }
        
        // Evening boost (18-22)
        if (hour >= 18 && hour <= 22) {
          intensity += Math.random() * 0.5;
        }
        
        // Weekend patterns
        if (dayIndex >= 5) {
          intensity *= 0.7; // Lower weekend activity
          if (hour >= 10 && hour <= 14) {
            intensity += Math.random() * 0.3; // Weekend afternoon boost
          }
        }
        
        data?.push({
          day: dayIndex,
          hour,
          intensity: Math.min(intensity, 1)
        });
      });
    });
    return data;
  };

  const heatmapData = generateHeatmapData();

  const getIntensityColor = (intensity) => {
    if (intensity < 0.2) return 'bg-muted/20';
    if (intensity < 0.4) return 'bg-primary/20';
    if (intensity < 0.6) return 'bg-primary/40';
    if (intensity < 0.8) return 'bg-primary/60';
    return 'bg-primary/80';
  };

  const getIntensityLabel = (intensity) => {
    if (intensity < 0.2) return 'Very Low';
    if (intensity < 0.4) return 'Low';
    if (intensity < 0.6) return 'Medium';
    if (intensity < 0.8) return 'High';
    return 'Very High';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">User Engagement Heatmap</h3>
          <p className="text-sm text-muted-foreground">Activity patterns by day and hour</p>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">This week</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="grid grid-cols-25 gap-1">
          {/* Hour labels */}
          <div></div>
          {hours?.map((hour) => (
            <div key={hour} className="text-xs text-muted-foreground text-center">
              {hour % 6 === 0 ? `${hour}h` : ''}
            </div>
          ))}
          
          {/* Heatmap grid */}
          {days?.map((day, dayIndex) => (
            <React.Fragment key={day}>
              <div className="text-xs text-muted-foreground text-right pr-2 flex items-center">
                {day}
              </div>
              {hours?.map((hour) => {
                const dataPoint = heatmapData?.find(d => d?.day === dayIndex && d?.hour === hour);
                return (
                  <div
                    key={`${dayIndex}-${hour}`}
                    className={`w-4 h-4 rounded-sm ${getIntensityColor(dataPoint?.intensity)} cursor-pointer transition-all hover:scale-110`}
                    title={`${day} ${hour}:00 - ${getIntensityLabel(dataPoint?.intensity)} activity (${Math.round(dataPoint?.intensity * 100)}%)`}
                  ></div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted/20"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/80"></div>
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Peak: Thu 20:00 (89% activity)
        </div>
      </div>
    </div>
  );
};

export default EngagementHeatmap;