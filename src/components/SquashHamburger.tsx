import React from 'react';
import { motion } from 'framer-motion';

interface SquashHamburgerProps {
  isOpen: boolean;
  className?: string;
}

export const SquashHamburger: React.FC<SquashHamburgerProps> = ({ isOpen, className = '' }) => {
  const springConfig = { type: "spring", stiffness: 300, damping: 20 };

  return (
    <div className={`relative flex flex-col justify-between items-center w-[15px] h-[10px] sm:w-[18px] sm:h-[12px] ${className}`}>
      <motion.span
        initial={false}
        animate={isOpen ? { rotate: 45, y: "4px" } : { rotate: 0, y: 0 }}
        transition={springConfig}
        className="w-full h-[1.2px] sm:h-[1.5px] bg-white absolute top-0 origin-center rounded-full"
      />
      <motion.span
        initial={false}
        animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
        transition={{ ...springConfig, duration: 0.1 }}
        className="w-full h-[1.2px] sm:h-[1.5px] bg-white absolute top-1/2 -translate-y-1/2 rounded-full"
      />
      <motion.span
        initial={false}
        animate={isOpen ? { rotate: -45, y: "-4px" } : { rotate: 0, y: 0 }}
        transition={springConfig}
        className="w-full h-[1.2px] sm:h-[1.5px] bg-white absolute bottom-0 origin-center rounded-full"
      />
    </div>
  );
};
