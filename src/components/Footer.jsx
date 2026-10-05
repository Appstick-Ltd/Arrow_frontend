import React from 'react';
import { ArrowUp, Terminal, Shield, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundEffects';

export default function Footer() {
  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-container">
      {/* Subtle top laser separator */}
      <div className="footer-laser-line" />

      <div className="footer-inner">
        {/* Brand & Slogan */}
        <div className="footer-brand-col">
          <div className="footer-logo">
            <span className="footer-title">ARROWS</span>
            <span className="footer-sub">PUZZLE ESCAPE</span>
          </div>
          <p className="footer-slogan">“Think. Move. Escape.”</p>
          <div className="footer-build-tag">
            <Terminal size={12} className="text-cyan-400 mr-1.5" />
            <span>CORE ENGINE V2.4.9 // PROTOCOL ESCAPE</span>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="footer-links-grid">
          <div className="footer-links-col">
            <span className="footer-heading">NAVIGATION</span>
            <a href="#hero" onClick={() => soundManager.playHover()}>
              Game
            </a>
            <a href="#challenge" onClick={() => soundManager.playHover()}>
              The Challenge
            </a>
            <a href="#how-to-play" onClick={() => soundManager.playHover()}>
              How to Play
            </a>
            <a href="#features" onClick={() => soundManager.playHover()}>
              Features
            </a>
          </div>

          <div className="footer-links-col">
            <span className="footer-heading">SYSTEM</span>
            <a href="#final-cta" onClick={() => soundManager.playHover()}>
              Mobile Apps
            </a>
            <a href="#showcase" onClick={() => soundManager.playHover()}>
              Vector Lab
            </a>
            <a href="#world" onClick={() => soundManager.playHover()}>
              Void World
            </a>
          </div>

          <div className="footer-links-col">
            <span className="footer-heading">LEGAL & SPECS</span>
            <a href="#" onClick={(e) => { e.preventDefault(); soundManager.playHover(); }}>
              Privacy Policy
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); soundManager.playHover(); }}>
              Terms of Protocol
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); soundManager.playHover(); }}>
              Contact Signals
            </a>
          </div>
        </div>

        {/* Back To Top Action */}
        <div className="footer-back-col">
          <button
            className="btn-back-top"
            onClick={scrollToTop}
            onMouseEnter={() => soundManager.playHover()}
            title="Return to Vector Apex"
          >
            <ArrowUp size={18} className="text-cyan-400" />
            <span className="back-top-label">RETURN TO APEX</span>
          </button>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>© {new Date().getFullYear()} ARROWS STUDIOS. ALL VECTOR PROTOCOLS RESERVED.</span>
        <span>ENGINEERED FOR MINIMALIST SPATIAL MASTERY.</span>
      </div>
    </footer>
  );
}
