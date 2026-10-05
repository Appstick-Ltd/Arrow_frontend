import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Check,
  Building2,
  ShieldCheck,
  FileText,
  ExternalLink,
  Mail,
  Globe,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function InfoModal({ isOpen, onClose, initialTab = 'about', onTabChange, onTone }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    if (onTone) onTone(540, 0.14, 0.03);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onTone]);

  if (!isOpen) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (onTone) onTone(640, 0.08, 0.025);
    if (onTabChange) onTabChange(tab);
  };

  const handleCopyShareLink = () => {
    const routePaths = {
      about: '/about-us',
      privacy: '/privacy-policy',
      terms: '/terms-conditions'
    };
    const fullUrl = `${window.location.origin}${routePaths[activeTab] || '/about-us'}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      if (onTone) onTone(760, 0.12, 0.035);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <div className="clean-modal-backdrop" onClick={onClose}>
      <div className="clean-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="clean-modal-header">
          <div className="clean-header-title">
            <span className="appstick-brand-dot" />
            <span className="appstick-brand-title">Appstick Ltd.</span>
            <span className="clean-header-divider">/</span>
            <span className="clean-header-current">
              {activeTab === 'about' && 'About Us'}
              {activeTab === 'privacy' && 'Privacy Policy'}
              {activeTab === 'terms' && 'Terms & Conditions'}
            </span>
          </div>

          <div className="clean-header-actions">
            <button
              className={`clean-share-button ${copied ? 'copied' : ''}`}
              onClick={handleCopyShareLink}
              title="Copy link to this section"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Share</span>
                </>
              )}
            </button>

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

        {/* Clean Segmented Tabs */}
        <div className="clean-tabs-bar">
          <button
            className={`clean-tab-item ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => handleTabChange('about')}
          >
            <Building2 size={15} />
            <span>About Us</span>
          </button>

          <button
            className={`clean-tab-item ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => handleTabChange('privacy')}
          >
            <ShieldCheck size={15} />
            <span>Privacy Policy</span>
          </button>

          <button
            className={`clean-tab-item ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => handleTabChange('terms')}
          >
            <FileText size={15} />
            <span>Terms & Conditions</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="clean-modal-body custom-scrollbar">
          {/* ==================== TAB 1: ABOUT US ==================== */}
          {activeTab === 'about' && (
            <div className="clean-tab-content">
              {/* Overview intro */}
              <div className="clean-hero-box">
                <h2>About Appstick Ltd.</h2>
                <p className="clean-hero-text">
                  Founded in 2020 in Bangladesh, <strong>Appstick Ltd.</strong> is a digital product and software engineering company. We design and build modern mobile applications, web platforms, and interactive digital experiences for users and businesses globally.
                </p>

                {/* 4 Key Metrics */}
                <div className="clean-stats-row">
                  <div className="clean-stat-item">
                    <span className="clean-stat-value">5+ Years</span>
                    <span className="clean-stat-label">In Industry (Est. 2020)</span>
                  </div>
                  <div className="clean-stat-item">
                    <span className="clean-stat-value">50+</span>
                    <span className="clean-stat-label">In-House Team</span>
                  </div>
                  <div className="clean-stat-item">
                    <span className="clean-stat-value">100K+</span>
                    <span className="clean-stat-label">Global Users</span>
                  </div>
                  <div className="clean-stat-item">
                    <span className="clean-stat-value">20+</span>
                    <span className="clean-stat-label">Products Launched</span>
                  </div>
                </div>
              </div>

              {/* Game Vision */}
              <div className="clean-section">
                <h3>About the Game: ARROWS</h3>
                <p>
                  <strong>Arrows – The Puzzle Escape</strong> is an indie 3D puzzle game created by Appstick. The goal is simple: untangle intertwining paths by rotating arrow tiles until all arrows can exit unobstructed. It is designed to be calm, satisfying, and focused on pure logical thinking without intrusive interruptions.
                </p>
              </div>


              {/* Contact Information */}
              <div className="clean-section">
                <h3>Contact & Company Details</h3>
                <div className="clean-contact-row">
                  <a
                    href="https://appstick.com.bd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clean-contact-link"
                  >
                    <Globe size={16} />
                    <span>Official Website: <strong>https://appstick.com.bd</strong></span>
                    <ExternalLink size={13} className="ext-icon" />
                  </a>

                  <a
                    href="mailto:contact@appstick.com.bd"
                    className="clean-contact-link"
                  >
                    <Mail size={16} />
                    <span>Email: <strong>contact@appstick.com.bd</strong></span>
                  </a>
                </div>

                <div className="clean-location-tag">
                  <MapPin size={14} />
                  <span>Headquartered in Khulna & Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: PRIVACY POLICY ==================== */}
          {activeTab === 'privacy' && (
            <div className="clean-tab-content">
              <div className="clean-hero-box">
                <h2>Privacy Policy</h2>
                <p className="clean-hero-text">
                  Last updated: October 2026. Appstick Ltd. respects your privacy. This policy explains what information is collected when you play <strong>Arrows – The Puzzle Escape</strong>.
                </p>
              </div>

              <div className="clean-section">
                <h3>1. We Do Not Collect Personal Information</h3>
                <p>
                  ARROWS does not require you to create an account, enter your name, or share personal contact information. We do not collect, sell, or store any personally identifiable information (PII).
                </p>
                <div className="clean-bullet-box">
                  <ul>
                    <li>No access to your contacts, phone number, or media files</li>
                    <li>No GPS or precise location tracking</li>
                    <li>No payment or credit card processing (100% free, zero in-app purchases)</li>
                  </ul>
                </div>
              </div>

              <div className="clean-section">
                <h3>2. In-Game Advertisements</h3>
                <p>
                  To keep ARROWS 100% free for everyone without any in-app purchases, the game displays standard in-game advertisements provided by certified third-party ad networks (such as Google AdMob).
                </p>
                <p>
                  These ad partners may receive standard non-personal technical identifiers (such as Google Advertising ID or IDFA) solely to serve family-safe, contextual ads. We do not sell personal data or perform invasive behavioral profiling.
                </p>
              </div>

              <div className="clean-section">
                <h3>3. Local Device Storage</h3>
                <p>
                  Your game progress (unlocked levels, stars earned) and audio settings are saved locally on your device so you can play offline smoothly.
                </p>
              </div>

              <div className="clean-section">
                <h3>4. App Store & Platform Services</h3>
                <p>
                  When you download ARROWS via Google Play or Apple App Store, optional achievements and cloud saves are handled securely by Google Play Games or Apple Game Center according to their respective privacy policies.
                </p>
              </div>

              <div className="clean-section">
                <h3>5. Safe for All Ages (Family & COPPA Compliant)</h3>
                <p>
                  ARROWS contains no violence or sensitive content. All served ads comply with family-friendly standards, making the game safe for players of all ages.
                </p>
              </div>

              <div className="clean-section">
                <h3>6. Contact for Privacy Questions</h3>
                <p>
                  If you have any questions about this privacy policy, please reach out to us at:
                </p>
                <p className="clean-email-highlight">
                  <Mail size={15} />
                  <a href="mailto:info@appstick.com.bd">info@appstick.com.bd</a>
                </p>
              </div>
            </div>
          )}

          {/* ==================== TAB 3: TERMS & CONDITIONS ==================== */}
          {activeTab === 'terms' && (
            <div className="clean-tab-content">
              <div className="clean-hero-box">
                <h2>Terms & Conditions</h2>
                <p className="clean-hero-text">
                  Last updated: October 2026. By downloading or playing <strong>Arrows – The Puzzle Escape</strong>, you agree to these straightforward terms.
                </p>
              </div>

              <div className="clean-section">
                <h3>1. License to Play</h3>
                <p>
                  Appstick Ltd. grants you a personal, free, non-exclusive license to install and play ARROWS on your mobile or web devices for personal entertainment.
                </p>
              </div>

              <div className="clean-section">
                <h3>2. Intellectual Property</h3>
                <p>
                  All 3D puzzle designs, arrow animations, artwork, sound effects, logos, and code are the intellectual property of Appstick Ltd. You may not copy, extract, or redistribute game assets for commercial use.
                </p>
              </div>

              <div className="clean-section">
                <h3>3. Fair Play</h3>
                <p>
                  Players agree not to modify game files, use bots or hacks to alter scores, or distribute unauthorized versions of the game.
                </p>
              </div>

              <div className="clean-section">
                <h3>4. 100% Free & Ad-Supported (No In-App Purchases)</h3>
                <p>
                  Arrows – The Puzzle Escape is 100% free to play. There are <strong>no in-app purchases</strong>, paid unlocks, microtransactions, or subscription fees. The game is supported exclusively by standard in-game advertisements, allowing all puzzle levels and future updates to remain completely free for every player.
                </p>
              </div>

              <div className="clean-section">
                <h3>5. Governing Law</h3>
                <p>
                  These terms are governed by and interpreted under the laws of Bangladesh. For any inquiries regarding these terms, contact us at <a href="mailto:contact@appstick.com.bd">contact@appstick.com.bd</a>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="clean-modal-footer">
          <span className="clean-footer-copy">
            © {new Date().getFullYear()} Appstick Ltd. All rights reserved.
          </span>
          <button
            className="clean-done-button"
            onClick={() => {
              if (onTone) onTone(320, 0.1, 0.03);
              onClose();
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
