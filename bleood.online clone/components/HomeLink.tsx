'use client';

import React, { useState } from 'react';

interface HomeLinkProps {
  onNavigate?: () => void;
}

export default function HomeLink({ onNavigate }: HomeLinkProps) {
  const [sprout, setSprout] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isTouch = !window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (isTouch && !sprout) {
      e.preventDefault();
      setSprout(true);
      setTimeout(() => {
        setSprout(false);
        if (onNavigate) onNavigate();
        else window.location.hash = '#home';
      }, 350);
    } else if (onNavigate) {
      e.preventDefault();
      onNavigate();
    }
  };

  return (
    <a
      className={`home-link ${sprout ? 'sprout' : ''}`}
      href="#home"
      aria-label="Back to the clearing"
      onClick={handleClick}
    >
      <svg className="stem" viewBox="0 0 20 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M10 120 C 5 96, 15 70, 10 44 S 9 14, 10 0" />
        <path className="leaf" d="M11 78 C 15 70, 20 69, 19 64 C 15 65, 11 70, 11 78 Z" />
      </svg>
      <img className="flower-img" alt="" src="/assets/flower.webp" />
    </a>
  );
}
