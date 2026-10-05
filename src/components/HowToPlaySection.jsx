import React from 'react';
import { Eye, Zap, KeyRound, ArrowRight } from 'lucide-react';
import { soundManager } from '../audio/soundEffects';

export default function HowToPlaySection() {
  const steps = [
    {
      num: '01',
      title: 'THINK',
      icon: <Eye size={24} className="text-cyan-400" />,
      color: '#00f3ff',
      summary: 'Scan the Interlocking Labyrinth',
      desc: 'Analyze every arrow in the maze. Identify which arrows are blocked by walls or neighbors, and locate the ones with a clear line of sight to exit.',
    },
    {
      num: '02',
      title: 'UNBLOCK',
      icon: <Zap size={24} className="text-purple-400" />,
      color: '#8b5cf6',
      summary: 'Launch Unobstructed Arrows',
      desc: 'Tap arrows with an open escape vector. Each arrow that flies out frees up space and unlocks adjacent arrows that were previously trapped.',
    },
    {
      num: '03',
      title: 'ESCAPE',
      icon: <KeyRound size={24} className="text-emerald-400" />,
      color: '#10b981',
      summary: 'Release the Blue Master Vector',
      desc: 'Once the path is clear, release the winding blue escape arrow. It glides through the cleared labyrinth and shoots through the exit to victory!',
    },
  ];

  return (
    <section id="how-to-play" className="section-container how-to-play-section">
      <div className="section-header-center">
        <div className="section-pill">
          <span>GAMEPLAY FOUNDATIONS</span>
        </div>
        <h2 className="section-title">HOW TO PLAY</h2>
        <p className="section-subtitle">
          Three steps stand between confinement and total escape. Untangle the arrow maze.
        </p>
      </div>

      <div className="how-steps-grid">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className="how-step-card interactive-card"
            onMouseEnter={() => soundManager.playHover()}
          >
            <div className="step-header">
              <span className="step-number" style={{ color: step.color }}>
                {step.num}
              </span>
              <div className="step-icon-box">{step.icon}</div>
            </div>

            <h3 className="step-title" style={{ textShadow: `0 0 15px ${step.color}40` }}>
              {step.title}
            </h3>
            <h4 className="step-summary">{step.summary}</h4>
            <p className="step-desc">{step.desc}</p>

            {idx < 2 && (
              <div className="step-connector-desktop">
                <ArrowRight size={20} className="text-cyan-400 opacity-60" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
