import React, { useEffect } from 'react';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';

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
    <div className="clean-modal-backdrop" onClick={onClose}>
      <div className="clean-modal-card clean-download-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="clean-modal-header">
          <div className="clean-header-title">
            <span className="appstick-brand-dot" />
            <span className="appstick-brand-title"> Appstick.</span>
            <span className="clean-header-divider">/</span>
            <span className="clean-header-current">Get ARROWS</span>
          </div>

          <div className="clean-header-actions">
            <button
              className="clean-close-button"
              onClick={() => {
                if (onTone) onTone(320, 0.1, 0.03);
                onClose();
              }}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="clean-download-body">
          {/* Game Banner */}
          <div className="clean-app-hero">
            <div className="clean-app-icon">
              <span>➤</span>
            </div>
            <div className="clean-app-info">
              <h3>Arrows – The Puzzle Escape</h3>
              <p>Minimalist spatial untangling puzzle game by Appstick</p>
              <div className="clean-tags-row">
                <span className="clean-tag-pill highlight">100% Free</span>
                <span className="clean-tag-pill highlight">Ad-Supported</span>
                <span className="clean-tag-pill">No In-App Purchases</span>
                <span className="clean-tag-pill">Offline Ready</span>
              </div>
            </div>
          </div>

          {/* Store Platforms Grid */}
          <div className="clean-store-grid">
            {/* Google Play Store */}
            <a
              href="https://play.google.com/store/apps/details?id=bd.com.appstick.arrows"
              target="_blank"
              rel="noopener noreferrer"
              className="clean-store-card store-playstore"
              onClick={() => onTone && onTone(660, 0.12, 0.04)}
            >
              <div className="clean-store-logo">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.128 2.128 0 0 1-.61-.318c-.282-.224-.447-.57-.447-.94V3.072c0-.37.165-.716.447-.94.186-.148.4-.258.61-.318zm11.305 11.308l2.259 2.259-11.83 6.83 9.571-9.089zm0-2.244L5.344 1.789l11.83 6.83-2.26 2.259zm1.536 1.122l4.137 2.388c.84.485.84 1.275 0 1.76l-4.137 2.388-2.022-2.022 2.022-2.514z" />
                </svg>
              </div>
              <div className="clean-store-texts">
                <span className="clean-store-action">GET IT ON</span>
                <strong className="clean-store-name">Google Play</strong>
                <span className="clean-store-meta">Android • Free Download</span>
              </div>
              <ExternalLink size={18} className="clean-store-arrow" />
            </a>

            {/* Apple App Store */}
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="clean-store-card store-appstore"
              onClick={() => onTone && onTone(720, 0.12, 0.04)}
            >
              <div className="clean-store-logo">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 7.07c.61-.75 1.04-1.8 1.01-2.87-.93.04-2.02.63-2.66 1.38-.56.65-1.06 1.71-1.01 2.76 1.04.08 2.05-.52 2.66-1.27z" />
                </svg>
              </div>
              <div className="clean-store-texts">
                <span className="clean-store-action">DOWNLOAD ON THE</span>
                <strong className="clean-store-name">App Store</strong>
                <span className="clean-store-meta">iOS & iPadOS • Free Download</span>
              </div>
              <ExternalLink size={18} className="clean-store-arrow" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="clean-modal-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Safe for all ages • 100% Free</span>
          </div>

          <button
            className="clean-done-button"
            onClick={() => {
              if (onTone) onTone(320, 0.1, 0.03);
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
