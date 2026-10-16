'use client';

import React, { useState, useEffect } from 'react';
import FilmGrain from '@/components/FilmGrain';
import HomeClearing from '@/components/HomeClearing';
import GalleryView from '@/components/GalleryView';
import MusicView from '@/components/MusicView';
import TourView from '@/components/TourView';
import NotesView from '@/components/NotesView';
import GamesView from '@/components/GamesView';
import ClosedView from '@/components/ClosedView';
import HelpButton from '@/components/HelpButton';
import LightboxModal from '@/components/LightboxModal';

export default function MainPage() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [candleStates, setCandleStates] = useState<boolean[]>([false, false, false, false, false]);
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; src: string; alt: string }>({
    isOpen: false,
    src: '',
    alt: ''
  });

  // Hash-based routing listener
  useEffect(() => {
    function handleRoute() {
      let hash = (window.location.hash || '#home').slice(1).toLowerCase();
      if (hash === 'quotes') hash = 'notes';
      if (!hash) hash = 'home';
      setCurrentRoute(hash);
      document.title = hash === 'home' ? 'bleood' : `bleood - ${hash}`;
      
      // Toggle html.fit class for single-screen views exactly as reference
      const isFit = ['music', 'notes', 'quotes', 'games'].includes(hash);
      document.documentElement.classList.toggle('fit', isFit);

      window.scrollTo(0, 0);
    }

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    return () => {
      window.removeEventListener('hashchange', handleRoute);
      document.documentElement.classList.remove('fit');
    };
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = `#${route}`;
  };

  const handleToggleCandle = (index: number) => {
    setCandleStates((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const handleOpenLightbox = (src: string, alt: string) => {
    setLightbox({ isOpen: true, src, alt });
  };

  const handleCloseLightbox = () => {
    setLightbox({ isOpen: false, src: '', alt: '' });
  };

  const hasLitCandle = candleStates.some(Boolean);
  const isHomeActive = currentRoute === 'home' || currentRoute === '';
  const isKnownRoute = ['home', 'gallery', 'music', 'tour', 'notes', 'quotes', 'games'].includes(currentRoute);

  return (
    <>
      {/* Dynamic global night overlay */}
      <div id="night" aria-hidden="true" />

      {/* Procedural Canvas Film Grain */}
      <FilmGrain />

      {/* Main Content Area */}
      <main>
        <HomeClearing
          active={isHomeActive}
          onNavigate={navigateTo}
          candleStates={candleStates}
          onToggleCandle={handleToggleCandle}
        />

        <GalleryView
          active={currentRoute === 'gallery'}
          onNavigateHome={() => navigateTo('home')}
          onOpenLightbox={handleOpenLightbox}
        />

        <MusicView
          active={currentRoute === 'music'}
          onNavigateHome={() => navigateTo('home')}
        />

        <TourView
          active={currentRoute === 'tour'}
          onNavigateHome={() => navigateTo('home')}
          onOpenLightbox={handleOpenLightbox}
        />

        <NotesView
          active={currentRoute === 'notes' || currentRoute === 'quotes'}
          onNavigateHome={() => navigateTo('home')}
        />

        <GamesView
          active={currentRoute === 'games'}
          onNavigateHome={() => navigateTo('home')}
        />

        <ClosedView
          active={!isHomeActive && !isKnownRoute}
          title={currentRoute === 'shop' ? 'Shop' : 'Lost'}
          onNavigateHome={() => navigateTo('home')}
        />

        {/* Fullscreen Lightbox Modal */}
        <LightboxModal
          isOpen={lightbox.isOpen}
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={handleCloseLightbox}
        />
      </main>

      {/* Floating Dynamic Help Link */}
      <HelpButton currentRoute={currentRoute} hasLitCandle={hasLitCandle} />
    </>
  );
}
