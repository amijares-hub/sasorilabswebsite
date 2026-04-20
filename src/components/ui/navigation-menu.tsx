"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown, Languages, ArrowRight, UserCircle2, X, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabaseClient";
import { SasoriLogo } from "./sasori-logo";
import { ThemeToggle } from "./theme-toggle";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring", damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: (isDesktop: boolean) => ({
    y: 0,
    opacity: 1,
    width: isDesktop ? "5rem" : "3rem",
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 400,
      when: "afterChildren",
    },
  }),
} as any;

const logoVariants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: 0.3 } },
} as any;

const itemVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
} as any;

const collapsedIconVariants = {
    expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    collapsed: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
        delay: 0.15,
      }
    },
} as any;

const dropdownVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring" as const, damping: 15, stiffness: 300 }
  },
  exit: { opacity: 0, y: 5, scale: 0.95, transition: { duration: 0.2 } }
};

export function AnimatedNavFramer({ lang = 'es', onToggleLang }: { lang?: string, onToggleLang?: (l: string) => void }) {
  const [showLanguages, setShowLanguages] = React.useState(false);
  const [showServices, setShowServices] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isExpanded, setExpanded] = React.useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);
  const [session, setSession] = React.useState<any>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    setIsMobileMenuOpen(false);
  };
  
  const servicesTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const langTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleServicesEnter = () => {
    if (servicesTimeout.current) clearTimeout(servicesTimeout.current);
    setShowServices(true);
    setShowLanguages(false);
  };

  const handleServicesLeave = () => {
    setShowServices(false);
  };

  const handleLangLeave = () => {
    setShowLanguages(false);
  };

  const handleLangEnter = () => {
    if (langTimeout.current) clearTimeout(langTimeout.current);
    setShowLanguages(true);
    setShowServices(false);
  };

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  const t = (({
    es: { home: "Inicio", solutions: "Servicios", blog: "Blog", contact: "Contacto", demo: "Demos", auto: "Agentes Autónomos", emp: "Empleados Digitales", webs: "Webs y Aplicaciones de Impacto", lim: "Limpieza y Aceleración de Negocios", account: "Mi Cuenta", logout: "Cerrar Sesión" },
    en: { home: "Home", solutions: "Services", blog: "Blog", contact: "Contact", demo: "Demos", auto: "Autonomous Agents", emp: "Digital Employees", webs: "Impact Webs & Apps", lim: "Business Acceleration", account: "My Account", logout: "Log Out" },
    zh: { home: "首頁", solutions: "服務", blog: "博客", contact: "聯繫", demo: "演示", auto: "自主代理", emp: "數位員工", webs: "影響力網站與應用", lim: "業務加速", account: "我的帳戶", logout: "登出" },
    ru: { home: "Главная", solutions: "Услуги", blog: "Блог", contact: "Контакт", demo: "Демо", auto: "Автономные Агенты", emp: "Цифровые Сотрудники", webs: "Влиятельные Веб-сайты", lim: "Ускорение Бизнеса", account: "Мой Аккаунт", logout: "Выйти" },
    pt: { home: "Início", solutions: "Serviços", blog: "Blog", contact: "Contato", demo: "Demos", auto: "Agentes Autônomos", emp: "Funcionários Digitais", webs: "Webs e Apps de Impacto", lim: "Aceleração de Negócios", account: "Minha Conta", logout: "Sair" },
  } as any)[lang] || { home: "Home", solutions: "Services", blog: "Blog", contact: "Contact", demo: "Demos", auto: "Autonomous Agents", emp: "Digital Employees", webs: "Impact Webs & Apps", lim: "Business Acceleration", account: "My Account", logout: "Log Out" });

  const services = [
    { name: t.auto, href: "/services/ai-automation" },
    { name: t.emp, href: "/services/digital-employees" },
    { name: t.webs, href: "/services/immersive-webs" },
    { name: t.lim, href: "/services/modernization" },
  ];

  const translatedNavItems = [
    { name: t.home, href: "/" },
    { name: t.solutions, isDropdown: true },
    { name: t.demo, href: "/demos" },
    { name: t.blog, href: "/blog" },
    { name: t.contact, href: "/#contact" },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    
    // En desktop expandimos al llegar arriba. En mobile NO, se queda contraído por diseño.
    if (isDesktop && latest < 50) {
      setExpanded(true);
      return;
    }

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      setShowServices(false);
      scrollPositionOnCollapse.current = latest; 
    } 
    else if (!isExpanded && latest < previous && (scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD)) {
      setExpanded(true);
    }
    
    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    if (!isExpanded) {
      e.preventDefault();
      if (isDesktop) {
        setExpanded(true);
      } else {
        setIsMobileMenuOpen(!isMobileMenuOpen);
      }
    }
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.split("#")[1];
      if (window.location.pathname === "/") {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      navigate(href);
      // Ensure we go to the top when navigating between pages
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Force scroll again after a tiny delay to overcome some framework/lib scroll restorations
      setTimeout(() => window.scrollTo(0, 0), 10);
    }
    setShowServices(false);
  };

  return (
    <>
    <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] max-w-[100vw]">
      <motion.nav
        initial={isExpanded ? "expanded" : "collapsed"}
        animate={isExpanded ? "expanded" : "collapsed"}
        custom={typeof window !== 'undefined' ? window.innerWidth >= 1024 : false}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.1 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        onMouseLeave={() => {
          handleServicesLeave();
          handleLangLeave();
        }}
        className={cn(
          "flex items-center rounded-full glass-metallic-white-nav h-12 md:h-20 transition-all duration-300 relative",
          isExpanded ? "w-auto min-w-[max-content] px-4 overflow-visible" : "justify-center px-0 cursor-pointer overflow-hidden"
        )}
        style={{ pointerEvents: 'auto' }}
      >
        <motion.div
          variants={logoVariants}
          className={cn(
            "flex-shrink-0 items-center font-semibold pl-4 md:pl-5 pr-2 md:pr-4 cursor-pointer",
            isExpanded ? "flex" : "hidden pointer-events-none w-0 p-0"
          )}
          onClick={() => { handleLinkClick("/"); setIsMobileMenuOpen(false); }}
        >
          <SasoriLogo className="h-6 w-6 md:h-11 md:w-11 ml-1 mr-2 md:mr-3" />
        </motion.div>
        
        <motion.div
          className={cn(
            "hidden lg:flex items-center gap-2 sm:gap-4 pr-8 transition-opacity duration-300",
            !isExpanded ? "opacity-0 pointer-events-none invisible" : "opacity-100 pointer-events-auto visible" 
          )}
        >
          {translatedNavItems.map((item, idx) => (
            <div 
              key={`${item.name}-${idx}`} 
              className="relative"
              onMouseEnter={() => item.isDropdown && handleServicesEnter()}
            >
              <motion.button
                variants={itemVariants}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.isDropdown) {
                    setShowServices(!showServices);
                  } else {
                    handleLinkClick(item.href!);
                  }
                }}
                className={cn(
                  "text-xs md:text-base font-bold tracking-[0.2em] uppercase text-black/70 hover:text-sasori-red transition-all px-4 py-4 rounded-full flex items-center gap-2",
                  (item.isDropdown && showServices) && "text-sasori-red bg-sasori-red/5"
                )}
              >
                {item.name}
                {item.isDropdown && <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", showServices && "rotate-180")} />}
              </motion.button>

              {/* Services Dropdown */}
              {item.isDropdown && (
                <AnimatePresence>
                  {showServices && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute top-full left-0 mt-4 w-64 p-3 rounded-2xl border border-sasori-red/20 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-2xl pointer-events-auto z-[999] overflow-visible"
                    >
                      <div className="flex flex-col gap-1">
                        {services.map((service) => (
                          <button
                            key={service.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLinkClick(service.href);
                            }}
                            className="text-left px-4 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest text-black/70 hover:text-sasori-red hover:bg-sasori-red/5 transition-all flex items-center justify-between group"
                          >
                            {service.name}
                            <div className="w-1.5 h-1.5 rounded-full bg-sasori-red opacity-0 group-hover:opacity-100 transition-opacity cinema-glow-red" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button
              variant="default"
              size="lg"
              className="rounded-full gap-2 px-6 group h-9 md:h-12"
              onClick={(e) => {
                e.stopPropagation();
                handleLinkClick(session ? '/mi-cuenta' : '/login');
              }}
            >
              <UserCircle2 className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline font-bold text-xs md:text-sm uppercase tracking-widest">{t.account}</span>
              {!session && (
                <ArrowRight 
                  className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5" 
                  size={16} 
                  strokeWidth={2} 
                  aria-hidden="true" 
                />
              )}
            </Button>
            
            {session && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                className="p-2 md:p-3 text-black/40 hover:text-sasori-red transition-all hover:bg-sasori-red/5 rounded-full"
                title={t.logout}
              >
                <LogOut className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}
          </motion.div>

          {/* Theme Toggle Inside Menu */}
          <motion.div 
            variants={itemVariants}
            className="pl-1 sm:pl-2 border-l border-black/10 ml-0 sm:ml-1 relative flex items-center h-full"
          >
            <ThemeToggle />
          </motion.div>

          {/* Language Selector Inside Menu */}
          <div 
            className="pl-1 sm:pl-2 border-l border-black/10 relative"
            onMouseLeave={handleLangLeave}
          >
            <motion.button
              variants={itemVariants}
              onMouseEnter={handleLangEnter}
              onClick={(e) => {
                e.stopPropagation();
                setShowLanguages(!showLanguages);
              }}
              className="group flex items-center gap-3 px-4 py-3 rounded-full hover:bg-sasori-red/5 transition-all text-black/70 hover:text-sasori-red"
            >
              <Languages className="w-4 h-4 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
              <span className="text-xs md:text-sm font-black tracking-widest uppercase">
                {lang.toUpperCase()}
              </span>
              <ChevronDown className={cn("w-3 h-3 transition-transform", showLanguages && "rotate-180")} />
            </motion.button>

            <AnimatePresence>
              {showLanguages && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  className="absolute top-full right-0 mt-2 w-32 p-1 rounded-xl border border-sasori-red/10 bg-white/95 shadow-2xl backdrop-blur-xl pointer-events-auto overflow-hidden"
                >
                  {[
                    { code: 'es', label: 'Español' },
                    { code: 'en', label: 'English' },
                    { code: 'zh', label: '中文' },
                    { code: 'ru', label: 'Русский' },
                    { code: 'pt', label: 'Português' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLang?.(l.code);
                        setShowLanguages(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        lang === l.code ? "bg-sasori-red text-white" : "text-black/70 hover:text-sasori-red hover:bg-sasori-red/5"
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Mobile Hamburger Button */}
        <motion.div 
          variants={itemVariants}
          className={cn(
            "lg:hidden items-center pr-3 sm:pr-4 transition-all duration-300", 
            isExpanded ? "flex" : "hidden pointer-events-none opacity-0 w-0 overflow-hidden"
          )}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
            className="p-2 text-black/70 hover:text-sasori-red transition-all outline-none"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            variants={collapsedIconVariants}
            animate={isExpanded ? "expanded" : "collapsed"}
          >
            <SasoriLogo className="h-10 w-10 md:h-12 md:w-12 opacity-100" />
          </motion.div>
        </div>
      </motion.nav>
    </div>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-[4.5rem] md:top-[6rem] inset-x-4 max-h-[80vh] overflow-y-auto glass-metallic-white-nav rounded-3xl p-6 shadow-2xl z-[99] lg:hidden border border-sasori-red/10"
        >
          <div className="flex flex-col gap-1">
            {translatedNavItems.map((item, idx) => (
              <div key={`mob-${item.name}-${idx}`} className="flex flex-col border-b border-black/5 last:border-0">
                <button
                  onClick={() => {
                    if (item.isDropdown) {
                      setShowServices(!showServices);
                    } else {
                      handleLinkClick(item.href!);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="flex justify-between items-center py-4 text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-black/80 hover:text-sasori-red transition-colors text-left"
                >
                  {item.name}
                  {item.isDropdown && <ChevronDown className={cn("w-4 h-4 transition-transform", showServices && "rotate-180")} />}
                </button>
                
                <AnimatePresence>
                  {item.isDropdown && showServices && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 pl-4 pb-4">
                        {services.map((service) => (
                          <button
                            key={`mob-${service.name}`}
                            onClick={() => {
                              handleLinkClick(service.href);
                              setIsMobileMenuOpen(false);
                            }}
                            className="py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-black/60 hover:text-sasori-red transition-all text-left flex items-center group gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-sasori-red opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            {service.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            <div className="mt-6 pt-6 border-t border-black/10 flex flex-col gap-6">
              <Button
                variant="default"
                className="w-full rounded-full gap-2 h-12 bg-sasori-red text-white hover:bg-black transition-colors"
                onClick={() => {
                  handleLinkClick('/login');
                  setIsMobileMenuOpen(false);
                }}
              >
                <UserCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="font-bold text-xs uppercase tracking-widest">{t.account}</span>
              </Button>
              
              {session && (
                <Button
                  variant="outline"
                  className="w-full rounded-full gap-2 h-12 border-sasori-red/20 text-sasori-red hover:bg-sasori-red/5"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-xs uppercase tracking-widest">{t.logout}</span>
                </Button>
              )}
              
              <div className="flex items-center justify-between px-2 bg-black/5 rounded-2xl p-4 border border-black/5">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-black/40">TEMA</span>
                  <ThemeToggle />
                </div>
                
                <div className="flex flex-col right items-end gap-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-black/40">IDIOMA</span>
                  <div className="flex flex-col gap-2 relative">
                    <button
                      onClick={() => setShowLanguages(!showLanguages)}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-black/10 shadow-sm text-[10px] font-black uppercase tracking-widest"
                    >
                      <Languages className="w-3 h-3" />
                      {lang}
                      <ChevronDown className={cn("w-3 h-3 transition-transform", showLanguages && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {showLanguages && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 bottom-full mb-2 bg-white border border-black/10 rounded-xl shadow-xl flex flex-col p-1 w-32 origin-bottom"
                        >
                          {[
                            { code: 'es', label: 'Español' },
                            { code: 'en', label: 'English' },
                            { code: 'zh', label: '中文' },
                            { code: 'ru', label: 'Русский' },
                            { code: 'pt', label: 'Português' },
                          ].map((l) => (
                            <button
                              key={`mob-lang-${l.code}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleLang?.(l.code);
                                setShowLanguages(false);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                lang === l.code ? "bg-sasori-red text-white" : "text-black/70 hover:text-sasori-red hover:bg-sasori-red/5"
                              )}
                            >
                              {l.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
