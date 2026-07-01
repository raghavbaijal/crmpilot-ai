export const CHART_THEME = {
  colors: {
    hot: '#ef4444',
    warm: '#f59e0b',
    cold: '#3b82f6',
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#8b5cf6',
    info: '#06b6d4',
    palette: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#06b6d4'],
  },
  margin: { top: 10, right: 10, left: -20, bottom: 10 },
  marginWithYAxis: { top: 10, right: 10, left: -10, bottom: 10 },
  marginHorizontal: { top: 10, right: 20, left: 10, bottom: 10 },
  animation: {
    isAnimationActive: true,
    animationDuration: 800,
    animationEasing: 'ease-out' as const,
  },
  axis: {
    fontSize: 9,
    stroke: '#94a3b8',
    tickLine: false,
    axisLine: false,
  },
  tooltip: {
    contentStyle: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '11px',
      fontFamily: 'sans-serif',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
      padding: '8px 12px',
    },
    cursor: { fill: '#f8fafc', opacity: 0.5 },
  },
  legend: {
    wrapperStyle: {
      fontSize: '10px',
      fontFamily: 'sans-serif',
      paddingTop: '10px',
    },
    iconType: 'circle' as const,
    iconSize: 8,
  },
  radius: [4, 4, 0, 0] as [number, number, number, number],
  radiusHorizontal: [0, 4, 4, 0] as [number, number, number, number],
};
