import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { soundManager } from '../audio/soundEffects';

export default function HeroSection({ onPlayClick, onWatchTrailer, isSolved }) {
  return (
    <section id="hero" className="minimal-hero-section">
      <div className="hero-grid-layout">
        {/* Left Side: Pure Minimalist Typography */}
        <div className="hero-text-pane">
          <div className="title-group">
            <div className="cyan-vertical-accent" />
            <div className="title-text-col">
              <h1 className="title-arrows">ARROWS</h1>
              <span className="title-puzzle-escape">PUZZLE ESCAPE</span>
            </div>
          </div>

          <p className="hero-tagline">“THINK. MOVE. ESCAPE.”</p>

          <p className="hero-description">
            A minimalist puzzle where every move changes your path.
          </p>

          {/* Action CTAs */}
          <div className="hero-action-row">
            <button
              className="btn-play-glass"
              onClick={onPlayClick}
              onMouseEnter={() => soundManager.playHover()}
            >
              <span>PLAY NOW</span>
            </button>

            <button
              className="link-trailer"
              onClick={onWatchTrailer}
              onMouseEnter={() => soundManager.playHover()}
            >
              <span>WATCH TRAILER</span>
              <ArrowUpRight size={15} className="ml-1 opacity-70" />
            </button>
          </div>

          <div className="hero-interaction-tip">
            <span className="tip-dot" />
            <span>Click any 3D arrow to test rotations and align the escape route.</span>
          </div>

          {/* Solved State Overlay */}
          {isSolved && (
            <div className="puzzle-solved-toast">
              <h2 className="solved-main">PUZZLE SOLVED</h2>
              <span className="solved-sub">PATH CLEARED</span>
            </div>
          )}
        </div>

        {/* Right Side: The 3D Puzzle Board in Canvas3D fills this 55-65% space */}
        <div className="hero-board-spacer" />
      </div>

      <div className="scroll-indicator">
        <span className="scroll-txt">SCROLL</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
