import React, { useEffect, useState } from "react";
import HeroText from "../components/ui/hero-shutter-text";
import { PremiumContact } from "../components/ui/premium-contact";
import { TextScrollAnimation } from "../components/ui/text-scroll-animation";
import { useNavigate } from "react-router-dom";
import { 
  Network, Database, Workflow, BarChart3, 
  Briefcase, LineChart, Users, Settings, 
  ShieldCheck, Zap, Lock, Eye, AlertCircle, ShoppingCart, ChevronDown, 
  Layers, Rocket, MonitorPlay, Box, Smartphone, Check, LayoutTemplate, 
  Gauge, Cloud, Shield, Wrench, Fingerprint, Activity, Code, Cpu, Scan
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

export function ModernizationPage({ lang = "es" }: { lang?: string }) {
  const navigate = useNavigate();
  const t = translations[lang as keyof typeof translations] || translations.es;
  const tp = (t.servicesPages as any).modernization;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCta = () => {
    navigate("/#contact");
  };

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

      {/* 2. Metodología (Nuestra Ingeniería de Alto Rendimiento) */}
      <section className="py-24 px-6 bg-[#F8F8F8] relative overflow-hidden border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h3 className="text-sasori-red text-sm font-bold tracking-[0.2em] uppercase mb-4">{tp.engTitle}</h3>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-6">
              {tp.engHeading}
            </h2>
            <div className="w-24 h-1.5 bg-sasori-red mx-auto mt-6 rounded-full" />
            <p className="mt-6 text-lg text-black/50 max-w-2xl mx-auto">
              {tp.engDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                icon: <Code className="w-8 h-8" />,
                title: tp.refactor,
                desc: tp.refactorDesc
              },
              {
                icon: <Layers className="w-8 h-8" />,
                title: tp.microservices,
                desc: tp.microservicesDesc
              },
              {
                icon: <Cloud className="w-8 h-8" />,
                title: tp.cloud,
                desc: tp.cloudDesc
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: tp.security,
                desc: tp.securityDesc
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

      {/* 3. Servicios de Optimización y Futuro (Grid de 6) */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A]">
              {tp.servicesHeading}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tp.servicesList.map((srv: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-[#F8F8F8] border border-black/5 p-8 rounded-3xl hover:border-sasori-red/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-black/5 flex items-center justify-center text-[#1A1A1A] group-hover:text-sasori-red mb-6 transition-colors duration-300">
                  {/* Icon mapping would go here if dynamic, using placeholder for structure */}
                  <Rocket className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black tracking-tight mb-3 text-[#1A1A1A]">{srv.title}</h4>
                <p className="text-black/60 text-sm mb-4 leading-relaxed"><span className="font-bold text-black/80">{tp.actionLabel}:</span> {srv.action}</p>
                <p className="text-sasori-red text-sm font-semibold"><span className="text-[#1A1A1A] opacity-50 font-normal">{tp.benefitLabel}:</span> {srv.benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ¿Quiénes se benefician? Bento Grid */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#0A0A0A] via-[#2A0005] to-[#000000] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-sasori-red mb-4">{tp.sectorsTitle}</h2>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              {tp.sectorsHeading}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {tp.sectors.map((sector: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#111111] border border-white/5 hover:border-sasori-red/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sasori-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h4 className="text-2xl font-black mb-3 text-white leading-tight">{sector.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {sector.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gráficos Vivos (BI Avanzado) Box gigante */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="metallic-vinotinto-card p-10 md:p-16 rounded-[3rem] flex flex-col md:flex-row gap-12 overflow-hidden relative group"
          >
            <div className="absolute right-0 top-0 w-[600px] h-full bg-gradient-to-l from-sasori-red/5 to-transparent pointer-events-none" />
            <Activity className="absolute right-[-100px] bottom-[-100px] w-[500px] h-[500px] text-white/5 pointer-events-none" />
            
            <div className="md:w-1/2 relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-8 w-max">
                <span className="w-2 h-2 rounded-full bg-sasori-red animate-pulse" />
                {tp.biLabel}
              </div>
              <h4 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6 text-white leading-none">
                {tp.biHeading}
              </h4>
              <p className="text-white/60 text-lg leading-relaxed mb-4">
                {tp.biDesc}
              </p>
            </div>

            <div className="md:w-1/2 relative z-10 flex flex-col gap-6 justify-center">
              {tp.biFeatures.map((feat: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 text-sasori-red flex-shrink-0">
                    {i === 0 ? <LineChart /> : i === 1 ? <AlertCircle /> : <Eye />}
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white mb-2">{feat.title}</h5>
                    <p className="text-white/50 text-sm">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Marquee de Casos Reales */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A] text-center">
            {tp.casesHeading}
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
            {[...tp.cases, ...tp.cases].map((item: any, i: number) => (
              <div 
                key={i} 
                className="w-[300px] md:w-[400px] shrink-0 bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-xl shadow-black/[0.02] hover:-translate-y-2 transition-transform duration-300 flex flex-col"
              >
                <div className="inline-block px-3 py-1 bg-sasori-red/5 text-sasori-red w-max rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
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

      {/* 6. Plan de Mantenimiento y FAQ juntas en una sección blanca pero seccionada */}
      <section className="py-24 px-6 bg-[#F8F8F8] relative border-t border-black/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* FAQ Column (Left) */}
          <div>
            <div className="mb-12">
              <h3 className="text-sasori-red text-sm font-bold tracking-[0.2em] uppercase mb-4">{tp.faqTitle}</h3>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#1A1A1A]">
                {tp.faqHeading}
              </h2>
            </div>
            <div className="flex flex-col">
              {tp.faqItems.map((item: any, i: number) => (
                <FaqItem key={i} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>

          {/* Mantenimiento Seguro (Right) */}
          <div className="flex items-center">
            <div className="bg-[#111111] p-10 rounded-[2rem] text-white shadow-2xl relative overflow-hidden w-full h-full lg:h-auto border border-white/5">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-sasori-red/20 blur-[80px] rounded-full pointer-events-none" />
              
              <ShieldCheck className="w-12 h-12 text-sasori-red mb-6" />
              <h4 className="text-sm font-bold tracking-widest uppercase text-white/50 mb-2">{tp.maintTitle}</h4>
              <h3 className="text-3xl font-black uppercase text-white mb-6 leading-tight">{tp.maintHeading}</h3>
              <p className="text-white/60 text-sm mb-10 leading-relaxed max-w-sm">
                {tp.maintDesc}
              </p>

              <ul className="space-y-6">
                {tp.maintFeatures.map((feat: any, i: number) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sasori-red/10 flex items-center justify-center flex-shrink-0">
                      {i === 0 ? <Scan className="w-4 h-4 text-sasori-red" /> : i === 1 ? <Database className="w-4 h-4 text-sasori-red" /> : <LineChart className="w-4 h-4 text-sasori-red" />}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">{feat.title}</h5>
                      <p className="text-white/40 text-xs mt-1">{feat.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Contacto */}
      <PremiumContact lang={lang} />
    </div>
  );
}
