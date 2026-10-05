import React from 'react';
import { Star, Award, Quote, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../audio/soundEffects';

export default function ReviewsSection() {
  const reviews = [
    {
      author: 'TouchArcade',
      role: 'Game of the Week',
      rating: 5,
      quote:
        'The most satisfying minimalist puzzle since Monument Valley. The physical snap of unblocking an arrow is pure tactile dopamine.',
      badge: 'EDITOR’S CHOICE',
    },
    {
      author: 'PocketGamer',
      role: 'Mobile Review',
      rating: 5,
      quote:
        'A breathtaking synthesis of dark mode aesthetics, ambient soundscapes, and devious spatial labyrinth design.',
      badge: 'PLATINUM 9.5/10',
    },
    {
      author: 'Indie Game Digest',
      role: 'Critical Acclaim',
      rating: 5,
      quote:
        'Respects your intelligence completely. No countdown timers, no predatory monetization—just pure, meditative logic flow.',
      badge: 'INNOVATION AWARD',
    },
  ];

  return (
    <section id="reviews" className="section-container reviews-section">
      <div className="section-header-center">
        <div className="section-pill">
          <Award size={14} className="text-cyan-400 mr-2" />
          <span>GLOBAL ACCLAIM</span>
        </div>
        <h2 className="section-title">PRAISED BY PLAYERS & CRITICS</h2>
        <p className="section-subtitle">
          Over 1,000,000 players worldwide have breached the void. Rated 4.9 stars across iOS and Android.
        </p>

        {/* Big Rating Summary Banner */}
        <div className="rating-summary-pill">
          <div className="stars-row">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="rating-val">4.9 / 5.0</span>
          <span className="rating-sep">•</span>
          <span className="rating-count">54,000+ VERIFIED RATINGS</span>
        </div>
      </div>

      <div className="reviews-cards-grid">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="review-card interactive-card"
            onMouseEnter={() => soundManager.playHover()}
          >
            <div className="review-top-bar">
              <span className="review-badge">{rev.badge}</span>
              <div className="stars-cluster">
                {[...Array(rev.rating)].map((_, s) => (
                  <Star key={s} size={13} className="fill-cyan-400 text-cyan-400" />
                ))}
              </div>
            </div>

            <Quote size={28} className="review-quote-icon" />

            <p className="review-body">“{rev.quote}”</p>

            <div className="review-footer">
              <span className="review-author">{rev.author}</span>
              <span className="review-role">{rev.role}</span>
            </div>

            <div className="review-card-glow" />
          </div>
        ))}
      </div>
    </section>
  );
}
