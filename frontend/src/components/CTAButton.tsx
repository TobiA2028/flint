import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'spark' | 'secondary';
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CTAButton = ({ 
  children, 
  onClick, 
  variant = 'spark', 
  disabled, 
  className,
  size = 'lg'
}: CTAButtonProps) => {
  const variants = {
    spark: 'bg-spark-gradient hover:shadow-spark text-accent-foreground font-semibold',
    secondary: 'border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        className
      )}
    >
      {children}
    </Button>
  );
};