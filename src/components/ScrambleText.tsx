import React, { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';

interface ScrambleTextProps {
  text: string;
  isHovered: boolean;
  className?: string;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({ text, isHovered, className = '' }) => {
  const [displayText, setDisplayText] = useState<string>(text);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }

    let frame = 0;
    const intervalId = setInterval(() => {
      frame++;
      // 4 frames per char = 0.25 chars per frame
      const revealCursor = Math.floor(frame * 0.25);

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
        } else {
          nextText += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayText(nextText);
    }, 25);

    return () => clearInterval(intervalId);
  }, [text, isHovered]);

  return <span className={className}>{displayText}</span>;
};
