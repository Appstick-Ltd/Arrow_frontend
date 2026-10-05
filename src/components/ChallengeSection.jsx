import React from 'react';
import { Layers, Compass, ArrowUpRight, Cpu } from 'lucide-react';
import { soundManager } from '../audio/soundEffects';

export default function ChallengeSection() {
  const levels = [
    {
      id: '01',
      title: 'LINEAR INITIATION',
      complexity: 'BEGINNER',
      desc: 'Master single-vector corridors and discover directional dependencies.',
      nodes: '9 NODES',
    },
    {
      id: '02',
      title: 'INTERSECTING NODES',
      complexity: 'INTERMEDIATE',
      desc: 'Bifurcated paths create interlocking lockouts. One wrong turn traps the beam.',
      nodes: '16 NODES',
    },
    {
      id: '03',
      title: 'QUANTUM REFRACTION',
      complexity: 'ADVANCED',
      desc: 'Arrows that alter downstream tiles when triggered. Multi-step forecasting required.',
      nodes: '25 NODES',
    },
    {
      id: '04',
      title: 'THE VOID LABYRINTH',
      complexity: 'MASTER',
      desc: 'Multidimensional vector networks with shifting gravity wells and timed portals.',
      nodes: '36+ NODES',
    },
  ];

  return (
    <section id="challenge" className="section-container challenge-section">
      <div className="section-header-center">
        <div className="section-pill">
          <Layers size={14} className="text-cyan-400 mr-2" />
          <span>TACTICAL DEPTH</span>
        </div>
        <h2 className="section-title">EVERY MOVE MATTERS.</h2>
        <p className="section-subtitle">
          Your path is never as simple as it looks. Plan ahead, follow the arrows, and find the way out.
        </p>
      </div>

      {/* Floating 3D HUD Level Cards */}
      <div className="challenge-cards-grid">
        {levels.map((lvl) => (
          <div
            key={lvl.id}
            className="challenge-card interactive-card"
            onMouseEnter={() => soundManager.playHover()}
          >
            <div className="card-top-row">
              <span className="level-badge">LEVEL {lvl.id}</span>
              <span className="complexity-tag">{lvl.complexity}</span>
            </div>

            <h3 className="card-level-title">{lvl.title}</h3>
            <p className="card-level-desc">{lvl.desc}</p>

            <div className="card-footer-row">
              <div className="card-node-stat">
                <Cpu size={14} className="text-cyan-400 mr-1.5" />
                <span>{lvl.nodes}</span>
              </div>
              <ArrowUpRight size={18} className="card-arrow-icon" />
            </div>

            {/* Glowing cyber accents */}
            <div className="card-border-glow" />
            <div className="card-corner corner-tl" />
            <div className="card-corner corner-br" />
          </div>
        ))}
      </div>
    </section>
  );
}
