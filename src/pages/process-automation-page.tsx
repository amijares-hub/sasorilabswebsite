import React, { useEffect } from "react";
import HeroText from "../components/ui/hero-shutter-text";
import { Footer } from "../components/ui/footer";
import { useNavigate } from "react-router-dom";
import { FeatureHighlightCard } from "../components/ui/feature-highlight-card";
import { LandingAccordionItem } from "../components/ui/interactive-image-accordion";
import { TextScrollAnimation } from "../components/ui/text-scroll-animation";
import { FluidTextMorph } from "../components/ui/fluid-text-morph";
import { 
  Network, Database, Workflow, BarChart3, 
  Briefcase, LineChart, FileText, Users, MapPin, 
  Mail, Settings, CheckCircle2, ShieldCheck, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { translations } from "../i18n/translations";

export function ProcessAutomationPage({ lang = "es" }: { lang?: string }) {
  const navigate = useNavigate();
  const t = translations[lang as keyof typeof translations] || translations.es;
  const tp = t.servicesPages.automation;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCta = () => {
    navigate("/contact");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="bg-white min-h-screen text-[#1A1A1A] font-sans selection:bg-sasori-red selection:text-white">
      {/* 1. Hero Section */}
      <HeroText text={tp.hero} />

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

      {/* 2. ¿Cómo lo hacemos? (El Arte de la Conectividad) */}
      <section className="py-24 px-6 bg-[#F8F8F8] relative overflow-hidden border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h3 className="text-sasori-red text-sm font-bold tracking-[0.2em] uppercase mb-4">{tp.howTitle}</h3>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A]">
              {tp.howHeading}
            </h2>
            <div className="w-24 h-1.5 bg-sasori-red mx-auto mt-6 rounded-full" />
            <p className="mt-6 text-lg text-black/50 max-w-2xl mx-auto">
              {tp.howDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                icon: <Workflow className="w-8 h-8" />,
                title: tp.mapping,
                desc: tp.mappingDesc
              },
              {
                icon: <Network className="w-8 h-8" />,
                title: tp.integration,
                desc: tp.integrationDesc
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: tp.logic,
                desc: tp.logicDesc
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: tp.panel,
                desc: tp.panelDesc
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

      {/* 3. Servicios que podemos automatizar (Catálogo de Servicios) */}
      <section className="py-24 px-6 relative bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h3 className="text-sasori-red text-sm font-bold tracking-[0.2em] uppercase mb-4">{tp.catalogTitle}</h3>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A]">
                {tp.catalogHeading}
              </h2>
            </div>
            <p className="text-lg text-black/50 max-w-sm">
              {tp.catalogDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {tp.catalogItems.map((service, i) => (
              <div key={i} className="group relative bg-[#F8F8F8] p-8 rounded-2xl border border-black/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  {/* Map icon based on area if needed, or use generic icons */}
                  {i === 0 && <LineChart className="w-24 h-24 text-sasori-red" />}
                  {i === 1 && <FileText className="w-24 h-24 text-sasori-red" />}
                  {i === 2 && <Users className="w-24 h-24 text-sasori-red" />}
                  {i === 3 && <MapPin className="w-24 h-24 text-sasori-red" />}
                  {i === 4 && <Mail className="w-24 h-24 text-sasori-red" />}
                  {i === 5 && <CheckCircle2 className="w-24 h-24 text-sasori-red" />}
                </div>
                <h4 className="text-2xl font-black tracking-tight mb-4 relative z-10">{service.area}</h4>
                <p className="text-black/60 mb-6 relative z-10 text-sm leading-relaxed min-h-[4rem]">{service.desc}</p>
                <div className="mt-auto relative z-10 pt-4 border-t border-black/10">
                  <span className="text-xs font-bold text-sasori-red uppercase tracking-widest block mb-1">Resultado Inmediato</span>
                  <p className="font-medium text-[#1A1A1A]">{service.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Ecosystem & Security Bento Grid */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#0A0A0A] via-[#2A0005] to-[#000000] text-white relative overflow-hidden">
        {/* Cinematic Lighting Background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sasori-red/10 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sasori-red/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-sasori-red mb-4">{tp.industriesTitle}</h2>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              {tp.industriesHeading1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">{tp.industriesHeading2}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Box 1: Fail Safe - Large (Span 2) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="metallic-vinotinto-card md:col-span-2 lg:col-span-2 p-8 md:p-12 rounded-[2rem] flex flex-col justify-between min-h-[340px] group"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/70">
                  <span className="w-2 h-2 rounded-full bg-sasori-red animate-pulse" />
                  {tp.securityTag}
                </div>
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-sasori-red/50 transition-all duration-500 shadow-[0_0_20px_rgba(226,6,19,0)] group-hover:shadow-[0_0_30px_rgba(226,6,19,0.3)]">
                  <ShieldCheck className="w-7 h-7 text-sasori-red" />
                </div>
              </div>
              <div>
                <h4 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">{tp.securityTitle}</h4>
                <p className="text-white/60 text-lg leading-relaxed max-w-lg">
                  {tp.securityDesc}
                </p>
              </div>
            </motion.div>

            {/* Box 2: PYMES */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-[#111111] border border-white/5 hover:border-sasori-red/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sasori-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Briefcase className="w-10 h-10 text-white/30 group-hover:text-sasori-red transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">{tp.boxes.pymes.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {tp.boxes.pymes.desc}
                </p>
              </div>
            </motion.div>

            {/* Box 3: Startups */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-[#111111] border border-white/5 hover:border-sasori-red/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sasori-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Zap className="w-10 h-10 text-white/30 group-hover:text-sasori-red transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">{tp.boxes.startups.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {tp.boxes.startups.desc}
                </p>
              </div>
            </motion.div>

            {/* Box 4: Financieros */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="bg-[#111111] border border-white/5 hover:border-sasori-red/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <LineChart className="w-10 h-10 text-white/30 group-hover:text-white transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">{tp.boxes.finance.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {tp.boxes.finance.desc}
                </p>
              </div>
            </motion.div>

            {/* Box 5: Servicios */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="bg-[#111111] border border-white/5 hover:border-sasori-red/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Network className="w-10 h-10 text-white/30 group-hover:text-white transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">{tp.boxes.services.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {tp.boxes.services.desc}
                </p>
              </div>
            </motion.div>

            {/* Box 6: Privacidad - Large (Span 2) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="metallic-vinotinto-card md:col-span-2 lg:col-span-2 p-8 md:p-12 rounded-[2rem] flex flex-col justify-center relative overflow-hidden group min-h-[340px]"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                <Database className="w-[400px] h-[400px]" />
              </div>
              
              <div className="relative z-10 max-w-lg">
                <Database className="w-12 h-12 text-white/50 mb-8" />
                <h4 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">{tp.privacyTitle}</h4>
                <p className="text-white/60 text-lg leading-relaxed">
                  {tp.privacyDesc}
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. Ejemplos Reales de Impacto */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A] text-center">
            Casos Reales de <span className="text-sasori-red">Impacto</span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="w-full relative flex overflow-hidden group">
          {/* Gradient Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling track moving RIGHT */}
          <motion.div 
            className="flex gap-6 min-w-max px-6 py-4"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          >
            {[...tp.cases, ...tp.cases].map((item, index) => (
              <div 
                key={index} 
                className="w-[380px] bg-[#F8F8F8] hover:bg-[#F0F0F0] p-8 rounded-3xl border border-black/5 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group/card flex flex-col justify-between cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sasori-red/5 rounded-bl-full transition-transform duration-700 ease-out group-hover/card:scale-150 group-hover/card:bg-sasori-red/10" />
                <div className="relative z-10">
                  <div className="inline-block px-4 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                    {item.tag}
                  </div>
                  <h4 className="text-xl font-black tracking-tight mb-4 leading-tight text-[#1A1A1A]">
                    {item.title}
                  </h4>
                  <p className="text-black/60 mb-8 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="relative z-10 bg-white p-5 rounded-xl border border-black/5 shadow-sm group-hover/card:border-sasori-red/20 transition-colors duration-300">
                  <span className="text-[10px] font-bold text-sasori-red uppercase tracking-widest block mb-1">
                    {item.metricLabel}
                  </span>
                  <p className="text-2xl font-black text-[#1A1A1A]">{item.metricValue}</p>
                  <p className="text-xs text-black/50 mt-1">{item.metricDesc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. Fluid Text Morph */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#0A0A0A] via-[#2A0005] to-[#000000] border-t border-white/5 flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
        
        <div className="relative z-10 text-center">
          <FluidTextMorph 
            wordPairs={[
              ["SERVICIOS", "AUTOMATIZACIÓN"],
              ["AUTOMATIZACIÓN", "RESULTADOS"],
              ["RESULTADOS", "SERVICIOS"]
            ]} 
            className="text-white mb-6"
            animationProps={{
              initialColor: "#E20613",
              animateColor: "#FFFFFF",
              exitColor: "#1A1A1A"
            }}
          />
          <p className="mt-8 text-white/50 text-sm md:text-base tracking-[0.2em] uppercase font-bold text-center">
            Pasa el cursor o haz clic para interactuar
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-white py-32 px-6 border-t border-black/5 relative items-center justify-center flex">
        <FeatureHighlightCard 
          imageSrc="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80"
          title={tp.ctaTitle}
          description={tp.ctaDesc}
          buttonText={tp.ctaBtn}
          onButtonClick={handleCta}
        />
      </section>

      <Footer lang={lang} />
    </div>
  );
}
