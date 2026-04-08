import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FluidTextMorphProps {
  wordPairs: [string, string][];
  className?: string;
  animationProps?: {
    initialColor?: string;
    animateColor?: string;
    exitColor?: string;
  };
}

export function FluidTextMorph({
  wordPairs,
  className,
  animationProps = {},
}: FluidTextMorphProps) {
  const [index, setIndex] = useState(0);
  const [word, setWord] = useState(wordPairs[0]?.[0] || "");

  const {
    initialColor = "#E20613",
    animateColor = "#FFFFFF",
    exitColor = "#1A1A1A",
  } = animationProps;

  useEffect(() => {
    if (wordPairs && wordPairs.length > 0) {
      setWord(wordPairs[index][0]);
    }
  }, [index, wordPairs]);

  const handleHover = () => {
    setWord(wordPairs[index][1]);
  };

  const handleHoverEnd = () => {
    setWord(wordPairs[index][0]);
  };

  const handleClick = () => {
    setIndex((prev) => (prev + 1) % wordPairs.length);
  };

  const letters = word.split("");

  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-center justify-center text-6xl font-black sm:text-8xl",
        className
      )}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
      onClick={handleClick}
    >
      <AnimatePresence mode="popLayout">
        {letters.map((letter, i) => (
          <motion.span
            key={`letter-${index}-${i}`}
            layoutId={`letter-${index}-${i}`}
            initial={{ opacity: 0, y: 30, scale: 0.8, color: initialColor }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              color: animateColor,
              transition: {
                type: "spring",
                damping: 15,
                stiffness: 200,
                delay: i * 0.05,
              },
            }}
            exit={{
              opacity: 0,
              y: -30,
              scale: 0.8,
              color: exitColor,
              transition: {
                type: "spring",
                damping: 15,
                stiffness: 200,
                delay: (letters.length - 1 - i) * 0.05,
              },
            }}
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
