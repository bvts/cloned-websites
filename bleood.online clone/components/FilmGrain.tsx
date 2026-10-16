'use client';

import React, { useEffect, useRef } from 'react';

export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const TILE_SIZE = 256;
    const NOISE_TILES: HTMLCanvasElement[] = [];

    // Pre-create 6 smooth, authentic noise tiles
    function createNoiseTile(alphaMax = 255) {
      const c = document.createElement('canvas');
      c.width = TILE_SIZE;
      c.height = TILE_SIZE;
      const cx = c.getContext('2d');
      if (!cx) return c;
      const img = cx.createImageData(TILE_SIZE, TILE_SIZE);
      const d = img.data;

      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = Math.random() * alphaMax;
      }

      cx.putImageData(img, 0, 0);
      return c;
    }

    for (let i = 0; i < 6; i++) {
      NOISE_TILES.push(createNoiseTile(255));
    }

    function resize() {
      if (!canvas) return;
      // Scaled down to half resolution matching original bleood.online
      canvas.width = Math.ceil(window.innerWidth / 2);
      canvas.height = Math.ceil(window.innerHeight / 2);
    }

    function render() {
      if (!canvas || !ctx || NOISE_TILES.length === 0) return;
      const tile = NOISE_TILES[(Math.random() * NOISE_TILES.length) | 0];
      const ox = (Math.random() * TILE_SIZE) | 0;
      const oy = (Math.random() * TILE_SIZE) | 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-ox, -oy);
      const pattern = ctx.createPattern(tile, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width + TILE_SIZE, canvas.height + TILE_SIZE);
      }
      ctx.restore();
    }

    resize();
    render();
    window.addEventListener('resize', resize);

    // 90ms gentle authentic TV noise cycle
    const interval = setInterval(render, 90);

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(interval);
    };
  }, []);

  return <canvas id="grain" ref={canvasRef} aria-hidden="true" />;
}
