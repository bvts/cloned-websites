'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EXAM_DATA, SLIDES_DATA, EXAM_TARGETS, REDACT, ExamStep } from '@/data/exam';
import { BLEOOD_AUDIO } from '@/data/assets';
import HomeLink from './HomeLink';

interface GamesViewProps {
  active?: boolean;
  onNavigateHome: () => void;
}

export default function GamesView({ active = true, onNavigateHome }: GamesViewProps) {
  const [activeTab, setActiveTab] = useState<'assessment' | 'attention' | 'living'>('assessment');
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [faith, setFaith] = useState(0.5);
  const [killed, setKilled] = useState(0);
  const [activeTarget, setActiveTarget] = useState<{ x: number; y: number; born: number } | null>(null);
  const [isCrtFlash, setIsCrtFlash] = useState(false);
  const [isCrtPanic, setIsCrtPanic] = useState(false);
  const [isCrtStrain, setIsCrtStrain] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const crtRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const faithLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const travelRef = useRef<number>(0);
  const failedRef = useRef<boolean>(false);
  const ambAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentStep: ExamStep = EXAM_DATA[stepIndex] || EXAM_DATA[0];

  // Sound Playback Helpers
  const playSound = useCallback((src: string, vol = 0.35) => {
    try {
      const a = new Audio(src);
      a.volume = vol;
      a.play().catch(() => {});
    } catch {}
  }, []);

  const startAmbient = useCallback(() => {
    try {
      if (!ambAudioRef.current) {
        ambAudioRef.current = new Audio(BLEOOD_AUDIO.kyiAmb);
        ambAudioRef.current.loop = true;
        ambAudioRef.current.volume = 0.11;
      }
      ambAudioRef.current.play().catch(() => {});
    } catch {}
  }, []);

  const stopAmbient = useCallback(() => {
    if (ambAudioRef.current) {
      ambAudioRef.current.pause();
      ambAudioRef.current.currentTime = 0;
    }
  }, []);

  // Text Typewriter Engine
  const startTypewriter = useCallback((text: string) => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setIsTyping(true);
    setShowChoices(false);
    let i = 0;
    setDisplayedText('');
    playSound(BLEOOD_AUDIO.kyiBeep, 0.25);

    typingTimerRef.current = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTyping(false);
        setTimeout(() => setShowChoices(true), 400);
      }
    }, 13);
  }, [playSound]);

  const finishTyping = useCallback(() => {
    if (isTyping && typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      setIsTyping(false);
      let text = currentStep.body || '';
      if (currentStep.q) text += (text ? '\n\n' : '') + currentStep.q;
      setDisplayedText(text);
      setShowChoices(true);
    }
  }, [isTyping, currentStep]);

  // Handle Step Advance
  const goToStep = useCallback((idOrNext?: string) => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setShowChoices(false);
    setSlideIndex(0);

    if (typeof idOrNext === 'string') {
      const idx = EXAM_DATA.findIndex((s) => s.id === idOrNext);
      if (idx !== -1) setStepIndex(idx);
    } else {
      setStepIndex((prev) => Math.min(prev + 1, EXAM_DATA.length - 1));
    }
  }, []);

  // Phase 2 Target Spawner
  const spawnTarget = useCallback(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const TW = isTouch ? 36 : 19;
    const x = 3 + Math.random() * (94 - TW);
    const y = 8 + Math.random() * 60;
    setActiveTarget({ x, y, born: performance.now() });
  }, []);

  // Step state change watcher
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep.glitch) {
      setIsCrtFlash(true);
      setTimeout(() => setIsCrtFlash(false), 300);
    }

    if (currentStep.video) {
      stopAmbient();
      return;
    }

    if (currentStep.slides) {
      return;
    }

    if (currentStep.phase2) {
      // Start Phase 2 Faith Meter
      failedRef.current = false;
      setFaith(0.5);
      setKilled(0);
      lastTimeRef.current = performance.now();
      travelRef.current = 0;
      spawnTarget();
      return;
    }

    let text = currentStep.body || '';
    if (currentStep.q) text += (text ? '\n\n' : '') + currentStep.q;
    if (text) {
      startTypewriter(text);
    } else {
      setDisplayedText('');
      setShowChoices(true);
    }
  }, [stepIndex, isPlaying, currentStep, startTypewriter, stopAmbient, spawnTarget]);

  // Phase 2 Target Kill
  const handleKillTarget = () => {
    playSound(BLEOOD_AUDIO.kyiBeep, 0.4);
    setIsCrtPanic(true);
    setTimeout(() => setIsCrtPanic(false), 240);
    setActiveTarget(null);
    setFaith((prev) => Math.min(1, prev + 0.15));

    setKilled((prev) => {
      const nextKilled = prev + 1;
      if (nextKilled >= EXAM_TARGETS.length) {
        goToStep('laser');
      } else {
        setTimeout(spawnTarget, 700);
      }
      return nextKilled;
    });
  };

  // Phase 2 Game Loop (Faith drain & cursor tracking)
  useEffect(() => {
    if (!isPlaying || !currentStep.phase2) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (lastMousePosRef.current) {
        travelRef.current += Math.hypot(
          e.clientX - lastMousePosRef.current.x,
          e.clientY - lastMousePosRef.current.y
        );
      }
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    function loop(now: number) {
      if (failedRef.current) {
        goToStep('p2fail');
        return;
      }

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Cursor movement faith gain
      const gain = Math.min(travelRef.current * 0.0013, 0.65 * dt);
      travelRef.current = 0;
      const drain = 0.14 * dt;

      setFaith((prev) => {
        const nextFaith = prev + gain - drain;
        if (nextFaith <= 0 || nextFaith >= 1) {
          failedRef.current = true;
        }
        setIsCrtStrain(nextFaith < 0.2 || nextFaith > 0.8);
        return Math.max(0, Math.min(1, nextFaith));
      });

      // Target expiration check (2600ms)
      if (activeTarget && now - activeTarget.born > 2600) {
        setActiveTarget(null);
        setTimeout(spawnTarget, 600);
      }

      faithLoopRef.current = requestAnimationFrame(loop);
    }

    faithLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (faithLoopRef.current) cancelAnimationFrame(faithLoopRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [isPlaying, currentStep.phase2, activeTarget, spawnTarget, goToStep]);

  // Screen Tap for Touch Devices in Phase 2
  const handleScreenTouch = () => {
    if (currentStep.phase2) {
      setFaith((prev) => Math.min(1, prev + 0.075));
    }
  };

  // Keyboard Developer Shortcut (Shift + KeyH)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.shiftKey && e.code === 'KeyH') {
        e.preventDefault();
        finishTyping();
        if (currentStep.slides) {
          goToStep(currentStep.next);
        } else if (currentStep.phase2) {
          goToStep('laser');
        } else if (currentStep.video) {
          goToStep(currentStep.next);
        } else {
          goToStep();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, finishTyping, goToStep]);

  // Restart Examination
  const handleRestart = () => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setIsPlaying(true);
    setStepIndex(0);
    setFaith(0.5);
    setKilled(0);
    startAmbient();
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!crtRef.current) return;
    if (!document.fullscreenElement) {
      crtRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-games" aria-label="Games">
      <div className="frame gamesframe">
        <div className="cabinet">
          {/* Tabs */}
          <div className="tabs" id="tabs">
            <button
              className={activeTab === 'assessment' ? 'on' : ''}
              onClick={() => setActiveTab('assessment')}
            >
              Assessment
            </button>
            <button
              className="struck"
              disabled
              aria-disabled="true"
              tabIndex={-1}
              onClick={() => setActiveTab('attention')}
            >
              Attention
            </button>
            <button
              className="struck"
              disabled
              aria-disabled="true"
              tabIndex={-1}
              onClick={() => setActiveTab('living')}
            >
              living
            </button>
          </div>

          {/* CRT Monitor */}
          <div
            className={`crt ${isCrtFlash ? 'flash' : ''} ${isCrtPanic ? 'panic' : ''} ${isCrtStrain ? 'strain' : ''}`}
            id="crt"
            ref={crtRef}
            onClick={finishTyping}
          >
            <div className="tube" id="tube">
              {/* Playgate */}
              {!isPlaying ? (
                <div className="playgate on">
                  <button
                    type="button"
                    className="pg-play"
                    onClick={() => {
                      setIsPlaying(true);
                      setStepIndex(0);
                      startAmbient();
                    }}
                  >
                    PLAY
                  </button>
                </div>
              ) : null}

              {/* Main CRT Screen */}
              {isPlaying ? (
                <div
                  className={`screen ${currentStep.slides ? 'slides' : ''} ${currentStep.phase2 ? 'hunt' : ''}`}
                  id="screen"
                  onClick={handleScreenTouch}
                >
                  {/* Video Playback */}
                  {currentStep.video ? (
                    <div className="slideshow exam-video">
                      <video
                        src={currentStep.video}
                        autoPlay
                        playsInline
                        onEnded={() => {
                          startAmbient();
                          goToStep(currentStep.next);
                        }}
                      />
                    </div>
                  ) : null}

                  {/* Slideshow */}
                  {currentStep.slides ? (
                    <div className="slideshow">
                      <div
                        className="ss-frame"
                        onClick={() => {
                          playSound(BLEOOD_AUDIO.kyiSlide, 0.35);
                          const slides = SLIDES_DATA[currentStep.slides!];
                          if (slideIndex >= slides.length - 1) {
                            goToStep(currentStep.next);
                          } else {
                            setSlideIndex((prev) => prev + 1);
                          }
                        }}
                      >
                        <img
                          className="ss-a on"
                          src={SLIDES_DATA[currentStep.slides][slideIndex]}
                          alt=""
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Standard Question & Text Display */}
                  {!currentStep.slides && !currentStep.video && !currentStep.phase2 ? (
                    <>
                      {currentStep.meta ? <div className="meta">{currentStep.meta}</div> : null}
                      {currentStep.title ? <div className="title-card">{currentStep.title}</div> : null}

                      <div
                        className={`body ${currentStep.q ? 'question' : ''} arrive`}
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {displayedText.includes(REDACT) ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: displayedText.replace(
                                new RegExp(REDACT + '([.,?!;:]*)', 'g'),
                                '<span class="hold"><span class="redbar" aria-label="redacted"></span>$1</span>'
                              )
                            }}
                          />
                        ) : (
                          displayedText
                        )}
                      </div>

                      {currentStep.photo ? (
                        <div className="qphoto arrive">
                          <img src={currentStep.photo} alt="" />
                        </div>
                      ) : null}

                      {/* Choice Buttons */}
                      {showChoices && currentStep.choices ? (
                        <div className={`choices ${currentStep.pics ? 'pics' : ''}`}>
                          {currentStep.choices.map((c, i) => {
                            const isWarm = ['take examination', 'deny', 'continue', 'begin phase two'].includes(
                              c.label.toLowerCase()
                            );
                            return (
                              <button
                                key={`choice-${i}`}
                                type="button"
                                className={`arrive ${isWarm ? 'warm' : ''} ${c.label === REDACT ? 'redacted' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playSound(BLEOOD_AUDIO.kyiNext, 0.35);
                                  goToStep(c.go);
                                }}
                              >
                                {c.img ? <img src={c.img} alt={c.label} /> : c.label}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  {/* Phase 2 Target */}
                  {currentStep.phase2 && activeTarget ? (
                    <button
                      type="button"
                      className="target"
                      aria-label="target"
                      style={{
                        left: `${activeTarget.x}%`,
                        top: `${activeTarget.y}%`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKillTarget();
                      }}
                    >
                      <img src={EXAM_TARGETS[Math.min(killed, EXAM_TARGETS.length - 1)]} alt="" />
                    </button>
                  ) : null}
                </div>
              ) : null}

              {/* Faith Meter */}
              {isPlaying && (currentStep.phase2 || currentStep.meterPreview) ? (
                <div className={`faith on ${faith < 0.18 || faith > 0.82 ? 'low' : ''}`}>
                  <span className="track">
                    <span className="end l" />
                    <span className="end r" />
                    <span className="tick" style={{ left: `${faith * 100}%` }} />
                  </span>
                  <span className="label">faith</span>
                  <span className="count">{currentStep.phase2 ? `${killed} / ${EXAM_TARGETS.length}` : ''}</span>
                </div>
              ) : null}
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              className={`fs-btn ${isFullscreen ? 'out' : ''}`}
              aria-label="full screen"
              onClick={toggleFullscreen}
            >
              <i />
              <i />
              <i />
              <i />
            </button>
          </div>

          {/* Restart Button */}
          {isPlaying ? (
            <button type="button" className="restart" onClick={handleRestart}>
              RESTART
            </button>
          ) : null}
        </div>

        <HomeLink onNavigate={onNavigateHome} />
      </div>
    </section>
  );
}
