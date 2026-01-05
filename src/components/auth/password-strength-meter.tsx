import { getPasswordStrength } from '@/helpers/get-pwd-strength';

export const PasswordStrengthMeter = ({
  strength,
}: {
  strength: ReturnType<typeof getPasswordStrength>;
}) => {
  return (
    <div className="mt-2" aria-live="polite" aria-atomic="true">
      <div className="flex gap-1" role="img" aria-label={`Password strength: ${strength.label}`}>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded ${i <= strength.score ? strength.color : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <div className="text-muted-foreground mt-1 text-xs">
        Strength: <span className="font-medium">{strength.label}</span>
      </div>
    </div>
  );
};
