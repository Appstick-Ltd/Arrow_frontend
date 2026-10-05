import React, { useState, useEffect, useRef } from 'react';
import Canvas3D from './components/Canvas3D';
import Typewriter from './components/Typewriter';
import './App.css';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [alignedCount, setAlignedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(26);
  const [statusLabel, setStatusLabel] = useState('ENTRY');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sceneIndex, setSceneIndex] = useState('01');

  const audioCtxRef = useRef(null);
  const cursorRef = useRef(null);

  // Play minimal procedural Web Audio tone
  const playTone = (freq, duration = 0.15, vol = 0.035) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const o = ctx.createOscillator();
      const g = ctx.createGain();

      o.type = 'sine';
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + duration);

      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      o.connect(g);
      g.connect(ctx.destination);

      o.start();
      o.stop(ctx.currentTime + duration);
    } catch {
      // safe fallback
    }
  };

  // Toggle sound
  const handleSoundToggle = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playTone(430, 0.14, 0.045);
    }
  };

  // Track cursor
  useEffect(() => {
    const onPointerMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('pointermove', onPointerMove);

    const onMouseEnterInteractive = () => {
      if (cursorRef.current) cursorRef.current.classList.add('active');
    };
    const onMouseLeaveInteractive = () => {
      if (cursorRef.current) cursorRef.current.classList.remove('active');
    };

    const attachCursorHover = () => {
      document.querySelectorAll('button, a').forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
    attachCursorHover();

    // Scroll updates for HUD & Scroll Meter
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll ? scrollY / maxScroll : 0;
      setScrollProgress(progress);

      const sectionIndex = Math.min(4, Math.floor(progress * 4) + 1);
      setSceneIndex(`0${sectionIndex}`);

      if (progress < 0.22) {
        setStatusLabel('ENTRY');
      } else if (progress < 0.52) {
        setStatusLabel('LEVELS');
      } else if (progress < 0.8) {
        setStatusLabel('SEQUENCE');
      } else {
        setStatusLabel('EXIT');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      document.querySelectorAll('button, a').forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, []);

  const handleTileChange = (aligned, total) => {
    setAlignedCount(aligned);
    setTotalCount(total);
  };

  const handlePlayClick = () => {
    playTone(410, 0.16, 0.04);
    setStatusLabel('ACTIVE PUZZLE');
    const heroEl = document.getElementById('game');
    if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTrailerClick = () => {
    const seqEl = document.getElementById('sequence');
    if (seqEl) seqEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFinalPlayClick = () => {
    const heroEl = document.getElementById('game');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
      setTimeout(handlePlayClick, 700);
    }
  };

  return (
    <div className="app-root">
      {/* 3D WebGL Canvas */}
      <Canvas3D
        onTileChange={handleTileChange}
        soundEnabled={soundEnabled}
        onTone={playTone}
      />

      {/* Atmospheric Overlays */}
      <div className="grain" />
      <div className="scan" />

      {/* HUD System */}
      <div className="hud">
        <div className="rail">
          <div className="system-id">
            <i /> INTERACTIVE PUZZLE / 01
          </div>
          <button
            className="sound"
            id="soundToggle"
            onClick={handleSoundToggle}
            aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
          >
            {soundEnabled ? '◉' : '◌'}
          </button>
        </div>

        <div className="scroll-meter">
          <span id="sceneIndex">{sceneIndex}</span>
          <b id="scrollFill" style={{ height: `${scrollProgress * 100}%` }} />
        </div>

        <div className="status">
          <i />
          <span id="statusLabel">{statusLabel}</span> //{' '}
          <b id="statusCount">
            {alignedCount} / {totalCount} ESCAPED
          </b>
        </div>
      </div>

      {/* Futuristic Cyber Reticle Cursor */}
      <div className="cursor" ref={cursorRef} />

      {/* Solved Overlay State */}
      <div className="solved" aria-live="polite">
        <div>
          <strong>MAZE ESCAPED</strong>
          <small>ALL PATHS CLEARED</small>
        </div>
      </div>

      {/* Main Continuous 3D Flow */}
      <main>
        {/* Section 1: Hero */}
        <section className="hero" id="game" data-label="ENTRY">
          <div className="hero-copy">
            <div className="eyebrow">Escape protocol</div>
            <h1>
              ARROWS <span>Puzzle Escape</span>
            </h1>
            <p className="tagline">
              <Typewriter
                phrases={[
                  'Think. Move. Escape.',
                  'Untangle the labyrinth.',
                  'One move clears the route.',
                  'Master the escape protocol.',
                ]}
                speed={65}
                deleteSpeed={35}
                pauseDuration={2400}
              />
            </p>
            <p className="lede">
              A minimalist puzzle where untangling each winding arrow clears your escape.
            </p>
            <div className="actions">
              <button className="btn" id="playBtn" onClick={handlePlayClick}>
                Play now&nbsp;&nbsp;→
              </button>
              <button className="text-link" id="trailerBtn" onClick={handleTrailerClick}>
                Watch trailer →
              </button>
            </div>
          </div>
          <div className="orbit-guide">
            <span>ESCAPE LABYRINTH / UNTANGLE PROTOCOL</span>
          </div>
          <div className="scroll-cue">
            DESCEND <i />
          </div>
        </section>

        {/* Section 2: Challenge */}
        <section className="challenge" id="challenge" data-label="LEVELS">
          <div className="content right">
            <div className="eyebrow">The challenge</div>
            <h2>
              Every move<br />
              <span className="stroke">matters.</span>
            </h2>
            <p className="body-copy">
              Plan ahead. Follow the path. Find the escape.
            </p>
          </div>
          <div className="level-labels" aria-label="Progressive puzzle levels">
            <span className="level-label">Level 01</span>
            <span className="level-label">Level 02</span>
            <span className="level-label">Level 03</span>
          </div>
        </section>

        {/* Section 3: Sequence */}
        <section className="sequence" id="sequence" data-label="SEQUENCE">
          <div className="sequence-copy">
            <div className="eyebrow">One path. Three decisions.</div>
            <h2>
              <span className="active">Think.</span>
              <span>Move.</span>
              <span>Escape.</span>
            </h2>
            <p className="body-copy">
              Read the possibilities. Rotate the path. Clear the route.
            </p>
          </div>
        </section>

        {/* Section 4: Final */}
        <section className="final" id="play" data-label="EXIT">
          <div className="content center">
            <div className="eyebrow">Path available</div>
            <h2>
              Ready to<br />
              <span className="stroke">escape?</span>
            </h2>
            <p className="body-copy">
              Every way out begins with one precise move.
            </p>
            <button className="btn" id="finalPlay" onClick={handleFinalPlayClick}>
              Play arrows&nbsp;&nbsp;→
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
