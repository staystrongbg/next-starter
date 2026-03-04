import { AlertCircleIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react';

interface NotificationBoardProps {
  type?: 'info' | 'warning' | 'error';
  children?: React.ReactNode;
}

export const NotificationBoard = ({ type = 'info', children }: NotificationBoardProps) => {
  const borderColor =
    type === 'info'
      ? 'border-green-500'
      : type === 'warning'
        ? 'border-yellow-500'
        : 'border-red-500';
  const backgroundColor =
    type === 'info' ? 'bg-green-300' : type === 'warning' ? 'bg-yellow-300' : 'bg-red-300';

  const icon =
    type === 'info' ? (
      <InfoIcon />
    ) : type === 'warning' ? (
      <TriangleAlertIcon />
    ) : (
      <AlertCircleIcon />
    );

  return (
    <div
      className={`flex items-center justify-center rounded-lg border-2 ${borderColor} ${backgroundColor} p-2`}
    >
      {icon}
      <span className="ml-2 text-sm text-gray-600">{children}</span>
    </div>
  );
};
