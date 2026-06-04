"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, UserCheck } from "lucide-react";
import { cn } from "../../lib/utils";

const slides = [
  {
    img: "/Imagenes/Backgrounds/GD.png",
    client: "GalaxyDust",
    quote: {
      es: "Sasorilabs transformó nuestra presencia digital con una automatización sin precedentes.",
      en: "Sasorilabs transformed our digital presence with unprecedented automation.",
      zh: "Sasorilabs 以史无前例的自动化改变了我们的数字形象。",
      ru: "Sasorilabs преобразил наше цифровое присутствие с беспрецедентной автоматизацией.",
      pt: "Sasorilabs transformou nossa presença digital com uma automação sem precedentes."
    },
    url: "https://galaxydust.io/"
  },
  {
    img: "/Imagenes/Backgrounds/SasoriMusic.png",
    client: "SasoriMusic",
    quote: {
      es: "La mejor experiencia inmersiva que hemos construido para nuestros artistas.",
      en: "The best immersive experience we've built for our artists.",
      zh: "我们为艺术家打造的最佳沉浸式体验。",
      ru: "Лучший иммерсивный опыт, который мы создали для наших артистов.",
      pt: "A melhor experiência imersiva que construímos para nossos artistas."
    },
    url: "https://sasorimusic-app-google-ai-studio.vercel.app/#/login"
  },
];

export default function ClientSlideshow({ lang = "es" }: { lang?: string }) {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-play every 8 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  const t = {
    es: { badge: "CLIENTES SATISFECHOS", viewWebsite: "VISITAR SITIO WEB", counter: "CLIENTES SATISFECHOS", result: "RESULTADO EXITOSO" },
    en: { badge: "SATISFIED CLIENTS", viewWebsite: "VISIT WEBSITE", counter: "SATISFIED CLIENTS", result: "SUCCESSFUL RESULT" },
    zh: { badge: "滿意客戶", viewWebsite: "訪問網站", counter: "滿意客戶", result: "成功结果" },
    ru: { badge: "ДОВОЛЬНЫЕ КЛИЕНТЫ", viewWebsite: "ПОСЕТИТЬ САЙТ", counter: "ДОВОЛЬНЫЕ КЛИЕНТЫ", result: "УСПЕШНЫЙ РЕЗУЛЬТАТ" },
    pt: { badge: "CLIENTES SATISFEITOS", viewWebsite: "VISITAR SITE", counter: "CLIENTES SATISFEITOS", result: "RESULTADO DE SUCESSO" }
  }[lang as 'es' | 'en' | 'zh' | 'ru' | 'pt'] || { badge: "SATISFIED CLIENTS" };

  return (
    <section className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden bg-black group/slideshow">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-cover bg-center cursor-pointer group/slide"
          onClick={() => slides[current].url && window.open(slides[current].url, "_blank")}
          style={{ backgroundImage: `url(${slides[current].img})` }}
        >
          {/* Overlay for cinematic feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-sasori-red/5 mix-blend-overlay" />
          
          {/* Content Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-[1px] w-12 bg-sasori-red/50" />
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sasori-red" />
                <span className="text-sasori-red text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-sm">
                  {t.badge}
                </span>
              </div>
              <div className="h-[1px] w-12 bg-sasori-red/50" />
            </motion.div>

            <div className="overflow-hidden py-4 mb-4">
               <motion.span 
                 initial={{ y: "110%" }}
                 animate={{ y: 0 }}
                 transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                 className="block text-5xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none italic drop-shadow-2xl"
               >
                 {slides[current].client}
               </motion.span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <span className="text-sasori-red/60 text-[8px] font-black tracking-[0.3em] uppercase mb-4 block">
                {t.result}
              </span>
              <p className="text-white/80 text-lg md:text-2xl font-medium italic border-l-2 border-sasori-red/30 pl-6 leading-relaxed">
                "{slides[current].quote[lang as 'es' | 'en' | 'zh' | 'ru' | 'pt'] || slides[current].quote.en}"
              </p>

               {/* Hover Hint */}
               <motion.div 
                 className="mt-10 flex items-center justify-center gap-2 text-sasori-red text-[10px] font-black tracking-[0.2em] opacity-0 group-hover/slide:opacity-100 transition-all duration-300"
               >
                 <span>{t.viewWebsite}</span>
                 <ArrowRight className="w-4 h-4" />
               </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 left-0 w-full px-12 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={prevSlide}
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md text-white hover:bg-sasori-red hover:border-sasori-red transition-all duration-500 group/btn shadow-2xl"
          >
            <ArrowLeft className="w-6 h-6 group-hover/btn:-translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md text-white hover:bg-sasori-red hover:border-sasori-red transition-all duration-500 group/btn shadow-2xl"
          >
            <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Counter */}
        <div className="hidden md:flex items-center gap-4 pointer-events-auto">
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-sasori-red uppercase tracking-[0.2em]">{t.counter}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white leading-none">0{current + 1}</span>
              <span className="text-white/20 text-xl font-bold">/</span>
              <span className="text-white/40 text-sm font-black">0{slides.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Decorative Text */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 h-fit hidden lg:flex flex-col items-center gap-12 text-white/10 pointer-events-none uppercase font-black text-xs tracking-[1em] [writing-mode:vertical-lr]">
        <span>SASORILABS ECOSYSTEM</span>
        <div className="w-[1px] h-24 bg-white/10" />
        <span>EST. 2026</span>
      </div>

      {/* Bottom Progress Bars */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] flex gap-1 z-20">
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-full bg-white/10 relative overflow-hidden">
            {i === current && (
              <motion.div
                layoutId="slide-progress"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 8, ease: "linear" }}
                className="absolute inset-0 bg-sasori-red"
              />
            )}
            {i < current && <div className="absolute inset-0 bg-sasori-red/40" />}
          </div>
        ))}
      </div>
    </section>
  );
}
