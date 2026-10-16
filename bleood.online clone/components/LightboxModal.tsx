'use client';

import React, { useEffect } from 'react';

interface LightboxModalProps {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

export default function LightboxModal({ isOpen, src, alt, onClose }: LightboxModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      id="lightbox"
      className={isOpen ? 'open colour' : ''}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {src && (
        <img
          src={src}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
