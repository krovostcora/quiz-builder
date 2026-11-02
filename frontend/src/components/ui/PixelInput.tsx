import { useId } from 'react';
import type { ComponentProps } from 'react';

interface PixelInputProps extends ComponentProps<'input'> {
  label?: string;
  error?: string;
}

export default function PixelInput({
  label,
  error,
  id,
  className = '',
  ...props
}: PixelInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="font-pixel text-[10px] uppercase">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`font-body text-ink placeholder:text-ink-soft/60 focus:bg-mint-50 bg-surface w-full border-4 px-3 py-2 text-xl ${
          error ? 'border-danger-dark' : 'border-ink'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-danger-dark text-lg">
          {error}
        </p>
      )}
    </div>
  );
}
