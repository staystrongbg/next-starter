import { Eye, EyeOff } from 'lucide-react';

interface TogglePasswordVisibilityProps extends React.HTMLAttributes<HTMLButtonElement> {
  isVisible: boolean;
}

export const TogglePasswordVisibility = ({
  isVisible,
  ...props
}: TogglePasswordVisibilityProps) => {
  return (
    <button type="button" className="absolute top-1/2 right-3 -translate-y-1/2" {...props}>
      {isVisible ? (
        <Eye className="size-4 text-gray-500" />
      ) : (
        <EyeOff className="size-4 text-gray-500" />
      )}
    </button>
  );
};
