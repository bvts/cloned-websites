'use client';

import React from 'react';
import { GALLERY_PIECES, GalleryPiece } from '@/data/gallery';
import HomeLink from './HomeLink';

interface GalleryViewProps {
  active?: boolean;
  onNavigateHome: () => void;
  onOpenLightbox: (src: string, alt: string) => void;
}

const FRAME_MAP: Record<'a' | 'v' | 'h', string> = {
  a: '/assets/kyiA.webp',
  v: '/assets/kyiV.webp',
  h: '/assets/kyiH.webp'
};

export default function GalleryView({ active = true, onNavigateHome, onOpenLightbox }: GalleryViewProps) {
  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-gallery" aria-label="Gallery">
      <div className="plate">
        <h1>Gallery</h1>
      </div>

      <div className="frame">
        <div className="wall" id="wall">
          {GALLERY_PIECES.map((p: GalleryPiece, i: number) => {
            const edgeFrame = FRAME_MAP[p.t];
            return (
              <figure
                key={`piece-${i}`}
                className={`piece ${p.t}`}
                style={{
                  ['--x' as string]: p.x,
                  ['--y' as string]: p.y,
                  ['--w' as string]: p.w,
                  ['--rot' as string]: p.r,
                  ['--dur' as string]: p.dur,
                  ['--delay' as string]: p.delay,
                  ['--dx' as string]: p.dx,
                  ['--dy' as string]: p.dy,
                  ['--swing' as string]: p.swing
                }}
                tabIndex={0}
                role="button"
                aria-label={`Open ${p.alt}`}
                onClick={() => onOpenLightbox(p.src, p.alt)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenLightbox(p.src, p.alt);
                  }
                }}
              >
                <div className="inner">
                  <div className="art">
                    <img src={p.src} alt={p.alt} />
                  </div>
                  <img className="edge" src={edgeFrame} alt="" aria-hidden="true" />
                </div>
              </figure>
            );
          })}
        </div>

        <HomeLink onNavigate={onNavigateHome} />
      </div>
    </section>
  );
}
