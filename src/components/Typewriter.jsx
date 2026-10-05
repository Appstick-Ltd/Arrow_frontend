import React, { useState, useEffect } from 'react';

export default function Typewriter({
  phrases = [
    'THINK. MOVE. ESCAPE.',
    'UNTANGLE THE LABYRINTH.',
    'ONE MOVE CLEARS THE WAY.',
    'MASTER THE ESCAPE PROTOCOL.',
  ],
  speed = 65,
  deleteSpeed = 35,
  pauseDuration = 2000,
}) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex % phrases.length];
    let timeoutId;

    if (!isDeleting) {
      if (text.length < currentPhrase.length) {
        // Typing forward
        timeoutId = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length + 1));
        }, speed);
      } else {
        // Pause when full phrase typed
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (text.length > 0) {
        // Deleting backward
        timeoutId = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length - 1));
        }, deleteSpeed);
      } else {
        // Switch to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, phraseIndex, phrases, speed, deleteSpeed, pauseDuration]);

  return (
    <span className="typewriter-container">
      <span className="typewriter-text">{text}</span>
      <span className="typewriter-caret" aria-hidden="true" />
    </span>
  );
}
