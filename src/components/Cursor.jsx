import React, { useEffect, useState } from 'react';

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target;
      const isInteractive = !!target.closest(
        'button, a, input, select, [role="button"], #webgl-canvas-container, .interactive-card'
      );
      setIsPointer(isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Center glowing dot */}
      <div
        style={{
          position: 'fixed',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#00f3ff',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 0 10px #00f3ff, 0 0 20px #00f3ff',
          transition: 'transform 0.08s ease-out',
        }}
      />

      {/* Cyber Reticle Ring */}
      <div
        style={{
          position: 'fixed',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isPointer ? '42px' : '26px',
          height: isPointer ? '42px' : '26px',
          borderRadius: isPointer ? '25%' : '50%',
          border: `1.5px solid ${isPointer ? '#00f3ff' : 'rgba(0, 243, 255, 0.45)'}`,
          transform: `translate(-50%, -50%) rotate(${isPointer ? '45deg' : '0deg'}) scale(${
            isClicking ? 0.8 : 1
          })`,
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'width 0.2s, height 0.2s, border 0.2s, transform 0.15s ease-out',
          boxShadow: isPointer ? '0 0 15px rgba(0, 243, 255, 0.35)' : 'none',
        }}
      >
        {isPointer && (
          <div
            style={{
              position: 'absolute',
              inset: '-4px',
              border: '1px dashed rgba(0, 243, 255, 0.4)',
              borderRadius: '25%',
              animation: 'spin 4s linear infinite',
            }}
          />
        )}
      </div>
    </>
  );
}
