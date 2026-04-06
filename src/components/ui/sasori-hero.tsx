"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { SasoriModernBackground } from "./sasori-modern-background";
import { Button } from "./button";
import { ArrowRight, Sparkles, Globe, Shield } from "lucide-react";
import { cn } from "../../lib/utils";

export function SasoriHero({ lang = "es" }: { lang?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
  };

  const springConfig = { damping: 25, stiffness: 150 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    mouseX.set(mousePos.x);
    mouseY.set(mousePos.y);
  }, [mousePos, mouseX, mouseY]);

  const words = {
    es: {
      tag: "Sasorilabs Innovation Hub",
      title1: "EL FUTURO SE CONSTRUYE",
      title2: "CON PRECISIÓN",
      subtitle: "Ingeniería FullStack de alto nivel y diseños 3D que desafían los límites de lo convencional y elevan cada px.",
      cta: "EXPLORAR ECOSISTEMA",
      stats: ["Seguro", "Global", "Eficiente"]
    },
    en: {
      tag: "Sasorilabs Innovation Hub",
      title1: "BUILD THE FUTURE",
      title2: "WITH PRECISION",
      subtitle: "High-level FullStack engineering and 3D designs that challenge conventional limits and elevate every px.",
      cta: "EXPLORE ECOSYSTEM",
      stats: ["Secure", "Global", "Efficient"]
    }
  }[lang] || {
    tag: "Sasorilabs Innovation Hub",
    title1: "BUILD THE FUTURE",
    title2: "WITH PRECISION",
    subtitle: "High-level FullStack engineering and 3D designs that challenge conventional limits and elevate every px.",
    cta: "EXPLORE ECOSYSTEM",
    stats: ["Secure", "Global", "Efficient"]
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
    >
      <SasoriModernBackground />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center gap-3 bg-sasori-grey/80 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 self-start shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-sasori-red" />
              <span className="text-xs font-black tracking-widest uppercase text-black/60">
                {words.tag}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] text-[#1A1A1A]">
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="block"
              >
                {words.title1}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="block text-sasori-red drop-shadow-[0_0_20px_rgba(243,6,19,0.3)]"
              >
                {words.title2}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="text-lg md:text-xl text-black/50 max-w-xl font-light leading-relaxed"
            >
              {words.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4 mt-4"
            >
              <Button className="group bg-black text-white px-8 py-7 rounded-2xl text-lg font-bold transition-all duration-300 hover:bg-sasori-red hover:shadow-[0_10px_30px_rgba(243,6,19,0.4)] border-0">
                {words.cta}
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
          </div>

          {/* 3D-Like Visualization Area */}
          <div className="lg:col-span-4 relative hidden lg:block h-[500px]">
            {/* Floating 3D Elements */}
            <motion.div
              style={{
                rotateX: useTransform(mouseY, [0, 2000], [15, -15]),
                rotateY: useTransform(mouseX, [0, 2000], [-15, 15]),
              }}
              className="absolute inset-0 bg-gradient-to-br from-white to-sasori-grey/50 rounded-3xl border border-black/5 shadow-2xl flex items-center justify-center overflow-hidden group perspective-1000"
            >
              <div className="absolute inset-0 bg-[url('/Logo.png')] bg-center bg-no-repeat bg-contain opacity-5 scale-150 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
              <motion.img
                src="/Logo.png"
                alt="Sasori Labs"
                className="w-48 h-48 object-contain drop-shadow-[0_35px_60px_-15px_rgba(243,6,19,0.5)] z-10"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Information Floating Cards */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2 z-20">
                {words.stats.map((stat, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-md p-3 rounded-xl border border-white flex items-center justify-between shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">{stat}</span>
                    <div className="w-2 h-2 bg-sasori-red rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Orbital Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-sasori-red/5 rounded-full pointer-events-none"
            >
              <div className="absolute top-0 left-1/2 w-4 h-4 bg-sasori-red rounded-full blur-[2px] -translate-x-1/2" />
            </motion.div>
          </div>

        </div>
      </div>

      {/* Background Parallax Words */}
      <motion.div
        style={{ x: useTransform(scrollYProgress, [0, 1], [0, 300]) }}
        className="absolute top-[20%] left-[-10%] text-[20vw] font-black text-black/[0.02] -z-10 whitespace-nowrap pointer-events-none"
      >
        FULLSTACK DESIGN LAB
      </motion.div>
    </section>
  );
}
