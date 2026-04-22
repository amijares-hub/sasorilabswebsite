"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/src/lib/utils";

type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: any;
};


const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);

  return (
    <motion.span
      className={cn("inline-block text-[#1A1A1A]", isSpace && "w-4")}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  );
};


const TextScrollAnimation = ({ 
  lang, 
  serviceName, 
  customText, 
  customHighlight, 
  customSubtext,
  children
}: { 
  lang: string, 
  serviceName?: string, 
  customText?: string, 
  customHighlight?: string, 
  customSubtext?: React.ReactNode,
  children?: React.ReactNode
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({ target: targetRef });

  const text = customText 
    ? customText 
    : serviceName 
      ? (lang === 'es' ? `descubre más sobre ` : lang === 'zh' ? '探索更多關於 ' : lang === 'ru' ? 'узнать больше о ' : lang === 'pt' ? 'descubra mais sobre ' : `discover more about `)
      : (lang === 'es' ? "descubre más de " : lang === 'zh' ? '更多來自 ' : lang === 'ru' ? 'узнать больше от ' : lang === 'pt' ? 'veja mais de ' : "discover more from ");
    
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <main className="w-full bg-[#EDEDED] relative overflow-hidden">
      {/* Metallic brushed grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

      {/* Scroll Indicator Accent */}
      <div className="hidden md:grid top-22 absolute left-1/2 z-10 -translate-x-1/2 content-start justify-items-center gap-6 text-center text-[#1A1A1A]">
        <span className="relative max-w-[12ch] text-[10px] md:text-xs uppercase leading-tight font-black tracking-widest opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-black/10 after:to-sasori-red after:content-['']">
          {lang === 'es' ? 'Desliza para explorar' : lang === 'zh' ? '滾動以探索' : lang === 'ru' ? 'Прокрутите для обзора' : lang === 'pt' ? 'Deslize para explorar' : 'Scroll to explore'}
        </span>
      </div>

      {/* Content Block — Animation */}
      <div
        ref={targetRef}
        className="relative box-border flex h-[140vh] flex-col items-center justify-center overflow-hidden bg-[#EDEDED] p-4 md:p-[2vw]"
      >
        <div
          className="w-full max-w-5xl text-center text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-8"
          style={{ perspective: "500px" }}
        >
          {characters.map((char, index) => (
            <CharacterV1
              key={index}
              char={char}
              index={index}
              centerIndex={centerIndex}
              scrollYProgress={scrollYProgress}
            />
          ))}
          <span className="text-sasori-red">{customHighlight || serviceName || "SASORILABS"}</span>
        </div>
        
         {customSubtext && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-3xl font-medium text-[#1A1A1A]/60 leading-relaxed text-center max-w-4xl"
            >
              {customSubtext}
            </motion.div>
         )}

         {children && (
           <div className="w-full mt-12 z-10">
             {children}
           </div>
         )}
      </div>
    </main>
  );
};

export { CharacterV1, TextScrollAnimation };
