import { cn } from '@/lib/utils';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

export const VisuallyHidden = ({
  children,
  className,
}: VisuallyHiddenProps) => {
  return (
    <span
      className={cn(
        'absolute h-px w-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
        className
      )}
      style={{
        clip: 'rect(0, 0, 0, 0)',
      }}
    >
      {children}
    </span>
  );
};