import React, { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';

interface ScrambleInProps {
  text: string;
  delay: number;
  triggered: boolean;
  className?: string;
}

export const ScrambleIn: React.FC<ScrambleInProps> = ({ text, delay, triggered, className = '' }) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!triggered) {
      setDisplayText('\u00A0'); // &nbsp;
      setHasStarted(false);
      return;
    }

    let frame = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const startTimeout = setTimeout(() => {
      setHasStarted(true);
      intervalId = setInterval(() => {
        frame++;
        const revealCursor = Math.floor(frame * 0.5); // 0.5 chars per frame

        if (revealCursor >= text.length) {
          clearInterval(intervalId);
          setDisplayText(text);
          return;
        }

        let nextText = '';
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') {
            nextText += ' ';
            continue;
          }

          if (i < revealCursor) {
            nextText += text[i];
          } else if (i < revealCursor + 3) {
            nextText += CHARS[Math.floor(Math.random() * CHARS.length)];
          } else {
            nextText += '\u00A0';
          }
        }
        setDisplayText(nextText);
      }, 25);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, delay, triggered]);

  if (!hasStarted && !triggered) {
    return <span className={className}>{'\u00A0'}</span>;
  }

  return <span className={className}>{displayText}</span>;
};
