import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../providers/theme-provider';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        toggleTheme();
      }}
      className="group flex items-center justify-center p-3 sm:px-4 sm:py-3 rounded-full hover:bg-sasori-red/5 transition-all text-black/70 hover:text-sasori-red relative overflow-hidden"
      whileTap={{ scale: 0.9 }}
      title="Toggle Light/Dark Theme"
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === 'dark' ? 1 : 0.5,
          opacity: theme === 'dark' ? 1 : 0,
          rotate: theme === 'dark' ? 0 : 90
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: theme === 'light' ? 1 : 0.5,
          opacity: theme === 'light' ? 1 : 0,
          rotate: theme === 'light' ? 0 : -90
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
      </motion.div>
      <div className="w-4 h-4 md:w-5 md:h-5 opacity-0 pointer-events-none" />
    </motion.button>
  );
}
