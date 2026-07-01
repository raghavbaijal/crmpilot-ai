import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300',
        hoverable && 'hover:shadow-md hover:border-slate-200/80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
