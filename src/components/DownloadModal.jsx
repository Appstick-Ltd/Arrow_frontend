import React, { useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Star, Radio, Zap } from 'lucide-react';

export default function DownloadModal({ isOpen, onClose, onTone }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    if (onTone) onTone(520, 0.16, 0.04);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onTone]);

  if (!isOpen) return null;

  return (
    <div className="cyber-modal-overlay" onClick={onClose}>
      <div className="cyber-terminal-frame download-frame-compact" onClick={(e) => e.stopPropagation()}>
        {/* Holographic Scanline & Grid Effect */}
        <div className="cyber-scanlines" />
        <div className="cyber-grid-mesh" />
        <div className="cyber-laser-beam" />

        {/* 4 Corner Tech Reticle Accents */}
        <div className="corner-bracket corner-tl" />
        <div className="corner-bracket corner-tr" />
        <div className="corner-bracket corner-bl" />
        <div className="corner-bracket corner-br" />

        {/* Top Sci-Fi Header */}
        <div className="cyber-terminal-header">
          <div className="header-status-group">
            <div className="live-radar-dot">
              <span className="dot-ping" />
              <span className="dot-core" />
            </div>
            <div className="sys-telemetry">
              <span className="sys-main">ARROWS MOBILE DEPLOYMENT // APPSTORE & PLAYSTORE</span>
              <span className="sys-sub">BUILD: v2.6.4 • ENGINE: WEBGL_CORE • TARGET: iOS & ANDROID</span>
            </div>
          </div>

          <button
            className="cyber-close-btn"
            onClick={() => {
              if (onTone) onTone(320, 0.1, 0.03);
              onClose();
            }}
            aria-label="Close terminal"
          >
            <span className="btn-bracket">[</span>
            <X size={15} />
            <span className="close-text">ESC</span>
            <span className="btn-bracket">]</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="cyber-terminal-body">
          {/* Game Banner Box */}
          <div className="cyber-game-banner">
            <div className="game-hologram-avatar">
              <span className="game-arrow-symbol">➤</span>
              <div className="avatar-pulse-ring" />
            </div>
            <div className="game-details">
              <div className="tag-badges-strip">
                <span className="neon-badge-cyan">STUDIO: APPSTICK</span>
                <span className="neon-badge-magenta">GEOMETRIC PUZZLE</span>
              </div>
              <h3 className="game-title-cyber">ARROWS: Puzzle Escape</h3>
              <p className="game-subtitle-cyber">Authentic Untangling Spatial Labyrinth by Appstick Ltd.</p>

              <div className="rating-telemetry-row">
                <div className="stars-cluster">
                  <Star size={13} className="star-cyber-filled" />
                  <Star size={13} className="star-cyber-filled" />
                  <Star size={13} className="star-cyber-filled" />
                  <Star size={13} className="star-cyber-filled" />
                  <Star size={13} className="star-cyber-filled" />
                </div>
                <span className="rating-num">4.9 / 5.0</span>
                <span className="review-meta">(12.4K Verified Player Logs)</span>
              </div>
            </div>
          </div>

          {/* Download Platforms Grid */}
          <div className="store-platforms-matrix">
            {/* Google Play Store */}
            <a
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-store-card store-playstore"
              onClick={() => onTone && onTone(660, 0.12, 0.04)}
            >
              <div className="store-logo-icon">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.128 2.128 0 0 1-.61-.318c-.282-.224-.447-.57-.447-.94V3.072c0-.37.165-.716.447-.94.186-.148.4-.258.61-.318zm11.305 11.308l2.259 2.259-11.83 6.83 9.571-9.089zm0-2.244L5.344 1.789l11.83 6.83-2.26 2.259zm1.536 1.122l4.137 2.388c.84.485.84 1.275 0 1.76l-4.137 2.388-2.022-2.022 2.022-2.514z" />
                </svg>
              </div>
              <div className="store-text-group">
                <span className="store-action-tag">GET IT ON</span>
                <strong className="store-brand-name">Google Play</strong>
                <span className="store-ver-meta">Android 9.0+ • 60 FPS Optimized</span>
              </div>
              <ExternalLink size={18} className="store-redirect-arrow" />
            </a>

            {/* Apple App Store */}
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-store-card store-appstore"
              onClick={() => onTone && onTone(720, 0.12, 0.04)}
            >
              <div className="store-logo-icon">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 7.07c.61-.75 1.04-1.8 1.01-2.87-.93.04-2.02.63-2.66 1.38-.56.65-1.06 1.71-1.01 2.76 1.04.08 2.05-.52 2.66-1.27z" />
                </svg>
              </div>
              <div className="store-text-group">
                <span className="store-action-tag">DOWNLOAD ON THE</span>
                <strong className="store-brand-name">App Store</strong>
                <span className="store-ver-meta">iOS 14.0+ • ProMotion 120Hz Support</span>
              </div>
              <ExternalLink size={18} className="store-redirect-arrow" />
            </a>
          </div>
        </div>

        {/* Sci-Fi Footer */}
        <div className="cyber-terminal-footer">
          <div className="footer-telemetry-tag">
            <ShieldCheck size={14} className="text-green" />
            <span>100% FREE • AD-SUPPORTED • NO IN-APP PURCHASES</span>
          </div>

          <button
            className="cyber-action-btn"
            onClick={() => {
              if (onTone) onTone(320, 0.1, 0.03);
              onClose();
            }}
          >
            <span className="btn-bracket">[</span>
            <span>DISMISS</span>
            <span className="btn-bracket">]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
