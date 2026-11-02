import type { ButtonHTMLAttributes } from 'react';

type Variant = 'default' | 'accent' | 'danger';
type Size = 'sm' | 'md';

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2 border-4 border-ink font-pixel uppercase shadow-pixel select-none ' +
  'active:translate-x-1 active:translate-y-1 active:shadow-none ' +
  'disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  default: 'bg-white text-ink hover:bg-mint-200',
  accent: 'bg-violet-pixel text-white hover:bg-violet-pixel-dark',
  danger: 'bg-danger text-ink hover:bg-danger-dark',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-2 text-[10px]',
  md: 'px-4 py-3 text-xs',
};

// Reusable for links (e.g. next/link) that should look like buttons
export function pixelButtonClasses(
  variant: Variant = 'default',
  size: Size = 'md',
  className = '',
) {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(' ');
}

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export default function PixelButton({
  variant = 'default',
  size = 'md',
  className,
  type = 'button',
  ...props
}: PixelButtonProps) {
  return <button type={type} className={pixelButtonClasses(variant, size, className)} {...props} />;
}
