import React from 'react';
import { Globe, Orbit, Radio, ShieldAlert } from 'lucide-react';
import { soundManager } from '../audio/soundEffects';

export default function WorldSection() {
  return (
    <section id="world" className="section-container world-section">
      <div className="section-header-center">
        <div className="section-pill">
          <Globe size={14} className="text-cyan-400 mr-2" />
          <span>DIMENSIONAL ANOMALY</span>
        </div>
        <h2 className="section-title">THE VOID OF VECTORS</h2>
        <p className="section-subtitle">
          An infinite expanse of forgotten algorithms and drifting geometric structures.
          Only by mastering vector alignment can you construct the path back to reality.
        </p>
      </div>

      {/* Atmospheric Void Telemetry Deck */}
      <div className="void-telemetry-deck">
        <div className="void-stat-box">
          <Orbit size={20} className="text-cyan-400 mb-2" />
          <span className="void-stat-val">250+</span>
          <span className="void-stat-lbl">FLOATING ANOMALIES</span>
        </div>
        <div className="void-stat-box">
          <Radio size={20} className="text-purple-400 mb-2" />
          <span className="void-stat-val">100%</span>
          <span className="void-stat-lbl">IMMERSIVE AMBIENCE</span>
        </div>
        <div className="void-stat-box">
          <ShieldAlert size={20} className="text-emerald-400 mb-2" />
          <span className="void-stat-val">0.00ms</span>
          <span className="void-stat-lbl">INPUT LATENCY</span>
        </div>
      </div>
    </section>
  );
}
