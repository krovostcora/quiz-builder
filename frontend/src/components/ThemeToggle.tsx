'use client';

import { useSyncExternalStore } from 'react';
import { pixelButtonClasses } from '@/components/ui/PixelButton';

type Theme = 'light' | 'dark';

// Theme lives in <html data-theme>, set by the inline script in layout.tsx
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

function SunIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="20"
      height="20"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      <path d="M5 5h6v6H5z M7 1h2v2H7z M7 13h2v2H7z M1 7h2v2H1z M13 7h2v2h-2z M3 3h2v2H3z M11 3h2v2h-2z M3 11h2v2H3z M11 11h2v2h-2z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 8 8"
      width="20"
      height="20"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      <path d="M2 0h4v1H2z M1 1h2v1H1z M0 2h2v2H0z M0 4h2v1H0z M6 4h2v1H6z M1 5h2v1H1z M5 5h2v1H5z M2 6h4v1H2z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  function handleClick() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage can be blocked; the theme still applies for this session
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={pixelButtonClasses('default', 'sm', 'h-11 w-11 px-0')}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
