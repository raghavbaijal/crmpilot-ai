import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp } from 'lucide-react';

interface RevenueForecastCardProps {
  forecast: string;
}

export const RevenueForecastCard: React.FC<RevenueForecastCardProps> = ({ forecast }) => {
  return (
    <Card className="border-emerald-100 bg-emerald-50/20 p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-emerald-100/30 pb-3">
        <div className="p-1.5 bg-emerald-500 text-white rounded-lg">
          <TrendingUp className="w-4 h-4" aria-hidden="true" />
        </div>
        <h4 className="text-xs font-bold text-emerald-800 tracking-tight uppercase">Revenue Forecast</h4>
      </div>

      <div className="py-2">
        <span className="text-xl font-black text-emerald-900 tracking-tight leading-none block">
          {forecast}
        </span>
        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block mt-1.5">
          Projected Quarter Revenue Impact
        </span>
      </div>
    </Card>
  );
};
export default RevenueForecastCard;
