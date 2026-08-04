import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../i18n/translations";
import { SasoriLogo } from "../components/ui/sasori-logo";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Monitor, Database, Smartphone, Cloud, Users } from "lucide-react";
import { useFunnelStore } from "../store/useFunnelStore";
import { MagneticDock } from "../components/ui/magnetic-dock";

const SANS = "'Inter', 'Helvetica Neue', Arial, system-ui, sans-serif";
const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const INK = "#1a1a22";

/* Film grain overlay */
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const LOOP = 24; // seconds for one full 360° orbit
const PERSP = 2200; // px — camera distance

type SupportedLang = 'es' | 'en' | 'pt' | 'ru' | 'zh';

// 🌐 DICCIONARIO COMPLETO DE TRADUCCIONES (Incluye Dock)
const I18N_TEXTS = {
  cta: {
    es: "CONSULTA GRATIS",
    en: "FREE CONSULTATION",
    pt: "CONSULTA GRÁTIS",
    ru: "БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ",
    zh: "免费咨询"
  },
  phrases: {
    es: ["UI/UX", "BASE DE DATOS", "APPS", "SAAS", "CRM"],
    en: ["UI/UX", "DATABASES", "APPS", "SAAS", "CRM"],
    pt: ["UI/UX", "BANCO DE DADOS", "APPS", "SAAS", "CRM"],
    ru: ["UI/UX", "БАЗЫ ДАННЫХ", "ПРИЛОЖЕНИЯ", "SAAS", "CRM"],
    zh: ["UI/UX", "数据库", "应用程序", "SAAS", "CRM"]
  },
  dockLabels: {
    uiUx: { es: "UI/UX", en: "UI/UX", pt: "UI/UX", ru: "UI/UX", zh: "UI/UX" },
    databases: { es: "Bases de Datos", en: "Databases", pt: "Bancos de Dados", ru: "Базы данных", zh: "数据库" },
    apps: { es: "Aplicaciones", en: "Apps", pt: "Aplicativos", ru: "Приложения", zh: "应用程序" },
    saas: { es: "SaaS", en: "SaaS", pt: "SaaS", ru: "SaaS", zh: "SaaS" },
    crm: { es: "CRM", en: "CRM", pt: "CRM", ru: "CRM", zh: "CRM" }
  },
  servicesBadge: {
    es: "NUESTROS SERVICIOS",
    en: "OUR SERVICES",
    pt: "NOSSOS SERVIÇOS",
    ru: "НАШИ УСЛУГИ",
    zh: "我们的服务"
  },
  servicesAction: {
    es: "MÁS INFORMACIÓN",
    en: "MORE INFO",
    pt: "MAIS INFORMAÇÕES",
    ru: "ПОДРОБНЕЕ",
    zh: "更多信息"
  },
  promo: {
    badge: {
      es: "OFERTA LIMITADA",
      en: "LIMITED PROMO",
      pt: "OFERTA LIMITADA",
      ru: "ОГРАНИЧЕННАЯ АКЦИЯ",
      zh: "限时优惠"
    },
    title: {
      es: "SaaS MVP en 4 Semanas",
      en: "SaaS MVP in 4 Weeks",
      pt: "SaaS MVP em 4 Semanas",
      ru: "SaaS MVP за 4 недели",
      zh: "4周内推出 SaaS MVP"
    },
    desc: {
      es: "Precios especiales para Startups. Lanza tu producto al mercado en tiempo récord.",
      en: "Special pricing for Startups. Launch your product to market in record time.",
      pt: "Preços especiais para Startups. Lance seu produto no mercado em tempo recorde.",
      ru: "Специальные цены для стартапов. Запустите свой продукт на рынок в рекордно короткие сроки.",
      zh: "为初创企业提供特价。以创纪录的时间将您的产品推向市场。"
    },
    action: {
      es: "RECLAMAR OFERTA",
      en: "CLAIM OFFER",
      pt: "RESGATAR OFERTA",
      ru: "ПОЛУЧИТЬ ПРЕДЛОЖЕНИЕ",
      zh: "领取优惠"
    }
  },
  servicesLoop: [
    {
      path: "/services/frontend-ux",
      title: {
        es: "Stack Tecnológico Frontend (UX/UI)",
        en: "Frontend Tech Stack (UX/UI)",
        pt: "Stack Tecnológico Frontend (UX/UI)",
        ru: "Стек фронтенд-технологий (UX/UI)",
        zh: "前端技术栈 (UX/UI)"
      },
      desc: {
        es: "Diseñamos interfaces intuitivas y de alto rendimiento que cautivan a tus usuarios.",
        en: "We design intuitive, high-performance interfaces that captivate your users.",
        pt: "Projetamos interfaces intuitivas e de alto desempenho que cativam seus usuários.",
        ru: "Мы разрабатываем интуитивно понятные и высокопроизводительные интерфейсы.",
        zh: "我们设计直观、高性能的界面，吸引您的用户。"
      }
    },
    {
      path: "/services/backend-relational",
      title: {
        es: "Base de Datos Relacional y Backend",
        en: "Relational Database & Backend",
        pt: "Banco de Dados Relacional e Backend",
        ru: "Реляционные базы данных и бэкенд",
        zh: "关系数据库和后端"
      },
      desc: {
        es: "Arquitecturas robustas y escalables para el manejo seguro de tus datos críticos.",
        en: "Robust and scalable architectures for the secure handling of your critical data.",
        pt: "Arquiteturas robustas e escaláveis para o manuseio seguro de seus dados.",
        ru: "Надежные и масштабируемые архитектуры для безопасной обработки данных.",
        zh: "强大且可扩展的架构，用于安全处理您的关键数据。"
      }
    },
    {
      path: "/services/cybersecurity",
      title: {
        es: "Ciberseguridad y Auditoría Zero-Trust",
        en: "Cybersecurity & Zero-Trust Auditing",
        pt: "Cibersegurança e Auditoria Zero-Trust",
        ru: "Кибербезопасность и аудит Zero-Trust",
        zh: "网络安全和零信任审计"
      },
      desc: {
        es: "Protegemos tu ecosistema digital con las políticas y estándares más rigurosos.",
        en: "We protect your digital ecosystem with the most rigorous policies and standards.",
        pt: "Protegemos seu ecossistema digital com as políticas mais rigorosas.",
        ru: "Защищаем вашу цифровую экосистему по строжайшим стандартам.",
        zh: "我们用最严格的政策和标准保护您的数字生态系统。"
      }
    },
    {
      path: "/services/infrastructure",
      title: {
        es: "Resiliencia Operativa e Integración Cloud",
        en: "Operational Resilience & Cloud Integration",
        pt: "Resiliência Operacional e Integração Cloud",
        ru: "Операционная устойчивость и интеграция",
        zh: "运营弹性和云集成"
      },
      desc: {
        es: "Garantizamos la continuidad de tu negocio con soluciones en la nube de alta disponibilidad.",
        en: "We ensure your business continuity with high-availability cloud solutions.",
        pt: "Garantimos a continuidade do seu negócio com soluções em nuvem de alta disponibilidade.",
        ru: "Обеспечиваем непрерывность бизнеса с помощью надежных облачных решений.",
        zh: "我们通过高可用性云解决方案确保您的业务连续性。"
      }
    },
    {
      path: "/services/ipaas",
      title: {
        es: "Hub de Integración, APIs y Conectividad",
        en: "Integration Hub, APIs & Connectivity",
        pt: "Hub de Integração, APIs e Conectividade",
        ru: "Интеграция, API и связь",
        zh: "集成中心，API 和外部连接"
      },
      desc: {
        es: "Conectamos tus sistemas para un flujo de información ininterrumpido y eficiente.",
        en: "We connect your systems for a seamless and efficient flow of information.",
        pt: "Conectamos seus sistemas para um fluxo de informações eficiente.",
        ru: "Объединяем ваши системы для бесперебойного и эффективного потока данных.",
        zh: "我们连接您的系统，实现无缝、高效的信息流动。"
      }
    },
    {
      path: "/services/ai-hardware",
      title: {
        es: "IA, Hardware y Herramientas Predictivas",
        en: "AI, Hardware & Predictive Tools",
        pt: "IA, Hardware e Ferramentas Preditivas",
        ru: "ИИ, оборудование и инструменты",
        zh: "人工智能，硬件和预测工具"
      },
      desc: {
        es: "Anticipa tendencias y optimiza procesos con modelos predictivos avanzados.",
        en: "Anticipate trends and optimize processes with advanced predictive models.",
        pt: "Antecipe tendências e otimize processos com modelos preditivos avançados.",
        ru: "Оптимизируйте процессы с помощью передовых прогнозирующих моделей ИИ.",
        zh: "利用高级预测模型预测趋势并优化流程。"
      }
    },
    {
      path: "/services/modernization",
      title: {
        es: "Gestión SaaS y Gobernanza IT",
        en: "SaaS Ecosystem & IT Governance",
        pt: "Ecossistema SaaS e Governança de TI",
        ru: "Экосистема SaaS и управление ИТ",
        zh: "SaaS 生态系统和 IT 治理"
      },
      desc: {
        es: "Administra tus herramientas en la nube con control total y cumplimiento normativo.",
        en: "Manage your cloud tools with full control and regulatory compliance.",
        pt: "Gerencie suas ferramentas em nuvem com controle total e conformidade.",
        ru: "Управляйте облачными инструментами с полным контролем и соблюдением нормативов.",
        zh: "全面掌控并合规地管理您的云工具。"
      }
    },
    {
      path: "/services/ai-agents",
      title: {
        es: "Motores de Razonamiento e IA Agéntica",
        en: "Reasoning Engines & Agentic AI",
        pt: "Motores de Raciocínio e IA Agêntica",
        ru: "Механизмы рассуждений и ИИ",
        zh: "推理引擎和代理人工智能"
      },
      desc: {
        es: "Agentes inteligentes que toman decisiones autónomas para escalar tu operativa.",
        en: "Intelligent agents that make autonomous decisions to scale your operations.",
        pt: "Agentes inteligentes que tomam decisões autônomas para escalar suas operações.",
        ru: "Интеллектуальные агенты, принимающие решения для масштабирования операций.",
        zh: "做出自主决策以扩展运营的智能代理。"
      }
    },
    {
      path: "/services/ai-automation",
      title: {
        es: "Automatización de Flujos y Servicios TI",
        en: "IT Flow & Services Automation",
        pt: "Automação de Fluxos e Serviços de TI",
        ru: "Автоматизация ИТ-потоков и сервисов",
        zh: "IT 流程和服务自动化"
      },
      desc: {
        es: "Eliminamos cuellos de botella mediante flujos de trabajo inteligentes y automatizados.",
        en: "We eliminate bottlenecks through intelligent and automated workflows.",
        pt: "Eliminamos gargalos por meio de fluxos de trabalho inteligentes.",
        ru: "Устраняем узкие места с помощью интеллектуальных автоматизированных процессов.",
        zh: "我们通过智能和自动化工作流程消除瓶颈。"
      }
    }
  ]
};

interface LandingPageInteractivaProps {
  lang: SupportedLang;
}

export function LandingPageInteractiva({ lang }: LandingPageInteractivaProps) {
  const navigate = useNavigate();
  const openFunnel = useFunnelStore((state) => state.openFunnel);
  
  // Estado para controlar el índice del servicio actual
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  // Helper para obtener textos según idioma con fallback a 'en'
  const getText = (obj: Record<SupportedLang, string>): string => {
    return obj[lang] || obj.en;
  };

  // Construcción dinámica de los ítems del Dock traducidos
  const dockItems = [
    { id: "ui-ux", label: getText(I18N_TEXTS.dockLabels.uiUx), icon: <Monitor /> },
    { id: "database", label: getText(I18N_TEXTS.dockLabels.databases), icon: <Database /> },
    { id: "apps", label: getText(I18N_TEXTS.dockLabels.apps), icon: <Smartphone /> },
    { id: "saas", label: getText(I18N_TEXTS.dockLabels.saas), icon: <Cloud /> },
    { id: "crm", label: getText(I18N_TEXTS.dockLabels.crm), icon: <Users /> },
  ];

  // Efecto para cambiar el servicio cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % I18N_TEXTS.servicesLoop.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const ctaText = getText(I18N_TEXTS.cta);
  const phrases = I18N_TEXTS.phrases[lang] || I18N_TEXTS.phrases.en;

  const ringN = phrases.length;
  const ringStep = 360 / ringN;
  const ringR = 720; 

  const currentService = I18N_TEXTS.servicesLoop[currentServiceIndex];

  return (
    <div className="relative h-screen bg-[#f1f1f7] text-[#1a1a22] overflow-hidden" style={{ fontFamily: SANS }}>
      <style>{`
        @keyframes sasori-orbit {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(-360deg); }
        }
        @keyframes sasori-fade {
          0%, 100% { opacity: 1; filter: blur(0px); }
          12% { opacity: 1; filter: blur(0px); }
          25% { opacity: 0; filter: blur(4px); }
          75% { opacity: 0; filter: blur(4px); }
          88% { opacity: 1; filter: blur(0px); }
        }
        @keyframes sasori-rise {
          0% { transform: translateY(0); }
          25% { transform: translateY(0); }
          50% { transform: translateY(32vh); }
          75% { transform: translateY(32vh); }
          85% { transform: translateY(0); }
          100% { transform: translateY(0); }
        }
        @keyframes sasori-bubble {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          12% { opacity: 0.7; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-108vh) translateX(2vh); opacity: 0; }
        }
        @keyframes logo-glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(226, 6, 19, 0.2)) drop-shadow(0 0 40px rgba(226, 6, 19, 0.1));
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          50% {
            filter: drop-shadow(0 0 45px rgba(226, 6, 19, 0.75)) drop-shadow(0 0 90px rgba(226, 6, 19, 0.35));
            transform: translate(-50%, -50%) translateY(-15px) rotate(3deg);
          }
        }
        .sasori-stage {
          transform-style: preserve-3d;
          animation: sasori-orbit ${LOOP}s linear infinite;
          will-change: transform;
        }
        .sasori-phrase {
          backface-visibility: hidden;
          WebkitBackfaceVisibility: hidden;
          will-change: opacity;
        }
        .logo-container {
          animation: logo-glow 6s ease-in-out infinite;
        }
      `}</style>

      <section
        className="relative overflow-hidden flex flex-col items-center justify-center"
        style={{
          height: "100vh",
          width: "100%",
          background: "radial-gradient(125% 120% at 50% 28%, #f1f1f7 0%, #e7e6f0 46%, #ddd9ea 74%, #d2cde2 100%)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            pointerEvents: "none",
            backgroundImage: `url("${GRAIN}")`,
            backgroundSize: "140px 140px",
            opacity: 0.05,
            mixBlendMode: "multiply",
          }}
        />

        {/* ── 3D Text Carousel ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            perspective: `${PERSP}px`,
            perspectiveOrigin: "50% 48%",
            overflow: "hidden",
            pointerEvents: "none",
            transform: "translateY(15vh)", 
          }}
        >
          <div className="sasori-stage absolute inset-0">
            {phrases.map((p, i) => (
              <span
                key={p}
                className="sasori-phrase absolute inset-0 grid place-items-center"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 900,
                  fontSize: "13vh",
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  whiteSpace: "nowrap",
                  color: INK,
                  opacity: 0,
                  transform: `rotateY(${(i * ringStep).toFixed(2)}deg) translateZ(${ringR}px) rotateY(180deg)`,
                  animation: `sasori-fade ${LOOP}s linear ${(
                    (-LOOP * ((ringN - i) % ringN)) / ringN -
                    LOOP / 2
                  ).toFixed(3)}s infinite`,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    animation: `sasori-rise ${LOOP}s linear ${(
                      (-LOOP * ((ringN - i) % ringN)) / ringN -
                      LOOP / 2
                    ).toFixed(3)}s infinite`,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      transform: "scaleX(0.85)",
                      transformOrigin: "center",
                    }}
                  >
                    {p}
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Background Floating Bubbles ── */}
        {[
          { left: "15%", size: "0.8vh", delay: "0s", dur: "14s" },
          { left: "80%", size: "1.2vh", delay: "3s", dur: "18s" },
          { left: "62%", size: "0.6vh", delay: "6s", dur: "12s" },
          { left: "30%", size: "1.0vh", delay: "5s", dur: "16s" },
        ].map((b, i) => (
          <span
            key={i}
            aria-hidden
            style={{
              position: "absolute",
              bottom: "-4vh",
              left: b.left,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: "rgba(226, 6, 19, 0.12)",
              boxShadow: "0 0 8px rgba(226, 6, 19, 0.15)",
              zIndex: 12,
              animation: `sasori-bubble ${b.dur} linear ${b.delay} infinite`,
              willChange: "transform, opacity",
            }}
          />
        ))}

        {/* ── Center Logo ── */}
        <div
          className="logo-container absolute z-20 pointer-events-none" 
          style={{
            left: "50%",
            top: "33%",
            transform: "translate(-50%, -50%)",
            width: "min(34vh, 42vw)", 
            height: "min(34vh, 42vw)", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.92, 
          }}
        >
          <SasoriLogo className="w-full h-full p-6 select-none filter transition-all duration-300" />
        </div>

        {/* ── Left Billboard Promo Card (Services Loop) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => {
            navigate(currentService.path);
            window.scrollTo(0, 0);
          }}
          className="hidden md:flex absolute top-[18%] left-[6%] lg:left-[10%] z-30 w-80 h-[260px] flex-col justify-between p-6 rounded-2xl bg-white border-2 border-[#1a1a22] shadow-[0_15px_40px_rgba(0,0,0,0.08)] cursor-pointer group overflow-hidden transition-all duration-500 hover:bg-zinc-50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1"
        >
          <div className="absolute -left-12 -top-12 w-32 h-32 bg-black/5 rounded-full blur-3xl group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />

          {/* Badge superior */}
          <div className="flex items-center gap-2 z-10 shrink-0">
            <span className="px-2.5 py-1 flex items-center text-[10px] font-black tracking-widest text-[#1a1a22] bg-[#1a1a22]/5 border border-[#1a1a22]/20 rounded uppercase">
              {getText(I18N_TEXTS.servicesBadge)}
            </span>
          </div>

          {/* Loop Content con AnimatePresence en contenedor flex centrado */}
          <div className="z-10 my-auto relative h-32 flex flex-col justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentServiceIndex}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full"
              >
                <h3 className="text-[#1a1a22] text-base font-bold leading-tight mb-2 line-clamp-2">
                  {getText(currentService.title)}
                </h3>
                <p className="text-[#1a1a22]/70 text-xs leading-relaxed line-clamp-3">
                  {getText(currentService.desc)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Button inferior fijo */}
          <div className="flex items-center text-[#1a1a22] text-xs font-bold tracking-widest uppercase z-10 shrink-0">
            <span>{getText(I18N_TEXTS.servicesAction)}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
          </div>
        </motion.div>

        {/* ── Right Billboard Promo Card (Promos) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={openFunnel}
          className="hidden md:flex absolute top-[18%] right-[6%] lg:right-[10%] z-30 w-80 h-[260px] flex-col justify-between p-6 rounded-2xl bg-[#E20613] text-white shadow-[0_0_30px_rgba(226,6,19,0.4)] cursor-pointer group overflow-hidden transition-all duration-500 hover:bg-[#c10510] hover:shadow-[0_0_40px_rgba(226,6,19,0.6)] hover:-translate-y-1"
        >
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500 pointer-events-none" />

          {/* Badge superior */}
          <div className="flex items-center gap-2 z-10 shrink-0">
            <span className="px-2.5 py-1 flex items-center text-[10px] font-black tracking-widest text-white bg-white/20 border border-white/30 rounded uppercase">
              {getText(I18N_TEXTS.promo.badge)}
            </span>
          </div>

          {/* Content central */}
          <div className="z-10 my-auto h-32 flex flex-col justify-center">
            <h3 className="text-white text-base font-bold leading-tight mb-2 line-clamp-2">
              {getText(I18N_TEXTS.promo.title)}
            </h3>
            <p className="text-white/80 text-xs leading-relaxed line-clamp-3">
              {getText(I18N_TEXTS.promo.desc)}
            </p>
          </div>

          {/* Action Button inferior fijo */}
          <div className="flex items-center text-white text-xs font-bold tracking-widest uppercase z-10 shrink-0">
            <span>{getText(I18N_TEXTS.promo.action)}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
          </div>
        </motion.div>

        {/* ── Magnetic Dock Traducido (Servicios) ── */}
        <div className="absolute bottom-28 z-30 w-full flex justify-center">
          <MagneticDock 
            items={dockItems} 
            magnetRadius={120} 
            maxScale={1.5} 
            lift={12} 
            idleWave 
            tooltip 
            onSelect={(id) => {
              console.log("Selected service:", id);
              openFunnel(); 
            }}
          />
        </div>

        {/* ── CTA Button (Consulta Gratis) ── */}
        <div className="absolute bottom-16 z-40 w-full flex justify-center">
          <button
            onClick={openFunnel}
            className="group flex items-center gap-3 px-10 py-4 bg-[#E20613] text-white rounded-full font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#c10510] shadow-[0_0_30px_rgba(226,6,19,0.4)] hover:shadow-[0_0_40px_rgba(226,6,19,0.6)]"
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

      </section>
    </div>
  );
}