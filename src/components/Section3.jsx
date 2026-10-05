import React from 'react';

export default function Section3() {
  const steps = [
    {
      word: 'THINK.',
      sub: 'Analyze divergent vector paths before committing.',
    },
    {
      word: 'MOVE.',
      sub: 'Rotate physical 3D blocks to unlock conduits.',
    },
    {
      word: 'ESCAPE.',
      sub: 'Illuminate the continuous route to freedom.',
    },
  ];

  return (
    <section id="section-3" className="minimal-section section-triptych">
      <div className="triptych-grid">
        {steps.map((st, i) => (
          <div key={i} className="triptych-step">
            <span className="triptych-num">0{i + 1}</span>
            <h3 className="triptych-word">{st.word}</h3>
            <p className="triptych-sub">{st.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
