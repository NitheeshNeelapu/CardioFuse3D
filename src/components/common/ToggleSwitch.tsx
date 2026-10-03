import React from 'react';
import clsx from 'clsx';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  activeColor?: 'cyan' | 'violet' | 'pink' | 'emerald';
  id?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  sublabel,
  disabled = false,
  activeColor = 'cyan',
  id,
}) => {
  const switchColors = {
    cyan: checked ? 'bg-cyan-500 shadow-[0_0_12px_rgba(0,229,255,0.4)]' : 'bg-slate-800',
    violet: checked ? 'bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.4)]' : 'bg-slate-800',
    pink: checked ? 'bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.4)]' : 'bg-slate-800',
    emerald: checked ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-slate-800',
  }[activeColor];

  const toggleHandler = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-3 select-none cursor-pointer group py-1',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={toggleHandler}
    >
      {(label || sublabel) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] font-mono text-slate-400 leading-tight">
              {sublabel}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          toggleHandler();
        }}
        className={clsx(
          'relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border border-white/20 transition-colors duration-200 ease-in-out focus:outline-none',
          switchColors
        )}
      >
        <span
          className={clsx(
            'pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out my-auto ml-0.5',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};
