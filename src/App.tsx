/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Menu, X, ArrowRight, Code, Rocket, ShieldCheck,
  Globe, Cpu, Database, Zap, Languages,
  FileCode, Activity, ChevronRight,
  Brain, Monitor, Layers, Settings, Globe2, Terminal,
  Home, Eye, Shield, Box, Search, Palette, BookOpen, FileText, Newspaper
} from 'lucide-react';
import { BackgroundPaths } from './components/ui/background-paths';
import { ParticleTextEffect } from './components/ui/particle-text-effect';
import { AnimatedNavFramer } from './components/ui/navigation-menu';
import { SasoriLogo } from './components/ui/sasori-logo';
import { ZoomParallax } from './components/ui/zoom-parallax';
import { TextScrollAnimation } from './components/ui/text-scroll-animation';
import { Timeline } from './components/ui/timeline';
import { PremiumContact } from './components/ui/premium-contact';
import { TextHoverEffect, FooterBackgroundGradient } from './components/ui/hover-footer';
import { ServicesScrollFX } from './components/ui/services-scroll-fx';
import {
  AIAutomationPage,
  ImmersiveWebsPage,
  ModernizationPage,
} from './pages/service-pages';
import { ContactPage } from './pages/contact-page';
import BlogPage from './pages/blog-page';
import { BlogDetailPage } from './pages/blog-detail-page';
import { LoginPage } from './pages/login-page';
import { DashboardPage } from './pages/dashboard-page';
import { UserAuthPage } from './pages/user-auth-page';
import { UserAccountPage } from './pages/user-account-page';
import { UnsubscribePage } from './pages/unsubscribe-page';
import { Footer } from './components/ui/footer';
import { BlogPostSection } from './components/ui/blog-posts';
import { NewsletterPopup } from './components/ui/newsletter';
import Lenis from '@studio-freight/lenis';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Translations ---
const translations = {
  es: {
    nav: {
      services: "Servicios",
      blog: "Blog",
    },
    entrance: {
      tagline: "Arquitectando el Futuro",
    },
    hero: {
      headline: "DIGITALIZA TU NEGOCIO AHORA",
      subheadline: "ES MÁS FÁCIL Y RÁPIDO DE LO QUE PIENSAS.",
      cta_start: "INICIAR PROYECTO",
      cta_showcase: "VER SHOWCASE",
      words: ["AUTOMATIZACIÓN", "IA", "WEBS", "INMERSIVAS", "MODERNIZACIÓN", "DIGITAL"],
    },
    services: {
      section_title: "SERVICIOS CENTRALES",
      ai: {
        title: "Automatización IA",
        desc: "Creación de 'Cerebros Digitales' que orquestan operaciones complejas de forma independiente.",
        items: [
          "Orquestación de Agentes Multi-Modelo",
          "Sistemas de Memoria de Largo Plazo (RAG)",
          "Interfaces de Voz y Texto Hiper-Naturales"
        ]
      },
      web: {
        title: "Webs Inmersivas",
        desc: "Entornos cinéticos de gravedad cero y arquitecturas de próxima generación.",
        items: [
          "Apps de Próxima Generación (Spatial Computing)",
          "E-commerce de Conversión Cognitiva (Retail 3.0)",
          "Arquitectura Cinética de Alta Fidelidad"
        ]
      },
      modernization: {
        title: "Modernización de Negocios",
        desc: "Transmutación de infraestructura legacy a sistemas de alto rendimiento.",
        items: [
          "Digitalización Total y Soberanía Operativa",
          "Blindaje de Activos y Privacidad Activa",
          "Ingeniería Inversa Propietaria"
        ]
      }
    },
    footer: {
      desc: "Desarrollo de software premium para marcas de alta gama que buscan la excelencia digital.",
      rights: "© 2026 SASORILABS. TODOS LOS DERECHOS RESERVADOS.",
    }
  },
  en: {
    nav: {
      services: "Services",
      blog: "Blog",
    },
    entrance: {
      tagline: "Architecting the Future",
    },
    hero: {
      headline: "DIGITALIZE YOUR BUSINESS NOW",
      subheadline: "IT'S EASIER AND FASTER THAN YOU THINK.",
      cta_start: "START PROJECT",
      cta_showcase: "VIEW SHOWCASE",
      words: ["AUTOMATION", "AI", "IMMERSIVE", "WEBS", "MODERNIZATION", "DIGITAL"],
    },
    services: {
      section_title: "CORE SERVICES",
      ai: {
        title: "AI Automation",
        desc: "Creation of 'Digital Brains' that orchestrate complex operations independently.",
        items: [
          "Multi-Model Agent Orchestration",
          "Long-Term Memory Systems (RAG)",
          "Hyper-Natural Voice & Text Interfaces"
        ]
      },
      web: {
        title: "Immersive Webs",
        desc: "Zero-gravity kinetic environments and next-generation architectures.",
        items: [
          "Next-Gen Apps (Spatial Computing)",
          "Cognitive Conversion E-commerce (Retail 3.0)",
          "High-Fidelity Kinetic Architecture"
        ]
      },
      modernization: {
        title: "Business Modernization",
        desc: "Transmutation of legacy infrastructure to high-performance systems.",
        items: [
          "Total Digitalization & Operational Sovereignty",
          "Asset Shielding & Active Privacy",
          "Proprietary Reverse Engineering"
        ]
      }
    },
    footer: {
      desc: "Premium software development for high-end brands seeking digital excellence.",
      rights: "© 2026 SASORILABS. ALL RIGHTS RESERVED.",
    }
  },
  zh: {
    nav: {
      services: "服務",
      blog: "部落格",
    },
    entrance: {
      tagline: "建築未來",
    },
    hero: {
      headline: "立即數位化您的業務",
      subheadline: "這比您想像的更簡單、更快捷。",
      cta_start: "啟動項目",
      cta_showcase: "查看案例",
      words: ["自動化", "人工智能", "沉浸式", "網頁", "現代化", "數位"],
    },
    services: {
      section_title: "核心服務",
      ai: {
        title: "人工智能自動化",
        desc: "創建獨立協調複雜操作的「數位大腦」。",
        items: [
          "多模型代理協調",
          "長期記憶系統 (RAG)",
          "超自然語音與文字界面"
        ]
      },
      web: {
        title: "沉浸式網站",
        desc: "零重力動力環境與下一代架構。",
        items: [
          "下一代應用 (空間計算)",
          "認知轉換電子商務 (零售 3.0)",
          "高保真動力建築"
        ]
      },
      modernization: {
        title: "業務現代化",
        desc: "將傳統基礎設施轉變為高性能系統。",
        items: [
          "全面數位化與運營主權",
          "資產屏蔽與主動隱私",
          "專有反向工程"
        ]
      }
    },
    footer: {
      desc: "為尋求卓越數位的優質品牌提供頂級軟件開發服務。",
      rights: "© 2026 SASORILABS。 版權所有。",
    }
  },
  ru: {
    nav: {
      services: "Услуги",
      blog: "Блог",
    },
    entrance: {
      tagline: "Проектирование будущего",
    },
    hero: {
      headline: "ЦИФРОВИЗИРУЙТЕ СВОЙ БИЗНЕС СЕЙЧАС",
      subheadline: "ЭТО ПРОЩЕ И БЫСТРЕЕ, ЧЕМ ВЫ ДУМАЕТЕ.",
      cta_start: "НАЧАТЬ ПРОЕКТ",
      cta_showcase: "СМОТРЕТЬ КЕЙСЫ",
      words: ["АВТОМАТИЗАЦИЯ", "ИИ", "ИММЕРСИВНЫЙ", "ВЕБ", "МОДЕРНИЗАЦИЯ", "ЦИФРА"],
    },
    services: {
      section_title: "ОСНОВНЫЕ УСЛУГИ",
      ai: {
        title: "ИИ Автоматизация",
        desc: "Создание «цифровых мозгов», которые независимо координируют сложные операции.",
        items: [
          "Оркестрация мультимодальных агентов",
          "Системы долгосрочной памяти (RAG)",
          "Гипернатуральные голосовые и текстовые интерфейсы"
        ]
      },
      web: {
        title: "Иммерсивные Веб-сайты",
        desc: "Кинетическая среда с нулевой гравитацией и архитектура следующего поколения.",
        items: [
          "Приложения следующего поколения (пространственные вычисления)",
          "E-commerce с когнитивной конверсией (Retail 3.0)",
          "Высокоточная кинетическая архитектура"
        ]
      },
      modernization: {
        title: "Модернизация Бизнеса",
        desc: "Трансформация устаревшей инфраструктуры в высокопроизводительные системы.",
        items: [
          "Полная цифровизация и операционный суверенитет",
          "Защита активов и активная конфиденциальность",
          "Собственная обратная разработка"
        ]
      }
    },
    footer: {
      desc: "Разработка программного обеспечения премиум-класса для брендов, стремящихся к цифровому совершенству.",
      rights: "© 2026 SASORILABS. ВСЕ ПРАВА ЗАЩИЩЕНЫ.",
    }
  },
  pt: {
    nav: {
      services: "Serviços",
      blog: "Blog",
    },
    entrance: {
      tagline: "Arquitetando o Futuro",
    },
    hero: {
      headline: "DIGITALIZE O SEU NEGÓCIO AGORA",
      subheadline: "É MAIS FÁCIL E RÁPIDO DO QUE VOCÊ PENSA.",
      cta_start: "INICIAR PROJETO",
      cta_showcase: "VER SHOWCASE",
      words: ["AUTOMAÇÃO", "IA", "IMERSIVO", "WEBS", "MODERNIZAÇÃO", "DIGITAL"],
    },
    services: {
      section_title: "SERVIÇOS PRINCIPAIS",
      ai: {
        title: "Automação IA",
        desc: "Criação de 'Cérebros Digitais' que orquestram operações complexas de forma independente.",
        items: [
          "Orquestração de Agentes Multimodais",
          "Sistemas de Memória de Longo Prazo (RAG)",
          "Interfaces de Voz e Texto Hiper-Naturais"
        ]
      },
      web: {
        title: "Webs Imersivas",
        desc: "Ambientes cinéticos de gravidade zero e arquiteturas de próxima geração.",
        items: [
          "Apps de Próxima Geração (Computação Espacial)",
          "E-commerce de Conversão Cognitiva (Varejo 3.0)",
          "Arquitetura Cinética de Alta Fidelidade"
        ]
      },
      modernization: {
        title: "Modernização de Negócios",
        desc: "Transmutação de infraestrutura legada para sistemas de alto desempenho.",
        items: [
          "Digitalização Total e Soberania Operacional",
          "Blindagem de Ativos e Privacidade Ativa",
          "Engenharia Reversa Proprietária"
        ]
      }
    },
    footer: {
      desc: "Desenvolvimento de software premium para marcas de alto padrão que buscam excelência digital.",
      rights: "© 2026 SASORILABS. TODOS OS DIREITOS RESERVADOS.",
    }
  }
};

// --- Components ---

const MatrixRain = ({ color = '#E20613', opacity = 0.15 }: { color?: string; opacity?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const columns = Math.floor(width / 20);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = `rgba(10, 10, 10, ${opacity})`;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(Math.random() * 128);
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [color, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
};

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Standard scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Sometimes scroll preservation kicks in, so we force it again
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
}

// Claymorphic Service Tile for Timeline
const ServiceIconTile = ({ icon: Icon }: { icon: any }) => (
  <div className="relative aspect-square md:aspect-video lg:aspect-square w-full bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[12px_12px_24px_rgba(0,0,0,0.5),-4px_-4px_12px_rgba(255,255,255,0.01)] flex items-center justify-center p-12 group">
    {/* Neomorphic subtle light source */}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

    {/* Inner claymorphic container for icon */}
    <div className="relative p-8 md:p-12 rounded-[2rem] bg-[#121212] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(255,255,255,0.02)] border border-white/5 flex items-center justify-center group-hover:shadow-[0_0_40px_rgba(226,6,19,0.15)] transition-all duration-500">
      <Icon className="text-sasori-red w-16 h-16 md:w-24 md:h-24 drop-shadow-[0_0_15px_#E20613] group-hover:scale-110 transition-transform duration-500" />
    </div>

    {/* Subtle glow effect */}
    <div className="absolute inset-0 bg-sasori-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl -z-10" />
  </div>
);

export default function App() {
  const [lang, setLang] = useState<keyof typeof translations>(() => {
    const saved = localStorage.getItem('sasori-lang');
    if (saved && saved in translations) return saved as keyof typeof translations;
    return 'es';
  });
  useEffect(() => {
    localStorage.setItem('sasori-lang', lang);
  }, [lang]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const entranceRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navLogoRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];

  const timelineData = [
    {
      title: t.services.ai.title,
      content: (
        <div className="reveal">
          <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
            {t.services.ai.desc}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <ServiceIconTile icon={Brain} />
            <div className="flex flex-col justify-center space-y-4 p-6 md:p-8 glass-card rounded-2xl border-white/5">
              {t.services.ai.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-lg md:text-xl font-bold uppercase tracking-tight text-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-sasori-red shadow-[0_0_12px_#E20613]" />
                  {item}
                </div>
              ))}
              <div className="pt-4">
                <button
                  onClick={() => {
                    navigate('/services/ai-automation');
                    window.scrollTo(0, 0);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sasori-red text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-sasori-red transition-all shadow-lg"
                >
                  {lang === 'es' ? 'Ver Detalles' : lang === 'en' ? 'View Details' : lang === 'zh' ? '查看詳情' : lang === 'ru' ? 'Подробнее' : lang === 'pt' ? 'Ver Detalhes' : 'View Details'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t.services.web.title,
      content: (
        <div className="reveal">
          <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
            {t.services.web.desc}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="flex flex-col justify-center space-y-4 p-6 md:p-8 glass-card rounded-2xl border-white/5 order-2 lg:order-1">
              {t.services.web.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-lg md:text-xl font-bold uppercase tracking-tight text-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-sasori-red shadow-[0_0_12px_#E20613]" />
                  {item}
                </div>
              ))}
              <div className="pt-4">
                <button
                  onClick={() => {
                    navigate('/services/immersive-webs');
                    window.scrollTo(0, 0);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sasori-red text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-sasori-red transition-all shadow-lg"
                >
                  {lang === 'es' ? 'Ver Detalles' : lang === 'en' ? 'View Details' : lang === 'zh' ? '查看詳情' : lang === 'ru' ? 'Подробнее' : lang === 'pt' ? 'Ver Detalhes' : 'View Details'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <ServiceIconTile icon={Monitor} />
          </div>
        </div>
      ),
    },
    {
      title: t.services.modernization.title,
      content: (
        <div className="reveal">
          <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
            {t.services.modernization.desc}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <ServiceIconTile icon={Layers} />
            <div className="flex flex-col justify-center space-y-4 p-6 md:p-8 glass-card rounded-2xl border-white/5">
              {t.services.modernization.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-lg md:text-xl font-bold uppercase tracking-tight text-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-sasori-red shadow-[0_0_12px_#E20613]" />
                  {item}
                </div>
              ))}
              <div className="pt-4">
                <button
                  onClick={() => {
                    navigate('/services/modernization');
                    window.scrollTo(0, 0);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sasori-red text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-sasori-red transition-all shadow-lg"
                >
                  {lang === 'es' ? 'Ver Detalles' : lang === 'en' ? 'View Details' : lang === 'zh' ? '查看詳情' : lang === 'ru' ? 'Подробнее' : lang === 'pt' ? 'Ver Detalhes' : 'View Details'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();

    // Entrance Animation
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1.1,
      duration: 1.5,
      ease: "power4.out",
    })
      .to(logoRef.current, {
        textShadow: "0 0 30px rgba(226, 6, 19, 0.8), 0 0 60px rgba(226, 6, 19, 0.4)",
        duration: 1,
        repeat: 1,
        yoyo: true,
      })
      .to(entranceRef.current, {
        y: "-100%",
        duration: 1.2,
        ease: "expo.inOut",
        onComplete: () => {
          setIsLoaded(true);
        }
      });

    // SAFETY FALLBACK: If animation hangs for some reason, force load after 5s
    const safetyTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 5000);

    return () => clearTimeout(safetyTimer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // Pulsating animation for the nav logo
      gsap.to(navLogoRef.current, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.utils.toArray('.reveal').forEach((elem: any) => {
        gsap.from(elem, {
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      });
    }
  }, [isLoaded, lang]);

  const toggleLang = () => {
    setLang(prev => prev === 'es' ? 'en' : 'es');
  };

  const parallaxItems = [
    {
      title: lang === 'es' ? 'Automatización IA' : lang === 'zh' ? '人工智能自動化' : lang === 'ru' ? 'ИИ Автоматизация' : lang === 'pt' ? 'Automação IA' : 'AI Automation',
      description: lang === 'es' ? 'Cerebros digitales que orquestan operaciones complejas.' : 'Digital brains orchestrating complex operations.',
      icon: Brain,
      path: '/services/ai-automation',
      src: ""
    },
    {
      title: lang === 'es' ? 'Webs Inmersivas' : lang === 'zh' ? '沉浸式網站' : lang === 'ru' ? 'Иммерсивные Веб-сайты' : lang === 'pt' ? 'Webs Imersivas' : 'Immersive Webs',
      description: lang === 'es' ? 'Entornos cinéticos de gravedad cero y arquitecturas de próxima generación.' : 'Zero-gravity kinetic environments and next-gen architectures.',
      icon: Monitor,
      path: '/services/immersive-webs',
      src: ""
    },
    {
      title: lang === 'es' ? 'Modernización' : lang === 'zh' ? '現代化' : lang === 'ru' ? 'Модернизация' : lang === 'pt' ? 'Modernização' : 'Modernization',
      description: lang === 'es' ? 'Transmutación de infraestructura legacy a sistemas de alto rendimiento.' : 'Transmutation of legacy infrastructure to high-performance systems.',
      icon: Layers,
      path: '/services/modernization',
      src: ""
    },
    {
      src: 'https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1517694712202-14dd9538aa97?w=800&q=80',
      title: lang === 'es' ? 'Ingeniería' : lang === 'zh' ? '工程' : lang === 'ru' ? 'Инженерия' : lang === 'pt' ? 'Engenharia' : 'Engineering',
      description: lang === 'es' ? 'Desarrollo de software premium con precisión quirúrgica.' : 'Premium software development with surgical precision.',
      icon: Code,
    },
    {
      src: 'https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1460925895917-afdab827c52f?w=800&q=80',
      title: lang === 'es' ? 'Estrategia Digital' : lang === 'zh' ? '數字戰略' : lang === 'ru' ? 'Цифровая стратегия' : lang === 'pt' ? 'Estratégia Digital' : 'Digital Strategy',
      description: lang === 'es' ? 'Hoja de ruta para la dominación del paisaje digital.' : 'Roadmap for digital landscape domination.',
      icon: Rocket,
    },
  ];

  return (
    <>
      <ScrollToTop />

      {/* Universal Components */}
      <AnimatedNavFramer lang={lang} onToggleLang={(l) => setLang(l as any)} />
      {/* Newsletter Popup - auto-shows after 8 seconds */}
      <NewsletterPopup lang={lang} />

      {/* Cinematic Entrance */}
      {!isLoaded && (
        <div
          ref={entranceRef}
          className="fixed inset-0 z-[100] bg-bg-dark flex items-center justify-center overflow-hidden"
        >
          <MatrixRain color="#E20613" opacity={0.4} />
          <div
            ref={logoRef}
            className="relative z-10 opacity-0 scale-90 text-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-[0.2em] text-sasori-red neon-glow">
              SASORILABS
            </h1>
            <p className="mt-4 text-gray-500 tracking-[0.5em] text-xs uppercase">
              {t.entrance.tagline}
            </p>
          </div>
        </div>
      )}

      <Routes>
        {/* Service detail pages */}
        <Route path="/contact" element={<ContactPage lang={lang} />} />
        <Route path="/blog" element={<BlogPage lang={lang} />} />
        <Route path="/blog/:slug" element={<BlogDetailPage lang={lang} setLang={setLang} />} />
        <Route path="/services/ai-automation" element={<AIAutomationPage lang={lang} />} />
        <Route path="/services/immersive-webs" element={<ImmersiveWebsPage lang={lang} />} />
        <Route path="/services/modernization" element={<ModernizationPage lang={lang} />} />
        {/* Admin routes - completely isolated */}
        <Route path="/dashboard/login" element={<LoginPage lang={lang} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* User routes - separate from admin */}
        <Route path="/login" element={<UserAuthPage lang={lang} />} />
        <Route path="/mi-cuenta" element={<UserAccountPage lang={lang} />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        {/* Home page */}
        <Route path="/*" element={
          <div className="relative min-h-screen">



            {/* Main Content */}
            <main className="relative z-10">
              {/* Hero Section */}
              <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-dark">
                <div className="absolute inset-0 z-0">
                  <BackgroundPaths
                    title={lang === 'es' ? "SASORILABS" : "SASORILABS"}
                    subtitle={lang === 'es' ? "AUTOMATIZANDO EL FUTURO CON IA." : "AUTOMATING THE FUTURE WITH AI."}
                    ctaText={lang === 'es' ? "INICIAR PROYECTO" : "START PROJECT"}
                    onCtaClick={() => {
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    showContent={true}
                  />
                </div>
                <div className="absolute inset-0 z-[1] pointer-events-none">
                  <ParticleTextEffect words={t.hero.words} />
                </div>
              </section>

              {/* Text Scroll Animation Section */}
              <section className="relative z-20">
                <TextScrollAnimation lang={lang} />
              </section>

              {/* Zoom Parallax Section */}
              <section className="relative z-20 bg-bg-dark" id="services">
                <div className="py-20 text-center reveal">
                  <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4">
                    {lang === 'es' ? 'NUESTRO ECOSISTEMA' : lang === 'zh' ? '我們的生態系統' : lang === 'ru' ? 'НАША ЭКОСИСТЕМА' : lang === 'pt' ? 'NOSSO ECOSSISTEMA' : 'OUR ECOSYSTEM'}
                  </h2>
                  <p className="text-gray-500 uppercase tracking-[0.3em] text-xs">
                    {lang === 'es' ? 'EXPLORA EL ECOSISTEMA' : lang === 'zh' ? '探索生態系統' : lang === 'ru' ? 'ИССЛЕДУЙТЕ ЭКОСИСТЕМУ' : lang === 'pt' ? 'EXPLORE O ECOSSISTEMA' : 'EXPLORE THE ECOSYSTEM'}
                  </p>
                </div>
                <ZoomParallax items={parallaxItems} />
              </section>

              {/* Timeline Section */}
              <section className="bg-bg-dark">
                <Timeline data={timelineData} />
              </section>

              {/* Blog Highlights Section */}
              <section className="relative z-20 bg-bg-dark border-y border-white/5">
                <BlogPostSection
                  lang={lang}
                  title={lang === 'es' ? "NUESTRO BLOG" : lang === 'zh' ? "我們的博客" : lang === 'ru' ? "НАШ БЛОГ" : lang === 'pt' ? "NOSSO BLOG" : "OUR BLOG"}
                  description={lang === 'es' ? "Explora nuestra visión sobre el futuro de la tecnología, la inteligencia artificial y el diseño inmersivo." : lang === 'zh' ? "探索我們對技術、人工智能和沉浸式設計未來的願景。" : lang === 'ru' ? "Исследуйте наше видение будущего технологий, искусственного интеллекта и иммерсивного дизайна." : lang === 'pt' ? "Explore nossa visão sobre o futuro da tecnologia, inteligência artificial e design imersivo." : "Explore our vision on the future of technology, artificial intelligence, and immersive design."}
                  backgroundLabel="NEWS"
                />
                <div className="flex justify-center pb-20">
                  <button
                    onClick={() => navigate('/blog')}
                    className="group flex items-center gap-3 bg-sasori-red text-white font-black px-10 py-5 rounded-full shadow-[0_0_40px_rgba(226,6,19,0.3)] hover:bg-white hover:text-sasori-red transition-all duration-300 uppercase tracking-widest text-xs"
                  >
                    {lang === 'es' ? 'Ver todo el blog' : lang === 'en' ? 'View full blog' : lang === 'zh' ? '查看所有部落格' : lang === 'ru' ? 'Весь блог' : lang === 'pt' ? 'Ver todo o blog' : 'View full blog'}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </section>

              {/* Final CTA Section */}
              <section className="relative z-20">
                <BackgroundPaths
                  title={lang === 'es' ? "TRANSFORMA TU FUTURO" : lang === 'zh' ? "改變你的未來" : lang === 'ru' ? "ПРЕОБРАЗИТЕ СВОЕ БУДУЩЕЕ" : lang === 'pt' ? "TRANSFORME SEU FUTURO" : "TRANSFORM YOUR FUTURE"}
                  subtitle={lang === 'es' ? "LLEVAMOS TU VISIÓN AL SIGUIENTE NIVEL CON TECNOLOGÍA DE ÉLITE." : lang === 'zh' ? "我們以頂級技術將您的願景提升到新的高度。" : lang === 'ru' ? "МЫ ВЫВОДИМ ВАШЕ ВИДЕНИЕ НА НОВЫЙ УРОВЕНЬ С ПОМОЩЬЮ ЭЛИТНЫХ ТЕХНОЛОГИЙ." : lang === 'pt' ? "LEVAMOS SUA VISÃO AO PRÓXIMO NÍVEL COM TECNOLOGIA DE ELITE." : "WE TAKE YOUR VISION TO THE NEXT LEVEL WITH ELITE TECHNOLOGY."}
                  ctaText={lang === 'es' ? "AGENDA UNA CONSULTA" : lang === 'zh' ? "安排諮詢" : lang === 'ru' ? "НАЗНАЧИТЬ КОНСУЛЬТАЦИЮ" : lang === 'pt' ? "AGENDAR CONSULTA" : "SCHEDULE A CONSULTATION"}
                  onCtaClick={() => {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  showContent={true}
                />
              </section>

              {/* Contact Section */}
              <section id="contact">
                <PremiumContact lang={lang} />
              </section>

              <Footer lang={lang} />
            </main>
          </div>
        } />
      </Routes>
    </>
  );
}
