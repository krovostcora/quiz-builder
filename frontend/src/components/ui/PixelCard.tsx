import type { HTMLAttributes, ReactNode } from 'react';

type Strip = 'mint' | 'violet';

const strips: Record<Strip, string> = {
  mint: 'bg-mint-200 text-ink',
  violet: 'bg-violet-pixel text-white',
};

interface PixelCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  actions?: ReactNode;
  strip?: Strip;
}

export default function PixelCard({
  title,
  actions,
  strip = 'mint',
  className = '',
  children,
  ...props
}: PixelCardProps) {
  return (
    <div className={`border-ink shadow-pixel bg-surface border-4 ${className}`} {...props}>
      <div
        className={`border-ink flex min-h-6 items-center justify-between gap-2 border-b-4 px-3 py-2 ${strips[strip]}`}
      >
        <span className="font-pixel truncate text-[10px] uppercase">{title}</span>
        {actions && <div className="flex shrink-0 items-center">{actions}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
