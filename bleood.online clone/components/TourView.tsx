'use client';

import React from 'react';
import { TOUR_DATA, TourLeg, TourDate } from '@/data/tour';
import HomeLink from './HomeLink';

interface TourViewProps {
  active?: boolean;
  onNavigateHome: () => void;
  onOpenLightbox: (src: string, alt: string) => void;
}

export default function TourView({ active = true, onNavigateHome, onOpenLightbox }: TourViewProps) {
  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-tour" aria-label="Tour">
      <div className="plate">
        <h1>Tour</h1>
      </div>

      <div className="frame">
        <div
          className="tour-poster"
          id="tourPoster"
          role="button"
          tabIndex={0}
          aria-label="Open tour poster"
          onClick={() => onOpenLightbox('/assets/art_poster.jpg', 'Tour poster')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenLightbox('/assets/art_poster.jpg', 'Tour poster');
            }
          }}
        >
          <div className="well">
            <img src="/assets/art_poster.jpg" alt="Tour poster" />
          </div>
          <img className="edge" src="/assets/kyiV.webp" alt="" aria-hidden="true" />
        </div>

        <div className="legs" id="legs">
          {TOUR_DATA.map((leg: TourLeg) => (
            <div key={leg.leg} className="leg">
              <h2>{leg.leg}</h2>
              {leg.rows.map((row: TourDate, idx: number) => (
                <div key={`${leg.leg}-${idx}`} className={`date ${row.past ? 'past' : ''}`}>
                  <span className="when">{row.when}</span>
                  <span className="where">
                    <span className="city">{row.city}</span>
                    <span className="venue">{row.venue}</span>
                  </span>
                  <span className="buy">
                    {row.url && !row.past ? (
                      <a href={row.url} target="_blank" rel="noopener noreferrer">
                        tickets
                      </a>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <HomeLink onNavigate={onNavigateHome} />
      </div>
    </section>
  );
}
