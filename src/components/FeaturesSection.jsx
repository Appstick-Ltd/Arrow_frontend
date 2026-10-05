import React from 'react';
import { EyeOff, BrainCircuit, TrendingUp, Sparkle, ShieldCheck, Zap } from 'lucide-react';
import { soundManager } from '../audio/soundEffects';

export default function FeaturesSection() {
  const features = [
    {
      id: '01',
      title: 'MINIMAL DESIGN',
      tagline: 'Pure Visual Focus',
      desc: 'Clean, distraction-free aesthetics crafted from obsidian blocks, neon laser conduits, and deep cosmic fog.',
      icon: <EyeOff size={22} className="text-cyan-400" />,
      accent: '#00f3ff',
    },
    {
      id: '02',
      title: 'SMART PUZZLES',
      tagline: 'Strategic Depth',
      desc: 'No arbitrary trial-and-error. Every challenge rewards geometric logic, path anticipation, and mathematical clarity.',
      icon: <BrainCircuit size={22} className="text-purple-400" />,
      accent: '#a855f7',
    },
    {
      id: '03',
      title: 'PROGRESSIVE DIFFICULTY',
      tagline: 'Gentle Start, Mind-Bending Endgame',
      desc: 'Intuitive introductory levels seamlessly evolve into multi-layered labyrinthine vector matrices.',
      icon: <TrendingUp size={22} className="text-emerald-400" />,
      accent: '#10b981',
    },
    {
      id: '04',
      title: 'SATISFYING MOVEMENT',
      tagline: 'Tactile Physical Haptics',
      desc: 'Every arrow turn snaps with precise physical inertia, acoustic servo feedback, and blinding harmonic pulses.',
      icon: <Zap size={22} className="text-amber-400" />,
      accent: '#f59e0b',
    },
  ];

  return (
    <section id="features" className="section-container features-section">
      <div className="section-header-center">
        <div className="section-pill">
          <Sparkle size={14} className="text-cyan-400 mr-2" />
          <span>CORE ARCHITECTURE</span>
        </div>
        <h2 className="section-title">BUILT FOR DISCIPLINED MINDS</h2>
        <p className="section-subtitle">
          Designed without clutter, microtransactions, or time penalties. Pure spatial puzzle mastery.
        </p>
      </div>

      {/* Floating 3D Transparent Glass Panels */}
      <div className="features-floating-grid">
        {features.map((feat) => (
          <div
            key={feat.id}
            className="feature-glass-panel interactive-card"
            onMouseEnter={() => soundManager.playHover()}
          >
            {/* Holographic Header Bar */}
            <div className="panel-hud-bar">
              <span className="panel-node-id">SYSTEM//{feat.id}</span>
              <div className="panel-icon-wrap" style={{ borderColor: `${feat.accent}55` }}>
                {feat.icon}
              </div>
            </div>

            <h3 className="panel-title">{feat.title}</h3>
            <span className="panel-tagline" style={{ color: feat.accent }}>
              {feat.tagline}
            </span>
            <p className="panel-desc">{feat.desc}</p>

            {/* Glowing Corner Accents */}
            <div className="panel-laser-edge" style={{ background: feat.accent }} />
          </div>
        ))}
      </div>
    </section>
  );
}
