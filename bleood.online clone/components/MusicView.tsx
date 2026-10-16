'use client';

import React, { useEffect, useState } from 'react';
import HomeLink from './HomeLink';

interface MusicViewProps {
  active?: boolean;
  onNavigateHome: () => void;
}

export default function MusicView({ active = true, onNavigateHome }: MusicViewProps) {
  const [frameSrc, setFrameSrc] = useState('/assets/kyiA.webp');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    function updateFrame() {
      const isNarrow = window.matchMedia('(max-width: 600px)').matches;
      setFrameSrc(isNarrow ? '/assets/kyiV.webp' : '/assets/kyiA.webp');
    }
    updateFrame();
    window.addEventListener('resize', updateFrame);
    return () => window.removeEventListener('resize', updateFrame);
  }, []);

  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-music" aria-label="Music">
      <div className="plate">
        <h1>Music</h1>
      </div>

      <div className="frame">
        <div className={`player ${hasError ? 'failed' : ''}`} id="player">
          <div className="well">
            <iframe
              id="spotify"
              title="Album player"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              src="https://open.spotify.com/embed/album/7iZ8k6nUY9f5Faf31rURPZ?utm_source=generator&theme=0"
              onError={() => setHasError(true)}
            />
          </div>

          <div className="fallback">
            <span>the player cannot run inside this preview</span>
            <span className="rule" />
            <a
              href="https://open.spotify.com/album/7iZ8k6nUY9f5Faf31rURPZ"
              target="_blank"
              rel="noopener noreferrer"
            >
              listen on spotify
            </a>
          </div>

          <img className="edge" src={frameSrc} alt="" aria-hidden="true" />
        </div>

        <HomeLink onNavigate={onNavigateHome} />
      </div>
    </section>
  );
}
