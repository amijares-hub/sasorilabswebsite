/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CombinedPromotionalSections } from './components/ui/promotional-sections';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Menu, X, ArrowRight, Code, Rocket, ShieldCheck,
  Globe, Cpu, Database, Zap, Languages,
  FileCode, Activity, ChevronRight,
  Brain, Monitor, Layers, Settings, Globe2, Terminal,
  Home, Eye, Shield, Box, Search, Palette, BookOpen, FileText, Newspaper,
  Building, Store
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
import BlogPage from './pages/blog-page';
import { ProcessAutomationPage } from './pages/process-automation-page';
import { DigitalEmployeesPage } from './pages/digital-employees-page';
import { ImmersiveWebsPage } from './pages/immersive-webs-page';
import { ModernizationPage } from './pages/modernization-page';
import { BlogDetailPage } from './pages/blog-detail-page';
import { LoginPage } from './pages/login-page';
import { DashboardPage } from './pages/dashboard-page';
import { UserAuthPage } from './pages/user-auth-page';
import { UserAccountPage } from './pages/user-account-page';
import { UnsubscribePage } from './pages/unsubscribe-page';
import { DemosPage } from './pages/demos-page';
import { Footer } from './components/ui/footer';
import { BlogPostSection } from './components/ui/blog-posts';
import { CreativeDemosSection } from './components/ui/creative-demos';
import { NewsletterPopup } from './components/ui/newsletter';
import Lenis from '@studio-freight/lenis';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { translations } from './i18n/translations';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Centralized Translations ---
// Moved to ./i18n/translations.ts

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
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
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
      title: t.services.entrepreneurs.title,
      content: (
        <div className="reveal w-full">
          <h3 className="text-sasori-dark font-extrabold text-2xl md:text-3xl mb-4 uppercase tracking-[0.15em]">{t.services.entrepreneurs.subtitle}</h3>
          <p className="text-gray-600 font-medium text-base md:text-lg mb-10 leading-relaxed max-w-3xl">
            {t.services.entrepreneurs.desc}
          </p>
          
          <div className="flex flex-col justify-center space-y-6 p-8 md:p-12 metallic-vinotinto-card rounded-3xl border border-white/10 shadow-2xl">
            <div className="space-y-5">
              {t.services.entrepreneurs.items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 text-base md:text-lg font-semibold uppercase tracking-wide text-white/90">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-sasori-red flex-shrink-0 shadow-[0_0_12px_rgba(226,6,19,0.8)]" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-8">
              <button
                onClick={() => {
                  navigate('/services/ai-automation');
                  window.scrollTo(0, 0);
                }}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-sasori-red text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-sasori-red transition-all duration-300 shadow-[0_0_20px_rgba(226,6,19,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                {t.common.viewDetails}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t.services.companies.title,
      content: (
        <div className="reveal w-full">
          <h3 className="text-sasori-dark font-extrabold text-2xl md:text-3xl mb-4 uppercase tracking-[0.15em]">{t.services.companies.subtitle}</h3>
          <p className="text-gray-600 font-medium text-base md:text-lg mb-10 leading-relaxed max-w-3xl">
            {t.services.companies.desc}
          </p>
          
          <div className="flex flex-col justify-center space-y-6 p-8 md:p-12 metallic-vinotinto-card rounded-3xl border border-white/10 shadow-2xl">
            <div className="space-y-5">
              {t.services.companies.items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 text-base md:text-lg font-semibold uppercase tracking-wide text-white/90">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-sasori-red flex-shrink-0 shadow-[0_0_12px_rgba(226,6,19,0.8)]" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-8">
              <button
                onClick={() => {
                  navigate('/services/modernization');
                  window.scrollTo(0, 0);
                }}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-sasori-red text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-sasori-red transition-all duration-300 shadow-[0_0_20px_rgba(226,6,19,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                {t.common.viewDetails}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t.services.pymes.title,
      content: (
        <div className="reveal w-full">
          <h3 className="text-sasori-dark font-extrabold text-2xl md:text-3xl mb-4 uppercase tracking-[0.15em]">{t.services.pymes.subtitle}</h3>
          <p className="text-gray-600 font-medium text-base md:text-lg mb-10 leading-relaxed max-w-3xl">
            {t.services.pymes.desc}
          </p>

          <div className="flex flex-col justify-center space-y-6 p-8 md:p-12 metallic-vinotinto-card rounded-3xl border border-white/10 shadow-2xl">
            <div className="space-y-5">
              {t.services.pymes.items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 text-base md:text-lg font-semibold uppercase tracking-wide text-white/90">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-sasori-red flex-shrink-0 shadow-[0_0_12px_rgba(226,6,19,0.8)]" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-8">
              <button
                onClick={() => {
                  navigate('/services/immersive-webs');
                  window.scrollTo(0, 0);
                }}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-sasori-red text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-sasori-red transition-all duration-300 shadow-[0_0_20px_rgba(226,6,19,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                {t.common.viewDetails}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
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

  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Sequential Timeline for Cinematic Entrance
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true);
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      }
    });

    // 1. Logo entrance (fast)
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power4.out"
    });

    // 2. Subtle pulse (shorter)
    tl.to(logoRef.current, {
      scale: 1.1,
      duration: 0.5,
      repeat: 1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 3. Slide exit (fast)
    tl.to(entranceRef.current, {
      y: "-100%",
      duration: 0.7,
      ease: "power4.inOut"
    });

    // Safety timeout: 3 seconds
    safetyTimerRef.current = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
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

  const parallaxItems = [
    {
      title: t.services.entrepreneurs.title,
      description: t.services.entrepreneurs.desc,
      icon: Rocket,
      path: '/services/ai-automation',
      src: ""
    },
    {
      title: t.services.companies.title,
      description: t.services.companies.desc,
      icon: Building,
      path: '/services/modernization',
      src: ""
    },
    {
      title: t.services.pymes.title,
      description: t.services.pymes.desc,
      icon: Store,
      path: '/services/immersive-webs',
      src: ""
    },
    {
      title: t.otherServices.engineering.title,
      description: t.otherServices.engineering.desc,
      icon: Code,
      src: ""
    },
    {
      title: t.otherServices.strategy.title,
      description: t.otherServices.strategy.desc,
      icon: Rocket,
      src: ""
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
          className="fixed inset-0 z-[100] bg-[#FFFFFF] flex items-center justify-center overflow-hidden"
        >
          <MatrixRain color="#E20613" opacity={0.15} />
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
        <Route path="/blog" element={<BlogPage lang={lang} />} />
        <Route path="/blog/:slug" element={<BlogDetailPage lang={lang} setLang={setLang} />} />
        <Route path="/services/ai-automation" element={<ProcessAutomationPage lang={lang} />} />
        <Route path="/services/digital-employees" element={<DigitalEmployeesPage lang={lang} />} />
        <Route path="/services/immersive-webs" element={<ImmersiveWebsPage lang={lang} />} />
        <Route path="/services/modernization" element={<ModernizationPage lang={lang} />} />
        {/* Admin routes - completely isolated */}
        <Route path="/dashboard/login" element={<LoginPage lang={lang} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* User routes - separate from admin */}
        <Route path="/login" element={<UserAuthPage lang={lang} />} />
        <Route path="/mi-cuenta" element={<UserAccountPage lang={lang} />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        <Route path="/demos" element={<DemosPage lang={lang} />} />
        {/* Home page */}
        <Route path="/*" element={
          <div className="relative min-h-screen">
            {/* Main Content */}
            <main className="relative z-10">
              {/* Hero Section */}
              <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-dark">
                <div className="absolute inset-0 z-0">
                  <BackgroundPaths
                    title="SASORILABS"
                    subtitle={t.hero.subheadline}
                    ctaText={t.common.startProject}
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
                  <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4 text-[#1A1A1A]">
                    {t.common.ecosystem}
                  </h2>
                  <p className="text-black/40 uppercase tracking-[0.3em] text-xs">
                    {t.common.exploreEcosystem}
                  </p>
                </div>
                <ZoomParallax 
                  lang={lang}
                  categories={{
                    audio: t.showcase?.categories?.audio,
                    creative: t.showcase?.categories?.creative,
                    data: t.showcase?.categories?.data
                  }}
                  items={parallaxItems} 
                />
              </section>

              {/* Timeline Section */}
              <section className="bg-bg-dark">
                <Timeline data={timelineData} />
              </section>

              {/* Digital Employees Special Promotion Section */}
              <CombinedPromotionalSections lang={lang} />

              {/* Creative Demos Showcase */}
              <section className="relative z-20">
                <CreativeDemosSection lang={lang} />
              </section>

              {/* Blog Highlights Section */}
              <section className="relative z-20 bg-bg-dark border-y border-black/5">
                <BlogPostSection
                  lang={lang}
                  title={t.blog.title}
                  description={t.blog.desc}
                  backgroundLabel="NEWS"
                />
                <div className="flex justify-center pb-20">
                  <button
                    onClick={() => navigate('/blog')}
                    className="group flex items-center gap-3 bg-sasori-red text-white font-black px-10 py-5 rounded-full shadow-[0_0_40px_rgba(226,6,19,0.3)] hover:bg-white hover:text-sasori-red transition-all duration-300 uppercase tracking-widest text-xs"
                  >
                    {t.common.viewFullBlog}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </section>

              {/* Final CTA Section */}
              <section className="relative z-20">
                <BackgroundPaths
                  title={t.common.transformFuture}
                  subtitle={t.common.techVision}
                  ctaText={t.common.scheduleConsultation}
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
