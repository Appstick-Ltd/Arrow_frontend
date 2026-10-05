import React from 'react';
import { soundManager } from '../audio/soundEffects';

export default function Section2() {
  const levels = [
    { id: 'LEVEL 01', label: 'LINEAR CONDUIT' },
    { id: 'LEVEL 02', label: 'CROSSROAD LOCK' },
    { id: 'LEVEL 03', label: 'QUANTUM MAZE' },
  ];

  return (
    <section id="section-2" className="minimal-section section-challenge">
      <div className="section-content-center">
        <h2 className="section-heading">EVERY MOVE MATTERS.</h2>
        <p className="section-subtext">“Plan ahead. Follow the path. Find the escape.”</p>

        <div className="levels-minimal-row">
          {levels.map((lvl, i) => (
            <div
              key={i}
              className="level-minimal-pill"
              onMouseEnter={() => soundManager.playHover()}
            >
              <span className="lvl-id">{lvl.id}</span>
              <span className="lvl-name">{lvl.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
