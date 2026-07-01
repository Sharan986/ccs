import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CCSLogo } from './CCSLogo';
import { SquashHamburger } from './SquashHamburger';
import { ScrambleText } from './ScrambleText';

interface NavbarProps {
  entranceComplete: boolean;
}

const NAV_LINKS = [
  { label: 'About', target: 'about' },
  { label: 'SOE IT', target: 'soe-it' },
  { label: 'Members', target: 'members' },
  { label: 'Events', target: 'events' },
  { label: 'Gallery', target: 'gallery' },
  { label: 'Suggestions', target: 'suggestions' },
];

export const Navbar: React.FC<NavbarProps> = ({ entranceComplete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoverDownload, setHoverDownload] = useState(false);

  const springConfig = { type: "spring" as const, stiffness: 350, damping: 28 };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: entranceComplete ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full h-20 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 pointer-events-none"
    >
      {/* Left side */}
      <div className="flex items-center gap-2 pointer-events-auto">

        {/* Logo Pill — hides on mobile when menu is open */}
        <motion.div
          initial={false}
          animate={{
            width: menuOpen && typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : 'auto',
            opacity: menuOpen && typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : 1,
            paddingLeft: menuOpen && typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : '1.25rem',
            paddingRight: menuOpen && typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : '1.25rem',
          }}
          transition={springConfig}
          className={`h-9 sm:h-12 bg-white/15 backdrop-blur-md rounded-[10px] sm:rounded-[14px] flex items-center justify-center cursor-pointer overflow-hidden ${menuOpen ? 'hidden md:flex' : 'flex'}`}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.22)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => scrollTo('home')}
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <CCSLogo className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] text-white" />
            <span className="text-white text-[13px] sm:text-[16px] font-medium tracking-tight">CCS</span>
          </div>
        </motion.div>

        {/* Expanding Menu Pill */}
        <motion.div
          animate={{
            width: menuOpen
              ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 'calc(100vw - 2rem - 80px)' : 520)
              : (typeof window !== 'undefined' && window.innerWidth < 640 ? 36 : 48)
          }}
          transition={springConfig}
          className="h-9 sm:h-12 bg-white/15 backdrop-blur-md rounded-[10px] sm:rounded-[14px] flex items-center overflow-hidden"
        >
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex-shrink-0 flex items-center justify-center transition-all ${
              menuOpen
                ? 'w-7 h-7 sm:w-9 sm:h-9 rounded-[8px] sm:rounded-[11px] bg-white/10 hover:bg-white/20 ml-1 sm:ml-1.5'
                : 'w-9 h-9 sm:w-12 sm:h-12 rounded-[10px] sm:rounded-[14px] hover:bg-white/10'
            }`}
          >
            <SquashHamburger isOpen={menuOpen} />
          </button>

          {/* Nav Links */}
          <div className="flex items-center pl-3 sm:pl-5 gap-3 sm:gap-5 flex-1 overflow-x-auto scrollbar-none">
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.target}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: menuOpen ? 1 : 0, x: menuOpen ? 0 : 15 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                className="text-white/85 hover:text-white text-[12px] sm:text-[15px] whitespace-nowrap transition-colors"
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

      {/* Right side: Join CCS */}
      <motion.button
        className="pointer-events-auto h-9 sm:h-12 px-3.5 sm:px-6 bg-white rounded-full flex items-center gap-2 text-black"
        whileHover={{ scale: 1.03, backgroundColor: '#e2e2e6' }}
        whileTap={{ scale: 0.97 }}
        onMouseEnter={() => setHoverDownload(true)}
        onMouseLeave={() => setHoverDownload(false)}
        onClick={() => scrollTo('suggestions')}
      >
        <i className="bi bi-arrow-right-circle text-[14px] sm:text-[16px]"></i>
        <span className="text-[13px] sm:text-[16px] font-medium">
          <ScrambleText text="Join CCS" isHovered={hoverDownload} />
        </span>
      </motion.button>
    </motion.nav>
  );
};
