import React, { useEffect, useState } from 'react';
import { X, Play, Volume2, VolumeX, FastForward, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundEffects';

export default function TrailerModal({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);

  const scenes = [
    {
      title: 'ENTER THE VOID',
      subtitle: 'Where geometric laws twist and time locks down.',
      vector: 'INITIALIZING SECTOR 09',
      color: '#00f3ff',
    },
    {
      title: 'ALIGN OR BE TRAPPED',
      subtitle: 'Every arrow determines the propagation of energy.',
      vector: 'CRITICAL FAILURE AT NODE (4,1)',
      color: '#8b5cf6',
    },
    {
      title: 'THE PATH UNFOLDS',
      subtitle: 'Harmonic resonance triggers the escape gateway.',
      vector: 'GATEWAY BREACH DETECTED',
      color: '#10b981',
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    soundManager.playSolved();

    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
      soundManager.playRotate();
    }, 3200);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const scene = scenes[currentScene];

  return (
    <div className="trailer-modal-backdrop" onClick={onClose}>
      <div className="trailer-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="trailer-header">
          <div className="trailer-badge">
            <span className="rec-dot" />
            <span>CINEMATIC TEASER // LIVE SIMULATION</span>
          </div>
          <button
            className="trailer-close-btn"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cinematic Video Teaser Canvas Area */}
        <div className="trailer-screen">
          {/* Cyber scanlines overlay */}
          <div className="screen-scanlines" />

          {/* Animated 3D Vector Visualizer */}
          <div className="screen-visualizer">
            <div
              className="trailer-arrow-monolith"
              style={{
                borderColor: scene.color,
                boxShadow: `0 0 40px ${scene.color}55`,
              }}
            >
              <svg viewBox="0 0 24 24" className="monolith-svg" fill={scene.color}>
                <path d="M12 2L21 11H15V22H9V11H3L12 2Z" />
              </svg>
            </div>

            <div className="trailer-radar-ring" style={{ borderColor: `${scene.color}40` }} />
            <div className="trailer-radar-ring ring-lg" style={{ borderColor: `${scene.color}25` }} />
          </div>

          {/* Dynamic Scene Captions */}
          <div className="trailer-captions">
            <span className="trailer-telemetry-tag" style={{ color: scene.color }}>
              // {scene.vector}
            </span>
            <h2 className="trailer-scene-title" style={{ color: '#ffffff' }}>
              {scene.title}
            </h2>
            <p className="trailer-scene-desc">{scene.subtitle}</p>
          </div>

          {/* Progress Indicators */}
          <div className="trailer-progress-bars">
            {scenes.map((s, idx) => (
              <div
                key={idx}
                className={`progress-seg ${idx === currentScene ? 'active' : ''}`}
                style={{
                  background: idx === currentScene ? scene.color : 'rgba(255, 255, 255, 0.2)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="trailer-footer">
          <span className="trailer-meta">IN-ENGINE 3D RENDER // 4K 60FPS TARGET</span>
          <button
            className="btn-trailer-launch"
            onClick={() => {
              soundManager.playClick();
              onClose();
              const heroEl = document.getElementById('hero');
              if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Play size={15} className="fill-current mr-2" />
            <span>PLAY DEMO NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
}
