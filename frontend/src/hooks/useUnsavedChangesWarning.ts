'use client';

import { useEffect } from 'react';

const MESSAGE = 'You have unsaved changes. Leave this page?';

export function useUnsavedChangesWarning(active: boolean) {
  useEffect(() => {
    if (!active) return;

    // Tab close and reload
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    // In-app links: App Router has no built-in navigation guard
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank') {
        return;
      }

      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      if (!window.confirm(MESSAGE)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('click', onClick, true);
    };
  }, [active]);
}
