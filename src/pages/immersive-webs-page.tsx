import React, { useEffect, useState } from "react";
import HeroText from "../components/ui/hero-shutter-text";
import { FeatureHighlightCard } from "../components/ui/feature-highlight-card";
import { TextScrollAnimation } from "../components/ui/text-scroll-animation";
import { useNavigate } from "react-router-dom";
import { 
  Network, Database, Workflow, BarChart3, 
  Briefcase, LineChart, Users, Settings, 
  ShieldCheck, Zap, Lock, Eye, AlertCircle, ShoppingCart, ChevronDown, 
  Layers, Rocket, MonitorPlay, Box, Smartphone, Check, LayoutTemplate
} from "lucide-react";
import { motion } from "framer-motion";
import { translations } from "../i18n/translations";

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-black/5 rounded-2xl bg-[#F8F8F8] overflow-hidden mb-4 transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left px-8 py-6 flex justify-between items-center bg-white hover:bg-[#FAF0F0] transition-colors"
      >
        <span className="font-bold text-lg text-[#1A1A1A] pr-8">{question}</span>
        <ChevronDown className={`w-6 h-6 text-sasori-red flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div 
        className={`px-8 transition-all duration-300 ease-in-out ${isOpen ? 'py-6 opacity-100 max-h-[500px]' : 'py-0 opacity-0 max-h-0'}`}
      >
        <p className="text-black/60 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

export function ImmersiveWebsPage({ lang = "es" }: { lang?: string }) {
  const navigate = useNavigate();
  const t = translations[lang as keyof typeof translations] || translations.es;
  const tp = t.servicesPages.immersive;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCta = () => {
    navigate("/#contact");
  };

  // cases variable is no longer needed locally as it's in the translations

  return (
    <div className="bg-white min-h-screen text-[#1A1A1A] font-sans selection:bg-sasori-red selection:text-white">
      {/* 1. Hero Section */}
      <HeroText text={tp.hero} subtitle="" />

      {/* Tagline Section - Animated */}
      <section className="relative z-20">
        <TextScrollAnimation 
          lang={lang} 
          customText={tp.tagline} 
          customHighlight={tp.taglineHighlight} 
          customSubtext={
            <>
              {tp.subtext}
            </>
          }
        />
      </section>

      {/* 2. Metodología (Nuestra Ingeniería Visual) */}
      <section className="py-24 px-6 bg-[#F8F8F8] relative overflow-hidden border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 md:mb-16 text-center">
            <h3 className="text-sasori-red text-sm font-bold tracking-[0.2em] uppercase mb-4">{tp.designTitle}</h3>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-6">
              {tp.designHeading}
            </h2>
            <div className="w-24 h-1.5 bg-sasori-red mx-auto mt-6 rounded-full" />
            <p className="mt-6 text-lg text-black/50 max-w-2xl mx-auto">
              {tp.designDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                icon: <MonitorPlay className="w-8 h-8" />,
                title: tp.webgl,
                desc: tp.webglDesc
              },
              {
                icon: <Rocket className="w-8 h-8" />,
                title: tp.ux,
                desc: tp.uxDesc
              },
              {
                icon: <Layers className="w-8 h-8" />,
                title: tp.conversion,
                desc: tp.conversionDesc
              },
              {
                icon: <ShoppingCart className="w-8 h-8" />,
                title: tp.performance,
                desc: tp.performanceDesc
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-black/[0.03] border border-black/5 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-sasori-red/10 rounded-2xl flex items-center justify-center text-sasori-red mb-6">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black tracking-tight mb-4">{item.title}</h4>
                <p className="text-black/60 text-lg leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ¿Quiénes se benefician? Bento Grid */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#0A0A0A] via-[#2A0005] to-[#000000] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 md:mb-20">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-sasori-red mb-4">Industrias Target</h2>
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              ¿Quiénes se <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">benefician?</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-[#111111] border border-white/5 hover:border-sasori-red/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <Briefcase className="w-10 h-10 text-white/30 group-hover:text-sasori-red transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">Marcas de Lujo<br />y Premium</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  Joyerías, automotrices o moda que necesitan transmitir exclusividad y detalle extremo.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-[#111111] border border-white/5 hover:border-white/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <LayoutTemplate className="w-10 h-10 text-white/30 group-hover:text-white transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">Real Estate y<br />Arquitectura</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  Inmobiliarias y estudios que quieren mostrar propiedades y recorridos antes de que se construyan.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-[#111111] border border-white/5 hover:border-sasori-red/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <Zap className="w-10 h-10 text-white/30 group-hover:text-sasori-red transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">Empresas Tech<br />e Innovadoras</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  Startups que quieren demostrar desde el primer segundo que están a la vanguardia del mercado.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="bg-[#111111] border border-white/5 hover:border-white/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <Box className="w-10 h-10 text-white/30 group-hover:text-white transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">Fabricantes de<br />Productos</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  Empresas industriales que necesitan explicar maquinaria o partes internas de forma visual e intuitiva.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Seguridad y Garantías - 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="metallic-vinotinto-card p-8 rounded-[2rem] flex flex-col justify-between overflow-hidden relative group"
            >
              <Zap className="w-8 h-8 text-sasori-red mb-6" />
              <h4 className="text-2xl font-black uppercase text-white mb-4">Carga Instantánea</h4>
              <p className="text-white/60 text-base leading-relaxed">
                A pesar de los efectos visuales complejos, optimizamos el peso de los archivos y usamos carga diferida para que tu web sea ultrarrápida.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="metallic-vinotinto-card p-8 rounded-[2rem] flex flex-col justify-between overflow-hidden relative group"
            >
              <Smartphone className="w-8 h-8 text-white mb-6" />
              <h4 className="text-2xl font-black uppercase text-sasori-red mb-4">Compatibilidad</h4>
              <p className="text-white/60 text-base leading-relaxed">
                Garantizamos que la expecierencia 3D fluya igual de bien en un iPhone de última generación que en un ordenador de oficina.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
              className="metallic-vinotinto-card p-8 rounded-[2rem] flex flex-col justify-between overflow-hidden relative group"
            >
              <Lock className="w-8 h-8 text-sasori-red mb-6" />
              <h4 className="text-2xl font-black uppercase text-white mb-4">Propiedad Total</h4>
              <p className="text-white/60 text-base leading-relaxed">
                El diseño y el código fuente son activos de tu empresa. Sin cuotas mensuales ocultas o candados por "alquiler" de la plataforma.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Marquee de Casos Reales */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A] text-center">
            Ejemplos y <span className="text-sasori-red">Casos Reales</span>
          </h2>
        </div>

        <div className="w-full relative flex overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <motion.div 
            className="flex gap-6 min-w-max px-6 py-4"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          >
            {[...tp.cases, ...tp.cases].map((item, i) => (
              <div 
                key={i} 
                className="w-[300px] md:w-[400px] shrink-0 bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-xl shadow-black/[0.02] hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="inline-block px-3 py-1 bg-sasori-red/5 text-sasori-red rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                  {item.tag}
                </div>
                <h4 className="text-xl md:text-2xl font-black leading-tight mb-4">{item.title}</h4>
                <p className="text-black/60 text-sm md:text-base leading-relaxed h-20 overflow-hidden mb-6">
                  {item.desc}
                </p>
                <div className="pt-6 border-t border-black/5 mt-auto">
                  <div className="text-[10px] uppercase font-bold text-black/40 tracking-widest mb-2">
                    {item.metricLabel}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-sasori-red">{item.metricValue}</span>
                    <span className="text-xs text-black/50 font-medium">{item.metricDesc}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Pricing / Mantenimiento */}
      <section className="py-24 px-6 bg-[#111111] text-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h3 className="text-sasori-red text-sm font-bold tracking-[0.2em] uppercase mb-4">Planes de Acompañamiento y Evolución Digital</h3>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">
              "Tu tecnología <span className="text-sasori-red">nunca se queda atrás.</span><br />Nosotros nos encargamos de que siempre sea el primer día."
            </h2>
            <p className="text-white/50 max-w-3xl mx-auto">
              Construir el futuro es el primer paso. Mantenerse en él es lo que separa a los líderes de los seguidores. Elige el plan que mejor se adapte a tu ritmo de crecimiento.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 md:mb-16">
            {/* Essential */}
            <div className="bg-[#1A1A1A] border border-white/5 hover:border-sasori-red/30 rounded-3xl p-8 flex flex-col transition-all duration-300 relative group">
              <h4 className="text-2xl font-black mb-2 text-white/50 group-hover:text-white">Plan Essential</h4>
              <p className="text-white/40 text-sm mb-6 pb-6 border-b border-white/10 uppercase tracking-widest">(Soporte)</p>
              
              <p className="text-sm text-white/70 mb-8 italic min-h-[40px]">Perfecto para Webs de impacto y bots básicos.</p>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/70">Actualización de IA Mensual (Ajustes de respuestas)</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/70">Optimización 3D Básica (Navegadores)</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/70">Seguridad: Parches y copias legales</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/70">Soporte Técnico Email (48h)</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/70">Reporte de métricas Trimestral</span></li>
              </ul>
            </div>

            {/* Performance */}
            <div className="bg-gradient-to-b from-[#2A0005] to-[#111] border border-sasori-red/30 hover:border-sasori-red/60 rounded-3xl p-8 flex flex-col transition-all duration-300 relative group transform md:-translate-y-4 shadow-[0_0_50px_rgba(226,6,19,0.1)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sasori-red text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">Recomendado</div>
              <h4 className="text-2xl font-black mb-2 text-sasori-red group-hover:text-white">Plan Performance</h4>
              <p className="text-white/40 text-sm mb-6 pb-6 border-b border-sasori-red/20 uppercase tracking-widest">(Evolución)</p>
              
              <p className="text-sm text-white/80 mb-8 italic min-h-[40px]">Ideal para Ecommerce 3D y asistentes de ventas avanzados.</p>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/90">Actualización de IA Semanal (Re-entrenamiento)</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/90">Optimización Avanzada (Nuevos dispositivos)</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/90">Monitoreo 24/7 y Firewall activo</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/90">Soporte Chat Directo (12h)</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/90">Reporte Mensual detallado de rendimiento</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/90">Horas de desarrollo mensual incluidas</span></li>
              </ul>
            </div>

            {/* Elite */}
            <div className="bg-[#1A1A1A] border border-white/5 hover:border-sasori-red/30 rounded-3xl p-8 flex flex-col transition-all duration-300 relative group">
              <h4 className="text-2xl font-black mb-2 text-white/50 group-hover:text-white">Plan Elite</h4>
              <p className="text-white/40 text-sm mb-6 pb-6 border-b border-white/10 uppercase tracking-widest">(Innovación)</p>
              
              <p className="text-sm text-white/70 mb-8 italic min-h-[40px]">Hecho para Ecosistemas de IA totales y Apps del futuro.</p>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/70">Actualización en Tiempo Real + Nuevos Modelos</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/70">Renderizado de nueva generación</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/70">Seguridad: Auditoría de intrusión mensual</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/70">Prioridad VIP (Asistencia Inmediata)</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-sasori-red flex-shrink-0" /><span className="text-sm text-white/70">Estrategia bi-semanal con ingenieros de IA</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Preguntas Frecuentes */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h3 className="text-sasori-red text-sm font-bold tracking-[0.2em] uppercase mb-4">Despejando dudas</h3>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A]">
              Preguntas Frecuentes
            </h2>
          </div>
          <div className="flex flex-col">
            {tp.faqs.map((faq, i) => (
              <FaqItem 
                key={i}
                question={faq.question} 
                answer={faq.answer} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Final */}
      <section className="bg-white py-32 px-6 border-t border-black/5 relative items-center justify-center flex">
        <FeatureHighlightCard 
          imageSrc="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80"
          title={tp.ctaTitle}
          description={tp.ctaDesc}
          buttonText={tp.ctaBtn}
          onButtonClick={handleCta}
        />
      </section>
    </div>
  );
}
