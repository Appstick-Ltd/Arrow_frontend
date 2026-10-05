import React from 'react';
import { soundManager } from '../audio/soundEffects';

export default function FinalSection({ onPlayClick }) {
  return (
    <section id="final" className="minimal-section section-final">
      <div className="final-center-box">
        <h2 className="final-prompt">READY TO ESCAPE?</h2>

        <button
          className="btn-play-monolith-minimal"
          onClick={onPlayClick}
          onMouseEnter={() => soundManager.playHover()}
        >
          <span>PLAY ARROWS</span>
        </button>

        <span className="final-specs">AVAILABLE FOR IOS & ANDROID</span>
      </div>

      <footer className="minimal-footer">
        <span className="footer-title">ARROWS — PUZZLE ESCAPE</span>
        <span className="footer-copyright">© {new Date().getFullYear()} ALL RIGHTS RESERVED.</span>
      </footer>
    </section>
  );
}
