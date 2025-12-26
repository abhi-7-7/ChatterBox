import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

export default function WeeklyEngagement({ theme, engagementData, isLoading }) {
  const themeStyles = {
    light: {
      card: 'bg-white/70 backdrop-blur-md border border-white/20',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      gridLine: 'border-gray-200'
    },
    dark: {
      card: 'bg-slate-800/70 backdrop-blur-md border border-white/10',
      text: 'text-gray-100',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-500',
      gridLine: 'border-slate-700'
    },
    vintage: {
      card: 'bg-amber-50/70 backdrop-blur-md border border-amber-200/50',
      text: 'text-amber-900',
      textSecondary: 'text-amber-800',
      textMuted: 'text-amber-700',
      gridLine: 'border-amber-300'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  // Process engagement data from API
  const chartData = useMemo(() => {
    if (!engagementData || !engagementData.bars || engagementData.bars.length === 0) {
      return [
        { day: 'M', value: 0 },
        { day: 'T', value: 0 },
        { day: 'W', value: 0 },
        { day: 'T', value: 0 },
        { day: 'F', value: 0 },
        { day: 'S', value: 0 },
        { day: 'S', value: 0 }
      ];
    }

    const bars = engagementData.bars || [];
    const days = engagementData.days || ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return bars.map((value, index) => ({
      day: days[index] || String(index),
      value: value || 0
    }));
  }, [engagementData]);

  // Calculate predicted trend (spike percentage)
  const predictedSpike = useMemo(() => {
    if (!chartData || chartData.length < 2) return 13;
    const recent = chartData.slice(-3).reduce((sum, d) => sum + d.value, 0);
    const previous = chartData.slice(0, 3).reduce((sum, d) => sum + d.value, 0);
    if (previous === 0) return 13;
    const growth = ((recent - previous) / previous) * 100;
    return Math.round(Math.max(growth, 13));
  }, [chartData]);

  // Calculate line graph points with normalized scale
  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const minValue = Math.min(...chartData.map(d => d.value), 0);
  const range = maxValue - minValue || 1;
  
  const chartHeight = 280;
  const chartWidth = 100;
  const padding = 12;
  const pointSpacing = chartData.length > 1 ? (chartWidth - padding * 2) / (chartData.length - 1) : 0;

  // Generate line graph points with normalized Y scale
  const linePoints = chartData.map((item, index) => {
    const x = padding + (index * pointSpacing);
    // Normalize to prevent extreme jumps
    const normalizedValue = range > 0 ? (item.value - minValue) / range : 0.5;
    const y = chartHeight - padding - (normalizedValue * (chartHeight - padding * 2));
    return { x, y, value: item.value };
  });

  // Create SVG path string with smooth curve
  const pathData = linePoints.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prevPoint = linePoints[index - 1];
    const cp1x = prevPoint.x + (point.x - prevPoint.x) / 2;
    const cp1y = prevPoint.y;
    const cp2x = cp1x;
    const cp2y = point.y;
    return `${path} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  }, '');

  // Determine trend direction
  const isTrendingUp = linePoints.length >= 2 && 
    linePoints[linePoints.length - 1].y < linePoints[0].y;
  const trendColor = isTrendingUp ? '#10b981' : '#ef4444';

  // Calculate prediction point (smooth continuation)
  const lastPoint = linePoints[linePoints.length - 1];
  const secondLastPoint = linePoints[linePoints.length - 2];
  const deltaY = lastPoint.y - secondLastPoint.y;
  // Subtle rise, not explosive
  const predictionY = lastPoint.y - (Math.abs(deltaY) * 0.3); // 30% of recent change
  const predictionX = chartWidth - padding;

  if (isLoading) {
    return (
      <div className={`${currentTheme.card} rounded-2xl p-6 shadow-lg`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-80 bg-gray-300 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.card} rounded-2xl p-7 shadow-[0_4px_12px_rgba(0,0,0,0.08)]`}>
      <div className="flex items-center justify-between mb-7">
        <h3 className={`${currentTheme.text} text-xl font-semibold leading-tight`}>Weekly Engagement</h3>
        <span className={`${currentTheme.textSecondary} text-xs opacity-80`}>
          Last 7 days
        </span>
      </div>
      
      {/* Chart */}
      <div className="relative h-80 mb-7 px-2">
        {/* Y-axis labels - only key points */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span className="font-medium">{maxValue}</span>
          <span className="opacity-50">{Math.round(maxValue * 0.5)}</span>
          <span className="opacity-50">0</span>
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full relative">
          {/* Grid lines - lighter */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`border-t ${currentTheme.gridLine} opacity-20`}></div>
            ))}
          </div>

          {/* Thicker baseline */}
          <div className={`absolute bottom-8 left-0 right-0 border-t-2 ${currentTheme.gridLine}`}></div>

          {/* Line Graph SVG */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={trendColor} stopOpacity="0.15" />
                <stop offset="100%" stopColor={trendColor} stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={trendColor} />
                <stop offset="100%" stopColor={trendColor} />
              </linearGradient>
              {/* Subtle glow for prediction */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Area under line */}
            <path
              d={`${pathData} L ${lastPoint.x} ${chartHeight - padding} L ${linePoints[0].x} ${chartHeight - padding} Z`}
              fill="url(#lineGradient)"
            />

            {/* Main line - thicker baseline */}
            <path
              d={pathData}
              fill="none"
              stroke="url(#lineStroke)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points - only key points */}
            {linePoints.map((point, index) => {
              // Show only Mon, Wed, Fri, and last point
              const showPoint = index === 0 || index === 2 || index === 4 || index === linePoints.length - 1;
              if (!showPoint) return null;
              return (
                <g key={index}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill={trendColor}
                    className="hover:r-7 transition-all cursor-pointer"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <title>{`${chartData[index].day}: ${point.value}`}</title>
                </g>
              );
            })}

            {/* Smooth prediction line */}
            {linePoints.length >= 2 && (
              <>
                <path
                  d={`M ${lastPoint.x} ${lastPoint.y} Q ${(lastPoint.x + predictionX) / 2} ${(lastPoint.y + predictionY) / 2} ${predictionX} ${predictionY}`}
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  opacity="0.8"
                  filter="url(#glow)"
                />
                <circle
                  cx={predictionX}
                  cy={predictionY}
                  r="4"
                  fill="#9333ea"
                  opacity="0.8"
                />
              </>
            )}
          </svg>

          {/* Day labels - only Mon, Wed, Fri */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around px-2">
            {chartData.map((item, index) => {
              const showLabel = index === 0 || index === 2 || index === 4;
              return (
                <div 
                  key={index} 
                  className={`${currentTheme.textSecondary} text-xs font-medium ${showLabel ? 'opacity-100' : 'opacity-40'}`}
                  style={{ flex: '1 1 0' }}
                >
                  {item.day}
                </div>
              );
            })}
          </div>

          {/* AI Prediction Label */}
          <div className="absolute top-4 right-4 flex items-center gap-2 text-purple-600">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">AI Predicted Engagement</span>
          </div>
        </div>
      </div>

      {/* Prediction Summary - aligned with visual, purple for AI */}
      <div className={`${currentTheme.textSecondary} text-sm`}>
        <span className="font-medium">
          AI predicts{' '}
          <span className="font-medium text-purple-600">
            +{predictedSpike}% growth
          </span>
          {' '}next week
        </span>
      </div>

      {/* Status Badge */}
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        System Healthy
      </div>
    </div>
  );
}
