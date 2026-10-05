import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../audio/soundEffects';

export default function Navbar({ onSoundToggle, isMuted }) {
  return (
    <header className="minimal-navbar">
      <div className="nav-brand">
        <span className="brand-arrows">ARROWS</span>
        <span className="brand-dot" />
        <span className="brand-sub">PUZZLE ESCAPE</span>
      </div>

      <div className="nav-right">
        <button
          className="btn-sound-minimal"
          onClick={onSoundToggle}
          onMouseEnter={() => soundManager.playHover()}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? (
            <VolumeX size={16} className="text-zinc-500" />
          ) : (
            <Volume2 size={16} className="text-cyan-400" />
          )}
          <span className="sound-txt">{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
        </button>
      </div>
    </header>
  );
}
