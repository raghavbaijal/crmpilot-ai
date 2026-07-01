import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  classification: 'HOT' | 'WARM' | 'COLD';
}

export const Badge: React.FC<BadgeProps> = ({ classification, className, ...props }) => {
  const styles = {
    HOT: 'bg-red-50 text-red-700 border-red-200/60',
    WARM: 'bg-amber-50 text-amber-700 border-amber-200/60',
    COLD: 'bg-blue-50 text-blue-700 border-blue-200/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border shadow-xs tracking-wide transition-all duration-300',
        styles[classification],
        className
      )}
      {...props}
    >
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        classification === 'HOT' && 'bg-red-500',
        classification === 'WARM' && 'bg-amber-500',
        classification === 'COLD' && 'bg-blue-500',
      )} />
      {classification}
    </span>
  );
};
export default Badge;
