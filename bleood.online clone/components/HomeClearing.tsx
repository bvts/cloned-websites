'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface HomeClearingProps {
  active?: boolean;
  onNavigate: (route: string) => void;
  candleStates: boolean[];
  onToggleCandle: (index: number) => void;
}

const PAGES = [
  { id: 'music', title: 'Music' },
  { id: 'gallery', title: 'Gallery' },
  { id: 'tour', title: 'Tour' },
  { id: 'notes', title: 'Notes' },
  { id: 'shop', title: 'Shop' }
];

const BACK_CANDLE = 2;

export default function HomeClearing({ active = true, onNavigate, candleStates, onToggleCandle }: HomeClearingProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const darkRef = useRef<HTMLDivElement | null>(null);
  const stageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 625, isPortrait: false });

  // Update lighting mask
  const paintDark = useCallback(() => {
    if (!darkRef.current || !sceneRef.current) return;
    const activeCandles = candleStates.filter((_, i) => i !== BACK_CANDLE);
    const lit = activeCandles.filter(Boolean).length;
    const n = activeCandles.length;

    const darkOpacity = (0.12 + 0.62 * (1 - lit / n)).toFixed(2);
    darkRef.current.style.opacity = darkOpacity;
    document.body.style.setProperty('--night', (0.72 * (1 - lit / n)).toFixed(2));

    const holes: string[] = [];
    const nPages = PAGES.length;
    const portrait = dimensions.isPortrait;
    const cx = 50, cy = portrait ? 64 : 66;
    const rx = portrait ? 34 : 31, ry = portrait ? 23 : 22;

    PAGES.forEach((_, i) => {
      if (i === BACK_CANDLE || !candleStates[i]) return;
      const ca = Math.PI / 2 + (nPages % 2 === 0 ? Math.PI / nPages : 0) + ((i + 0.5) / nPages) * Math.PI * 2;
      const cx2 = cx + Math.cos(ca) * rx * 1.1;
      const cy2 = cy + Math.sin(ca) * ry * 1.1;
      const yOffset = cy2 + 1 - 5 * Math.abs(Math.cos(ca)) - 3;
      const x = ((cx2 + 8) / 116) * 100;
      const y = ((yOffset + 14) / 136) * 100;
      holes.push(`radial-gradient(ellipse 22% 18% at ${x.toFixed(1)}% ${y.toFixed(1)}%, transparent 0%, rgba(0,0,0,.35) 45%, #000 100%)`);
    });

    holes.push(
      'linear-gradient(to bottom, transparent 0%, #000 12%, #000 72%, transparent 100%)',
      'linear-gradient(to right, transparent 0%, #000 9%, #000 91%, transparent 100%)'
    );
    const mask = holes.join(',');
    darkRef.current.style.webkitMaskImage = mask;
    darkRef.current.style.maskImage = mask;
  }, [candleStates, dimensions]);

  // Handle window resizing & scene dimension updates
  useEffect(() => {
    function updateDimensions() {
      if (!sceneRef.current) return;
      const w = sceneRef.current.clientWidth;
      const h = sceneRef.current.clientHeight;
      setDimensions({ w, h, isPortrait: w / h < 1 });
    }
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    paintDark();
  }, [paintDark]);

  const candleStatesRef = useRef(candleStates);
  candleStatesRef.current = candleStates;

  // 3D Figure Stage Engine
  useEffect(() => {
    const canvas = stageCanvasRef.current;
    const host = sceneRef.current;
    if (!canvas || !host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene3D = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    // Balanced lighting calibrated between moody shadows and clear visibility
    const hemiLight = new THREE.HemisphereLight(0xc0c8db, 0x222222, 0.58);
    scene3D.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene3D.add(ambientLight);

    const frontKey = new THREE.DirectionalLight(0xffffff, 0.88);
    frontKey.position.set(0, 1.2, 5.0);
    scene3D.add(frontKey);

    const backLight = new THREE.DirectionalLight(0xffffff, 2.2);
    backLight.position.set(-0.6, 3.2, -4);
    scene3D.add(backLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(2.6, 1.2, -2.2);
    scene3D.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.52);
    fillLight.position.set(0.8, 1, 3.2);
    scene3D.add(fillLight);

    const group = new THREE.Group();
    scene3D.add(group);
    let figureWidth = 1;
    const BASE_Y = 0.46;

    const armBones: THREE.Bone[] = [];
    const boneByName: Record<string, THREE.Bone> = {};

    // Helper: load and convert textures to grayscale with sRGB color space
    function loadGrayscaleTexture(src: string): Promise<THREE.CanvasTexture | null> {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d');
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0);
          try {
            const id = ctx.getImageData(0, 0, c.width, c.height);
            const d = id.data;
            for (let i = 0; i < d.length; i += 4) {
              const l = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2];
              d[i] = d[i + 1] = d[i + 2] = l;
            }
            ctx.putImageData(id, 0, 0);
          } catch {}
          const tx = new THREE.CanvasTexture(c);
          tx.flipY = false;
          tx.colorSpace = THREE.SRGBColorSpace;
          resolve(tx);
        };
        img.onerror = () => resolve(null);
        img.src = src;
      });
    }

    const FIGURE_TEX_MAP: Record<string, string> = {
      bow: '/assets/girl_bow.jpg',
      eyes: '/assets/girl_eyes.jpg',
      wingshield: '/assets/girl_wingshield.jpg',
      eggs: '/assets/girl_eggs.jpg',
      hair: '/assets/girl_hair.webp',
      lower: '/assets/girl_lower.jpg',
      upper: '/assets/girl_upper.jpg'
    };

    const loader = new GLTFLoader();

    loader.load(
      '/assets/figure.glb',
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const mid = box.getCenter(new THREE.Vector3());
        const fit = 1.15 / Math.max(size.y, 0.001);
        model.scale.setScalar(fit);
        figureWidth = size.x * fit;
        model.position.sub(mid.multiplyScalar(fit));
        group.add(model);
        group.position.y = BASE_Y;
        group.rotation.set(0, 0, 0);

        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            (o as THREE.Mesh).frustumCulled = false;
            const mat = (o as THREE.Mesh).material;
            if (mat) {
              if (Array.isArray(mat)) {
                mat.forEach((m) => {
                  m.side = THREE.DoubleSide;
                });
              } else {
                mat.side = THREE.DoubleSide;
              }
            }
          }
          if ((o as THREE.Bone).isBone) {
            boneByName[o.name] = o as THREE.Bone;
            if (/^bone_(upperarm|forearm|hand)_/.test(o.name)) {
              armBones.push(o as THREE.Bone);
            }
          }
        });

        // Load & bind materials
        const texNames = Object.keys(FIGURE_TEX_MAP);
        Promise.all(texNames.map((n) => loadGrayscaleTexture(FIGURE_TEX_MAP[n]))).then((loadedMaps) => {
          const mapByName: Record<string, THREE.CanvasTexture | null> = {};
          texNames.forEach((n, i) => {
            mapByName[n] = loadedMaps[i];
          });
          model.traverse((o) => {
            if ((o as THREE.Mesh).isMesh) {
              const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
              if (m && mapByName[m.name]) {
                m.map = mapByName[m.name];
                if (m.name === 'hair') {
                  m.alphaTest = 0.5;
                  m.transparent = false;
                }
                m.color.setHex(0xffffff);
                m.roughness = 0.58;
                m.metalness = 0.03;
                m.needsUpdate = true;
              }
            }
          });
        });

        const stageWrap = document.getElementById('stageWrap');
        if (stageWrap) stageWrap.classList.add('lit');
        const shade = document.getElementById('shade');
        if (shade) shade.classList.add('lit');

        resizeStage();
      },
      undefined,
      (err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn('3D Figure loading note:', msg);
      }
    );

    // Animation state machine variables
    let sleep = 1.0; // 1.0 = Resting, 0.0 = Hovering
    let entranceOffset = 0.45; // State 1: smooth entrance descent from +0.45
    let headYaw = 0;
    let headPitch = 0;
    let yaw = 0;
    let animId: number;
    let t = 0;
    let lastTime = performance.now();

    const pointer = { cx: 0, cy: 0, moved: false };
    const onPointerMove = (e: PointerEvent) => {
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.moved = true;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const ease = (v: number) => v * v * (3 - 2 * v);

    function render3D() {
      animId = requestAnimationFrame(render3D);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      t += dt;

      if (group.children.length > 0) {
        // Target state driven by authoritative candle count (excluding BACK_CANDLE)
        const curCandles = candleStatesRef.current.filter((_, i) => i !== BACK_CANDLE);
        const litCount = curCandles.filter(Boolean).length;
        const wantSleep = litCount === 0 ? 1 : 0;

        // Continuous exponential state blending (handles reversals seamlessly)
        sleep += (wantSleep - sleep) * (1 - Math.exp(-dt * 0.95));
        if (Math.abs(wantSleep - sleep) < 0.001) sleep = wantSleep;

        // State 1: One-time entrance descent
        if (entranceOffset > 0.001) {
          entranceOffset += (0 - entranceOffset) * (1 - Math.exp(-dt * 0.9));
          if (entranceOffset < 0.001) entranceOffset = 0;
        }

        const eA = ease(clamp(sleep / 0.7, 0, 1));
        const eH = ease(clamp((sleep - 0.3) / 0.7, 0, 1));

        // Cursor leaning & tracking
        let lean = 0;
        if (pointer.moved && host) {
          const r = host.getBoundingClientRect();
          lean = clamp((pointer.cx - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
        }
        yaw += (lean * (1 - eA) * 0.14 - yaw) * clamp(dt * 2.2, 0, 1);

        const tall = camera.aspect < 1;
        const FWD = tall ? 0.2 : 0;
        const bob = (Math.sin(t * 0.9) * 0.08 + Math.sin(t * 2.3) * 0.012) * (tall ? 0.5 : 1) * (1 - eH);

        group.rotation.y = yaw;
        group.rotation.z = Math.sin(t * 0.6) * 0.035 * (1 - eH);
        group.position.x = yaw * 0.12;

        const restY = -0.48 - FWD + 0.575 * group.scale.y + 0.02;
        const floatY = (tall ? restY - 0.02 + 0.13 : BASE_Y) + bob;
        group.position.y = floatY * (1 - eH) + restY * eH + Math.sin(t * 0.7) * 0.006 * eH + entranceOffset;

        // Arm bones skeletal animation
        armBones.forEach((bn) => {
          const m = bn.name.match(/^bone_(upperarm|forearm|hand)_(upper|mid)_(L|R)$/);
          if (!m) return;
          const kind = m[1];
          const midKind = m[2];
          const side = m[3];
          const lag = kind === 'upperarm' ? 0 : kind === 'forearm' ? 0.7 : 1.4;
          const amp = kind === 'upperarm' ? 0.085 : kind === 'forearm' ? 0.22 : 0.25;
          const off = midKind === 'mid' ? 1.6 : 0;
          const sg = side === 'L' ? 1 : -1;

          const awakeZ = sg * amp * Math.sin(t * 0.9 + off - lag);
          const awakeX = (kind === 'upperarm' ? 0.02 : kind === 'forearm' ? 0.07 : 0.1) * Math.sin(t * 0.7 + off - lag + 1.2);
          const down = kind === 'upperarm' ? (midKind === 'upper' ? -2.3 : -1.6) : (kind === 'forearm' ? -0.22 : -0.28);
          const asleepZ = sg * (down + 0.012 * Math.sin(t * 0.7 + lag));

          bn.rotation.z = awakeZ * (1 - eA) + asleepZ * eA;
          bn.rotation.x = awakeX * (1 - eA);
        });

        // Wings, neck, and head posture
        const wl = boneByName.bone_wing_L;
        const wr = boneByName.bone_wing_R;
        const hd = boneByName.bone_head;
        const nk = boneByName.bone_neck;

        if (wl) {
          wl.rotation.z = (0.095 * Math.sin(t * 0.75) + 0.03 * Math.sin(t * 1.9)) * (1 - eA) - 0.35 * eA;
          wl.rotation.x = 0.025 * Math.sin(t * 0.6 + 0.8) * (1 - eA);
        }
        if (wr) {
          wr.rotation.z = (-0.095 * Math.sin(t * 0.75 + 0.5) - 0.03 * Math.sin(t * 1.7)) * (1 - eA) + 0.35 * eA;
          wr.rotation.x = 0.025 * Math.sin(t * 0.6 + 1.4) * (1 - eA);
        }

        let tx = 0, ty = 0;
        if (pointer.moved && host) {
          const r = host.getBoundingClientRect();
          tx = clamp((pointer.cx - (r.left + r.width / 2)) / (window.innerWidth * 0.5), -1, 1);
          ty = clamp((pointer.cy - (r.top + r.height * 0.3)) / (window.innerHeight * 0.5), -1, 1);
        }
        headYaw += (tx * (1 - eA) - headYaw) * clamp(dt * 2.4, 0, 1);
        headPitch += (ty * (1 - eA) - headPitch) * clamp(dt * 2.4, 0, 1);

        if (nk) {
          nk.rotation.x = (0.015 * Math.sin(t * 0.45) + headPitch * 0.05) * (1 - eA) + 0.35 * eA;
          nk.rotation.y = headYaw * 0.1;
        }
        if (hd) {
          hd.rotation.x = (0.025 * Math.sin(t * 0.45 - 0.6) + headPitch * 0.13) * (1 - eA) + 0.6 * eA;
          hd.rotation.y = headYaw * 0.24;
          hd.rotation.z = (0.02 * Math.sin(t * 0.31) - headYaw * 0.03) * (1 - eA) + 0.12 * eA;
        }

        // Shade scaling and opacity
        const shadeEl = document.getElementById('shade');
        if (shadeEl) {
          shadeEl.style.top = (64 + FWD / (2 * 6 * Math.tan(16 * Math.PI / 180)) * 100).toFixed(2) + '%';
          const k = (1 - bob * 1.8) * (1 + 0.18 * eH);
          shadeEl.style.transform = `translate(-50%,-50%) scale(${k.toFixed(3)})`;
          shadeEl.style.opacity = Math.min(1, 0.55 + (1 - (1 - bob * 1.8)) * -1.2 + 0.45 + 0.3 * eH).toFixed(2);
        }
      }

      renderer.render(scene3D, camera);
    }
    render3D();

    function resizeStage() {
      if (!host || !canvas) return;
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (group.children.length > 0) {
        const viewW = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
        group.scale.setScalar(Math.min(1, (viewW * 0.86) / Math.max(figureWidth, 0.001)));
      }
    }
    resizeStage();
    window.addEventListener('resize', resizeStage);

    // Glow interaction on figure hover
    const hitEl = document.getElementById('figureHit');
    const stageWrapEl = document.getElementById('stageWrap');
    const onEnter = () => stageWrapEl?.classList.add('hot');
    const onLeave = () => stageWrapEl?.classList.remove('hot');
    hitEl?.addEventListener('mouseenter', onEnter);
    hitEl?.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resizeStage);
      hitEl?.removeEventListener('mouseenter', onEnter);
      hitEl?.removeEventListener('mouseleave', onLeave);
      renderer.dispose();
    };
  }, []);

  const n = PAGES.length;
  const portrait = dimensions.isPortrait;
  const cx = 50, cy = portrait ? 64 : 66;
  const rx = portrait ? 34 : 31, ry = portrait ? 23 : 22;
  const w = dimensions.w;

  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-home" aria-label="Home">
      <div className="frame">
        <div className="scene" id="scene" ref={sceneRef}>
          {/* Dynamic Night Mask */}
          <div id="dark" ref={darkRef} aria-hidden="true" />

          {/* Central Figure Shadow & Stage */}
          <div id="shade" className="lit" aria-hidden="true" />
          <div id="stageWrap" className="lit">
            <canvas id="stage" ref={stageCanvasRef} aria-hidden="true" />
          </div>

          {/* Figure Clickable Hit Target */}
          <a
            className="figure-hit"
            id="figureHit"
            href="#games"
            aria-label="Games"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('games');
            }}
          />

          {/* Status accessibility message */}
          <div id="status" role="status" />

          {/* Candles */}
          {PAGES.map((_, i) => {
            if (i === BACK_CANDLE) return null;
            const ca = Math.PI / 2 + (n % 2 === 0 ? Math.PI / n : 0) + ((i + 0.5) / n) * Math.PI * 2;
            const cx2 = cx + Math.cos(ca) * rx * 1.1;
            const cy2 = cy + Math.sin(ca) * ry * 1.1;
            const cdepth = (Math.sin(ca) + 1) / 2;
            const topPercent = cy2 + 1 - 5 * Math.abs(Math.cos(ca));
            const candleWidth = Math.max(8, (portrait ? w * 0.03 : w * 0.015) * (0.7 + cdepth * 0.5));
            const isLit = candleStates[i];

            return (
              <button
                key={`candle-${i}`}
                type="button"
                className={`candle ${isLit ? 'lit' : ''}`}
                aria-label={`candle ${i + 1}`}
                style={{
                  left: `${cx2}%`,
                  top: `${topPercent}%`,
                  zIndex: 3 + Math.round(cdepth * 10),
                  ['--cw' as string]: `${candleWidth}px`
                }}
                onClick={() => onToggleCandle(i)}
              >
                <span className="glow" />
                <span className="flame" />
                <span className="wick" />
                <span className="stick" />
              </button>
            );
          })}

          {/* Flower Navigation Links */}
          {PAGES.map((p, i) => {
            const a = Math.PI / 2 + (n % 2 === 0 ? Math.PI / n : 0) + (i / n) * Math.PI * 2;
            const x = cx + Math.cos(a) * rx;
            const y = cy + Math.sin(a) * ry;
            const depth = (Math.sin(a) + 1) / 2;
            const base = portrait ? w * 0.27 : w * 0.145;
            const size = Math.max(64, base * (0.72 + depth * 0.45));
            const rot = (i * 47) % 36 - 18;
            const delay = -i * 1.3;

            return (
              <a
                key={`flower-${p.id}`}
                className="flower"
                href={`#${p.id}`}
                aria-label={p.title}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  zIndex: 2 + Math.round(depth * 10),
                  ['--s' as string]: `${size}px`,
                  ['--r' as string]: `${rot}deg`,
                  ['--d' as string]: `${delay}s`
                }}
                onClick={(e) => {
                  const isTouch = !window.matchMedia('(hover:hover) and (pointer:fine)').matches;
                  if (isTouch) {
                    e.preventDefault();
                    const target = e.currentTarget;
                    target.classList.add('sprout');
                    setTimeout(() => {
                      target.classList.remove('sprout');
                      onNavigate(p.id);
                    }, 350);
                  } else {
                    e.preventDefault();
                    onNavigate(p.id);
                  }
                }}
              >
                <svg className="stem" viewBox="0 0 20 120" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M10 120 C 5 96, 15 70, 10 44 S 9 14, 10 0" />
                  <path className="leaf" d="M11 78 C 15 70, 20 69, 19 64 C 15 65, 11 70, 11 78 Z" />
                </svg>
                <span className="bloom">
                  <img src="/assets/flower.webp" alt="" />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
