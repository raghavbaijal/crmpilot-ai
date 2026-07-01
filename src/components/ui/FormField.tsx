import React from 'react';
import type { FieldError } from 'react-hook-form';
import { cn } from '../../utils/cn';

interface FormFieldProps {
  label: string;
  error?: FieldError;
  required?: boolean;
  children: React.ReactElement<any>;
  className?: string;
}


export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {error && (
          <span className="text-xs text-red-500 font-normal">
            {error.message}
          </span>
        )}
      </label>
      
      {React.cloneElement(children, {
        className: cn(
          'w-full px-4 py-2.5 bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm shadow-xs',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 focus:border-blue-500',
          children.props.className
        ),
      })}
    </div>
  );
};
export default FormField;
