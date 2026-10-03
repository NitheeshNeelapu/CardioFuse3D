import React from 'react';
import clsx from 'clsx';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
  borderVariant?: 'subtle' | 'cyan' | 'violet' | 'amber';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = false,
  borderVariant = 'subtle',
  padding = 'md',
  ...props
}) => {
  const borderStyles = {
    subtle: 'border-white/10 hover:border-white/15',
    cyan: 'border-cyan-500/30 hover:border-cyan-400/50',
    violet: 'border-violet-500/30 hover:border-violet-400/50',
    amber: 'border-amber-500/30 hover:border-amber-400/50',
  }[borderVariant];

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }[padding];

  return (
    <div
      className={clsx(
        'rounded-2xl backdrop-blur-xl transition-all duration-200 border',
        'bg-[#08111F]/80 text-slate-100',
        glow && 'shadow-[0_0_25px_rgba(0,229,255,0.08)]',
        borderStyles,
        paddingStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
