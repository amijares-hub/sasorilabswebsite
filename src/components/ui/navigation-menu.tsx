"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown, Languages, ArrowRight, UserCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { SasoriLogo } from "./sasori-logo";
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
  collapsed: {
    y: 0,
    opacity: 1,
    width: "4.5rem",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
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
  const [isExpanded, setExpanded] = React.useState(true);
  const [showServices, setShowServices] = React.useState(false);
  const navigate = useNavigate();
  
  const servicesTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const langTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleServicesEnter = () => {
    if (servicesTimeout.current) clearTimeout(servicesTimeout.current);
    setShowServices(true);
    setShowLanguages(false);
  };

  const handleServicesLeave = () => {
    // Dropdowns intentionally left open until selection per user request
  };

  const handleLangEnter = () => {
    if (langTimeout.current) clearTimeout(langTimeout.current);
    setShowLanguages(true);
    setShowServices(false);
  };

  const handleLangLeave = () => {
    // Dropdowns intentionally left open until selection per user request
  };

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  const t = {
    es: { home: "Inicio", solutions: "Servicios", blog: "Blog", contact: "Contacto", demo: "Demos", auto: "Automatización de Procesos", emp: "Empleados Digitales", webs: "Webs y Aplicaciones de Impacto", lim: "Limpieza y Aceleración de Negocios", account: "Mi Cuenta" },
    en: { home: "Home", solutions: "Services", blog: "Blog", contact: "Contact", demo: "Demos", auto: "Process Automation", emp: "Digital Employees", webs: "Impact Webs & Apps", lim: "Business Acceleration", account: "My Account" },
    zh: { home: "首頁", solutions: "服務", blog: "博客", contact: "聯繫", demo: "演示", auto: "流程自動化", emp: "數位員工", webs: "影響力網站與應用", lim: "業務加速", account: "我的帳戶" },
    ru: { home: "Главная", solutions: "Услуги", blog: "Блог", contact: "Контакт", demo: "Демо", auto: "Автоматизация Процессов", emp: "Цифровые Сотрудники", webs: "Влиятельные Веб-сайты", lim: "Ускорение Бизнеса", account: "Мой Аккаунт" },
    pt: { home: "Início", solutions: "Serviços", blog: "Blog", contact: "Contato", demo: "Demos", auto: "Automação de Procesos", emp: "Funcionários Digitais", webs: "Webs e Apps de Impacto", lim: "Aceleração de Negócios", account: "Minha Conta" },
  }[lang as 'es'|'en'|'zh'|'ru'|'pt'] || { home: "Home", solutions: "Services", blog: "Blog", contact: "Contact", demo: "Demos", auto: "Process Automation", emp: "Digital Employees", webs: "Impact Webs & Apps", lim: "Business Acceleration", account: "My Account" };

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
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.split("#")[1];
      if (window.location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
    <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100]">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.1 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        onMouseLeave={handleServicesLeave}
        className={cn(
          "flex items-center overflow-visible rounded-full glass-metallic-white-nav h-12 md:h-20",
          !isExpanded && "cursor-pointer justify-center pl-0"
        )}
      >
        <motion.div
          variants={logoVariants}
          className="flex-shrink-0 flex items-center font-semibold pl-4 md:pl-5 pr-2 md:pr-4 cursor-pointer"
          onClick={() => handleLinkClick("/")}
        >
          <SasoriLogo className="h-6 w-6 md:h-11 md:w-11 ml-1 mr-2 md:mr-3" />
        </motion.div>
        
        <motion.div
          className={cn(
            "flex items-center gap-2 sm:gap-4 pr-8",
            !isExpanded && "pointer-events-none" 
          )}
        >
          {translatedNavItems.map((item, idx) => (
            <div 
              key={`${item.name}-${idx}`} 
              className="relative"
              onMouseEnter={handleServicesEnter}
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
                      className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl border border-sasori-red/10 bg-white/95 shadow-2xl backdrop-blur-xl pointer-events-auto overflow-hidden"
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
          
          <motion.div variants={itemVariants}>
            <Button
              variant="default"
              size="lg"
              className="rounded-full gap-2 px-6 group h-9 md:h-12"
              onClick={(e) => {
                e.stopPropagation();
                handleLinkClick('/login');
              }}
            >
              <UserCircle2 className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline font-bold text-xs md:text-sm uppercase tracking-widest">{t.account}</span>
              <ArrowRight 
                className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5" 
                size={16} 
                strokeWidth={2} 
                aria-hidden="true" 
              />
            </Button>
          </motion.div>

          {/* Language Selector Inside Menu */}
          <div className="pl-2 border-l border-black/10 ml-1 relative">
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
  );
}
