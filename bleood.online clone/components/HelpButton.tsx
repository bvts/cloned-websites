'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface HelpButtonProps {
  currentRoute: string;
  hasLitCandle: boolean;
}

export default function HelpButton({ currentRoute, hasLitCandle }: HelpButtonProps) {
  const [isAway, setIsAway] = useState(false);

  useEffect(() => {
    function checkScroll() {
      if (currentRoute === 'home' || currentRoute === '') {
        setIsAway(false);
        return;
      }
      const root = document.scrollingElement || document.documentElement;
      const left = root.scrollHeight - root.clientHeight - root.scrollTop;
      const isNearEnd = root.scrollHeight - root.clientHeight < 8 || left < 140;
      setIsAway(!isNearEnd);
    }

    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [currentRoute]);

  const isHome = currentRoute === 'home' || currentRoute === '';
  const isDim = isHome && !hasLitCandle;

  return (
    <Link
      href="/pages/help"
      className={`bl-help ${isAway ? 'is-away' : ''} ${isDim ? 'is-dim' : ''}`}
      aria-label="Help and Store Policies"
    >
      help
    </Link>
  );
}
