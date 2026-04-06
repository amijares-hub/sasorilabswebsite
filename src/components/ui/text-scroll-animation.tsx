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


const TextScrollAnimation = ({ lang, serviceName }: { lang: string, serviceName?: string }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({ target: targetRef });

  const text = serviceName 
    ? (lang === 'es' ? `descubre más sobre ` : lang === 'zh' ? '了解更多關於 ' : lang === 'ru' ? 'узнать больше о ' : lang === 'pt' ? 'descubra mais sobre ' : `see more about `)
    : (lang === 'es' ? "descubre más de " : lang === 'zh' ? '更多來自 ' : lang === 'ru' ? 'узнать больше от ' : lang === 'pt' ? 'veja mais de ' : "see more from ");
    
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <main className="w-full bg-[#EDEDED] relative overflow-hidden">
      {/* Metallic brushed grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

      {/* Шапка-подсказка */}
      <div className="top-22 absolute left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-[#1A1A1A]">
        <span className="relative max-w-[12ch] text-[10px] md:text-xs uppercase leading-tight font-black tracking-widest opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-black/10 after:to-sasori-red after:content-['']">
          {lang === 'es' ? 'Desliza para ver más' : lang === 'zh' ? '滑動查看更多' : lang === 'ru' ? 'Прокрутите, чтобы увидеть больше' : lang === 'pt' ? 'Deslize para ver mais' : 'Scroll to see more'}
        </span>
      </div>

      {/* Блок 1 — текст */}
      <div
        ref={targetRef}
        className="relative box-border flex h-[140vh] items-center justify-center overflow-hidden bg-[#EDEDED] p-4 md:p-[2vw]"
      >
        <div
          className="w-full max-w-4xl text-center text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A]"
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
          <span className="text-sasori-red">{serviceName || "SASORILABS"}</span>
        </div>
      </div>
    </main>
  );
};

export { CharacterV1, TextScrollAnimation };
