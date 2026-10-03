import React from 'react';
import clsx from 'clsx';

export type BadgeVariant =
  | 'system-ready'
  | 'synthetic'
  | 'available'
  | 'unavailable'
  | 'demo-output'
  | 'cyan'
  | 'violet'
  | 'amber'
  | 'emerald';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  text?: string;
  className?: string;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  text,
  className,
  pulse = false,
}) => {
  const content = text || children;

  const variantStyles: Record<BadgeVariant, string> = {
    'system-ready':
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-[10px] uppercase font-bold tracking-wider',
    synthetic:
      'bg-amber-500/15 text-amber-300 border-amber-500/30 font-mono text-[10px] uppercase font-bold tracking-wider',
    available:
      'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-mono text-[10px] uppercase font-bold tracking-wider',
    unavailable:
      'bg-rose-500/15 text-rose-300 border-rose-500/30 font-mono text-[10px] uppercase font-bold tracking-wider',
    'demo-output':
      'bg-violet-500/15 text-violet-300 border-violet-500/30 font-mono text-[10px] uppercase font-bold tracking-wider',
    cyan:
      'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 font-mono text-[10px] uppercase font-bold tracking-wider',
    violet:
      'bg-violet-500/15 text-violet-300 border-violet-500/30 font-mono text-[10px] uppercase font-bold tracking-wider',
    amber:
      'bg-amber-500/15 text-amber-300 border-amber-500/30 font-mono text-[10px] uppercase font-bold tracking-wider',
    emerald:
      'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-mono text-[10px] uppercase font-bold tracking-wider',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border select-none',
        variantStyles[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {content}
    </span>
  );
};
