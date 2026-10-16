'use client';

import React, { useState, useRef } from 'react';
import { NOTES_DATA, NoteSheet } from '@/data/notes';
import { BLEOOD_AUDIO } from '@/data/assets';
import HomeLink from './HomeLink';

interface NotesViewProps {
  active?: boolean;
  onNavigateHome: () => void;
}

export default function NotesView({ active = true, onNavigateHome }: NotesViewProps) {
  const [turned, setTurned] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const N = NOTES_DATA.length;

  const playSlideSound = () => {
    try {
      const audio = new Audio(BLEOOD_AUDIO.kyiSlide);
      audio.volume = 0.35;
      audio.play().catch(() => {});
    } catch {}
  };

  const flipNext = () => {
    if (turned < N) {
      setTurned((prev) => prev + 1);
      playSlideSound();
    }
  };

  const flipPrev = () => {
    if (turned > 0) {
      setTurned((prev) => prev - 1);
      playSlideSound();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diff < -40) {
      flipNext();
    } else if (diff > 40) {
      flipPrev();
    }
    touchStartXRef.current = null;
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (turned < N) {
          setTurned((prev) => prev + 1);
          playSlideSound();
        }
      } else if (e.key === 'ArrowLeft') {
        if (turned > 0) {
          setTurned((prev) => prev - 1);
          playSlideSound();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, turned, N]);

  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-quotes" aria-label="Notes">
      <div className="plate">
        <h1>Notes</h1>
      </div>

      <div className="frame">
        <div
          className="book"
          id="book"
          style={{
            transform: turned > 0 ? 'translate(0)' : 'translate(var(--shift, -25%))'
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {NOTES_DATA.map((sheet: NoteSheet, i: number) => {
            const isFlipped = i < turned;
            const z = isFlipped ? (i - turned) * 1.2 : (turned - i) * 1.2;
            const rest = (i * 0.35).toFixed(2);
            const open = (-178 + (N - 1 - i) * 0.5).toFixed(2);
            const zIndex = isFlipped ? 20 + i : 30 + (N - i);

            return (
              <div
                key={`sheet-${i}`}
                className={`sheet ${isFlipped ? 'flipped' : ''}`}
                style={{
                  ['--z' as string]: `${z}px`,
                  ['--rest' as string]: `${rest}deg`,
                  ['--open' as string]: `${open}deg`,
                  zIndex
                }}
              >
                <div className="face">
                  <img className="draw" src={sheet.draw} alt={sheet.alt || ''} draggable={false} />
                </div>
                <div className="back" />
              </div>
            );
          })}

          <button
            type="button"
            className="turn prev"
            id="turnPrev"
            aria-label="Previous page"
            disabled={turned === 0}
            onClick={flipPrev}
          />
          <button
            type="button"
            className="turn next"
            id="turnNext"
            aria-label="Next page"
            disabled={turned === N}
            onClick={flipNext}
          />

          <div className="corner" aria-hidden="true" />
        </div>

        <div className="pages" id="pages" aria-hidden="true">
          {Array.from({ length: N }).map((_, idx) => (
            <i key={`dot-${idx}`} className={idx === Math.min(turned, N - 1) ? 'on' : ''} />
          ))}
        </div>

        <HomeLink onNavigate={onNavigateHome} />
      </div>
    </section>
  );
}
