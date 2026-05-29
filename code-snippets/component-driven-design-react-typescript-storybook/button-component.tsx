// The constrained Button: only accepts declared props — no escape hatches.
// Every valid visual state is enumerable from the type definitions alone.

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600',
  secondary:
    'bg-white text-blue-600 hover:bg-blue-50 border border-blue-600',
  ghost:
    'bg-transparent text-blue-600 hover:bg-blue-50 border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-sm rounded',
  md: 'px-4 py-2 text-base rounded-md',
  lg: 'px-6 py-3 text-lg rounded-lg',
};

export function Button({ variant, size, label, onClick, disabled = false }: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center font-medium transition-colors',
    variantStyles[variant],
    sizeStyles[size],
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
  ].join(' ');

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
