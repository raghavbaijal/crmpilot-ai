import React from 'react';
import { UserCheck } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No qualified leads yet',
  subtitle = 'Submit a customer enquiry in the qualification workspace to get started.',
  actionLabel = 'Qualify Your First Lead',
  onAction,
}) => {
  return (
    <Card className="border-slate-100/60 p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100/40 shadow-inner">
        <UserCheck className="w-8 h-8" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">{subtitle}</p>
      </div>
      {onAction && (
        <Button onClick={onAction} className="px-6 py-2.5 font-semibold text-sm cursor-pointer">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
export default EmptyState;
