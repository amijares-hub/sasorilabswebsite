"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AiCloudIcon,
  SmartPhone01Icon,
  CheckmarkCircle01Icon,
  DashboardSquare01Icon,
  MagicWandIcon,
  CpuIcon,
  Globe02Icon,
  DatabaseIcon,
  Shield01Icon,
  Brain01Icon,
  RocketIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "../../lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";

const FEATURES_DATA = {
  es: [
    {
      id: "ai-orchestration",
      label: "Orquestación IA",
      icon: Brain01Icon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1677442136019-21780ecad995?q=80&w=1200",
      description: "Cerebros digitales que orquestan operaciones complejas de forma independiente.",
    },
    {
      id: "spatial-computing",
      label: "Spatial Computing",
      icon: Globe02Icon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1639762681485-074b7f938ba0?q=80&w=1200",
      description: "Entornos cinéticos de gravedad cero y arquitecturas de próxima generación.",
    },
    {
      id: "legacy-transmutation",
      label: "Transmutación Legacy",
      icon: DatabaseIcon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1614850523296-d8c1af93d400?q=80&w=1200",
      description: "Transmutación de infraestructura legacy a sistemas de alto rendimiento.",
    },
    {
      id: "asset-shielding",
      label: "Blindaje de Activos",
      icon: Shield01Icon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1550751827-4bd374c3f58b?q=80&w=1200",
      description: "Privacidad activa y seguridad de grado bancario para la era digital.",
    },
    {
      id: "cognitive-retail",
      label: "Retail Cognitivo",
      icon: DashboardSquare01Icon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1460925895917-afdab827c52f?q=80&w=1200",
      description: "Arquitecturas de e-commerce optimizadas para la conversión cognitiva.",
    },
    {
      id: "rag-systems",
      label: "Sistemas RAG",
      icon: CpuIcon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1518770660439-4636190af475?q=80&w=1200",
      description: "Sistemas de memoria a largo plazo para interacciones de IA hiper-naturales.",
    },
    {
      id: "digital-sovereignty",
      label: "Soberanía Digital",
      icon: RocketIcon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1451187580459-43490279c0fa?q=80&w=1200",
      description: "Digitalización total e independencia operativa para tu marca.",
    },
    {
      id: "magic-automation",
      label: "Automatización Mágica",
      icon: MagicWandIcon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1485827404703-89b55fcc595e?q=80&w=1200",
      description: "Deja que la IA maneje las tareas repetitivas con precisión quirúrgica.",
    },
  ],
  en: [
    {
      id: "ai-orchestration",
      label: "AI Orchestration",
      icon: Brain01Icon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1677442136019-21780ecad995?q=80&w=1200",
      description: "Digital brains orchestrating complex operations independently.",
    },
    {
      id: "spatial-computing",
      label: "Spatial Computing",
      icon: Globe02Icon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1639762681485-074b7f938ba0?q=80&w=1200",
      description: "Zero-gravity kinetic environments and next-gen architectures.",
    },
    {
      id: "legacy-transmutation",
      label: "Legacy Transmutation",
      icon: DatabaseIcon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1614850523296-d8c1af93d400?q=80&w=1200",
      description: "Transmuting legacy infrastructure into high-performance systems.",
    },
    {
      id: "asset-shielding",
      label: "Asset Shielding",
      icon: Shield01Icon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1550751827-4bd374c3f58b?q=80&w=1200",
      description: "Active privacy and bank-grade security for the digital age.",
    },
    {
      id: "cognitive-retail",
      label: "Cognitive Retail",
      icon: DashboardSquare01Icon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1460925895917-afdab827c52f?q=80&w=1200",
      description: "E-commerce architectures optimized for cognitive conversion.",
    },
    {
      id: "rag-systems",
      label: "RAG Systems",
      icon: CpuIcon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1518770660439-4636190af475?q=80&w=1200",
      description: "Long-term memory systems for hyper-natural AI interactions.",
    },
    {
      id: "digital-sovereignty",
      label: "Digital Sovereignty",
      icon: RocketIcon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1451187580459-43490279c0fa?q=80&w=1200",
      description: "Total digitalization and operational independence for your brand.",
    },
    {
      id: "magic-automation",
      label: "Magic Automation",
      icon: MagicWandIcon,
      image: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1485827404703-89b55fcc595e?q=80&w=1200",
      description: "Let AI handle the repetitive tasks with surgical precision.",
    },
  ],
};

const AUTO_PLAY_INTERVAL = 4000;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const FEATURES = FEATURES_DATA[lang];

  const currentIndex =
    ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div className="w-full max-w-7xl mx-auto md:p-8">
      <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16 bg-[#E20613] ">
          <div className="absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 bg-gradient-to-b from-[#E20613] via-[#E20613]/80 to-transparent z-40" />
          <div className="absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 bg-gradient-to-t from-[#E20613] via-[#E20613]/80 to-transparent z-40" />
          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {FEATURES.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(FEATURES.length / 2),
                FEATURES.length / 2,
                distance
              );

              return (
                <motion.div
                  key={feature.id}
                  style={{
                    height: ITEM_HEIGHT,
                    width: "fit-content",
                  }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 22,
                    mass: 1,
                  }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-4 px-6 md:px-10 lg:px-8 py-3.5 md:py-5 lg:py-4 rounded-full transition-all duration-700 text-left group border",
                      isActive
                        ? "bg-white text-[#E20613] border-white z-10"
                        : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-colors duration-500",
                        isActive ? "text-[#E20613]" : "text-white/40"
                      )}
                    >
                      <HugeiconsIcon
                        icon={feature.icon}
                        size={18}
                        strokeWidth={2}
                      />
                    </div>

                    <span className="font-bold text-sm md:text-[15px] tracking-tight whitespace-nowrap uppercase">
                      {feature.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative bg-black/40 flex items-center justify-center py-10 md:py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10">
          <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
            {FEATURES.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 rounded-[2rem] md:rounded-[2.8rem] overflow-hidden border-4 md:border-8 border-[#0a0a0a] bg-[#0a0a0a] origin-center shadow-2xl"
                >
                  <img loading="lazy"
                    src={feature.image}
                    alt={feature.label}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive
                        ? "grayscale-0 blur-0"
                        : "grayscale blur-[2px] brightness-75"
                    )}
                    referrerPolicy="no-referrer"
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-10 pt-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div className="bg-sasori-red text-white px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] w-fit shadow-lg mb-3 border border-white/10">
                          {index + 1} • {feature.label}
                        </div>
                        <p className="text-white font-bold text-xl md:text-2xl leading-tight drop-shadow-md tracking-tight uppercase">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "absolute top-8 left-8 flex items-center gap-3 transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div className="w-2 h-2 rounded-full bg-sasori-red shadow-[0_0_10px_#E20613]" />
                    <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.3em] font-mono">
                      Sasorilabs Protocol
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
