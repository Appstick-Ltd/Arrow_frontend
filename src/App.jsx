import React, { useState, useEffect, useRef } from 'react';
import Canvas3D from './components/Canvas3D';
import Typewriter from './components/Typewriter';
import DownloadModal from './components/DownloadModal';
import InfoModal from './components/InfoModal';
import './App.css';

export const TAB_ROUTES = {
  about: {
    path: '/about-us',
    title: 'ARROWS — About Appstick.',
    aliases: ['/about-us', '/about', '#about-us', '#about']
  },
  privacy: {
    path: '/privacy-policy',
    title: 'ARROWS — Privacy Policy | Appstick',
    aliases: ['/privacy-policy', '/privacy', '#privacy-policy', '#privacy']
  },
  terms: {
    path: '/terms-conditions',
    title: 'ARROWS — Terms & Conditions | Appstick',
    aliases: ['/terms-conditions', '/terms', '#terms-conditions', '#terms']
  }
};

export const getTabFromLocation = () => {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const hash = window.location.hash.toLowerCase();

  for (const [tabKey, config] of Object.entries(TAB_ROUTES)) {
    if (config.aliases.includes(path) || config.aliases.includes(hash)) {
      return tabKey;
    }
  }
  return null;
};

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [alignedCount, setAlignedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(9);
  const [statusLabel, setStatusLabel] = useState('ENTRY');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sceneIndex, setSceneIndex] = useState('01');
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoTab, setInfoTab] = useState('about');

  const audioCtxRef = useRef(null);
  const cursorRef = useRef(null);

  // Synchronize modal state with URL on initial load, refresh, and popstate
  useEffect(() => {
    const handleUrlChange = () => {
      const tab = getTabFromLocation();
      if (tab) {
        setInfoTab(tab);
        setInfoOpen(true);
        document.title = TAB_ROUTES[tab].title;
      } else {
        setInfoOpen(false);
        document.title = 'ARROWS — Puzzle Escape';
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

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
    // Track cursor position and interaction state across entire DOM (including modals)
    const onPointerMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        cursorRef.current.style.opacity = '1';
      }
    };
    window.addEventListener('pointermove', onPointerMove);

    const onPointerOver = (e) => {
      const isInteractive = e.target && e.target.closest && e.target.closest(
        'button, a, input, select, textarea, .info-tab-btn, .contact-card, .store-card, .product-chip, .legal-card, .stat-card, [role="button"]'
      );
      if (cursorRef.current) {
        if (isInteractive) {
          cursorRef.current.classList.add('active');
        } else {
          cursorRef.current.classList.remove('active');
        }
      }
    };
    window.addEventListener('pointerover', onPointerOver);

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
      window.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleTileChange = (aligned, total) => {
    setAlignedCount(aligned);
    setTotalCount(total);
  };

  const handlePlayClick = () => {
    playTone(410, 0.16, 0.04);
    setDownloadOpen(true);
  };

  const handleTrailerClick = () => {
    const seqEl = document.getElementById('sequence');
    if (seqEl) seqEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFinalPlayClick = () => {
    playTone(410, 0.16, 0.04);
    setDownloadOpen(true);
  };

  const openInfo = (tab = 'about', updateHistory = true) => {
    playTone(540, 0.12, 0.035);
    setInfoTab(tab);
    setInfoOpen(true);
    const route = TAB_ROUTES[tab];
    if (route) {
      document.title = route.title;
      if (updateHistory && window.location.pathname !== route.path) {
        window.history.pushState({ modal: tab }, '', route.path);
      }
    }
  };

  const closeInfo = (updateHistory = true) => {
    setInfoOpen(false);
    document.title = 'ARROWS — Puzzle Escape';
    if (updateHistory && getTabFromLocation()) {
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <div className="app-root">
      {/* Download Modal Dialog */}
      <DownloadModal
        isOpen={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        onTone={playTone}
      />

      {/* Info & Legal Modal Dialog (About Us, Privacy Policy, Terms) */}
      <InfoModal
        isOpen={infoOpen}
        initialTab={infoTab}
        onTabChange={(tab) => openInfo(tab, true)}
        onClose={() => closeInfo(true)}
        onTone={playTone}
      />

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
          <div className="rail-nav-links">
            <button className="rail-link-btn" onClick={() => openInfo('about')}>
              About Us
            </button>
            <button className="rail-link-btn" onClick={() => openInfo('privacy')}>
              Privacy Policy
            </button>
            <button className="rail-link-btn" onClick={() => openInfo('terms')}>
              Terms & Conditions
            </button>
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

        <div className={`status ${scrollProgress > 0.85 ? 'status-hidden' : ''}`}>
          <i />
          <span id="statusLabel">{statusLabel}</span> //{' '}
          <b id="statusCount">
            {alignedCount} / {totalCount} ALIGNED
          </b>
        </div>
      </div>

      {/* Futuristic Cyber Reticle Cursor */}
      <div className="cursor" ref={cursorRef} />

      {/* Solved Overlay State */}
      <div className="solved" aria-live="polite">
        <div>
          <strong>PUZZLE SOLVED</strong>
          <small>PATH CLEARED</small>
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
              <Typewriter />
            </p>
            <p className="lede">
              A minimalist puzzle where every move changes your path.
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
            <span>3D MOBILE DISPLAY / UNTANGLE</span>
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

        {/* Footer Legal Bar */}
        <footer className="footer-legal-bar">
          <div className="footer-copy-text">
            © {new Date().getFullYear()} <strong>Appstick Ltd.</strong> • All rights reserved. Crafting next-gen interactive digital experiences.
          </div>
          <div className="footer-legal-buttons">
            <button className="footer-legal-btn" onClick={() => openInfo('about')}>
              About Appstick
            </button>
            <button className="footer-legal-btn" onClick={() => openInfo('privacy')}>
              Privacy Policy
            </button>
            <button className="footer-legal-btn" onClick={() => openInfo('terms')}>
              Terms & Conditions
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

