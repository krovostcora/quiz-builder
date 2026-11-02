'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PixelButton, { pixelButtonClasses } from '@/components/ui/PixelButton';
import { DotsIcon } from '@/components/ui/PixelIcons';

interface QuizCardMenuProps {
  editHref: string;
  onDelete: () => void;
  disabled?: boolean;
}

export default function QuizCardMenu({ editHref, onDelete, disabled }: QuizCardMenuProps) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const close = () => {
      setOpen(false);
      setConfirming(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Reset the confirmation if the second click never comes
  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(timer);
  }, [confirming]);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setOpen(false);
    setConfirming(false);
    onDelete();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Quiz actions"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => {
          setOpen((value) => !value);
          setConfirming(false);
        }}
        className="border-ink bg-surface text-ink hover:bg-mint-100 flex h-8 w-8 cursor-pointer items-center justify-center border-2 disabled:pointer-events-none disabled:opacity-50"
      >
        <DotsIcon />
      </button>

      {open && (
        <div
          role="menu"
          className="border-ink bg-surface shadow-pixel absolute top-full right-0 z-10 mt-2 flex flex-col gap-2 border-4 p-2"
        >
          <Link
            role="menuitem"
            href={editHref}
            // The cached page stays mounted, so close the menu explicitly
            onClick={() => setOpen(false)}
            className={pixelButtonClasses('default', 'sm', 'text-center whitespace-nowrap')}
          >
            Edit
          </Link>
          <PixelButton
            role="menuitem"
            variant="danger"
            size="sm"
            className="whitespace-nowrap"
            onClick={handleDelete}
          >
            {confirming ? 'Sure?' : 'Delete'}
          </PixelButton>
        </div>
      )}
    </div>
  );
}
