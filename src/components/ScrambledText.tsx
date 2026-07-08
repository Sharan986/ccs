import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

import './ScrambledText.css';

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  delay?: number;
  triggered?: boolean;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children,
  delay = 0,
  triggered = true
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<any[]>([]);

  const triggeredRef = useRef(triggered);
  useEffect(() => {
    triggeredRef.current = triggered;
  }, [triggered]);

  useEffect(() => {
    if (!rootRef.current) return;

    const split = SplitText.create(rootRef.current.querySelector('span'), {
      type: 'chars',
      charsClass: 'char'
    });
    charsRef.current = split.chars;

    charsRef.current.forEach(c => {
      gsap.set(c, {
        display: 'inline-block',
        attr: { 'data-content': c.innerHTML },
        opacity: 0
      });
    });

    const handleMove = (e: PointerEvent) => {
      if (!triggeredRef.current) return;
      charsRef.current.forEach(c => {
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          gsap.to(c, {
            overwrite: true,
            opacity: 1,
            duration: duration * (1 - dist / radius),
            scrambleText: {
              text: c.dataset.content || '',
              chars: scrambleChars,
              speed
            },
            ease: 'none'
          });
        }
      });
    };

    const el = rootRef.current;
    el.addEventListener('pointermove', handleMove);

    return () => {
      el.removeEventListener('pointermove', handleMove);
      split.revert();
    };
  }, [radius, duration, speed, scrambleChars]);

  useEffect(() => {
    if (!charsRef.current.length || !triggered) return;
    
    charsRef.current.forEach(c => {
      gsap.to(c, {
        opacity: 1,
        duration: duration,
        delay: delay / 1000,
        scrambleText: {
          text: c.dataset.content || '',
          chars: scrambleChars,
          speed
        },
        ease: 'none'
      });
    });
  }, [triggered, delay, duration, scrambleChars, speed]);

  // Changed <p> to <span> so it works inline
  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <span>{children}</span>
    </div>
  );
};

export default ScrambledText;
