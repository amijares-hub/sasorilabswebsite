"use client";
import { cn } from "../../lib/utils";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroTextProps {
  text?: string;
  subtitle?: string;
  className?: string;
}

export default function HeroText({
  text = "AUTOMATIZACIÓN",
  subtitle = "DE PROCESOS",
  className = "",
}: HeroTextProps) {
  
  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <div
      className={`relative flex flex-col items-center justify-center h-screen w-full 
      bg-white transition-colors duration-700 overflow-hidden ${className}`}
    >
      {/* Immersive Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.10] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #E20613 1px, transparent 1px), linear-gradient(to bottom, #E20613 1px, transparent 1px)`,
          backgroundSize: "clamp(20px, 5vw, 60px) clamp(20px, 5vw, 60px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-0" />

      {/* Main Text Container */}
      <div className="relative z-10 w-full px-4 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            className="flex flex-wrap justify-center items-center w-full gap-x-3 md:gap-x-6"
          >
            {words.map((word, wIdx) => {
              const wordChars = word.split("");
              return (
                <div key={wIdx} className="flex flex-nowrap justify-center">
                  {wordChars.map((char, cIdx) => {
                    const i = globalCharIndex++;
                    return (
                      <div
                        key={cIdx}
                        className="relative px-[0.1vw] overflow-hidden group"
                      >
                        {/* Main Character - Adjusted size for longer words */}
                        <motion.span
                          initial={{ opacity: 0, filter: "blur(10px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          transition={{ delay: i * 0.04 + 0.3, duration: 0.8 }}
                          className="text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] xl:text-[6vw] leading-none font-black text-[#1A1A1A] tracking-tighter"
                        >
                          {char}
                        </motion.span>

                        {/* Top Slice Layer */}
                        <motion.span
                          initial={{ x: "-100%", opacity: 0 }}
                          animate={{ x: "100%", opacity: [0, 1, 0] }}
                          transition={{
                            duration: 0.7,
                            delay: i * 0.04,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] xl:text-[6vw] leading-none font-black text-sasori-red z-10 pointer-events-none"
                          style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
                        >
                          {char}
                        </motion.span>

                        {/* Middle Slice Layer */}
                        <motion.span
                          initial={{ x: "100%", opacity: 0 }}
                          animate={{ x: "-100%", opacity: [0, 1, 0] }}
                          transition={{
                            duration: 0.7,
                            delay: i * 0.04 + 0.1,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] xl:text-[6vw] leading-none font-black text-zinc-300 z-10 pointer-events-none"
                          style={{
                            clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)",
                          }}
                        >
                          {char}
                        </motion.span>

                        {/* Bottom Slice Layer */}
                        <motion.span
                          initial={{ x: "-100%", opacity: 0 }}
                          animate={{ x: "100%", opacity: [0, 1, 0] }}
                          transition={{
                            duration: 0.7,
                            delay: i * 0.04 + 0.2,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] xl:text-[6vw] leading-none font-black text-sasori-red z-10 pointer-events-none"
                          style={{
                            clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)",
                          }}
                        >
                          {char}
                        </motion.span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </motion.div>
          
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="w-full text-center mt-4"
            >
               <h2 className="text-xl md:text-3xl text-black/40 font-bold tracking-[0.3em] uppercase">
                  {subtitle}
               </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-8 left-8 border-l border-t border-sasori-red/30 w-12 h-12" />
      <div className="absolute bottom-8 right-8 border-r border-b border-sasori-red/30 w-12 h-12" />
    </div>
  );
}
