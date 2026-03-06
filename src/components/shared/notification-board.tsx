import { AlertCircleIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react';
import React from 'react';

type NotificationType = 'info' | 'warning' | 'error';

interface NotificationBoardProps {
  type?: NotificationType;
  children?: React.ReactNode;
}

const styles: Record<
  NotificationType,
  { border: string; bg: string; icon: typeof InfoIcon; iconColor: string; textColor: string }
> = {
  info: {
    border: 'border-blue-300',
    bg: 'bg-blue-100',
    icon: InfoIcon,
    iconColor: 'text-blue-700',
    textColor: 'text-blue-900',
  },
  warning: {
    border: 'border-yellow-300',
    bg: 'bg-yellow-100',
    icon: TriangleAlertIcon,
    iconColor: 'text-yellow-800',
    textColor: 'text-yellow-950',
  },
  error: {
    border: 'border-red-300',
    bg: 'bg-red-100',
    icon: AlertCircleIcon,
    iconColor: 'text-red-700',
    textColor: 'text-red-950',
  },
};

export const NotificationBoard = ({
  type = 'info',
  children,
}: NotificationBoardProps): React.ReactElement => {
  const style = styles[type];
  const Icon = style.icon;

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className={`flex items-center rounded-lg border-2 ${style.border} ${style.bg} p-3`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${style.iconColor}`} aria-hidden="true" />
      <span className={`ml-2 text-sm ${style.textColor}`}>{children}</span>
    </div>
  );
};
