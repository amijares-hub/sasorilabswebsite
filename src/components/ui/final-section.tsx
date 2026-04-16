import React from 'react';
import { ContainerScroll, BentoGrid, BentoCell, ContainerScale } from './hero-gallery-scroll-animation';
import { Button } from './button';
import { ArrowRight } from 'lucide-react';

const IMAGES = [
  "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1677442136019-21780ecad995?w=1200&q=80",
  "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1639762681485-074b7f938ba0?w=1200&q=80",
  "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1614850523296-d8c1af93d400?w=1200&q=80",
  "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1518770660439-4636190af475?w=1200&q=80",
  "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1451187580459-43490279c0fa?w=1200&q=80",
];

export function FinalSection({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const t = {
    es: {
      eyebrow: "SASORILABS",
      title: "Arquitectando\nEl Futuro",
      subtitle: "Transformamos ideas en experiencias digitales de alto impacto. Únete a las marcas que ya operan en la próxima generación.",
      cta: "Iniciar Proyecto",
      ctaSecondary: "Ver Casos de Éxito",
    },
    en: {
      eyebrow: "SASORILABS",
      title: "Architecting\nThe Future",
      subtitle: "We transform ideas into high-impact digital experiences. Join the brands already operating in the next generation.",
      cta: "Start Project",
      ctaSecondary: "View Case Studies",
    },
  }[lang];

  return (
    <div className="bg-black" id="final-section">
      <ContainerScroll className="h-[350vh] bg-black">
        <BentoGrid className="sticky left-0 top-0 z-0 h-screen w-full p-3 md:p-5">
          {IMAGES.map((imageUrl, index) => (
            <BentoCell
              key={index}
              className="overflow-hidden rounded-2xl shadow-2xl border border-white/5 relative group"
            >
              <img loading="lazy"
                className="size-full object-cover object-center brightness-50 group-hover:brightness-40 transition-all duration-700 group-hover:scale-105"
                src={imageUrl}
                alt=""
              />
              {/* Red tint overlay on hover */}
              <div className="absolute inset-0 bg-sasori-red/0 group-hover:bg-sasori-red/10 transition-all duration-700" />
            </BentoCell>
          ))}
        </BentoGrid>

        <ContainerScale className="relative z-10 text-center pointer-events-none px-4">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-sasori-red/40 bg-sasori-red/10 rounded-full pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-sasori-red animate-pulse shadow-[0_0_8px_#E20613]" />
            <span className="text-sasori-red text-xs font-black uppercase tracking-[0.3em]">{t.eyebrow}</span>
          </div>

          {/* Main title */}
          <h2 className="text-4xl sm:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white leading-none mb-8 text-shadow-heavy">
            {t.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {i === 1 ? <span className="text-sasori-red text-glow-red">{line}</span> : line}
                {i === 0 && <br />}
              </React.Fragment>
            ))}
          </h2>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/60 leading-relaxed mb-10 text-shadow-dark">
            {t.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <Button
              className="bg-sasori-red hover:bg-white hover:text-sasori-red text-white font-black uppercase tracking-widest rounded-full px-8 py-6 h-auto text-sm transition-all duration-300 shadow-[0_0_30px_rgba(226,6,19,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex gap-2 group"
            >
              {t.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white hover:text-black font-bold uppercase tracking-widest rounded-full px-8 py-6 h-auto text-sm transition-all duration-300"
            >
              {t.ctaSecondary}
            </Button>
          </div>
        </ContainerScale>
      </ContainerScroll>
    </div>
  );
}
