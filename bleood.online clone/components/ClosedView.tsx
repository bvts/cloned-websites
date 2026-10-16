'use client';

import React from 'react';
import HomeLink from './HomeLink';

interface ClosedViewProps {
  active?: boolean;
  title: string;
  onNavigateHome: () => void;
}

export default function ClosedView({ active = true, title, onNavigateHome }: ClosedViewProps) {
  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-closed" aria-label="Page in progress">
      <div className="plate">
        <h1 id="closed-title">{title}</h1>
      </div>

      <div className="frame">
        <div className="closed">
          <p className="bs-empty" id="closed-soon">
            coming soon
          </p>
        </div>

        <HomeLink onNavigate={onNavigateHome} />
      </div>
    </section>
  );
}
