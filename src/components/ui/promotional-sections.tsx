import React, { useEffect, useRef } from 'react';
import { 
  Bot, BrainCircuit, Users, Sparkles, TrendingUp,
  MousePointerClick, Box, LayoutDashboard, Smartphone, Diamond,
  Zap, Rocket, ShieldCheck, Timer, PiggyBank,
  Settings
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { translations } from '../../i18n/translations';

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface PromoSectionProps {
  titleStart: string;
  titleHighlight: string;
  titleEnd?: string;
  subtitle: string;
  features: Feature[];
  logoPosition: 'left' | 'right';
  className?: string;
}

export function PromoSection({ 
  titleStart, 
  titleHighlight, 
  titleEnd = "", 
  subtitle, 
  features, 
  logoPosition,
  className = ""
}: PromoSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !logoRef.current || !cardRef.current) return;

    const items = cardRef.current.querySelectorAll('.feature-item');

    // Float animation for logo
    gsap.to(logoRef.current, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    const isMobile = window.innerWidth < 768;

    // Reveal animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: isMobile ? 'top bottom+=400' : 'top 75%',
        end: 'bottom 25%',
        toggleActions: 'play none none reverse'
      }
    });

    const isLeft = logoPosition === 'left';

    if (isMobile) {
      // Entrada cinemática personalizada para mobile: Logo (izquierda -> derecha) y Card (derecha -> izquierda)
      tl.fromTo(logoRef.current, 
        { opacity: 0, x: -50, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(cardRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(items,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        '-=0.4'
      );
    } else {
      // Original desktop animations
      tl.fromTo(logoRef.current, 
        { opacity: 0, scale: 0.8, x: isLeft ? -50 : 50 },
        { opacity: 1, scale: 1, x: 0, duration: 1, ease: 'power3.out' }
      )
      .fromTo(cardRef.current,
        { opacity: 0, x: isLeft ? 50 : -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(items,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        '-=0.4'
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [logoPosition]);

  return (
    <section ref={containerRef} className={`relative z-20 py-10 md:py-24 bg-bg-dark overflow-hidden ${className}`}>
      {/* Background glow effects */}
      <div className={`absolute top-1/2 ${logoPosition === 'left' ? 'left-1/4' : 'right-1/4'} -translate-y-1/2 w-96 h-96 bg-sasori-red/5 rounded-full blur-[100px] pointer-events-none`} />
      <div className={`absolute top-1/2 ${logoPosition === 'left' ? 'right-1/4' : 'left-1/4'} -translate-y-1/2 w-[500px] h-[500px] bg-sasori-red/3 rounded-full blur-[120px] pointer-events-none`} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Logo */}
          <div className={`flex justify-center items-center relative perspective-[1000px] p-6 lg:p-10 ${logoPosition === 'right' ? 'lg:order-2' : ''}`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-sasori-red/10 to-transparent rounded-full blur-3xl opacity-50" />
            <img 
              ref={logoRef}
              src="/Logo.png" 
              alt="Sasorilabs Logo" 
              className="w-full max-w-[500px] drop-shadow-[0_0_40px_rgba(226,6,19,0.5)] z-10"
            />
          </div>

          {/* Promotion Box */}
          <div 
            ref={cardRef} 
            className={`metallic-vinotinto-card p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden ${logoPosition === 'right' ? 'lg:order-1' : ''}`}
          >
            {/* Cinematic overlay for the card */}
            <div className={`absolute top-0 ${logoPosition === 'left' ? 'right-0' : 'left-0'} w-64 h-64 bg-sasori-red/20 blur-[80px] -translate-y-1/2 ${logoPosition === 'left' ? 'translate-x-1/2' : '-translate-x-1/2'} rounded-full pointer-events-none`} />
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 uppercase tracking-tight leading-tight">
              {titleStart} <span className="text-sasori-red">{titleHighlight}</span><br/> {titleEnd}
            </h2>
            <p className="text-lg md:text-xl text-white/70 font-light mb-10 tracking-wide border-l-4 border-sasori-red pl-4">
              {subtitle}
            </p>

            <div className="space-y-8 relative z-10">
              {features.map((feature, idx) => (
                <div key={idx} className="feature-item flex gap-5 group">
                  <div className="shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-sasori-red group-hover:border-sasori-red transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:shadow-[0_0_25px_rgba(226,6,19,0.5)] group-hover:-translate-y-1">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-white mb-1 uppercase tracking-wider group-hover:text-sasori-red transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-white/60 text-sm md:text-base leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// Componente de aglomeración 
// -------------------------------------------------------------
export function CombinedPromotionalSections({ lang = 'es' }: { lang?: string }) {
  const t = translations[lang as keyof typeof translations]?.promotions;
  
  if (!t) return null;

  const section1Icons = [
    <Bot size={24} className="text-white" />,
    <BrainCircuit size={24} className="text-white" />,
    <Users size={24} className="text-white" />,
    <Sparkles size={24} className="text-white" />,
    <TrendingUp size={24} className="text-white" />
  ];

  const section2Icons = [
    <MousePointerClick size={24} className="text-white" />,
    <Box size={24} className="text-white" />,
    <LayoutDashboard size={24} className="text-white" />,
    <Smartphone size={24} className="text-white" />,
    <Diamond size={24} className="text-white" />
  ];

  const section3Icons = [
    <Rocket size={24} className="text-white" />,
    <Zap size={24} className="text-white" />,
    <ShieldCheck size={24} className="text-white" />,
    <Timer size={24} className="text-white" />,
    <Settings size={24} className="text-white" />
  ];

  return (
    <div className="flex flex-col bg-bg-dark">
      <PromoSection 
        titleStart={t.section1.titleStart}
        titleHighlight={t.section1.titleHighlight}
        titleEnd={t.section1.titleEnd}
        subtitle={t.section1.subtitle}
        features={t.section1.features.map((f, i) => ({ ...f, icon: section1Icons[i] }))}
        logoPosition="left"
      />
      <PromoSection 
        titleStart={t.section2.titleStart}
        titleHighlight={t.section2.titleHighlight}
        subtitle={t.section2.subtitle}
        features={t.section2.features.map((f, i) => ({ ...f, icon: section2Icons[i] }))}
        logoPosition="right"
      />
      <PromoSection 
        titleStart={t.section3.titleStart}
        titleHighlight={t.section3.titleHighlight}
        titleEnd={t.section3.titleEnd}
        subtitle={t.section3.subtitle}
        features={t.section3.features.map((f, i) => ({ ...f, icon: section3Icons[i] }))}
        logoPosition="left"
      />
    </div>
  );
}
