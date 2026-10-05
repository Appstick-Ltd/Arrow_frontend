import React, { useState } from 'react';
import { Target, Compass, Sparkles, Navigation, Shuffle, Check } from 'lucide-react';
import { soundManager } from '../audio/soundEffects';

export default function ShowcaseSection() {
  const [activeHint, setActiveHint] = useState(false);

  return (
    <section id="showcase" className="section-container showcase-section">
      <div className="section-header-center">
        <div className="section-pill">
          <Target size={14} className="text-cyan-400 mr-2" />
          <span>ADVANCED VECTOR LAB</span>
        </div>
        <h2 className="section-title">CAN YOU FIND THE WAY OUT?</h2>
        <p className="section-subtitle">
          Test your spatial reasoning against a high-density 4x4 dimensional matrix.
          Click or hover arrows directly on the 3D board to trace potential vector vectors.
        </p>
      </div>

      {/* Showcase Interactive Glass Overlay Deck */}
      <div className="showcase-deck-wrapper">
        <div className="showcase-glass-hud">
          <div className="deck-header">
            <div className="deck-title-group">
              <Compass size={18} className="text-cyan-400 mr-2" />
              <span className="deck-title">MATRIX TOPOLOGY // LEVEL 44</span>
            </div>
            <div className="deck-badge">DIFFICULTY: EXPERT</div>
          </div>

          <p className="deck-instruction">
            The 3D board behind this panel is live. Click arrows on screen to redirect their vectors,
            or toggle telemetry to highlight candidate escape trajectories.
          </p>

          <div className="deck-controls-row">
            <button
              className={`btn-deck-hint ${activeHint ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setActiveHint(!activeHint);
              }}
              onMouseEnter={() => soundManager.playHover()}
            >
              <Sparkles size={16} className="mr-2" />
              <span>{activeHint ? 'VECTOR TRAIL HIGHLIGHTED' : 'REVEAL CRITICAL VECTOR'}</span>
            </button>
          </div>

          {activeHint && (
            <div className="deck-hint-alert">
              <Navigation size={16} className="text-cyan-400 mr-2 shrink-0" />
              <span>
                <strong>CRITICAL VECTOR DETECTED:</strong> Align the center column nodes facing
                NORTH-EAST to bypass the gravitational dampener at node (3, 2).
              </span>
            </div>
          )}

          <div className="deck-metrics-bar">
            <div className="deck-metric">
              <span className="lbl">DIVERGENCE INDEX</span>
              <span className="val text-cyan-400">94.8%</span>
            </div>
            <div className="deck-metric">
              <span className="lbl">SOLUTION BRANCHES</span>
              <span className="val text-purple-400">1 OF 4,096</span>
            </div>
            <div className="deck-metric">
              <span className="lbl">OPTIMAL MOVES</span>
              <span className="val text-emerald-400">7 ROTATIONS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
