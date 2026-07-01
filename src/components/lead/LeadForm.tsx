import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { User, Phone, FileText, Send } from 'lucide-react';
import type { LeadRequest } from '../../types';


const phoneRegex = /^\+?[1-9]\d{1,14}$|^[0-9\s\-()]{7,15}$/;

const leadSchema = z.object({
  customer_name: z
    .string()
    .min(1, 'Customer name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Invalid phone number format'),
  chatInput: z
    .string()
    .min(1, 'Property requirement is required')
    .min(10, 'Requirement must be at least 10 characters'),
});

interface LeadFormProps {
  onSubmit: (data: LeadRequest) => void;
  isLoading: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadRequest>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      customer_name: '',
      phone: '',
      chatInput: '',
    },
  });

  return (
    <Card className="max-w-xl mx-auto border-slate-200/60 shadow-md p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField label="Customer Name" error={errors.customer_name} required>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <User className="w-4.5 h-4.5" aria-hidden="true" />
            </span>
            <input
              type="text"
              placeholder="e.g. Raghav Baijal"
              disabled={isLoading}
              className="pl-10"
              {...register('customer_name')}
            />
          </div>
        </FormField>

        <FormField label="Phone Number" error={errors.phone} required>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Phone className="w-4.5 h-4.5" aria-hidden="true" />
            </span>
            <input
              type="tel"
              placeholder="e.g. +91 99999 99999"
              disabled={isLoading}
              className="pl-10"
              {...register('phone')}
            />
          </div>
        </FormField>

        <FormField label="Property Requirement" error={errors.chatInput} required>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400">
              <FileText className="w-4.5 h-4.5" aria-hidden="true" />
            </span>
            <textarea
              placeholder="e.g. Looking for a premium 3 BHK apartment in Gurgaon with a budget of around 1.5 crore, preferably ready to move in within the next 3 months..."
              rows={4}
              disabled={isLoading}
              className="pl-10 resize-none pt-3"
              {...register('chatInput')}
            />
          </div>
        </FormField>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full text-sm font-semibold py-3 flex items-center justify-center gap-2 group cursor-pointer"
          size="lg"
        >
          {!isLoading && <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />}
          Analyze Lead
        </Button>
      </form>
    </Card>
  );
};
export default LeadForm;
