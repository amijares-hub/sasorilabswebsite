/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ThemeProvider } from './providers/theme-provider';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Menu, X, ArrowRight, Code, Rocket, ShieldCheck,
  Globe, Cpu, Database, Zap, Languages,
  FileCode, Activity, ChevronRight, ChevronDown,
  Brain, Monitor, Layers, Settings, Globe2, Terminal,
  Home, Eye, Shield, Box, Search, Palette, BookOpen, FileText, Newspaper,
  Building, Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedNavFramer } from './components/ui/navigation-menu';
import { SasoriLogo } from './components/ui/sasori-logo';

// --- Lazy loaded components for performance ---
const BlogPostSection = React.lazy(() => import('./components/ui/blog-posts').then(m => ({ default: m.BlogPostSection })));
const PremiumContact = React.lazy(() => import('./components/ui/premium-contact').then(m => ({ default: m.PremiumContact })));

import BlogPage from './pages/blog-page';
import { ProcessAutomationPage } from './pages/process-automation-page';
import { DigitalEmployeesPage } from './pages/digital-employees-page';
import { ImmersiveWebsPage } from './pages/immersive-webs-page';
import { ModernizationPage } from './pages/modernization-page';
import { FrontendUXPage } from './pages/frontend-ux-page';
import { BackendRelationalPage } from './pages/backend-relational-page';
import { CybersecurityPage } from './pages/cybersecurity-page';
import { InfrastructurePage } from './pages/infrastructure-page';
import { IpaasPage } from './pages/ipaas-page';
import { AiHardwarePage } from './pages/ai-hardware-page';
import { FinopsPage } from './pages/finops-page';
import { AiAgentsPage } from './pages/ai-agents-page';
import { ItsmOrchestrationPage } from './pages/itsm-orchestration-page';
import { DataBiPage } from './pages/data-bi-page';
import { MarketingGeoPage } from './pages/marketing-geo-page';
import { DevSecOpsPage } from './pages/devsecops-page';
import { BlogDetailPage } from './pages/blog-detail-page';
import { UserAuthPage } from './pages/user-auth-page';
import { UserAccountPage } from './pages/user-account-page';
import { UnsubscribePage } from './pages/unsubscribe-page';
import { DemosPage } from './pages/demos-page';
import { LandingPageInteractiva } from './pages/landing-page-interactiva';

import { FunnelModal } from './components/ui/funnel-modal';
import { NewsletterPopup } from './components/ui/newsletter';
import { FloatingWhatsApp } from './components/ui/floating-whatsapp';
import Lenis from 'lenis';

interface CarouselItem {
  id: number;
  title: string;
}
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { translations } from './i18n/translations';
import { Canvas } from '@react-three/fiber';
import { ActivityParticles } from './components/canvas/ActivityParticles';
import { useExperienceStore } from './store/useExperienceStore';
import { supabase } from './lib/supabaseClient';

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

    let animationId: number;
    const isMobile = window.innerWidth < 768;
    const interval = isMobile ? 66 : 33; // 15fps on mobile, 30fps on desktop for matrix
    let lastTime = 0;

    const draw = (time: number) => {
      animationId = requestAnimationFrame(draw);
      
      if (time - lastTime < interval) return;
      lastTime = time;

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
    animationId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
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
// Scroll to top or anchor helper
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, scroll to the element
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Standard scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Handle delayed rendering or lazy loaded content
    const timer = setTimeout(() => {
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo(0, 0);
    }, 150); // Increased delay for safety

    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}


export default function App() {
  const [lang, setLang] = useState<keyof typeof translations>(() => {
    const saved = localStorage.getItem('sasori-lang');
    if (saved && saved in translations) return saved as keyof typeof translations;
    return 'es';
  });

  const t = translations[lang];
  useEffect(() => {
    localStorage.setItem('sasori-lang', lang);
  }, [lang]);
  const { pathname } = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const initRealtime = useExperienceStore(state => state.initRealtime);

  useEffect(() => {
    // 🛡️ Security Check: Ensure user still exists in the database
    const checkUserPersistence = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Query only the ID for maximum performance
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (error || !profile) {
          console.warn("Security Alert: User session found but profile is missing in the 'profiles' table.");
          setAuthError(lang === 'es' 
            ? 'Error de sincronización: Su cuenta ya no está activa en Sasori Node. Por favor, contacte con soporte.'
            : 'Synchronization error: Your account is no longer active in Sasori Node. Please contact support.');
          
          // Emergency Logout Sequence
          setTimeout(async () => {
            await supabase.auth.signOut();
            localStorage.clear();
            sessionStorage.clear();
            // Force a hard reload to the home page to wipe all states
            window.location.href = '/'; 
          }, 5000); 
        }
      }
    };

    checkUserPersistence();
  }, [pathname, lang]);

  useEffect(() => {
    // Initialize real-time listener for Hollywood-style feedback
    const cleanup = initRealtime();
    return () => cleanup();
  }, [initRealtime]);

  const [isMobile, setIsMobile] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const entranceRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navLogoRef = useRef<HTMLDivElement>(null);

  // --- Hook and State Initializations ---



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

    // Safety timeout: 0.5 seconds for much faster feedback
    safetyTimerRef.current = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

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

  const carouselItems: CarouselItem[] = [
    { id: 1, title: t.nav.ai || "AGENTES AUTÓNOMOS" },
    { id: 2, title: t.nav.web || "WEBS INMERSIVAS" },
    { id: 3, title: t.nav.mod || "MODERNIZACIÓN" },
    { id: 4, title: lang === 'es' ? "IA CREATIVA" : lang === 'zh' ? '創意 AI' : lang === 'ru' ? 'КРЕАТИВНЫЙ ИИ' : lang === 'pt' ? 'IA CRIATIVA' : "CREATIVE AI" },
    { id: 5, title: lang === 'es' ? "ESTRATEGIA" : lang === 'zh' ? '策略' : lang === 'ru' ? 'СТРАТЕГИЯ' : lang === 'pt' ? 'ESTRATÉGIA' : "STRATEGY" },
    { id: 6, title: lang === 'es' ? "INGENIERÍA" : lang === 'zh' ? '工程' : lang === 'ru' ? 'ИНЖЕНЕРИЯ' : lang === 'pt' ? 'ENGENHARIA' : "ENGINEERING" },
    { id: 7, title: "CLOUD" },
    { id: 8, title: lang === 'es' ? "SEGURIDAD" : lang === 'zh' ? '安全' : lang === 'ru' ? 'БЕЗОПАСНОСТЬ' : lang === 'pt' ? 'SEGURANÇA' : "SECURITY" },
  ];

  const parallaxItems = [
    {
      title: t.services.entrepreneurs.title,
      description: t.services.entrepreneurs.desc,
      icon: Rocket,
      path: '/services/ai-automation',
      src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: t.services.companies.title,
      description: t.services.companies.desc,
      icon: Building,
      path: '/services/modernization',
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: t.services.pymes.title,
      description: t.services.pymes.desc,
      icon: Store,
      path: '/services/immersive-webs',
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: t.servicesPages.automation.hero,
      description: t.servicesPages.automation.subtext,
      icon: Cpu,
      path: '/services/ai-automation',
      src: "https://images.unsplash.com/photo-148527404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: t.servicesPages.employees.hero,
      description: t.servicesPages.employees.subtext,
      icon: Brain,
      path: '/services/digital-employees',
      src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: t.servicesPages.immersive.hero,
      description: t.servicesPages.immersive.subtext,
      icon: Globe,
      path: '/services/immersive-webs',
      src: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: t.servicesPages.modernization.hero,
      description: t.servicesPages.modernization.subtext,
      icon: Code,
      path: '/services/modernization',
      src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    },
  ];

  return (
    <ThemeProvider>
      <ScrollToTop />
      
      {/* Dynamic 3D Activity Particles Background (Hollywood Vibe) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
          <ActivityParticles />
        </Canvas>
      </div>

      {/* GLOBAL AUTH ERROR ALERT */}
      <AnimatePresence>
        {authError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-zinc-900 border border-sasori-red/30 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(226,6,19,0.15)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-sasori-red shadow-[0_0_15px_rgba(226,6,19,0.8)]"
                />
              </div>

              <div className="w-20 h-20 bg-sasori-red/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-sasori-red/20 rotate-3">
                <ShieldCheck className="w-10 h-10 text-sasori-red" />
              </div>
              
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Acceso Denegado</h2>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-10 px-4">
                {authError}
              </p>
              
              <div className="pt-2">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-sasori-red rounded-full animate-pulse" />
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em]">Cerrando sesión de forma segura...</span>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal Components */}
      <AnimatedNavFramer lang={lang} onToggleLang={(l) => setLang(l as any)} />
      {/* Newsletter Popup - auto-shows after 8 seconds */}
      <NewsletterPopup lang={lang} />
      {/* WhatsApp Floating Button */}
      <FloatingWhatsApp lang={lang} onToggleLang={(l) => setLang(l as any)} />

      {/* Cinematic Entrance */}
      {!isLoaded && (
        <div
          ref={entranceRef}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
        >
          <MatrixRain color="#E20613" opacity={0.15} />
          <div
            ref={logoRef}
            className="relative z-10 opacity-0 scale-90 text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-8xl font-bold tracking-[0.15em] sm:tracking-[0.2em] text-sasori-red neon-glow">
              SASORILABS
            </h1>
            <p className="mt-4 text-gray-500 tracking-[0.3em] sm:tracking-[0.5em] text-[10px] md:text-xs uppercase px-4">
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
        <Route path="/services/frontend-ux" element={<FrontendUXPage lang={lang} />} />
        <Route path="/services/backend-relational" element={<BackendRelationalPage lang={lang} />} />
        <Route path="/services/cybersecurity" element={<CybersecurityPage lang={lang} />} />
        <Route path="/services/infrastructure" element={<InfrastructurePage lang={lang} />} />
        <Route path="/services/ipaas" element={<IpaasPage lang={lang} />} />
        <Route path="/services/ai-hardware" element={<AiHardwarePage lang={lang} />} />
        <Route path="/services/finops" element={<FinopsPage lang={lang} />} />
        <Route path="/services/ai-agents" element={<AiAgentsPage lang={lang} />} />
        <Route path="/services/itsm-orchestration" element={<ItsmOrchestrationPage lang={lang} />} />
        <Route path="/services/data-bi" element={<DataBiPage lang={lang} />} />
        <Route path="/services/marketing-geo" element={<MarketingGeoPage lang={lang} />} />
        <Route path="/services/devsecops" element={<DevSecOpsPage lang={lang} />} />
        {/* User routes */}
        <Route path="/login" element={<UserAuthPage lang={lang} />} />
        <Route path="/mi-cuenta" element={<UserAccountPage lang={lang} />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        <Route path="/demos" element={<DemosPage lang={lang} />} />
        {/* Home page */}
        <Route path="/*" element={<LandingPageInteractiva lang={lang} />} />
      </Routes>
      <FunnelModal lang={lang} />
    </ThemeProvider>
  );
}
