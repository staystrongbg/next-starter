import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

interface SubmitButtonProps extends Omit<React.ComponentProps<typeof Button>, 'children'> {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
}

export const SubmitButton = ({ isLoading, label, loadingLabel, ...props }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn('flex items-center gap-2', props.className)}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" />
          <p>{loadingLabel}</p>
        </div>
      ) : (
        <p>{label}</p>
      )}
    </Button>
  );
};
