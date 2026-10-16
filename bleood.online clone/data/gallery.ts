export interface GalleryPiece {
  t: 'h' | 'v' | 'a';
  src: string;
  alt: string;
  x: string;
  y: string;
  w: string;
  r: string;
  dx: string;
  dy: string;
  dur: string;
  delay: string;
  swing: string;
}

export const GALLERY_PIECES: GalleryPiece[] = [
  { t: 'h', src: '/assets/gal_wall.webp', alt: 'Backstage, the sticker wall', x: '1%', y: '4%', w: '37%', r: '-1.4deg', dx: '-4px', dy: '-5px', dur: '11s', delay: '0s', swing: '-0.6deg' },
  { t: 'v', src: '/assets/gal_tycho1.webp', alt: 'Portrait', x: '41%', y: '0%', w: '19%', r: '1.4deg', dx: '7px', dy: '-8px', dur: '13.4s', delay: '-1.7s', swing: '1deg' },
  { t: 'h', src: '/assets/gal_blue.webp', alt: 'Backstage, the blue door', x: '62%', y: '5%', w: '37%', r: '1.6deg', dx: '-10px', dy: '-11px', dur: '15.8s', delay: '-3.4s', swing: '-1.4deg' },
  { t: 'a', src: '/assets/gal_gyg.webp', alt: 'GYG cover', x: '7%', y: '52%', w: '28%', r: '-2.2deg', dx: '4px', dy: '-14px', dur: '18.2s', delay: '-5.1s', swing: '0.6deg' },
  { t: 'v', src: '/assets/gal_tycho2.webp', alt: 'Portrait', x: '41%', y: '49%', w: '19%', r: '-2deg', dx: '-7px', dy: '-5px', dur: '11s', delay: '-6.8s', swing: '-1deg' },
  { t: 'a', src: '/assets/gal_scrap.webp', alt: 'Scrap design', x: '65%', y: '53%', w: '28%', r: '1.8deg', dx: '10px', dy: '-8px', dur: '13.4s', delay: '-8.5s', swing: '1.4deg' }
];
