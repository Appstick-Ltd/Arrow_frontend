import React, { useState } from 'react';
import { Smartphone, Download, QrCode, Play, Apple, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundEffects';

export default function FinalCtaSection({ onPlayClick }) {
  const [showQrModal, setShowQrModal] = useState(false);

  return (
    <section id="final-cta" className="section-container final-cta-section">
      <div className="final-cta-content">
        <div className="final-badge">
          <Sparkles size={14} className="text-cyan-400 mr-2" />
          <span>BREACH PROTOCOL READY</span>
        </div>

        <h2 className="final-title">READY TO ESCAPE?</h2>
        <p className="final-tagline">“Your next move is waiting.”</p>

        {/* Primary Play Button */}
        <div className="final-actions-box">
          <button
            className="btn-play-monolith"
            onClick={onPlayClick}
            onMouseEnter={() => soundManager.playHover()}
          >
            <div className="btn-monolith-glow" />
            <Play size={20} className="fill-current mr-2.5" />
            <span>PLAY ARROWS</span>
          </button>
        </div>

        <p className="final-mobile-sub">Available now on iOS & Android</p>

        {/* Floating Store Badges */}
        <div className="store-badges-row">
          {/* App Store Badge */}
          <button
            className="store-badge-card"
            onClick={() => {
              soundManager.playClick();
              setShowQrModal(true);
            }}
            onMouseEnter={() => soundManager.playHover()}
          >
            <Apple size={24} className="store-icon" />
            <div className="store-text-col">
              <span className="store-sub">Download on the</span>
              <span className="store-name">App Store</span>
            </div>
            <div className="badge-glow" />
          </button>

          {/* Google Play Badge */}
          <button
            className="store-badge-card"
            onClick={() => {
              soundManager.playClick();
              setShowQrModal(true);
            }}
            onMouseEnter={() => soundManager.playHover()}
          >
            <svg className="store-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M3.609 1.814L13.793 12 3.61 22.186A2.296 2.296 0 0 1 3 20.569V3.431c0-.628.23-1.206.609-1.617zm11.602 11.604l2.553-2.554-12.87-7.43 10.317 9.984zm0-2.836L4.894 19.38l12.87-7.43-2.553-2.554zm1.417 1.418l3.197 1.846c.866.5.866 1.314 0 1.814l-3.197 1.846-2.02-2.02 2.02-2.02z" />
            </svg>
            <div className="store-text-col">
              <span className="store-sub">GET IT ON</span>
              <span className="store-name">Google Play</span>
            </div>
            <div className="badge-glow" />
          </button>

          {/* Instant QR Code Button */}
          <button
            className="store-badge-card qr-card"
            onClick={() => {
              soundManager.playClick();
              setShowQrModal(true);
            }}
            onMouseEnter={() => soundManager.playHover()}
          >
            <QrCode size={22} className="text-cyan-400 store-icon" />
            <div className="store-text-col">
              <span className="store-sub">INSTANT LINK</span>
              <span className="store-name">SCAN QR CODE</span>
            </div>
            <div className="badge-glow" />
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="qr-modal-backdrop" onClick={() => setShowQrModal(false)}>
          <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <Smartphone size={20} className="text-cyan-400 mr-2" />
              <h3 className="qr-title">SCAN TO PLAY ON MOBILE</h3>
            </div>
            <p className="qr-desc">
              Scan with your iOS or Android camera to immediately play ARROWS with native touch
              haptics and 60FPS WebGL acceleration.
            </p>

            <div className="qr-code-box">
              {/* High-tech vector stylized QR code representation */}
              <div className="qr-matrix-sim">
                <div className="qr-corner-box tl" />
                <div className="qr-corner-box tr" />
                <div className="qr-corner-box bl" />
                <div className="qr-arrow-center">
                  <Play size={26} className="text-cyan-400 fill-current" />
                </div>
              </div>
            </div>

            <span className="qr-status-text">DIRECT WEBGL STREAM // READY</span>

            <button
              className="btn-qr-close"
              onClick={() => {
                soundManager.playClick();
                setShowQrModal(false);
              }}
            >
              CLOSE WINDOW
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
