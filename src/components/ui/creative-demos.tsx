"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MoveRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

interface DemoItem {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  link: string;
}

interface CreativeDemosSectionProps {
  lang?: string;
  className?: string;
}

export function CreativeDemosSection({ lang = "es", className }: CreativeDemosSectionProps) {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const t = {
      es: {
        titlePrefix: "Laboratorio de",
        titleSuffix: "Experiencias",
        description: "Prototipos experimentales y despliegues técnicos de alta fidelidad. Mira lo que estamos construyendo en las fronteras de lo posible.",
        viewProject: "Explorar Demo",
      },
      en: {
        titlePrefix: "Experience",
        titleSuffix: "Laboratory",
        description: "Experimental prototypes and high-fidelity technical deployments. See what we are building at the frontiers of the possible.",
        viewProject: "Explore Demo",
      },
      zh: {
        titlePrefix: "體驗",
        titleSuffix: "實驗室",
        description: "實驗性原型和高保真技術部署。看看我們在可能性的前沿正在建造什麼。",
        viewProject: "探索演示",
      },
      ru: {
        titlePrefix: "Лаборатория",
        titleSuffix: "Опыта",
        description: "Экспериментальные прототипы и высокоточные технические решения. Посмотрите, что мы создаем на границе возможного.",
        viewProject: "Исследовать демо",
      },
      pt: {
        titlePrefix: "Laboratório de",
        titleSuffix: "Experiências",
        description: "Protótipos experimentais e implantações técnicas de alta fidelidade. Veja o que estamos construindo nas fronteiras do possível.",
        viewProject: "Explorar Demo",
      }
  }[lang as 'es' | 'en' | 'zh' | 'ru' | 'pt'] || {
      titlePrefix: "Experience",
      titleSuffix: "Laboratory",
      description: "Experimental prototypes and high-fidelity technical deployments.",
      viewProject: "Explore Demo",
  };

  const demos: DemoItem[] = [
    {
      id: 1,
      title: lang === 'es' ? "Agente de Voz Ultra-Realista" : "Ultra-Realistic Voice Agent",
      description: lang === 'es' ? "IA conversacional con latencia zero y matices humanos." : "Conversational AI with zero latency and human nuances.",
      category: "AI AUDIO",
      imageUrl: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1589254065878-42c9da997008?w=800&q=80",
      link: "/#contact"
    },
    {
      id: 2,
      title: lang === 'es' ? "E-commerce Espacial 3D" : "3D Spatial E-commerce",
      description: lang === 'es' ? "Navegación inmersiva para productos de alta gama." : "Immersive navigation for high-end products.",
      category: "CREATIVE WEB",
      imageUrl: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1633177317976-3f9bc45e1d1d?w=800&q=80",
      link: "/#contact"
    },
    {
      id: 3,
      title: lang === 'es' ? "Neural Predictor CRM" : "Neural Predictor CRM",
      description: lang === 'es' ? "Anticipación de churn basada en patrones cognitivos." : "Churn anticipation based on cognitive patterns.",
      category: "DATA ENGINE",
      imageUrl: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1551288049-bbdac8626ad1?w=800&q=80",
      link: "/#contact"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className={cn("py-24 px-6 bg-bg-dark relative overflow-hidden", className)}
    >
      {/* Background Tech Elements */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-8">
          <div className="max-w-2xl">
             <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-sasori-red" />
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-black/40">SHOWCASE TÉCNICO</span>
             </div>
             <h2 className="text-3xl sm:text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#1A1A1A] leading-none">
               {t.titlePrefix} <span className="text-sasori-red">{t.titleSuffix}</span>
             </h2>
             <p className="mt-6 text-black/60 text-lg md:text-xl font-medium leading-relaxed">
               {t.description}
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demos.map((demo, idx) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-700 metallic-vinotinto-card"
            >
              <div className="absolute inset-0">
                <img 
                  loading="lazy"
                  src={demo.imageUrl} 
                  alt={demo.title}
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-sasori-wine/40 to-transparent opacity-95 group-hover:opacity-60 transition-opacity duration-700" />
              </div>

              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-sasori-red mb-3">
                  {demo.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mb-4 group-hover:text-sasori-red transition-colors">
                  {demo.title}
                </h3>
                <p className="text-white/60 text-sm font-medium mb-8 line-clamp-2">
                  {demo.description}
                </p>
                
                <button
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/#contact');
                    }
                  }}
                  className="flex items-center gap-3 w-fit text-[10px] font-black uppercase tracking-[0.2em] py-4 px-8 rounded-full border border-white/20 bg-white/5 text-white hover:bg-sasori-red hover:text-white transition-all duration-500"
                >
                  {t.viewProject}
                  <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              {/* Modern Tech Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rotate-45 translate-x-[50%] translate-y-[-50%] border-l border-b border-white/10 z-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
