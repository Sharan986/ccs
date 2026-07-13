import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CCSLogo } from './CCSLogo';
import { SquashHamburger } from './SquashHamburger';
import { ScrambleText } from './ScrambleText';

interface NavbarProps {
  entranceComplete: boolean;
}

const NAV_LINKS = [
  { label: 'About',       target: 'about' },
  { label: 'SOE IT',      target: 'soe-it' },
  { label: 'Members',     target: 'members' },
  { label: 'Events',      target: 'events' },
  { label: 'Gallery',     target: 'gallery' },
  { label: 'Suggestions', target: 'suggestions' },
];

const SIDE_PAD = 'clamp(12px, 4vw, 80px)';

export const Navbar: React.FC<NavbarProps> = ({ entranceComplete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoverJoin, setHoverJoin] = useState(false);
  const [hoverHack, setHoverHack] = useState(false);
  const navigate = useNavigate();

  const spring = { type: 'spring' as const, stiffness: 340, damping: 30 };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: entranceComplete ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between pointer-events-none"
      style={{ height: 72, paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD }}
    >
      {/* ── Left cluster ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 pointer-events-auto">

        {/* Logo pill — ALWAYS VISIBLE, never moves */}
        <button
          className="h-10 flex items-center gap-2 bg-white/12 backdrop-blur-md rounded-xl cursor-pointer flex-shrink-0"
          style={{ paddingLeft: 16, paddingRight: 16 }}
          onClick={() => scrollTo('home')}
        >
          <CCSLogo className="w-4 h-4 text-white flex-shrink-0" />
          <span className="text-white text-[14px] font-medium tracking-tight whitespace-nowrap">CCS</span>
        </button>

        {/* Expanding menu pill — grows to the right from a fixed left edge */}
        <motion.div
          animate={{ width: menuOpen ? 'clamp(240px, 48vw, 600px)' : 40 }}
          transition={spring}
          className="h-10 bg-white/12 backdrop-blur-md rounded-xl flex items-center overflow-hidden flex-shrink-0"
          style={{ willChange: 'width', originX: 0 }}
        >
          {/* Hamburger — fixed left inside the pill */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"
            style={{ minWidth: 40 }}
          >
            <SquashHamburger isOpen={menuOpen} />
          </button>

          {/* Nav links — evenly distributed in the remaining space */}
          <div className="flex items-center justify-evenly flex-1 pr-4 overflow-hidden min-w-0">
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.target}
                initial={false}
                animate={{
                  opacity: menuOpen ? 1 : 0,
                  x:       menuOpen ? 0  : 10,
                }}
                transition={{
                  delay:    menuOpen ? 0.05 + i * 0.03 : 0,
                  duration: 0.22,
                }}
                className="text-white/80 hover:text-white text-[12px] tracking-wide whitespace-nowrap transition-colors"
                style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
                onMouseEnter={() => setHoveredLink(link.target)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => scrollTo(link.target)}
              >
                <ScrambleText text={link.label} isHovered={hoveredLink === link.target} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right: CTA buttons ────────────────────────────────── */}
      <div className="pointer-events-auto flex items-center gap-2 flex-shrink-0">
        {/* Hackathon button — hidden on very small screens */}
        <motion.button
          className="hidden sm:flex h-10 rounded-full items-center justify-center gap-2 font-medium text-[13px] whitespace-nowrap"
          style={{
            paddingLeft: 20, paddingRight: 20,
            background: 'linear-gradient(135deg, rgba(192,132,252,0.18), rgba(129,140,248,0.14))',
            border: '1px solid rgba(192,132,252,0.35)',
            color: 'rgba(220,200,255,0.95)',
          }}
          whileHover={{
            scale: 1.04,
            background: 'linear-gradient(135deg, rgba(192,132,252,0.30), rgba(129,140,248,0.22))',
            boxShadow: '0 0 20px rgba(192,132,252,0.30)',
          }}
          whileTap={{ scale: 0.96 }}
          onMouseEnter={() => setHoverHack(true)}
          onMouseLeave={() => setHoverHack(false)}
          onClick={() => navigate('/hackathon')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <ScrambleText text="Hackathon" isHovered={hoverHack} />
        </motion.button>

        {/* Join CCS button */}
        <motion.button
          className="h-10 bg-white rounded-full flex items-center justify-center gap-2 text-black font-medium text-[13px] whitespace-nowrap"
          style={{ paddingLeft: 'clamp(12px, 2vw, 20px)', paddingRight: 'clamp(12px, 2vw, 20px)' }}
          whileHover={{ scale: 1.04, backgroundColor: '#e8e8ec' }}
          whileTap={{ scale: 0.96 }}
          onMouseEnter={() => setHoverJoin(true)}
          onMouseLeave={() => setHoverJoin(false)}
          onClick={() => scrollTo('suggestions')}
        >
          <ScrambleText text="Join CCS" isHovered={hoverJoin} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.nav>
  );
};
